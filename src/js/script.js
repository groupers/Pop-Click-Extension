
/** Injected script **/

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

/** Closes the Dialog **/
function closingBtnCollector() {
	document.getElementById('TheDialogBox').style.display = 'none';
	dialogBoxVisible = !dialogBoxVisible;
}

var dialogBoxVisible = false;
var btnaboxElements = document.getElementById('ButtonCollection');
var fortyEightPlusTen = []

if (btnaboxElements) {
	btnaboxElements = btnaboxElements.childNodes;
	fortyEightPlusTen = Array.apply(null, {length: btnaboxElements.length+1}).map(Number.call, function(x) { return x + 48; });
}

/**  Monitores Keyboard import for Dialog Open/Close State **/
var doubleShift = false;
function KeyPress(e) {
	var input = document.getElementById('AwesompleteInputfield');
      var evtobj = window.event? event : e
      if (evtobj.keyCode == 80 && evtobj.ctrlKey) {
      	document.getElementById('TheDialogBox').style.display = (dialogBoxVisible ) ?  'none' : '';
      	dialogBoxVisible = !dialogBoxVisible;
      }
      if(dialogBoxVisible && evtobj.keyCode == 16) {
      	console.log('test'+ input == document.activeElement);
      	if(input != document.activeElement) {
      		input.focus();
      		input.select();
      	}
	    if(doubleShift){     
      		closingBtnCollector();
	        doubleShift = false;
	    } else {
	     doubleShift = true;
	    }
      }else if(dialogBoxVisible ){
      	doubleShift = false;
      }
      //Escape key
      if(evtobj.keyCode == 27 && dialogBoxVisible) {
      	closingBtnCollector();
      }
      if(fortyEightPlusTen.includes(evtobj.keyCode) && dialogBoxVisible && btnaboxElements) {
      	document.getElementById("DialogBoxAnchor"+(evtobj.keyCode-48)).click();
      } 

}		

document.onkeydown = KeyPress;
console.log('check');