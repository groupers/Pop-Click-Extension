/**
This is for content control
**/

function addBlockedWebpage(){
	chrome.runtime.sendMessage({block_webpage: "head"}, function(response) {
	});
}
function addBlockedWebsite(){
	chrome.runtime.sendMessage({block_website: "head"}, function(response) {
	});
}

   var blockpage = document.getElementById('BlockPage')
   var blockwebsite = document.getElementById('BlockWebsite')
   if(blockpage){
	  blockpage.addEventListener('click', function() {
	   		addBlockedWebpage();
	   }); 
   }
   if(blockwebsite){
	  blockwebsite.addEventListener('click', function() {
	   		addBlockedWebsite();
	   }); 
   }