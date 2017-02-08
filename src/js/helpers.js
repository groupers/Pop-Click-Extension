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