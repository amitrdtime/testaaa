import axios from "axios";
import DedicatedTrailer from "../models/dedicatedtrailerModel";
import Driver from "../models/driverModel";

// Application Specific
import Location from "../models/locationModel";
import ShipperPool from "../models/shipperpoolModel";
import BaseService from "./baseService";
import * as fflate from 'fflate';
//import zlib from zlib;

class LocationService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  async getLocation(locationId) {
    const location = new Location();
    let locationObject = [];
    try {
      if (!this.isIntegrated) {
        const locationData = location.sampleLocations.filter(function (tml) {
          return tml.id === locationId;
        });
        locationObject = location.parseApiLocationObject(locationData[0]);
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/locations/" + locationId;
        const locationApiData = await axios.get(url);
        locationObject = location.parseApiLocationObject(
          locationApiData.data.data
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving terminal data. Please try again!"
      );
    }

    return Promise.resolve(locationObject);
  }

  async getAllLocations() {
    const location = new Location();
    let locationObject = [];
    try {
      if (!this.isIntegrated) {
        const locationData = location.sampleLocations;
        locationObject = location.sampleLocations.map((data) =>
          location.parseApiLocationObject(data)
        );
      } else {
        // API object call.

        const url = this.ApiEndPoint + "/locations";
        let locationApiData = await axios.get(url);

        //locationApiData = zlib.inflateSync(Buffer.from(locationApiData.data, 'base64')).toString();
        const strData = atob(locationApiData.data);
        // Convert binary string to character-number array
        const charData = strData.split("").map((x) => { return x.charCodeAt(0); });
        // Turn number array into byte-array
        const binData = new Uint8Array(charData);
        // Use this Code to Decode the String

        //Uncompress API Call//
        let locationApiDataUnCompressed = fflate.unzlibSync(binData);
        let locationApiDataUnCompressedString =  fflate.strFromU8(locationApiDataUnCompressed)
        let locationIntermediateObject = JSON.parse(locationApiDataUnCompressedString)

        locationObject = locationIntermediateObject.data.map((data) =>
          location.parseApiLocationObject(data)
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving terminal data. Please try again!"
      );
    }
    return Promise.resolve(locationObject);
  }
  async filterLocation(filterData) {
    
    const location = new Location();
    let locationObject = [];
    // Call API using Await
    if (!this.isIntegrated) {
      const locationData = location.sampleLocations.filter(function (ter) {
        return ter.name === filterData;
      });

      
      if (locationData.length > 0) {
        locationObject = locationData;
      } else {
        locationObject = location.sampleLocations.map((data) =>
          location.parseApiLocationObject(data)
        );
      }
    } else {
      // API object call.
      const url = this.ApiEndPoint + "/filterlocationconsigneeshipper";
      const data = {
        search: filterData.search,
        terminalId: filterData.terminalId,
        relayPoint: filterData.relayPoint,
        dropYard: filterData.dropYard,
        distCenter: filterData.distCenter,
        truckStop: filterData.truckStop,
        outsideShop: filterData.outsideShop,
        TW: filterData.TW,
        BRATSLoc: filterData.BRATSLoc,
        region: filterData.region,
        state: filterData.state,
      };
      const locationApiData = await axios.post(url, data);
      
      locationObject = locationApiData.data.data.map((data) =>
        location.parseApiLocationObject(data)
      );
      
    }

    return Promise.resolve(locationObject);
  }

  async getDriversByLocationID(locationId, searchData, isShipperOrConsignee) {
    let allDrivers = [];
    const driver = new Driver();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          locationId: locationId,
          search: searchData,
          blocktype: isShipperOrConsignee,
        };
        const url = this.ApiEndPoint + "/getdriverbylocationid";
        const driverApiData = await axios.post(url, data);
        

        allDrivers = driverApiData.data.data.map((data) =>
          driver.parseApiDriverObject(data)
        );
      }
    } catch (error) {}
    return Promise.resolve(allDrivers);
  }
  // get  and innner serach
  async getShipperPoolByLocationID(locationId) {
    let sPools = [];
    const sPool = new ShipperPool();
   
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          locationid: locationId,
        
        };
        const url = this.ApiEndPoint + "/shipperpoolsbylocationid";
        const spApiData = await axios.post(url, data);
        // sPools = spApiData.data.data.map((data) =>
        //   sPool.parseApiShipperPoolObject(data)
        // );
        var getshiperpool = spApiData.data.data;
        sPools = getshiperpool;
      
      }
    
    return Promise.resolve(sPools);
  }

  async createShipperPool(data) {
    let sPools = [];
    const sPool = new ShipperPool();
   
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/shipperpools";
        const spApiData = await axios.post(url, data);
        

        // sPools = spApiData.data.data.map((data) =>
        //   sPool.parseApiShipperPoolObject(data)
        // );
        let addShiperpool = spApiData.data.data
        sPools = addShiperpool
      }
    
    return Promise.resolve(sPools);
  }
  async saveShipperPool(data) {
    let sPools = [];
    const sPool = new ShipperPool();
   
      if (!this.isIntegrated) {
        
      } else {
       
        let payLoad = {
        
          id: data.id,
          locationid: data.locationid,
          commodityid: data.commodityid,
          effectivedate: data.effectivedate,
          expirationdate:data.expirationdate,
          targetcount: data.targetcount,
        };
        console.log("payLoad",payLoad)

            
        // 
        // const url = this.ApiEndPoint + "/shipperpools/" + data.id;
        const url = this.ApiEndPoint + "/updateShipperPool";
        const spApiData = await axios.post(url, payLoad);
        
        var updateshipperpool = spApiData.data.data
        sPools = updateshipperpool
        // sPools = spApiData.data.data.map((data) =>
        //   sPool.parseApiShipperPoolObject(data)
        // );
        // sPools = sPool.parseApiShipperPoolObject(spApiData.data)
        return Promise.resolve(sPools);
      }
    
  
  }
  async deleteShipperPool(data) {
    let sPools = [];
    const sPool = new ShipperPool();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let payLoad = {
          id:data.id,
          // locationId: data.locationId,
          // commodityid: data.cgId,
        };
        const url = this.ApiEndPoint + "/deleteShipperPool/";
        const spApiData = await axios.post(url, payLoad);
        

        sPools = spApiData.data.data;
      }
    } catch (error) {
      return Promise.reject("failed");
    }
    return Promise.resolve(sPools);
  }
 

  async getDedicatedTrailersByLocationID(locationId, searchData) {
    let dedicatedTrailers = [];
    const dTrailer = new DedicatedTrailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          location_id: locationId,
          
        };
        const url = this.ApiEndPoint + "/getdedicatedtrailersbylocation";
        const dtApiData = await axios.post(url, data);
        

        // dedicatedTrailers = dtApiData.data.data.map((data) =>
        //   dTrailer.parseApiDedicatedTrailerObject(data)
        // );
        dedicatedTrailers = dtApiData.data.data;
      }
    } catch (error) {
      return Promise.reject("Error: Unable to retirve the dedicated trailers.");
    }
    return Promise.resolve(dedicatedTrailers);
  }

  async getShipperPoolsById(shipperpoolId) {
    try {
      if (!this.isIntegrated) {

      } else {
        let data = {
          shipperpoolId: shipperpoolId,

        };
        const url = this.ApiEndPoint + "/getshipperpooltrailers";
        const shipperpoolTrailers = await axios.post(url, data);
        return Promise.resolve(shipperpoolTrailers.data.data);
      }
    } catch (error) {
      return Promise.reject("Error: Unable to retirve the Shipper Pool Trailers.");
    }

  }

  async getDedicatedFilterTrailersByLocationID(locationId, searchData) {
    let dedicatedTrailers = [];
    const dTrailer = new DedicatedTrailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          locationid: locationId,
          search: searchData,
        };
        const url = this.ApiEndPoint + "/filterdedicatedtrailer";
        const dtApiData = await axios.post(url, data);
        

        dedicatedTrailers = dtApiData.data.data.map((data) =>
          dTrailer.parseApiDedicatedTrailerObject(data)
        );
      }
    } catch (error) {
      return Promise.reject("Error: Unable to retirve the dedicated trailers.");
    }
    return Promise.resolve(dedicatedTrailers);
  }

  async addDedicatedTrailer(data) {
    let dedicatedTrailers = [];
    const dTrailer = new DedicatedTrailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/assigndedicatedtrailer";
        const dtApiData = await axios.post(url, data);
        

        dedicatedTrailers = dtApiData.data.data.map((data) =>
          dTrailer.parseApiDedicatedTrailerObject(data)
        );
      }
    } catch (error) {
      return Promise.reject("Error: Unable to add the dedicated trailer.");
    }
    return Promise.resolve(dedicatedTrailers);
  }

  async saveDedicatedTrailer(data) {
    let dedicatedTrailers = [];
    const dTrailer = new DedicatedTrailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/updatededicatedtrailer";
        const dtApiData = await axios.post(url, data);
        

        dedicatedTrailers = dtApiData.data.data.map((data) =>
          dTrailer.parseApiDedicatedTrailerObject(data)
        );
      }
    } catch (error) {
      return Promise.reject("Error: Unable to update the dedicated trailer.");
    }
    return Promise.resolve(dedicatedTrailers);
  }

  async removeDedicatedTrailer(data) {
    let dedicatedTrailers = [];
    const dTrailer = new DedicatedTrailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const payload = {
          id: data.id,
        };
        const url = this.ApiEndPoint + "/removededicatedtrailer";

        const dtApiData = await axios.post(url, payload);
        

        dedicatedTrailers = dtApiData.data.data;
      }
    } catch (error) {
      return Promise.reject("failed");
    }
    return Promise.resolve(dedicatedTrailers);
  }
  async dateFormatter (date) {
    var today = date;
    var dd = String(today?.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    today = yyyy + '-' + mm + '-' + dd;
    console.log("Today",today);
    return today;
  }
}

export default LocationService;
