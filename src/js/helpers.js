/**
* ©Copyrights, all rights reserved.
* @author: Phileas Hocquard 
* Helper methods
**/
/** 
* Returns today's date
* @return {Date} today
*/
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

/** 
* Return a statement indicating if a key exists in a map
* @param {map} dictionary
* @param {string} key 
* @return {boolean}
*/
function containsKey(map, key) {
	for(var prop in map) {
		if(prop === key) {
			return true;
		}
	}
	return false;
}

/**
*Acts as a CSS selector, allows us to uniquely identify an HTML element.
* Returns the HTML arborescence of the element	 
* @param {DOM element} element
* @return {string} path
**/
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

/**
* Returns the index of the element among others who have the same nodeName
* @param {HTML Node} node
* @return {number} (num|-1)
**/
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

/**
* Returns the number of elements containing the same nodeName
* @param {HTML Node} node
* @return {number} num
**/
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