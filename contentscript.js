
/** Using content script as a front end processing tear **/

//HTML DOM ELEMENT SHORTS
var p = 0;
var a = 1;
var d = 2;
var ac = 6;
// listing
var ul = 4;
var li = 5;

//minor 
var b = -1;
var i = -2;

//Adding extra properties
var btnabox = 10;

chrome.runtime.sendMessage({msg: "this is a content message"}, function(b) {
    console.log('This is the content script talking about the call back : ' + b.backgroundMsg);
});

// String processing, so that we can slice and insert an item
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Generate DOM element <p>
function e(elementShort, text, href, ID, classname, order) {
	var returnvalue = "";
	text = text.trim();
	if (text.length == 0 || typeof text === 'undefined') return ;
	if (typeof ID === 'undefined') { ID = ''; }
	if (typeof href === 'undefined') { href = ''; }
	if (typeof classname === 'undefined') { classname = ''; }
	if (typeof order === 'undefined') { order = ''; }
	switch(elementShort) {
		case 0:
	      returnvalue = "<p>" + text + "</p>";
	      break;
	    case 1:// set 2 options
	      if (text.length > 25) {
		   text = text.substring(0,25)+"..." ;
		  }
		  if (order) {
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
	return returnvalue;
}

function containsKey(map, key){
	for (var prop in map) {
	     if(prop === key){
	     	return true;
	     }
	}
	return false;
}

var str = [];
for ( i=0; i< 10 && document.getElementsByTagName('a')[i]; i++ ){
	str.push(document.getElementsByTagName('a')[i]);
}
str.sort()
console.log(str);
console.log("\n after");
var pointer = 1;
console.log(str.length+"length");
if(str.length >= 2) {
	for (i=0; i< str.length; i++) {
		// console.log(str[i].href);
		if(/javascript(\(.*\)|:)|.*\/\#$/.test(str[i].href)) {
			// console.log(str[i].href);
			str.remove(i);
			i--;
		}
	}
}
console.log(str.length+"length");
var string = "";
var inListElements = 1;
for (i=0; i< str.length; i++) {
	var text = "";
	// if(str[i].text.length == 0 && str[i].title != "") {
	// 	text = str[i].title;
	// }else {
		text = str[i].text;
	// }
	  	var currentElement = e(a, text, str[i].href, "", "btnabox", inListElements);
	  	// Verifies if the element exists, in case some how in the handling something went wrong.
	  	//Problem when the anchor tag starts with # for some reason.
	  	//Example: https://developer.chrome.com/extensions/content_scripts#pi
		if(currentElement || currentElement != ""){
			string += currentElement;
			++inListElements;
		}
}

//Hashmap text:href

var listofnameElements = ""
var mapOfElements = new Map();
for (i = 0; i < 500 && i < document.getElementsByTagName('a').length; i++){
var currentAnchor = document.getElementsByTagName('a')[i];
listofnameElements += currentAnchor.text.trim()+" ,";
mapOfElements.set(currentAnchor.text.trim(),currentAnchor.href);

}
// If no text nor title find end half of the url :
// /something/ or /something
// #something

//Reorder elements so that they can fit
//Remove elements with href starting with javascript (y)

//When dialogOpen and shift key pressed, click action on inputfield

//Make a color for a different category of elements for the backgrounds


// Backend processing on python
// When multiple text or href seem to have similar substrings remove uncommons
// If url contains mean URI followed by /# Remove from list :=> Put it in the list of unwanted
var inputfield = '<input id="AwesompleteInputfield" class="awesomplete" data-autofirst data-list="'+listofnameElements+'" />';

console.log(str);

var div = document.createElement("div"); 
document.body.appendChild(div); 
div.id = "TheDialogBox"
div.innerHTML = e(d, e(ac, "Close", "closingBtnCollector()", "ClosingBtnCollector", "closingCollector"),"","DialogBoxHead","dialogBoxHead");
div.innerHTML += e(d, string, "default", "ButtonCollection", "btncollector");
div.innerHTML += e(d,inputfield,"DialogBoxFoot","dialogBoxFoot");
div.style.position = "float";
div.style.left = "50px";
div.style.display = "none";

var dialogBoxVisible = false;
// Observer for when the div element has it's class attribute altered
var observerDisplay = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if( window.getComputedStyle(div).getPropertyValue('display') !== 'none' && mutation.attributeName === 'style') {
            dialogBoxVisible = !dialogBoxVisible;
        }
    });
});
observerDisplay.observe(div, { attributes: true });


//Add algorithm method to select the element with the most caracters :
//Order of the words, order of the letters, words in common, letters in common.

var inputfield = document.getElementById('AwesompleteInputfield')
// Key press listener on enter key
addEvent(document, "keypress", function (e) {
    e = e || window.event;
    if(e.keyCode == "13"){
    	var redirectPath = mapOfElements.get(inputfield.value);
    	if(dialogBoxVisible && redirectPath && inputfield.value.length > 0 &&  inputfield == document.activeElement){
    		document.location = redirectPath;
    	}
    }
});

function addEvent(element, event, callback) {
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, callback);
    } else {
        element["on" + event] = callback;
    }
}

// Injecting script 
var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};

// Add event listener for whatever click on anchor element send to  backend process
(document.head || document.documentElement).appendChild(s);
// //asynchronously load jQuery
