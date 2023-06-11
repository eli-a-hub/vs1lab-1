/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...


console.log(document.getElementById("tagLongitude").value + " before reset")
//document.getElementById("tag-form").reset()
console.log(document.getElementById("tagLongitude").value + " after reset")

var longitude__coords = (document.getElementById("tagLongitude")).value;
var latitude__coords = (document.getElementById("tagLatitude")).value;

function updateLocation() {

  const ourMap = new MapManager("9JoohNhdn98fOEdzquKuTR4RRZaGKjMm");  
  console.log(document.getElementById("tagLongitude").value)
  
  var img= document.getElementById("mapView");
  var tags = null;
  let nearGeoTaglist = JSON.parse(img.getAttribute("data-tags"));
  

  if(longitude__coords == '' || latitude__coords == '') {
    LocationHelper.findLocation(function (helper) {
      console.log("Entered findLocation")
      
      longitude__coords = helper.longitude;
      latitude__coords = helper.latitude;

      var tLong = document.getElementById("tagLongitude");
      tLong.value = longitude__coords;

      var tLat = document.getElementById("tagLatitude");
      tLat.value = latitude__coords;

      var dLong = document.getElementById("discLongitude");
      dLong.value = longitude__coords;

      var dLat = document.getElementById("discLatitude");
      dLat.value = latitude__coords;

    

      console.log(document.getElementById("tagLongitude").value);
      img.src = ourMap.getMapUrl(latitude__coords, longitude__coords, nearGeoTaglist, 15);
    });

  } else {
    img.src = ourMap.getMapUrl(latitude__coords, longitude__coords, nearGeoTaglist, 15);
  }
}

document.addEventListener("DOMContentLoaded", updateLocation, true);