/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

console.log("The geoTagging script is going to start...");

document.getElementById("discoveryFilterForm").addEventListener("submit", clickSearch, false); // Event Listener for discovery submit button

document.getElementById("tag-form").addEventListener("submit", clickAddTag, false); // Event Listener for tagging submit button

document.getElementById("prev").addEventListener("click", clickPrev, false); // Event Listener for previous page button

document.getElementById("next").addEventListener("click", clickNext, false); // Event Listener for next page button

// Code A4 Pagination
let currentPage = 1;
let maxPages = 3;
function getArrayLength(tags){
  let info = Object.keys(tags).length;
  return info;
}

function updatePages(tags){
  let maxEntries = 5;
  maxPages = Math.ceil(Object.keys(tags).length / maxEntries);
  return maxPages;
}

function updateTagList(taglist, page) {
  let n = page*5;
  let range = Array.from(Array(n).keys())
  let pageTags = [];
  if (taglist == null || taglist === undefined) return pageTags;
  for (let i = n-5; i < range.length; i++){
    if(taglist[i] == null || taglist[i] === undefined) break;
      pageTags.push(taglist[i]);
  }
  return pageTags;
  }

function clickPrev(event){
  console.log('Clicked "previous" button');
  event.preventDefault();
}

function clickNext(event){
  console.log('Clicked "next" button');
  let formData = new FormData(document.getElementById("discoveryFilterForm"));
  let url = "http://localhost:3000/api/geotags";
  let questionMark = false;
  let lat;
  let long;
  currentPage++;

  // Create URL with (optional) querys
  if (formData.get("keyword") !== null && formData.get("keyword") !== undefined && formData.get("keyword") !== "") {
    url += "?keyword=" + encodeURIComponent(formData.get("keyword"));
    questionMark = true;
  }
  if (formData.get("latitude") !== null && formData.get("latitude") !== undefined && formData.get("latitude") !== "" && questionMark) {
    url += "&latitude=" + encodeURIComponent(formData.get("latitude"));
    lat = formData.get("latitude");
  } else if (formData.get("latitude") !== null && formData.get("latitude") !== undefined && formData.get("latitude") !== "" && !questionMark){
    url += "?latitude=" + encodeURIComponent(formData.get("latitude"));
    lat = formData.get("latitude");
    questionMark = true;
  }
  if (formData.get("longitude") !== null && formData.get("longitude") !== undefined && formData.get("longitude") !== "") {
    url += "&longitude=" + encodeURIComponent(formData.get("longitude"));
    long = formData.get("longitude");
  }
  if(questionMark) url += "&page=" + encodeURIComponent(currentPage);
  if(!questionMark) url += "?page=" + encodeURIComponent(currentPage);
  console.log("Page number set: " +currentPage);
  console.log("URL to fetch: " +url);

  fetch(url, {
    method: "GET"
  })
    .then(function(res) {
      // Check success status
      if (res.ok) {
        console.log("fetching...");
        return res.json();
      } else {
        throw new Error("Error while fetching: " + res.status);
      }
    })
    .then(function(data) {
        // New map + update GeoTag discovery List with generateNewHTML(tagList)
        const ourMap = new MapManager("9JoohNhdn98fOEdzquKuTR4RRZaGKjMm");
        let img= document.getElementById("mapView");
        img.src = ourMap.getMapUrl(lat, long, data.tags, 15);
        let newHTML = generateNewHTML(updateTagList(data.tags, currentPage));
        let discoveryListElement = document.getElementById("discoveryResults");
        discoveryListElement.innerHTML = newHTML;
        console.log(data.tags); 
        // Code Zusatzaufgabe
        let pageInfo = document.getElementById("pageInfo");
        pageInfo.innerHTML = currentPage + "/" + updatePages(data.tags) + " (" + getArrayLength(data.tags) + ")";
        if(currentPage == maxPages) document.getElementById("next").disabled = true;
    })
    .catch(function(error) {
      console.error(error);
    });
}
  
  
//                      -- Discovery Section --
function generateNewHTML(tagList) {     // Generates new HTML with CSS of old discoveryList
  var html = '<ul class="discovery__results" id="discoveryResults">';

  tagList.forEach(gtag => {
    html += `<li>${gtag.name} (${gtag.latitude},${gtag.longitude}) ${gtag.hashtag}</li>`;
  });

  html += '</ul>';

  return html;
}

function clickSearch(event){
  console.log('Clicked "Search" button');
  event.preventDefault();
  let formData = new FormData(document.getElementById("discoveryFilterForm"));
  let url = "http://localhost:3000/api/geotags";
  let questionMark = false;
  let lat;
  let long;

  // Create URL with (optional) querys
  if (formData.get("keyword") !== null && formData.get("keyword") !== undefined && formData.get("keyword") !== "") {
    url += "?keyword=" + encodeURIComponent(formData.get("keyword"));
    questionMark = true;
  }
  if (formData.get("latitude") !== null && formData.get("latitude") !== undefined && formData.get("latitude") !== "" && questionMark) {
    url += "&latitude=" + encodeURIComponent(formData.get("latitude"));
    lat = formData.get("latitude");
  } else if (formData.get("latitude") !== null && formData.get("latitude") !== undefined && formData.get("latitude") !== "" && !questionMark){
    url += "?latitude=" + encodeURIComponent(formData.get("latitude"));
    lat = formData.get("latitude");
  }
  if (formData.get("longitude") !== null && formData.get("longitude") !== undefined && formData.get("longitude") !== "") {
    url += "&longitude=" + encodeURIComponent(formData.get("longitude"));
    long = formData.get("longitude");
  }
  console.log("URL to fetch: " +url);

  fetch(url, {
    method: "GET"
  })
    .then(function(res) {
      // Check success status
      if (res.ok) {
        console.log("fetching...");
        return res.json();
      } else {
        throw new Error("Error while fetching: " + res.status);
      }
    })
    .then(function(data) {
      // New map + update GeoTag discovery List with generateNewHTML(tagList)
      const ourMap = new MapManager("9JoohNhdn98fOEdzquKuTR4RRZaGKjMm");
      let img= document.getElementById("mapView");
      img.src = ourMap.getMapUrl(lat, long, data.tags, 15);
      let newHTML = generateNewHTML(updateTagList(data.tags, data.page));
      let discoveryListElement = document.getElementById("discoveryResults");
      discoveryListElement.innerHTML = newHTML;
      console.log(data.tags); 
      // Code Zusatzaufgabe
      let pageInfo = document.getElementById("pageInfo");
      pageInfo.innerHTML = data.page + "/" + updatePages(data.tags) + " (" + getArrayLength(data.tags) + ")";
    })
    .catch(function(error) {
      console.error(error);
    });
}

//                      -- Tagging Section --

function clickAddTag(event) {
  console.log('Clicked "Add Tag" button');
  event.preventDefault();

  let formData = new FormData(document.getElementById("tag-form"));
  let url = "http://localhost:3000/api/geotags";
  let lat;
  let long;

  // Create URL with (optional) querys
  if (formData.get("geoTagName") !== null && formData.get("geoTagName") !== undefined && formData.get("geoTagName") !== "") {
    url += "?name=" + encodeURIComponent(formData.get("geoTagName"));
  }
  if (formData.get("geoTagLatitude") !== null && formData.get("geoTagLatitude") !== undefined && formData.get("geoTagLatitude") !== "") {
    url += "&latitude=" + encodeURIComponent(formData.get("geoTagLatitude"));
    lat = formData.get("geoTagLatitude");
  }
  if (formData.get("geoTagLongitude") !== null && formData.get("geoTagLongitude") !== undefined && formData.get("geoTagLongitude") !== "") {
    url += "&longitude=" + encodeURIComponent(formData.get("geoTagLongitude"));
    long = formData.get("geoTagLongitude");
  }
  if (formData.get("geoTagHashtag") !== null && formData.get("geoTagHashtag") !== undefined && formData.get("geoTagHashtag") !== "") {
    url += "&hashtag=" + encodeURIComponent(formData.get("geoTagHashtag"));
  }
  console.log("URL to fetch: " +url);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(res) {
      // Check success status
      if (res.ok) {
        console.log("fetching...");
        return res.json();
      } else {
        throw new Error("Error while fetching: " + res.status);
      }
    })
    .then(function(data) {
      // Add new GeoTag to the tagList and update the map + GeoTag discovery list
      const ourMap = new MapManager("9JoohNhdn98fOEdzquKuTR4RRZaGKjMm");  
      
      let img = document.getElementById("mapView");
      let nearGeoTaglist = JSON.parse(img.getAttribute("data-tags"));
      nearGeoTaglist.push(data.tag);
      img.src = ourMap.getMapUrl(lat, long, nearGeoTaglist, 15);
      console.log(JSON.stringify(data.tag) + " added.");
      let smallerTagList = updateTagList(nearGeoTaglist, data.page);
      let newHTML = generateNewHTML(smallerTagList);
      let discoveryListElement = document.getElementById("discoveryResults");
      discoveryListElement.innerHTML = newHTML;
      img.setAttribute("data-tags", JSON.stringify(nearGeoTaglist));
      console.log(nearGeoTaglist);
      // Code Zusatzaufgabe
      let pageInfo = document.getElementById("pageInfo");
      pageInfo.innerHTML = data.page + "/" + updatePages(nearGeoTaglist) + " (" + getArrayLength(nearGeoTaglist) + ")"; 
    })
    .catch(function(error) {
      console.error(error);
    });
}
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
  
  var img= document.getElementById("mapView");
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

      img.src = ourMap.getMapUrl(latitude__coords, longitude__coords, nearGeoTaglist, 15);
    });

  } else {
    img.src = ourMap.getMapUrl(latitude__coords, longitude__coords, nearGeoTaglist, 15);
  }
}

document.addEventListener("DOMContentLoaded", updateLocation, true);