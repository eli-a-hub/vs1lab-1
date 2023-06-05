import LocationHelper from './location-helper.js';
import MapManager from './map-manager.js';
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
//const locationHelper = new LocationHelper();
const ourMap = new MapManager("9JoohNhdn98fOEdzquKuTR4RRZaGKjMm");

var longitude__coords;
var latitude__coords;
function updateLocation() {
  //if(!(true)) {
  if(!(longitude__coords && latitude__coords)) {
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

        /*const currentTagList = {
              latitude: latitude__coords,
              longitude: longitude__coords,
              name: "",
              tags: ""
        };*/

        document.getElementById("mapView").src = ourMap.getMapUrl(latitude__coords, longitude__coords, [latitude__coords, longitude__coords], 10); // [currentTagList] ?
      });
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation());