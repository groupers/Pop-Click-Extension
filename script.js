
/** Injected script **/

// function jQuery(func) {
//     if (func) drh_callbacks.push(func);
//     return {ready: function(func) { drh_callbacks.push(func); }};
// };
// var $ = jQuery, drh_callbacks = [];

// //asynchronously load jQuery
// setTimeout(function() {
//     var scr = document.createElement('script');
//     scr.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js';
//     document.head.appendChild(scr);
//     scr.onload = function() {
//         $.each(drh_callbacks, function(i, func) { $(func); });
//     };
// }, 2000);

// jQuery(document).ready(function() {
//});

//=> Good idea to prompt only the parts that it doesn't share in common and propose as such in terms of formating.
function getAllElementsWithAttribute(attribute) {
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

function findElementFromPath(path) {
	if (path > 0) throw 'Requires one element.';
		var mainIterator = 0; var innerIterator = 0;
		var arrayOfPath = path.split("\u003e");
		var currentNodeList = document.getElementsByTagName('html')[0];
		if (currentNodeList.localName === arrayOfPath[0]){
			++mainIterator;
			while(false != true) {
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
									if (currentNodeList[i]){

										if(currentSplit[0] === currentNodeList[i].localName.toLowerCase()) {

											if(currentSplitCounter === currentSplit[2]) {
												currentNodeList = currentNodeList[i];
												mainIterator++;
												console.log(currentNodeList);
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

		}
function closingBtnCollector() {
	document.getElementById('TheDialogBox').style.display = 'none';
}
var dialogBoxVisible = false;
function KeyPress(e) {
      var evtobj = window.event? event : e
      if (evtobj.keyCode == 80 && evtobj.ctrlKey){
      	document.getElementById('TheDialogBox').style.display = (dialogBoxVisible ) ?  'none' : '';
      	dialogBoxVisible = !dialogBoxVisible;
      }
      //Escape key
      if(evtobj.keyCode == 27 && dialogBoxVisible){
      	closingBtnCollector(); dialogBoxVisible = !dialogBoxVisible;
      }

}		

document.onkeydown = KeyPress;
console.log('check');

// console.log('done');
// });