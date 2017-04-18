/**
* ©Copyrights, all rights reserved.
* @author: Phileas Hocquard 
This is for content control of the popup
**/
$( document ).ready(function() {
	getToken();
	blockedStatus();
	$('#showDialog').click( function() {
		showDialog();
	});
});
// Item is blocked
function blockedStatus() {
	isBlockedRequest('webpage')
	isBlockedRequest('website')
}
// Request if page/websites is blocked
function isBlockedRequest(siteorpage) {
	var response;
	chrome.runtime.sendMessage({isBlocked: siteorpage}, function(r) {
		if(siteorpage == 'webpage') {
			if("true" == r) {
				document.getElementById('ppage').innerText = "deactivated";
			} else {
				document.getElementById('ppage').innerText = "activated";
			}
		} else {
			if("true" == r) {
				document.getElementById('psite').innerText = "deactivated";
			} else {
				document.getElementById('psite').innerText = "activated";
			}
		}
	});
}
// Receive token
function getToken() {
	chrome.runtime.sendMessage({getToken: "head"}, function(response) {
		if(document.getElementById('ptoken')){
			if(response != "false") {
				document.getElementById('ptoken').innerText = ""+response
			} else {
				document.getElementById('ptoken').innerText = "Not Found."
			}
		}
	});
}

// Add page to blocked state
function addBlockedWebpage() {
	chrome.runtime.sendMessage({block_webpage: "head"}, function(response) {});
}
// Add websites to blocked state
function addBlockedWebsite() {
	chrome.runtime.sendMessage({block_website: "head"}, function(response) {});
}

var blockpage = document.getElementById('BlockPage')
var blockwebsite = document.getElementById('BlockWebsite')
if(blockpage) {
	blockpage.addEventListener('click', function() {
		addBlockedWebpage();
		blockedStatus();
	}); 
}
if(blockwebsite) {
	blockwebsite.addEventListener('click', function() {
		addBlockedWebsite();
		blockedStatus();
	}); 
}
function showDialog() {
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {action: "show_dialog"});
	});
}