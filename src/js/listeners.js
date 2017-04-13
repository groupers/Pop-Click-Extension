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
	if(+e.keyCode > 47 && +e.keyCode < 58 && +e.altKey +e.shiftKey) {
		//Add if shortcut click option is activated
		if(Object.keys(iziToasts).length > 0){
			if(typeof iziToasts['['+(e.keyCode-48)+']'] !== 'undefined'){
				document.location = iziToasts['['+(e.keyCode-48)+']'];
			}
		}
	}
});

addEvent(document, "click", function(event) {
		var targetElement = event.target || event.srcElement;
		var array = new Array();
		if(JSON.parse(window.localStorage['location']) != undefined){
			array[0] = JSON.parse(window.localStorage['location'])[2]
			var parentElementA = undefined, currentElement = targetElement;
			if(targetElement.className != 'closingCollector'){
				if(targetElement.nodeName != 'A' && targetElement.className != 'btnabox') {
					for(i = 0; i < 6; i++){
						if (currentElement.parentElement == undefined) {
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
				
				array[2] = targetElement.innerText.trim()|| "not-found"
				if(targetElement.className != 'btnabox') {
					// array[3] = getPath(targetElement);
					array[3] = "something"
				} else {
					array[2] = array[2].replace(/\s\[\d*\]$/,"")

					// Get object selector with same page,href
					array[3] = 'btnabox-element';
				}
				array[4] = JSON.parse(window.localStorage['location'])[0]
				array[5] = JSON.parse(window.localStorage['location'])[1]
				var stringifiedArray = JSON.stringify(array);
				//Have to make sure it matches run time : Test if link clicked in fb message.
				if(stringifiedArray != null){
					chrome.runtime.sendMessage({sendingevent: stringifiedArray}, function(b) {
						if(b && b.backgroundMsg){
							console.log(b.backgroundMsg);
						}
						console.log('Callback object just above');
					});
				}
			}
			var iziToaster = false;
			if(targetElement.className == 'iziToast-body'){
				iziToaster = true;
			}
			else if(targetElement.className == 'slideIn'){
				targetElement = targetElement.parentNode
				iziToaster = true;
			}
			else if(targetElement.classList[0] == 'iziToast'){
				targetElement = targetElement.childNodes[2]
				iziToaster = true;
			}
			if(iziToaster == true){
				if(/\[[0-9]\]/.test(targetElement.firstChild.innerHTML)){
					window.location = iziToasts[targetElement.firstChild.innerHTML];
				}
			}
		}
	}
});