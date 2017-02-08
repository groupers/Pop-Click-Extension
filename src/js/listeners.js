//Add algorithm method to select the element with the most caracters :
//Order of the words, order of the letters, words in common, letters in common.

// Key press listener on enter key
addEvent(document, "keypress", function(e) {
	e = e || window.event;
	if(e.keyCode == "13") {
		var inputfield = document.getElementById('AwesompleteInputfield');
		var redirectPath = mapOfElements.get(inputfield.value);
		if(window.getComputedStyle(div).getPropertyValue('display') !== 'none' && redirectPath && inputfield.value && inputfield.value.length > 0 &&  inputfield == document.activeElement) {
			var array = new Array();
			array[0] = document.location.href;
			array[1] = redirectPath;
			array[2] = inputfield.value.trim();
			var stringifiedArray = JSON.stringify(array);
			console.log(stringifiedArray)
			chrome.runtime.sendMessage({sendingevent: stringifiedArray}, function(b) {
				if(b && b.backgroundMsg) {
					console.log(b.backgroundMsg);
				}
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

if (document.addEventListener) {
	document.addEventListener("click", function(event) {
		var targetElement = event.target || event.srcElement;
		var array = new Array();
		array[0] = document.location.href;
		var parentElementA = undefined, currentElement = targetElement;
		if(targetElement.className != 'closingCollector'){
			if(targetElement.nodeName != 'A' && targetElement.className != 'btnabox') {
				for(i = 0; i < 6; i++){
					if (currentElement.parentElement == undefined){
						break;
					} else {
						currentElement = currentElement.parentElement;
					}
					if(currentElement.nodeName == 'A') {
						parentElementA = currentElement;
						break;
					}
				}
			}
			if(targetElement.nodeName == 'A' || parentElementA) {
				if(parentElementA) {
					targetElement = parentElementA;
				}
				array[1] = targetElement.href;

			// Have to add a condition for when there is no title nor text.
			// Order : 1.Text, 2.title, 3.child alt, 4. URL compare, 5. tag
			// Give option to modify name
			array[2] = targetElement.text.trim() || "not-found"
			if(targetElement.className != 'btnabox') {
				array[3] = getPath(targetElement);
			} else {
				array[2] = array[2].replace(/\s\[\d*\]$/,"")

				// Get object selector with same page,href
				array[3] = 'btnabox-element';
			}
			var stringifiedArray = JSON.stringify(array);
			chrome.runtime.sendMessage({sendingevent: stringifiedArray}, function(b) {
				if(b && b.backgroundMsg){
					console.log(b.backgroundMsg);
				}
				console.log('Callback object just above');
			});
		}
	}
});
} else if (document.attachEvent) {    
	document.attachEvent("onclick", function() {
		var targetElement = event.target || event.srcElement;
	});
}