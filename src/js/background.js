/** Using background to handle background task which do not require to be processed on each page **/ 
// Initialise. If the database doesn't exist, it is created

var PopClick_profile = new localStorageDB("Profile", chrome.storage.local);
var PopClick_local_clickables = new localStorageDB("ClickTable", chrome.storage.local);

if(PopClick_profile.isNew()) {
	PopClick_profile.createTable("profile", ["token", "privatekey","logtime"]);
	PopClick_profile.commit();
}
if(PopClick_local_clickables.isNew()) {
	PopClick_local_clickables.createTable("pageselectable", ["pagehref", "elementhref", "text", "selector", "clicks"]);
	PopClick_local_clickables.commit();
}

var myURL = "about:blank"; // A default url just in case below code doesn't work
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { // onUpdated should fire when the selected tab is changed or a link is clicked 
	chrome.tabs.getSelected(null, function(tab) {
		myURL = tab.url;
		chrome.tabs.sendMessage(tabId, {action: "refresh_dialog", url: myURL}, function(response) {});
	});
});

/** Handles profile **/
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if(msg && msg.createprofile) {
		var profile = new Array(JSON.parse(msg.createprofile));
			var tok = profile[0][0]
			console.log(tok)
			PopClick_profile.insert("profile", {token: ''+tok, privatekey: ''});
			PopClick_profile.commit();
	}
	if(msg && msg.updateprivate) {
		var priv  = msg.updateprivate
		console.log(priv)
		PopClick_profile.update("profile", function(row){ 
			row.privatekey = priv;
			console.log(row)
			return row;
		});
		PopClick_profile.commit();
	}
});
/** Handles selectable elements **/
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	var content, page;
	if (msg && msg.sendingevent) {
		content =  new Array(JSON.parse(msg.sendingevent))[0];
		page = ''+content[0];
		var elementhref = ''+content[1];
		var text = ''+content[2];
		var selector = ''+content[3];
		console.log('dab')
		console.log(content)
			// var testing_record = PopClick_local_clickables.queryAll("pageselectable", { query: {elementhref: "https://www.facebook.com/"
			// 	, pagehref: "https://www.facebook.com/#", }})
			if(page && elementhref && text) {
				var existing_record = PopClick_local_clickables.queryAll("pageselectable", {
					query: {elementhref: elementhref, pagehref: page, text: text}
				});

				if(typeof existing_record == 'undefined' || existing_record.length == 0) {	
					PopClick_local_clickables.insert("pageselectable",{ pagehref: page,
						elementhref: elementhref,
						text: text,
						selector: selector,
						clicks: 1});
				} else {

					var current_clicks = existing_record[0].clicks;
					var current_selector = existing_record[0].selector;
					if(selector === "btnabox-element"){
						selector = current_selector;
					}
						PopClick_local_clickables.update("pageselectable", {  
							pagehref: page,
							elementhref: elementhref,
							text: text, selector: selector
						}, function(row) {
							row.clicks = ++current_clicks;
						    // the update callback function returns to the modified record
						    return row;
						});
				}
				PopClick_local_clickables.commit();
				chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
				//what is sent by the contentscript
				// alert("This is the background talking : "+msg.msg);
				sendResponse({backgroundMsg: "bump"});
			});
			}
		} else if(msg && msg.sendinginitialisation) {
			content = new Array(JSON.parse(msg.sendinginitialisation));
			var highest_clicks_text = new Array();
			var highest_clicks_href = new Array();
			page = ''+content[0]
		//Top 10 different
		var page_existing_top_ten_elements  = PopClick_local_clickables.queryAll("pageselectable", {
			query: {pagehref: page}, sort: [["ID","DESC"], ["clicks", "DESC"]], distinct: ["elementhref","text"]
		});
		console.log(page_existing_top_ten_elements);

		for(i = 0 ; i < 10 && i < (page_existing_top_ten_elements.length); i++) {
			highest_clicks_text[i] = page_existing_top_ten_elements[i].text;
			highest_clicks_href[i] = page_existing_top_ten_elements[i].elementhref;
		}
		highest_clicks_text = JSON.stringify(highest_clicks_text);
		highest_clicks_href = JSON.stringify(highest_clicks_href);
		sendResponse({hc_text: highest_clicks_text, hc_href: highest_clicks_href});
	}
});
//Structure " "
//Add click to collection of clicks
// chrome.storage.location.set()
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'awesomplete.min.js'
	});
});

