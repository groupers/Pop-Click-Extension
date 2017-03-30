// function getToggle(callback) { // expects function(value){...}
//   chrome.storage.local.get('toggle', function(data){
//     if(data.toggle === undefined) {
//       callback(true); // default value
//     } else {
//       callback(data.toggle);
//     }
//   });
// }

// function setToggle(value, callback){ // expects function(){...}
//   chrome.storage.local.set({toggle : value}, function(){
//     if(chrome.runtime.lastError) {
//       throw Error(chrome.runtime.lastError);
//     } else {
//       callback();
//     }
//   });
// }

// $(document).ready(function() {
//   chrome.storage.local.get('toggle', function(data) {
//     if (data.toggle === false) {
//       return;
//     } else {
//       /* do some css inject */
//     }
//   });

//   chrome.storage.onChanged.addListener(function(changes, areaName){
//     if(areaName == "local" && changes.toggle) { 
//       if(changes.toggle.newValue) {
//         /* do some css inject */
//       } else {
//         /* set css to original */
//       }
//     }
//   });
// });