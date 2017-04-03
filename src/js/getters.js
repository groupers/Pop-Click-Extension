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