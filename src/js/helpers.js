// Get today's date and time in a properly javascript/python format
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
// Adds EventListener By Stackoverflow, collaboration
function addEvent(element, event, callback) {
	if (element.addEventListener) {
		element.addEventListener(event, callback, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + event, callback);
	} else {
		element["on" + event] = callback;
	}
}
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

function containsKey(map, key) {
	for(var prop in map) {
		if(prop === key) {
			return true;
		}
	}
	return false;
}