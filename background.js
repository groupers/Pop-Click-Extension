/** Using background to handle background task which do not require to be processed on each page **/ 

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	//what is sent by the contentscript
	// alert("This is the background talking : "+msg.msg);
    sendResponse({backgroundMsg: "this is background msg"});
});