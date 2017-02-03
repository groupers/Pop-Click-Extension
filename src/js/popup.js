 $(document).ready(function() {
 	$('select').material_select();
 	$('.carousel').carousel();
 	$('.carousel.carousel-slider').carousel({fullWidth: true});
 });

 document.addEventListener('DOMContentLoaded', function() {
 	document.getElementById('initialForm').addEventListener('submit', initialPost)
   // When the user ticks to agree on the contract
   var signing = document.getElementById('signing')
   signing.addEventListener('click', function() {
   	if (signing.value == undefined){
   		signing.value = 0;
   	}
   	signing.value = (+(signing.value) + 1)%2
   	console.log(signing.value)
   }); 
   var ran_age = document.getElementById('ran_age')
   var in_age = document.getElementById('in_age')
   ran_age.addEventListener('change', function () {
   	in_age.value = ran_age.value
   })
   in_age.addEventListener('change', function () {
   	ran_age.value = in_age.value
   })
});

 function initialInterests(){
 	var interests = []

 	return interests
 }

 function initialPost(){
 	event.preventDefault();
 	var today = new Date()
 	var dd = today.getDate();
 	var mm = today.getMonth()+1; 
 	var yyyy = today.getFullYear();
 	var HH = today.getHours();
 	var MM = today.getMinutes();
 	if(dd<10) 
 	{
 		dd='0'+dd;
 	} 

 	if(mm<10) 
 	{
 		mm='0'+mm;
 	}
 	if(HH<10)
 	{
 		HH='0'+HH;
 	}
 	today = yyyy+'-'+mm+'-'+dd+' '+HH+':'+MM
 	var age = 25;
 	var interests = ['food','movies']
 	console.log(today);

 	postAction(today, age, interests, signed, initialResponse);
 }

 function initialResponse(str){
 	console.log(str)
 }
 function postAction(logtime, age, interests, signed, callback){
 	var postUrl = 'http://localhost:8000/popclick/api/create/';
    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    // Handle request state change events
    xhr.onreadystatechange = function() { 
        // If the request completed
        if (xhr.readyState == 4) {
        	// statusDisplay.innerHTML = '';
        	if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                // statusDisplay.innerHTML = 'Saved!';
                callback(xhr.responseText);
                // window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                // statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
            }
        }
    };
    // };JSON.stringify(initialInterests)
    xhr.send(JSON.stringify({"logtime":logtime,"age":age,"interests":interests}));
    // statusDisplay.innerHTML = 'Saving...';

}