
var chips = document.getElementsByClassName('chip')
var genders = ["Female","Male","Other","Irrelevant"]
var sizeSwitch = false;
//Should pull from server the data tags

$(document).ready(function() {
	$('select').material_select();
	$('.chips').material_chip();
	$('#sparkles').hide();
	$('.chips-initial').material_chip({
		data: [{
			tag: 'New & Media',
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
			tag: '+1' 
		}],
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
				if ((element.value+1)%2) {
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
				console.log(chips_count)
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
});

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('initialForm').addEventListener('submit', initialPost)
   // When the user ticks to agree on the contract
   var signing = document.getElementById('signing')

   var ran_age = document.getElementById('ran_age')
   var in_age = document.getElementById('in_age')

   signing.addEventListener('click', function() {
   	if (signing.value == undefined){
   		signing.value = 0;
   	}
   	signing.value = (+(signing.value) + 1)%2
   	if(signing.value){
   		setTimeout(flipInitialState, 500);
   	}
   }); 
   ran_age.value = 18;
   in_age.value = 18;
   ran_age.addEventListener('change', function () {
   	in_age.value = ran_age.value
   })
   in_age.addEventListener('change', function () {
   	ran_age.value = in_age.value
   })
});

function flipInitialState() {
	var middle = document.getElementById('middle');
	var bottom = document.getElementById('bottom');

	if(!sizeSwitch){
		bottom.style.height = '70%';
		middle.style.height = '20%';
		$('#initial-1').hide()
		$('#initial-2').hide()
		$('#interests').show()
	} else {
		bottom.style.height = '60%';
		middle.style.height = '30%';
		$('#initial-1').show()
		$('#initial-2').show()
		$('#interests').hide()
	}
	sizeSwitch = !sizeSwitch;
}

function initialInterests() {
	var interests = []
	Array.from(chips).forEach(function(element) {
		if(element.value == 1 ){
			interests.push(element.innerText)
		}
	})
	return interests
}

function initialPost() {
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
	var age = document.getElementById('in_age').value
	var gender = genders[document.getElementById('gender').value-1]
	var signed = document.getElementById('signing').value
	console.log(today);
	postAction(today, age, initialInterests(), gender, signed, initialResponse);
}

function displayElement(obj) {
	var obj = document.getElementById(obj);
	if (obj.style.visibility == 'visible') {
		obj.style.visibility = 'hidden';
	}
	else {
		obj.style.visibility = 'visible';
	}
}

function initialResponse(str){
	var profile = new Array();
	profile[0] = JSON.parse(str).profile
	var stringifiedProfile = JSON.stringify(profile)
	chrome.runtime.sendMessage({createprofile: stringifiedProfile}, function(response) {
		fetchFileContent('http://localhost:8000/popclick/api/get/'+profile[0], logging)
	});
}

function logging(tes) {
	console.log(tes);
	tes = JSON.parse(tes);
	chrome.runtime.sendMessage({updateprivate: tes.auth}, function(response) {
		console.log('auth on board')
	});
}

function fetchFileContent(URL, cb) {
	var xhr = new XMLHttpRequest()
	console.log('sent');
	console.log('URL'+URL)
	xhr.ontimeout = function() {
		console.error('Please contact support.')
	};

	xhr.onload = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				cb(xhr.response);
			}
		}
	};
	xhr.open('GET', URL, true)
	xhr.send()
}

//Remember to toast if form isn't complete
function postAction(logtime, age, interests, gender, signed, callback){
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
    xhr.send(JSON.stringify({"logtime":logtime, "age":age, "gender":gender, "interests":interests}));
    // statusDisplay.innerHTML = 'Saving...';

}