function getObjectFromHref(href) {
	for( i=0; i < document.getElementsByTagName('a').length; i++) {
		if(href === document.getElementsByTagName('a')[i].href) {
			return document.getElementsByTagName('a')[i];
		}
	}
}
function getLogtime() {
	var today = new Date()
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	var HH = today.getHours();
	var MM = today.getMinutes();
	if(dd<10) { dd='0'+dd; } 
	if(mm<10) { mm='0'+mm; }
	if(HH<10) {	HH='0'+HH; }
	if(MM<10) { MM='0'+MM; }
	today = yyyy+'-'+mm+'-'+dd+' '+HH+':'+MM;
	return today
}

function containsKey(map, key) {
	for(var prop in map) {
		if(prop === key) {
			return true;
		}
	}
	return false;
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