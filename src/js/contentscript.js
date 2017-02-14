
/** Using content script as a front end processing tier **/
var suggestedElements;
//Adding extra properties
var btnabox = 10;

//Not necessary
var array = new Array();
array[0] = document.location.href;
var stringifiedArray = JSON.stringify(array);
var historyBasedSuggestion, highest_clicks_text = new Array(), highest_clicks_href = new Array();

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

	if(msg.action == 'refresh_dialog') {

		generateDialogContent(msg.url);
	}

	if(msg.action = 'sendpage_info') {
		var objects = []
		for (i = 0 ; i < document.getElementsByTagName('a').length && i < 500; i++) {
			var curr = document.getElementsByTagName('a')[i]
			var arr = []
			arr.push(curr.baseURI)
			arr.push(curr.href)
			arr.push(curr.text)
			arr.push(getPath(curr))
			objects.push(arr)
		}

		sendResponse({objects: objects});
	}
});

//HTML DOM ELEMENT SHORTS
var p = 0, a = 1, d = 2, ac = 6, ul = 4, li = 5;
// Generate DOM element <p>
function e(elementShort, text, href, ID, classname, order, kind) {
	var returnvalue = "";
	text = text.trim();
	if (text.length == 0 || typeof text === 'undefined') return ;
	if (typeof ID === 'undefined') { ID = ''; }
	if (typeof href === 'undefined') { href = ''; }
	if (typeof classname === 'undefined') { classname = ''; }
	if (typeof order === 'undefined') { order = ''; }
	if (typeof kind === 'undefined') { kind = ''; }
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
//This only works if ButtonCollection already exists
function generateDialogContent(url) {
	if (typeof url === 'undefined') { 
		url = ''; 
	} else {
		var array = new Array();
		array[0] = url;
		stringifiedArray = JSON.stringify(array);
	}
	chrome.runtime.sendMessage({sendinginitialisation: stringifiedArray}, function(x) {
		console.log('message sent');
		highest_clicks_text = new Array(JSON.parse(x.hc_text))[0];
		highest_clicks_href = new Array(JSON.parse(x.hc_href))[0];
		var dialogbuttons = document.getElementById("ButtonCollection");
		while (dialogbuttons.firstChild) {
			dialogbuttons.removeChild(dialogbuttons.firstChild);
		}
		var randomListOfAnchors = []

		for (i = 0 ; i < document.getElementsByTagName('a').length; i++) {
			if(!highest_clicks_href.contains(document.getElementsByTagName('a')[i])) {
				randomListOfAnchors.push(i);
			}
		}
		randomListOfAnchors[randomListOfAnchorsIterator]
		var randomListOfAnchorsIterator = 0;

			  for (i = 0; i < 10; i++){
			  	
			  	if(highest_clicks_text[i] != undefined) {
			  		var anchor = e(a, highest_clicks_text[i], highest_clicks_href[i], "", "btnabox", i, "pers");

			  	} else {
			  		var currentIndex = randomListOfAnchors[randomListOfAnchorsIterator];
			  		if(document.getElementsByTagName('a')[currentIndex]){
			  			var anchor = e(a, document.getElementsByTagName('a')[currentIndex].text, document.getElementsByTagName('a')[currentIndex].href, "", "btnabox", i);
			  		}
			  		randomListOfAnchorsIterator++;
			  	}
			  	dialogbuttons.innerHTML += anchor;
			  }
			  for(i = 0 ; i < document.getElementsByClassName('btnabox').length; i++) {
			  	var currentElement =document.getElementsByClassName('btnabox')[i];
			  	if(currentElement.getAttribute('kind') === 'pers') {
			  		currentElement.style.backgroundColor = "rgb(76, 175, 80)";
			  	}
			  }		  
			});
}

var str = [];
for (i=0; i < (10 - highest_clicks_text.length) && document.getElementsByTagName('a')[i]; i++) {
	str.push(document.getElementsByTagName('a')[i]);
}
str.sort();
console.log("\n after");
var pointer = 1;
if(str.length >= 2) {
	for (i=0; i < str.length; i++) {
		if(/javascript(\(.*\)|:)|.*\/\#$/.test(str[i].href)) {
			str.remove(i);
			i--;
		}
	}
}
var string = "", inListElements = 1;

for (i=0; i < str.length; i++) {
	var text = "";
	if(str[i].text.length == 0 && str[i].title != "") {
		text = str[i].title;
	} else {
		text = str[i].text;
	}
	var currentElement = e(a, text, str[i].href, "", "btnabox", inListElements);
	// Verifies if the element exists, in case some how in the handling something went wrong.
	//Problem when the anchor tag starts with # for some reason.
	//Example: https://developer.chrome.com/extensions/content_scripts#pi
	if(currentElement || currentElement != "") {
		string += currentElement;
		++inListElements;
	}
}

var listofnameElements = ""
var mapOfElements = new Map();
for (i = 0; i < 500 && i < document.getElementsByTagName('a').length; i++) {
	var currentAnchor = document.getElementsByTagName('a')[i];
	listofnameElements += currentAnchor.text.trim()+" ,";
	mapOfElements.set(currentAnchor.text.trim(),currentAnchor.href);
}

// If no text nor title find end half of the url :
// /something/ or /something
// #something

// Backend processing on python
// When multiple text or href seem to have similar substrings remove uncommons
// If url contains mean URI followed by /# Remove from list :=> Put it in the list of unwanted
var inputfield = '<input id="AwesompleteInputfield" class="awesomplete" data-autofirst placeholder="Insert Text to find what you wish for :"/>';
var dim_div = document.createElement("div");
document.body.appendChild(dim_div);
dim_div.id = "pagecover"
var div = document.createElement("div"); 
document.body.appendChild(div); 
div.id = "TheDialogBox"
div.innerHTML = e(d, e(ac, "Close", "closingBtnCollector()", "ClosingBtnCollector", "closingCollector"),"","DialogBoxHead","dialogBoxHead");
div.innerHTML += e(d, string, "default", "ButtonCollection", "btncollector");
div.innerHTML += e(d,inputfield,"DialogBoxFoot","dialogBoxFoot");
div.style.position = "float";
div.style.left = "50px";
div.style.display = "none";
var input = document.getElementById("AwesompleteInputfield");
new Awesomplete(input, {
	list: listofnameElements
});
generateDialogContent();

var dialogBoxVisible = false;
// Observer for when the div element has it's class attribute altered
/** Observing the visibility of the dialog box **/
var observerDisplay = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if( window.getComputedStyle(div).getPropertyValue('display') !== 'none' && mutation.attributeName === 'style') {
			dialogBoxVisible = !dialogBoxVisible;
		}
	});
});
observerDisplay.observe(div, { attributes: true });

/* vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv*/
// Injecting script 
var s = document.createElement('script');
s.src = chrome.extension.getURL('src/js/script.js');
s.onload = function() {
	this.remove();
};

// Add event listener for whatever click on anchor element send to  backend process
(document.head || document.documentElement).appendChild(s);
// //asynchronously load jQuery
