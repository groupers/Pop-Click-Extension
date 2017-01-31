
/** Using content script as a front end processing tier **/

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
var suggestedElements;
//Adding extra properties
var btnabox = 10;

//Not necessary
var array = new Array();
array[0] = document.location.href;
var stringifiedArray = JSON.stringify(array);
var historyBasedSuggestion, highest_clicks_text = new Array(), highest_clicks_href = new Array();

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == 'refresh_dialog') {

	generateDialogContent(msg.url);
  }
});

/**  %%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%% %%%%%%%%%%%%%%%% **/
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

// Array Contains String + Trimming.
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].toString().trim() === obj.toString().trim()) {
            return true;
        }
    }
    return false;
}

function containsKey(map, key){
	for (var prop in map) {
	     if(prop === key){
	     	return true;
	     }
	}
	return false;
}

/** &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& &&&&&&&& **/
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

//Added call back updating the str

generateDialogContent();
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
			console.log(highest_clicks_href);
			console.log(highest_clicks_text);
			 var dialogbuttons = document.getElementById("ButtonCollection");
			  while (dialogbuttons.firstChild) {
		       dialogbuttons.removeChild(dialogbuttons.firstChild);
			  }
			  var randomListOfAnchors = []

			  for (i = 0 ; i < document.getElementsByTagName('a').length; i++){
			  	if(!highest_clicks_href.contains(document.getElementsByTagName('a')[i])){

					randomListOfAnchors.push(i);
			  	}
			  }
			  randomListOfAnchors[randomListOfAnchorsIterator]
			  var randomListOfAnchorsIterator = 0;
			  // For performance reasons we should replace the innerHTML by an append.
			  for (i = 0; i < 10; i++){
			  	
			  	if(highest_clicks_text[i] != undefined){
			    var anchor = e(a, highest_clicks_text[i], highest_clicks_href[i], "", "btnabox", i, "pers");

				} else {
				var currentIndex = randomListOfAnchors[randomListOfAnchorsIterator];
				var anchor = e(a, document.getElementsByTagName('a')[currentIndex].text, document.getElementsByTagName('a')[currentIndex].href, "", "btnabox", i);
				randomListOfAnchorsIterator++;
				}
			    dialogbuttons.innerHTML += anchor;
			  }
			for(i = 0 ; i < document.getElementsByClassName('btnabox').length; i++){
				var currentElement =document.getElementsByClassName('btnabox')[i];
				if( currentElement.getAttribute('kind') === 'pers'){
					currentElement.style.backgroundColor = "rgb(76, 175, 80)";
				}
			}		  
			  // forceRedraw(dialogbuttons);
	});
}

// Could be useful -- to check if a website is available //
function load(target, url) {
  var r = new XMLHttpRequest();
  r.open("GET", url, true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    target.innerHTML = r.responseText;
  };
  r.send();
}
var forceRedraw = function(element){

    if (!element) { return; }

    var n = document.createTextNode(' ');
    var disp = element.style.display;  // don't worry about previous display style

    element.appendChild(n);
    element.style.display = 'none';

    setTimeout(function(){
        element.style.display = disp;
        n.parentNode.removeChild(n);
    },20); // you can play with this timeout to make it as short as possible
}
/** Second mesure **/
/** If sending a message to the localstorage server failed **/
var str = [];
for ( i=0; i< (10 - highest_clicks_text.length) && document.getElementsByTagName('a')[i]; i++ ){
	str.push(document.getElementsByTagName('a')[i]);
}
str.sort();
console.log("\n after");
var pointer = 1;
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
console.log(str.length + "length");
var string = "";
var inListElements = 1;

for (i=0; i < str.length; i++) {
	var text = "";
	if(str[i].text.length == 0 && str[i].title != "") {
		text = str[i].title;
	}else {
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
//Hashmap text:href
mapOfElements.set(currentAnchor.text.trim(),currentAnchor.href);

}
// If no text nor title find end half of the url :
// /something/ or /something
// #something

//Reorder elements so that they can fit
//Remove elements with href starting with javascript (y)

//When dialogOpen and shift key pressed, click action on inputfield

//Make a color for a different category of elements for the backgrounds ()

//Record also the Dialog buttons when clicked meaning they have to be stored in array/Hashmap

//Record what has been clicked but also analyse the elements parent structure.




// Backend processing on python
// When multiple text or href seem to have similar substrings remove uncommons
// If url contains mean URI followed by /# Remove from list :=> Put it in the list of unwanted
var inputfield = '<input id="AwesompleteInputfield" class="awesomplete" data-autofirst placeholder="Insert Text to find what you wish for :" data-list="'+listofnameElements+'" />';

console.log(str);
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


/* ------------ ------------------ ------------------ ------------------ ------------------ */
//Acts as a CSS selector
/** Allows use to uniquely identify an HTML element **/
function getPath(element) {
  var path, node = element;
  while(node){
    var name = node.localName;
    if (!name) break;
    name = name.toLowerCase();
    if (inParentSameNodeName(node) > 1) {
    	name += ':eq(' + (indexInParent(node))  + ')';
    }
    path = name + (path ? '>' + path : '');
    node = node.parentNode;
  }
  return path;
}

// Gets the index of the element among others who have the same nodeName
function indexInParent(node) {
  var children = node.parentNode.childNodes;
  var num = 0;
  for (var i=0; i<children.length; i++) {
    if (children[i]==node) return num;
    if (children[i].nodeType==1 && children[i].nodeName == node.nodeName) {
    	num++;
	}
  }
 return -1;
}


// Get number of elements containing the same nodeName
function inParentSameNodeName(node) {
 var children = node.parentNode.childNodes;
 var num = 0;
 for (var i=0; i<children.length; i++) {
   if (children[i].nodeType==1 && children[i].nodeName == node.nodeName) {
   	num++;
   }
 }
 return num;	
}




// CSS Selector element finder
function findElementFromPath(path) {
	if (path > 0) throw 'Requires one element.';
		var mainIterator = 0; var innerIterator = 0;
		var arrayOfPath = path.split("\u003e");
		var currentNodeList = document.getElementsByTagName('html')[0];
		if (currentNodeList.localName === arrayOfPath[0]) {
			++mainIterator;
			while(true) {
				var oldIterator = mainIterator;
				if(mainIterator < arrayOfPath.length) {
					 currentNodeList = currentNodeList.childNodes;
					  try {
						var currentSplit = [];
						var currentSplitCounter = 0;
						for(var i = 0; i<currentNodeList.length; i++) {
							try {
								if(/[a-zA-Z]+(:eq\(\d+\))/.test(arrayOfPath[mainIterator])) {  
									currentSplit = arrayOfPath[mainIterator].split(/(:eq\(|\))/);
									currentSplit[2] = parseInt(currentSplit[2]);
									if (currentNodeList[i]) {

										if(currentSplit[0] === currentNodeList[i].localName.toLowerCase()) {

											if(currentSplitCounter === currentSplit[2]) {
												currentNodeList = currentNodeList[i];
												mainIterator++;
												console.log(currentNodeList);
												console.log("current node just above");
												break;
											}
											currentSplitCounter++;
										}
									}
								}
								else if(arrayOfPath[mainIterator] === currentNodeList[i].localName.toLowerCase()) {
									mainIterator++;
									currentNodeList = currentNodeList[i];
								}
							} catch(err) {
								console.log('err' + err.message);
							}
						}
					  } catch(err) {
						console.log('err' + err.message);
					  }
					  if (oldIterator == mainIterator) {
						  break;
					  }
					}else{
						break;
					}
				}
			}			
			return currentNodeList;

		}
/* ------------ ------------------ ------------------ ------------------ ------------------------------------ */

/* ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ */
//Add algorithm method to select the element with the most caracters :
//Order of the words, order of the letters, words in common, letters in common.

var inputfield = document.getElementById('AwesompleteInputfield');
// Key press listener on enter key
addEvent(document, "keypress", function (e) {
    e = e || window.event;
    if(e.keyCode == "13"){
    	// console.log('something');
    	var redirectPath = mapOfElements.get(inputfield.value);
    	// console.log(redirectPath);
    	if(window.getComputedStyle(div).getPropertyValue('display') !== 'none' && redirectPath && inputfield.value.length > 0 &&  inputfield == document.activeElement){
    		console.log(dialogBoxVisible +"Is this visible");
    		// console.log(inputfield.value.length);
 	  		var array = new Array();
	  		array[0] = document.location.href;
	  		array[1] = redirectPath;
	  		array[2] = inputfield.value.trim();
	  		var stringifiedArray = JSON.stringify(array);
        	chrome.runtime.sendMessage({sendingevent: stringifiedArray}, function(b) {
        	if(b && b.backgroundMsg){
			    	console.log(b.backgroundMsg);
				}
			    console.log('Callback object just above');
			});    		
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
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

//EventListener when an element is clicked.
if (document.addEventListener ) {
    document.addEventListener("click", function(event) {
        var targetElement = event.target || event.srcElement;
        // console.log(JSON.stringify(instorage));
        // console.log(targetElement);
        // console.log(document.getElementById(targetElement.id));

        console.log('-------    --------');
        //Not supported
        // console.log(getEventListeners(targetElement));
        console.log('-------    --------');
        //Prints the entire arborescence
        console.log(findElementFromPath(getPath(targetElement)));
        // console.log(findElementFromPath(getPath(targetElement).innerHTML.replace(/<[^>]*>/g, "")));
       console.log(getPath(targetElement));
      //TODO% Make an else statement if it is a btnabox remove 4 last caracters " [x]"
	  if( targetElement.nodeName == 'A' && targetElement.className != 'btnabox') {
	  	var array = new Array();
	  	array[0] = document.location.href;
	  	array[1] = targetElement.href;
	  	array[2] = targetElement.text.trim();
	  	array[3] = getPath(targetElement);

	  	var stringifiedArray = JSON.stringify(array);
        chrome.runtime.sendMessage({sendingevent: stringifiedArray}, function(b) {
        	if(b && b.backgroundMsg){
		    	console.log(b.backgroundMsg);
			}
		    console.log('Callback object just above');
		});
	  }
	});
} else if (document.attachEvent) {    
    document.attachEvent("onclick", function() {
        var targetElement = event.target || event.srcElement;
    });
}
/* ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ */

/* vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv vvvvvvvvvvv*/
// Injecting script 
var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};

// Add event listener for whatever click on anchor element send to  backend process
(document.head || document.documentElement).appendChild(s);
// //asynchronously load jQuery
