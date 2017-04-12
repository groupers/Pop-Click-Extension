/** Using content script as a front end processing tier **/
// You have to update variable names
var suggestedElements;
var str = [], string = "", inListElements = 1;
var listofnameElements = [];
var mapOfElements = new Map();

//Adding extra properties
var btnabox = 10;
//Not necessary
var array = new Array();
array[0] = document.location.href;
var stringifiedArray = JSON.stringify(array);
var div = document.createElement("div"); 
var historyBasedSuggestion, highest_clicks_text = new Array(), highest_clicks_href = new Array();
var feedback_info_timestamp = null, feedback_info_link = null;
var iziToasts = new Map();
var sentObjects = new Map();

/** 
* Content script onMessage listener
* @params {msg}
* @params {sender}
* @params {sendResponse}
* @message action handling:
*	- refresh_dialog
*	- show_dialog
*	- sendpage_info
*	- feedback_info
**/
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

	if(msg.action == 'refresh_dialog') {
		generateDialogContent(msg.url);
		window.localStorage['location'] = JSON.stringify([document.location.hostname, document.location.pathname, document.location.href])
	}

	if(msg.action === 'show_dialog') {
		document.getElementById('TheDialogBox').style.display = ''
	}

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
	if(msg.action == 'feedback_info') {
		var toastall = false;
		// Add option if toasts should be visible
		if(feedback_info_timestamp === null || (new Date() - feedback_info_timestamp)/ 1000.0 > 2.0){
			feedback_info_timestamp = new Date();
			feedback_info_link = document.location.href;
			toastall = true;
		}
		if(toastall == true) {
			var timeout = 7000, changed = false;
			if (msg.numbers != -1 && sentObjects[document.location.href].length >0) {
				if(msg.update && document.getElementsByClassName('iziToast-body').length > 0){
					iziToast.destroy();
				}
				if(document.getElementsByClassName('iziToast-body').length == 0 || changed == true) {
					for(i=0; i<msg.numbers.length && i<5; i++) {
						var elem = sentObjects[document.location.href][msg.numbers[i]]
						// Have to fix the fact of being sent back a random list with an item 0
						if(typeof elem != 'undefined' && elem[2].replace(/\s/g,' ').length != 0){
							var message = elem[2].trim();
							if (message.length > 15){
								message = message.substring(0,15)+"...";
							}
							if(i<2){
								timeout = 100000;
							}else{
								timeout = 10000;
							}
							iziToast.show({
								title: '['+i+']',
								message: message,
								timeout: timeout,
								onOpen: function(instance, toast){
									iziToasts['['+i+']'] = elem[1]
									console.log(instance)
								},
								onClose: function(instance, toast, closedBy){
						        console.info('closedBy: ' + closedBy); // tells if it was closed by 'drag' or 'button'

						        console.log("item removed"+instance['title'])
						        delete iziToasts[instance['title']]
						    }
						});

						}
					}
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
	var returnvalue = "";
	if (typeof text === 'undefined' || text.length == 0) return ;
	text = text.trim();
	if (typeof ID === 'undefined') { ID = ''; }
	if (typeof href === 'undefined') { href = ''; }
	if (typeof classname === 'undefined') { classname = ''; }
	if (typeof order === 'undefined') { order = ''; }
	if (typeof kind === 'undefined') { kind = ''; }
	if (typeof text === 'undefined') { text = ''; }
	switch(elementShort) {
		case 0:
		returnvalue = "<p>" + text + "</p>";
		break;
	    case 1:// set 2 options
	    if (text.length > 25) {
	    	text = text.substring(0,25)+"..." ;
	    }
	    if (order != undefined) {
	    	text +="<span> ["+order%10+"]</span>";
	    	ID = "DialogBoxAnchor"+order%10;
	    }
	    returnvalue = (ID === "")? '<a href="' + href +'">' + text + "</a>" : '<a id="' + ID + '" href="' + href +'">' + text + '</a>'
	    break;
	    case 2:
	    returnvalue = (ID === "")? '<div>' + text + "</div>" : '<div id="' + ID + '">' + text + '</div>'
	    break;
	    case 4:
	    returnvalue ='<ul>' + text + '</ul>'
	    break;
	    case 5:
	    returnvalue = '<li>' + text + '</li>'
	    break;
	    case 6:
	    returnvalue = '<a id="' + ID + '" onclick="' + href +'">' + text + '</a>'
	    break;
	    case 7:
	    returnvalue = '<script src="'+ href +'"></script>'
	    break;
	    case 8:
	    returnvalue = '<link rel="stylesheet" href="' +href + '">'
	    break;
	    case 10:
	    return
	    default:
	    returnvalue = text;
	    break;
	}
	if(classname) {
		returnvalue = returnvalue.splice(returnvalue.indexOf('>'), 0, ' class="' + classname + '"');
	}
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
	if (typeof url === 'undefined') { 
		url = ''; 
	} else {
		var array = new Array();
		array[0] = url;
		stringifiedArray = JSON.stringify(array);
	}
	/**
	* @action {chrome.runtime.sendMessage}
	* @params {{string: JSON(url)}} {sendinginitialisation: stringifiedArray}
	**/
	chrome.runtime.sendMessage({sendinginitialisation: stringifiedArray}, function(x) {
		// Retrieve elements text and href from callback
		highest_clicks_text = new Array(JSON.parse(x.hc_text))[0];
		highest_clicks_href = new Array(JSON.parse(x.hc_href))[0];

		var dialogbuttons = document.getElementById("ButtonCollection");
		// If the dialogBox is empty generate content
		if(dialogbuttons != null && dialogbuttons.firstChild != null){
			while (dialogbuttons.firstChild) {
				dialogbuttons.removeChild(dialogbuttons.firstChild);
			}
			var randomListOfAnchors = []
			// Select the 10 first of elements of the list (random procedure)
			for (i = 0 ; i < document.getElementsByTagName('a').length; i++) {
				if(!highest_clicks_href.contains(document.getElementsByTagName('a')[i])) {
					randomListOfAnchors.push(i);
				}
				if(highest_clicks_text.length > (i+1)){
					if(highest_clicks_text[i] == 'not-found' || highest_clicks_href[i] == ""){
						highest_clicks_text.remove(i)
						highest_clicks_href.remove(i)
					}
				}
			}
			var randomListOfAnchorsIterator = 0;
			var dialog_elements = {}
			// Creates an an anchor tag corresponding to the conventioned style with the given parameters
			for (i = 0; i < 10; i++){
				var text, href;
				console.log(highest_clicks_text[i])
				if(highest_clicks_text[i] != undefined) {
					text = highest_clicks_text[i];
					href = highest_clicks_href[i];
					var anchor = e(a, text, href, "", "btnabox", i, "pers");
				} 
				else {
					var currentIndex = randomListOfAnchors[randomListOfAnchorsIterator];
					if(document.getElementsByTagName('a')[currentIndex]){
						text = document.getElementsByTagName('a')[currentIndex].innerText.trim();
						href = document.getElementsByTagName('a')[currentIndex].href;
						var anchor = e(a, text, href, "", "btnabox", i);
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
				}
			}		  
		}

	});
}

main()
/**
* @constructor 
* 
**/
function main(){
	for (i = 0; i < 500 && i < document.getElementsByTagName('a').length; i++) {
		var currentAnchor = document.getElementsByTagName('a')[i];
		var currentElement = (currentAnchor.text).replace(/\s/g,' ');
		if (!/(javascript\(.*\)|.*\/\#)$/.test(currentAnchor.href) || currentAnchor.className != 'btnabox') {
			listofnameElements.push(currentElement);
			mapOfElements.set(currentElement,currentAnchor.href);
		}
	}
	createDialogBox()
	generateDialogContent();
}

function createDialogBox(){
	var inputfield = '<input id="AwesompleteInputfield" class="awesomplete" data-autofirst placeholder="Insert Text to find what you wish for :"/>';
	var dim_div = document.createElement("div");
	document.body.appendChild(dim_div);
	dim_div.id = "pagecover"
	document.body.appendChild(div); 
	div.id = "TheDialogBox"
	div.innerHTML = e(d, e(ac, "Close", "closingBtnCollector()", "ClosingBtnCollector", "closingCollector"),"","DialogBoxHead","dialogBoxHead");
	div.innerHTML += e(d, e(a, "initial", "", "", "btnabox",0), "default", "ButtonCollection", "btncollector");
	div.innerHTML += e(d,inputfield,"DialogBoxFoot","dialogBoxFoot");
	div.style.position = "float";
	div.style.left = "50px";
	div.style.display = "none";
	var input = document.getElementById("AwesompleteInputfield");
	
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

/** vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv **/
// Injecting script

var s = document.createElement('script');
s.src = chrome.extension.getURL('src/js/script.js');
s.onload = function() {
	this.remove();
};

// Add event listener for whatever click on anchor element send to  backend process
(document.head || document.documentElement).appendChild(s);
// //asynchronously load jQuery
