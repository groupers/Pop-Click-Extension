
/** Injected script **/

//=> Good idea to prompt only the parts that it doesn't share in common 
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
//Acts as a CSS selector
/** Allows use to uniquely identify an HTML element **/
function getPath(element) {
  var path, node = element;
  while(node) {
    var name = node.localName;
    if (!name) break;
    name = name.toLowerCase();
    if (inParentSameNodeName(node) > 1) {
      name += ':eq(' + (indexInParent(node)) + ')';
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
      //TODO Allow different evtobj.altKey or ctrl etc in menu switch..
      if (evtobj.keyCode == 80 && evtobj.altKey) {
      	document.getElementById('TheDialogBox').style.display = (dialogBoxVisible ) ?  'none' : '';
      	dialogBoxVisible = !dialogBoxVisible;
      }
      if(dialogBoxVisible && evtobj.keyCode == 16) {
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
      if(fortyEightPlusTen.includes(evtobj.keyCode) && dialogBoxVisible && btnaboxElements && input != document.activeElement) {
      	document.getElementById("DialogBoxAnchor"+(evtobj.keyCode-48)).click();
      } 

    }		

    document.onkeydown = KeyPress;