/**
* ©Copyrights, all rights reserved.
* @author: Phileas Hocquard 
* js/Popup.js
**/
var chips = document.getElementsByClassName('chip')
var genders = ["Female","Male","Other","Irrelevant"]
var sizeSwitch = false;
var popclickhost = 'http://localhost:8000';
// interests listener
$(document).ready(function() {
	$('select').material_select();
	$('.chips').material_chip();
	$('#sparkles').hide();
	$('.chips-initial').material_chip({
		data: [{
			tag: 'News & Media',
		}, {
			tag: 'Fashion',
		}, {
			tag: 'Tech',
		}, {
			tag: 'Finance & Economics',
		}, {
			tag: 'Music',
		}, {
			tag: 'Cars',
		},{
			tag: 'Sports',
		}, {
			tag: 'Games & Tech',
		}, {
			tag: 'Shopping',
		}, {
			tag: 'Literature',
		},{
			tag: 'Travel',
		}, {
			tag: 'Arts',
		}, {
			tag: 'Social Awareness',
		}, {
			tag: 'Science',
		}, {
			tag: 'Movies & Theatre',
		}, {
			tag: 'Craft',
		}]
	});

	Array.from(chips).forEach(function(element) {
		element.value = 0;
	});

	$('.chip > i').hide();
	$('.chips > input').remove();

	var chips_count = 0;
	$('.chips').on('chip.select', function(e, chip) {
		Array.from(chips).forEach(function(element) {
			if(chip.tag == element.outerText){
				element.className = "chip";
				if((element.value+1)%2) {
					if(chips_count < 3){
						element.value = (element.value+1)%2;
						chips_count++;
						element.style.backgroundColor = '#26a69a';
						element.style.color = 'white';
					}
				} else {
					element.value = (element.value+1)%2;
					chips_count--;
					element.style.backgroundColor = '#e4e4e4';
					element.style.color = 'rgba(0,0,0,0.6)';

				}
				if(chips_count > 2) {
					$('#sparkles').show();
				} else {
					$('#sparkles').hide();
				}
			}		
		});
		var c = (3 - chips_count);
		document.getElementById('number_of_select').innerText = c;
	});

	$('#showDialog').click(function() {
		showDialog();
	});

});

function showDialog() {
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {action: "show_dialog"});
	});
}
// Dom click listener limiting movement on page
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('initialForm').addEventListener('submit', initialPost)
   // When the user ticks to agree on the contract
   var signing = document.getElementById('signing')

   var ran_age = document.getElementById('ran_age')
   var in_age = document.getElementById('in_age')
   if (signing.value == undefined){
   	signing.value = 0;
   }
   signing.addEventListener('click', function() {
   	signing.value = (+(signing.value) + 1)%2
   	if(signing.value){
   		setTimeout(flipInitialState, 500);
   	}
   }); 
   ran_age.value = 18;
   in_age.value = 18;
   ran_age.addEventListener('change', function() {
   	in_age.value = ran_age.value
   })
   in_age.addEventListener('change', function() {
   	ran_age.value = in_age.value
   })
});
var spinnerState = false;
// Switching views
function flipInitialState() {
	var middle = document.getElementById('middle');
	var bottom = document.getElementById('bottom');

	if(!sizeSwitch){
		bottom.style.height = '70%';
		middle.style.height = '20%';
		$('#initial-1').hide()
		$('#initial-2').hide()
		$('#interests').show()
		$('#showDialog').hide()
		$('#submitInitial').show()
	} else {
		bottom.style.height = '60%';
		middle.style.height = '30%';
		$('#initial-1').show()
		$('#initial-2').show()
		$('#interests').hide()
		$('#showDialog').show()
		$('#submitInitial').hide()
	}
	sizeSwitch = !sizeSwitch;
}
// First Interests
function initialInterests() {
	var interests = []
	Array.from(chips).forEach(function(element) {
		if(element.value == 1 ){
			interests.push(element.innerText)
		}
	})
	return interests
}
// Information post
function initialPost() {
	event.preventDefault()
	var age = document.getElementById('in_age').value
	var gender = genders[document.getElementById('gender').value-1]
	var signed = document.getElementById('signing').value
	postAccountCreation(getLogtime(), age, initialInterests(), gender, signed, initialResponse);
}

/**
* Checks if the element is availables
* @Params : {DOM element} obj
**/
function displayElement(obj) {
	var obj = document.getElementById(obj);
	if (obj.style.visibility == 'visible') {
		obj.style.visibility = 'hidden';
	}
	else {
		obj.style.visibility = 'visible';
	}
}
// First response request, store token
function initialResponse(str) {
	var profile = new Array();
	profile[0] = JSON.parse(str).profile
	if(JSON.parse(str).hasOwnProperty('profile')) {
		var stringifiedProfile = JSON.stringify(profile)
		chrome.runtime.sendMessage({createprofile: stringifiedProfile}, function(response) {
			fetchFileContent(popclickhost+'/popclick/api/get/'+profile[0], logging)
		});
		// If we receive a 200 response from logging
	} else {
		// Popup error at the right place redirect the user to the page with the error (page 1 or 2)
		handleError(str)
	}
}

/**
Error Handling 
Form validation
**/
function handleError(error) {
	// If invalid age, gender, not signed flip to first view
	// If invalid interests, flip to second view if necessary
	console.log(JSON.parse(error)['profile_error'])
	var error_call =JSON.parse(error)['profile_error']
	var errcodesWindow1 = ["INVALID_AGE","INVALID_GENDER","NOT_SIGNED","MISSING_ATTRIBUTE"]
	if(errcodesWindow1.indexOf(error_call) != -1 && !atInitialPage()) {
		flipInitialState();
	}
	if(error_call == "MISSING_ATTRIBUTE") {
		publishError('Please fill in the form normally')
	} else if(error_call == "INVALID_AGE") {
		publishError('You must be older than 3 years old.')
	} else if(error_call == "INVALID_GENDER") {
		publishError('Please select one of the displayed genders.')
	} else if(error_call == "NOT_SIGNED") {
		publishError('Please sign the contract.')
	} else if(error_call == "WRONG_DATE_FORMAT") {
		publishError('There seems to be in issue with your time.')
	} else if(error_call == "WRONG_INTERESTS") {
		publishError('Please select the appropriate amount of proposed interests.')
	} else {
		// Should be impossible 
		publishError('Contact support.')
	}
}
// Handle error delay
function publishError(message, time) {
	
	if(typeof time == 'undefined') {
		time = 2000;
	} else {
		time = time*1000;
	}
	Materialize.toast(message, time)

}
// Is at the initialapge
function atInitialPage(){

	return (+($('#interests').is(":visible")) + 1)%2

}

// Logging handle
function logging(tes) {

	tes = JSON.parse(tes);
	chrome.runtime.sendMessage({updateprivate: tes.auth}, function(response) {
	});
	window.location.href= "../view/popup_control.html";
	chrome.browserAction.setPopup({popup: "src/view/popup_control.html"})

}
// Fetch content
function fetchFileContent(URL, cb) {
	var xhr = new XMLHttpRequest()
	xhr.ontimeout = function() {

		console.error('Please contact support.')

	};
	xhr.onload = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {

				cb(xhr.response);

			} else {

				publishError('There seems to be an issue with your connection to the server.')
			
			}
		}
	};
	xhr.open('GET', URL, true)
	xhr.send()
}

//Remember to toast if form isn't complete
function postAccountCreation(logtime, age, interests, gender, signed, callback) {
	var postUrl = popclickhost+'/popclick/api/create/';
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

        		callback(xhr.responseText);
        		return true;

        	} else {

        		publishError('No connection to the server.')
        	
        	}
        }
    };
    xhr.send(JSON.stringify({ "logtime":logtime, "age":age, "gender":gender, "interests":interests, "signed":signed}));
}