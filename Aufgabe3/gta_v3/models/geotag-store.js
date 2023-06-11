// File origin: VS1LAB A3

const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    
    #storeGeoTag = [];
    
    addGeoTag(geotag) {
        this.#storeGeoTag.push(geotag);
    }

    removeGeoTag(name) {
        for(let i = 0; i < this.#storeGeoTag.length; i++) {
            if(name === this.#storeGeoTag[i].name) {
                this.#storeGeoTag.splice(i);
                break;
            }
        }
    }

    getNearbyGeoTags(location){
        let nearTags = [];
        for(let i = 0; i < this.#storeGeoTag.length; i++) {
            if(this.getDistance(location.latitude, location.longitude, 
                this.#storeGeoTag[i].latitude, this.#storeGeoTag[i].longitude) <= radius) {
                nearTags.push(storeGeoTag[i]);
            }
        }
        return nearTags;
    }

    searchNearbyGeoTags(location, keyword) {
        let nearTags = [];
        for(let i = 0; i < this.#storeGeoTag.length; i++) {
            let distance = this.getDistance(location.latitude, location.longitude, this.#storeGeoTag[i].latitude, this.#storeGeoTag[i].longitude);
            if(distance <= radius && (this.#storeGeoTag[i].name.includes(keyword) || this.#storeGeoTag[i].hashtag.includes(keyword))) {
                nearTags.push(storeGeoTag[i]);
            }
        }
        return nearTags;
    }

    getTags() {
        return this.#storeGeoTag;
    } 

    // Use haversine formula to calculate distance between coordinates
    getDistance(lat1,lon1,lat2,lon2) {
        var rEarth = 6371; // radius of the earth in km
        var distLon = this.degToRad(lon2-lon1); 
        var distLat = this.degToRad(lat2-lat1);
        
        var a = Math.sin(distLat/2) * Math.sin(distLat/2) + Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
          Math.sin(distLon/2) * Math.sin(distLon/2); 

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var distance = rEarth * c; // distance in km
        return distance;
      }
    
    degToRad(degree) {
        return degree * (Math.PI/180);
      }

}

let radius = 5; // in km

module.exports = InMemoryGeoTagStore
