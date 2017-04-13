/**
* ©Copyrights, all rights reserved.
* @author: Phileas Hocquard 
* Main Content Script
* The content script is used as front end processing tier 
**/

// All the text properties of the available anchor tags
var listofnameElements = [];
// Required by the listener.js
var mapOfElements = new Map();

// Main dialogBox Div
var div = document.createElement("div"); 

var highest_clicks_text = new Array(), highest_clicks_href = new Array();
var recommended_clicks = {}
// Used by the toast Message action, monitoring time.
var feedback_info_timestamp = null, feedback_info_link = null;
// Toasts mapped to their respectful displayed values
var iziToasts = new Map();
// Items sent for recommendation requested by the sendpage_info Message action.
var sentObjects = new Map();
window.localStorage['location'] = JSON.stringify([document.location.hostname, document.location.pathname, document.location.href])
/** 
* Content script onMessage listener
* @params {msg}
* @params {sender}
* @params {sendResponse}
* @message action handling:
*	- refresh_dialog from -background.js
*	- show_dialog	from -popup & popup_control.js
*	- sendpage_info	from -background.js
*	- feedback_info from -background.js
**/
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	// Message received suggests that the dialogBox should refresh (From background)
	if(msg.action == 'refresh_dialog') {
		generateDialogContent(msg.url);
		searchUtilityItems();
		window.localStorage['location'] = JSON.stringify([document.location.hostname, document.location.pathname, document.location.href])
	}
	// Message received demands that the dialogBox becomes visible (From popup)
	if(msg.action === 'show_dialog') {
		document.getElementById('TheDialogBox').style.display = ''
	}

	// Message received demands that the list of selectable items should be sent as a Response
	if(msg.action == 'sendpage_info') {
		var objects = [];
		for (i = 0 ; i < document.getElementsByTagName('a').length && i < 500; i++) {
			var curr = document.getElementsByTagName('a')[i]
			var arr = []
			arr.push(document.location.href)
			arr.push(curr.href)
			arr.push(curr.innerText.trim())
			arr.push(getPath(curr))
			if (curr.className !== 'btnabox') {
				objects.push(arr)
			}
		}
		sentObjects[document.location.href] = objects;
		sendResponse({objects: objects});
	}
	// Message received demands that a certain set of elements should be displayed as toasts
	if(msg.action == 'feedback_info') {
		var toastall = false;
		// If toasts should appear for the given time (avoiding constant refresh backlashes)
		if(feedback_info_timestamp === null || (new Date() - feedback_info_timestamp)/ 1000.0 > 2.0){
			feedback_info_timestamp = new Date();
			feedback_info_link = document.location.href;
			toastall = true;
		}
		// If we should set new toasts
		if(toastall == true) {
			var timeout = 7000
			// If we have received more than 0 toasts
			if (msg.numbers != -1 && sentObjects[document.location.href].length >0) {
				// If we receive an update request than we must destroy all elements
				if(msg.update && document.getElementsByClassName('iziToast-body').length > 0){
					iziToast.destroy();
				}
				// If there is no existing toasts
				if(document.getElementsByClassName('iziToast-body').length == 0) {
					// For the dialogBox
					var recommended_clicks_text = []
					var recommended_clicks_href = []
					// Create up to 5 toasts
					for(i=0; i<msg.numbers.length && i<5; i++) {
						var elem = sentObjects[document.location.href][msg.numbers[i]]
						// Verify that the matching item contains text or is existent
						if(typeof elem != 'undefined' && elem[2].replace(/\s/g,' ').length != 0){
							var message = elem[2].trim();
							// If the text is too long
							recommended_clicks_text.push(message)
							recommended_clicks_href.push(elem[1])
							if (message.length > 15){
								message = message.substring(0,15)+"...";
							}
							// For the dialogBox

							// For the top 2 elements set a longer duration
							if(i<2){
								timeout = 100000;
							}else{
								timeout = 10000;
							}
							// Display the toasts
							iziToast.show({
								title: '['+i+']',
								message: message,
								timeout: timeout,
								onOpen: function(instance, toast){
									iziToasts['['+i+']'] = elem[1]
									console.log(instance)
								},
								onClose: function(instance, toast, closedBy){
									delete iziToasts[instance['title']]
								}
							});

						}
					}
					recommended_clicks[document.location.href] = [recommended_clicks_text, recommended_clicks_href];
					// Refresh the dialogBox
					generateDialogContent(document.location.href);
				}
			}
		}
	}
});

// HTML DOM ELEMENT SHORTS
var p = 0, a = 1, d = 2, ac = 6, ul = 4, li = 5, script = 7, link = 8;
/**
* Generate DOM element
* @params {number} elementShort
* @params {string} text
* @params {string} href
* @params {string} ID
* @params {string} classname
* @params {number} order
* @params {string} kind
*
* @return {string} html element
**/
function e(elementShort, text, href, ID, classname, order, kind){
	// The returned DOM formatted element
	var returnvalue = "";
	// If the their is no text field or an empty string then return.
	if (typeof text === 'undefined' || text.length == 0) return ;
	// Trim the text
	text = text.trim();
	// If any of the following attribute does not exist set them to an empty string
	if (typeof ID === 'undefined') { ID = ''; }
	if (typeof href === 'undefined') { href = ''; }
	if (typeof classname === 'undefined') { classname = ''; }
	if (typeof order === 'undefined') { order = ''; }
	if (typeof kind === 'undefined') { kind = ''; }
	if (typeof text === 'undefined') { text = ''; }
	// For the specific element  choose corresponding HTML string embedding
	switch(elementShort) {
		case 0:
		returnvalue = "<p>" + text + "</p>";
		break;
		// anchor
	    case 1:// set 2 options
	    // If the string is too long reduce its size
	    if (text.length > 25) {
	    	text = text.substring(0,25)+"..." ;
	    }
	    // If the element has an order then it is a recommendation
	    if (order != undefined) {
	    	text +="<span> ["+order%10+"]</span>";
	    	ID = "DialogBoxAnchor"+order%10;
	    }
	    returnvalue = (ID === "")? '<a href="' + href +'">' + text + "</a>" : '<a id="' + ID + '" href="' + href +'">' + text + '</a>'
	    break;
	    // div
	    case 2:
	    returnvalue = (ID === "")? '<div>' + text + "</div>" : '<div id="' + ID + '">' + text + '</div>'
	    break;
	    // ul
	    case 4:
	    returnvalue ='<ul>' + text + '</ul>'
	    break;
	    // li
	    case 5:
	    returnvalue = '<li>' + text + '</li>'
	    break;
	    // anchor with onclick
	    case 6:
	    returnvalue = '<a id="' + ID + '" onclick="' + href +'">' + text + '</a>'
	    break;
	    // script
	    case 7:
	    returnvalue = '<script src="'+ href +'"></script>'
	    break;
	    //  stylesheet
	    case 8:
	    returnvalue = '<link rel="stylesheet" href="' +href + '">'
	    break;
	    // nothing
	    case 10:
	    return
	    // Return the text otherwise
	    default:
	    returnvalue = text;
	    break;
	}
	// If the element has a class then add its attribute
	if(classname) {
		returnvalue = returnvalue.splice(returnvalue.indexOf('>'), 0, ' class="' + classname + '"');
	}
	// If the element has a kind then add its attribute
	if(kind) {
		returnvalue = returnvalue.splice(returnvalue.indexOf('>'), 0, ' kind="' + kind + '"');
	}
	return returnvalue;
}
/**
*
* Populates the DialogBox and allows refreshing the dialogbox
* Example: When the user updates the navigation tab
* @params {string} url
*
**/
function generateDialogContent(url) {
	var jsonArrayUrl;
	// If there is no url set the url to an empty string
	if (typeof url === 'undefined') { 
		url = ''; 
	} else {
		// create a JSON object containing the string
		// var array = new Array();
		// array[0] = [url];
		jsonArrayUrl = JSON.stringify([url]);
	}
	console.log(recommended_clicks)
	/**
	* @action {chrome.runtime.sendMessage}
	* @params {{string: JSON(url)}} {sendinginitialisation: stringifiedArray}
	**/
	chrome.runtime.sendMessage({sendinginitialisation: jsonArrayUrl}, function(x) {
		// Retrieve elements text and href from callback
		if(x && x.hc_href && x.hc_text){
			highest_clicks_text = new Array(JSON.parse(x.hc_text))[0];
			highest_clicks_href = new Array(JSON.parse(x.hc_href))[0];
		}
		var dialogbuttons = document.getElementById("ButtonCollection");
		// If the dialogBox is empty generate content
		if(dialogbuttons != null && dialogbuttons.firstChild != null){
			// While there is a child remove all elements
			while (dialogbuttons.firstChild) {
				dialogbuttons.removeChild(dialogbuttons.firstChild);
			}
			var randomListOfAnchors = []
			// Select the 10 first of elements of the list (random procedure)
			for (i = 0 ; i < document.getElementsByTagName('a').length; i++) {
				// If the element in the list doest not contain an href that is the same as the suggested items
				// Add it to the collection of random anchors
				if(!highest_clicks_href.contains(document.getElementsByTagName('a')[i])) {
					randomListOfAnchors.push(i);
				}
				// Assuring we have text for the given suggestion
				if(highest_clicks_text.length >= (i+1)){
					if(highest_clicks_text[i] == 'not-found' || highest_clicks_href[i] == ""){
						highest_clicks_text.remove(i)
						highest_clicks_href.remove(i)
					}
				}

			}
			// Remove the common item between what is recommended and the item popularity of the users
			var recommended_items = recommended_clicks[document.location.href];
			if(recommended_items && recommended_items[0].length > 0 && typeof recommended_items[0][recommendedIterator] != 'undefined'){
				for(i = 0 ; i < recommended_items[0].length; i++){
					if(highest_clicks_text.contains(text) || highest_clicks_href.contains(href)){
						recommended_items[0].remove(i)
						recommended_items[1].remove(i)
					}
				}
			}

			var randomListOfAnchorsIterator = 0;
			var recommendedIterator = 0;
			var dialog_elements = {}
			// Creates an an anchor tag corresponding to the conventioned style with the given parameters
			for (i = 0; i < 10; i++){
				var text, href, anchor;
				if(typeof highest_clicks_text[i] != 'undefined') {
					text = highest_clicks_text[i];
					href = highest_clicks_href[i];
					anchor = e(a, text, href, "", "btnabox", i, "pers");
				} 
				else if(recommended_items && recommended_items[0].length >0 
					&& typeof recommended_items[0][recommendedIterator] != 'undefined'){
					text = recommended_items[0][recommendedIterator]
					href = recommended_items[1][recommendedIterator]
					anchor = e(a, text, href, "", "btnabox", i, "rec");
					recommendedIterator++;
				}
				else {
					var currentIndex = randomListOfAnchors[randomListOfAnchorsIterator];
					if(document.getElementsByTagName('a')[currentIndex]){
						text = document.getElementsByTagName('a')[currentIndex].innerText.trim();
						if (text.length > 20){
							text = text.substring(0,20)+"...";
						}
						href = document.getElementsByTagName('a')[currentIndex].href;
						anchor = e(a, text, href, "", "btnabox", i);
					}
					randomListOfAnchorsIterator++;
				}
				if(dialog_elements[text] != href){
					dialog_elements[text]= href;
					dialogbuttons.innerHTML += anchor;
				}
			}
			// If the kind of an element is personal than we show a background color which is green
			for(i = 0 ; i < document.getElementsByClassName('btnabox').length; i++) {
				var currentElement =document.getElementsByClassName('btnabox')[i];
				if(currentElement.getAttribute('kind') === 'pers') {
					currentElement.style.backgroundColor = "rgb(76, 175, 80)";
				}else if(currentElement.getAttribute('kind') === 'rec') {
					currentElement.style.backgroundColor = "rgb(232, 149, 60)";
				}
			}		  
		}

	});
}

/**
*Initialises the listofnameElements which is used by the search utility
**/
function searchUtilityItems(){
	listofnameElements = [];
	for (i = 0; i < 500 && i < document.getElementsByTagName('a').length; i++) {
		var currentAnchor = document.getElementsByTagName('a')[i];
		var currentElement = (currentAnchor.text).replace(/\s/g,' ');
		if (!/(javascript\(.*\)|.*\/\#)$/.test(currentAnchor.href) || currentAnchor.className != 'btnabox') {
			listofnameElements.push(currentElement);
			mapOfElements.set(currentElement, currentAnchor.href);
		}
	}
}

main()
/**
* Main method
* @constructor 
* 
**/
function main(){
	// Initialising with 10 blank anchors
	var emptySelectables = "";
	for (i=1; i < 11; i++) {
			emptySelectables += e(a, "initial", "none", "", "btnabox", i);
	}
	searchUtilityItems();
	createDialogBox(emptySelectables);
	generateDialogContent();
}

/**
*Creates the DialogBox
* @params: {string} initialEmptyAnchors 
* @actions:
*	-Initialises Awesomplete inputField
*	- Adds a MutationObserver method
**/
function createDialogBox(initialEmptyAnchors){
	// DOM formatted input field
	var inputfield = '<input id="AwesompleteInputfield" class="awesomplete" data-autofirst placeholder="Insert Text to find what you wish for :"/>';
	// Creates the Dialog Box
	var dim_div = document.createElement("div");
	document.body.appendChild(dim_div);
	dim_div.id = "pagecover"
	document.body.appendChild(div); 
	div.id = "TheDialogBox"
	div.innerHTML = e(d, e(ac, "Close", "closingBtnCollector()", "ClosingBtnCollector", "closingCollector"),"","DialogBoxHead","dialogBoxHead");
	div.innerHTML += e(d, initialEmptyAnchors, "default", "ButtonCollection", "btncollector");
	div.innerHTML += e(d,inputfield,"DialogBoxFoot","dialogBoxFoot");
	div.style.position = "float";
	div.style.left = "50px";
	div.style.display = "none";
	var input = document.getElementById("AwesompleteInputfield");
	// Initialises the awesomplete search and filter
	new Awesomplete(input, {
		// Remove duplicates
		list: listofnameElements.filter( function( item, index, inputArray ) {
			return inputArray.indexOf(item) == index;
		}),
		filter: function (text, input) {
			if ((text.toLowerCase()).indexOf(input.toLowerCase()) == -1 
				&& ( pre_lev(text.toLowerCase(),input.toLowerCase())>0 
					&& pre_lev(text.toLowerCase(),input.toLowerCase()) < 3) 
				&& input.length > 2){
				input = text
		}
		return ((text.toLowerCase()).includes(input.toLowerCase()));
	}
});
	// Allows monitor the DialogBox activity
	var dialogBoxVisible = false;
	// Observer for when the div element has it's class attribute altered
	/** Observing the visibility of the dialog box **/
	var observerDisplay = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if( window.getComputedStyle(div).getPropertyValue('display') !== 'none' 
				&& mutation.attributeName === 'style') {
				dialogBoxVisible = !dialogBoxVisible;
		}
	});
	});
	observerDisplay.observe(div, { attributes: true });
}

// Injecting script
var s = document.createElement('script');
s.src = chrome.extension.getURL('src/js/script.js');
s.onload = function() {
	this.remove();
};

// Add event listener for whatever click on anchor element send to  backend process
(document.head || document.documentElement).appendChild(s);
// //asynchronously load jQuery
