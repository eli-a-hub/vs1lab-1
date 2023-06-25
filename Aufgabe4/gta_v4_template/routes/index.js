// File origin: VS1LAB A3, A4


// App routes (A3)

//////////////////////////////////////A3////////////////////////////////////////
// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');


let store = new InMemoryGeoTagStore();

// add geotag-examples to store
GeoTagExamples.tagList.forEach(tag => {
  store.addGeoTag(new GeoTag(tag[0], tag[1], tag[2], tag[3], tag[4]));
});
store.giveID();


/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { taglist: store.getTagsPage(1) , resLat: "", resLong: "", resTags: JSON.stringify(store.getTags()), PageNumber: 1, maxPageNumber: Math.ceil(Object.keys(store.getTags()).length/5), pageElements: Object.keys(store.getTags()).length});
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...

router.post('/tagging', (req, res) => {
  let newTag = new GeoTag(req.body["geoTagName"], req.body["geoTagLatitude"], req.body["geoTagLongitude"], req.body["geoTagHashtag"], req.body["geoTagID"]);
  store.addGeoTag(newTag);
  var nearTags = store.getNearbyGeoTags({latitude: newTag.latitude, longitude: newTag.longitude });
  res.render('index', {taglist: nearTags, resLat: newTag.latitude, resLong: newTag.longitude, resTags: JSON.stringify(nearTags)});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...

router.post('/discovery',(req, res)=> {
    let keyword = req.body["keyword"];
    searchTags = store.searchNearbyGeoTags(keyword);
    res.render("index", { taglist: searchTags, resLat: req.body["latitude"], resLong: req.body["longitude"], resTags: JSON.stringify(searchTags)});
});

/////////////////////////////////////////A3END/////////////////////////////////////////////////7


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
// curl Aufruf Beispiel Keyword + Location: curl -X GET "http://localhost:3000/api/geotags/?keyword=edu&latitude=49.01369&longitude=8.404425"
// curl Aufruf Beispiel nur Keyword: curl -X GET "http://localhost:3000/api/geotags/?keyword=Building"
// curl Aufruf Beispiel nur Location: curl -X GET "http://localhost:3000/api/geotags/?latitude=49.01369&longitude=8.404425"
// curl Aufruf Beispiel bei nichts(einfach alle GeoTags): curl -X GET "http://localhost:3000/api/geotags/"
router.get('/api/geotags', (req,res)=> {
  if(req.query.page === undefined || req.query.page == null){
    if (req.query.latitude == null || req.query.latitude === undefined || req.query.longitude == null || req.query.longitude === undefined){
      if (req.query.keyword) {
        let keyword = req.query.keyword;
        let nearTags = store.searchNearbyGeoTags(keyword);
        store.setPageNumber(1);
        res.json({tags: nearTags, page: store.getPageNumber()});
      } else { // <------------------------------------------------------
        let storeList = store.getTags();
        store.setPageNumber(1);
        res.json({tags: storeList, page: store.getPageNumber()});
      }
    } else {
      if (req.query.keyword) {
        let keyword = req.query.keyword;
        let nearTags = store.searchNearbyGeoTags(keyword, {latitude: req.query.latitude, longitude: req.query.longitude});
        store.setPageNumber(1);
        res.json({tags: nearTags, page: store.getPageNumber()});
      } else {
        let nearTags = store.getNearbyGeoTags({latitude: req.query.latitude, longitude: req.query.longitude});
        store.setPageNumber(1);
        res.json({tags: nearTags, page: store.getPageNumber()});
      }
    }
  }else {
    store.setPageNumber(req.query.page);  
    if (req.query.latitude == null || req.query.latitude === undefined || req.query.longitude == null || req.query.longitude === undefined){
      if (req.query.keyword) {
        let keyword = req.query.keyword;
        let nearTags = store.searchNearbyGeoTags(keyword);
        res.json({tags: nearTags, page: store.getPageNumber()});
      } else {
        let storeList = store.getTags();
        res.json({tags: storeList, page: store.getPageNumber()});
      }
    } else {
      if (req.query.keyword) {
        let keyword = req.query.keyword;
        let nearTags = store.searchNearbyGeoTags(keyword, {latitude: req.query.latitude, longitude: req.query.longitude});
        res.json({tags: nearTags, page: store.getPageNumber()});
      } else {
        let nearTags = store.getNearbyGeoTags({latitude: req.query.latitude, longitude: req.query.longitude});
        res.json({tags: nearTags, page: store.getPageNumber()});
      }
    }
  }
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
// curl Aufruf Beispiel: curl -I -X POST "http://localhost:3000/api/geotags/?name=test&latitude=49.01369&longitude=8.404425&hashtag=%23test1"
router.post('/api/geotags', (req, res)=> {
  let forcedHashtag = ""; // If hashtag not defined, 'undefined' in discovery list, so we force it
  let newGeo;
  if (req.query.hashtag == null || req.query.hashtag === undefined) {
    newGeo = new GeoTag(req.query.name, req.query.latitude, req.query.longitude, forcedHashtag);
  } else {
    newGeo = new GeoTag(req.query.name, req.query.latitude, req.query.longitude, req.query.hashtag);
  }
  store.addGeoTag(newGeo);
  let geoID = newGeo.id;
  res.set({'Location': 'api/geotags/'+geoID, 'Status': '201 Created'});
  res.json({tag: newGeo, page: store.getPageNumber()});
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
// curl Aufruf Beispiel: curl -X GET "http://localhost:3000/api/geotags/0"
router.get('/api/geotags/:id', (req, res)=> {
  let geoTag = store.searchID(req.params.id);
  res.json(geoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
// curl Aufruf Beispiel: curl -X PUT "http://localhost:3000/api/geotags/9?name=test&latitude=49.01369&longitude=8.404425&hashtag=%23test1"
router.put('/api/geotags/:id', (req, res) => {
  let newTag = new GeoTag(req.query.name, req.query.latitude, req.query.longitude, req.query.hashtag, req.params.id);
  store.replaceGeoTag(req.params.id, newTag);
  let changedTag = store.searchID(req.params.id);
  res.json(changedTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
// curl Aufruf Beispiel: curl -X DELETE "http://localhost:3000/api/geotags/0"
router.delete('/api/geotags/:id', (req, res) => {
  let deletedTag = store.removebyID(req.params.id);
  res.json(deletedTag);
});

module.exports = router;
