import axios from 'axios';

// Application Specific
import Driver from '../models/driverModel';
import BaseService from './baseService';
import { DateTime } from "luxon";
import * as fflate from 'fflate';

class DriverService extends BaseService {
    constructor() {
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async getDriver(driverId) {
        const driver = new Driver();
        let driverObject = []
        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver.filter(function (dvr) {
                    return dvr.roleId === driverId;
                });
                driverObject = driver.parseApiDriverObject(driverData[0]);
            } else {
                // API object call.
                console.log("Driver ID: ", driverId);
                const url = this.ApiEndPoint + "/drivers/" + driverId;
                const driverApiData = await axios.get(url);
                driverObject = driver.parseApiDriverObject(driverApiData.data.data);
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }


    async getAllActiveDrivers() {
        const driver = new Driver();
        let driverObject = [];

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object cafhgffhll.
                const url = this.ApiEndPoint + "/activedrivers";
                
                const driverApiData = await axios.get(url);
                //console.log("driverApiData :"+JSON.stringify(driverApiData));
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                //console.log("driverApiData :"+JSON.stringify(driverObject));
            }
        } catch (err) {
            console.log("driverApiData error :"+err);
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }


    async searchDrivers(filterdata) {
        const driver = new Driver();
        let driverObject = [];

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object call.

                const url = this.ApiEndPoint + "/filterdrivers";
                const data = {
                    search: filterdata.search,
                    name: filterdata.name,
                    code: filterdata.code,
                    region: filterdata.region,
                    terminalId: filterdata.terminalId,
                    city: filterdata.city,
                    state: filterdata.state,
                    status: filterdata.status,
                    zip: filterdata.zip,
                    isactive: null
                }

                const driverApiData = await axios.post(url, data);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async getAllDrivers(filterData){
        let allDrivers = []
        const driver=new Driver()
        try {
            if (!this.isIntegrated) {
                
            }
            else {
                let data = {
                    "terminalId": filterData.terminalId,
                }
                const url = this.ApiEndPoint + "/drivers";
                
                const driverApiData = await axios.post(url, data);

                //locationApiData = zlib.inflateSync(Buffer.from(locationApiData.data, 'base64')).toString();
                const strData = atob(driverApiData.data);
                // Convert binary string to character-number array
                const charData = strData.split("").map((x) => { return x.charCodeAt(0); });
                // Turn number array into byte-array
                const binData = new Uint8Array(charData);
                // Use this Code to Decode the String

                //Uncompress API Call//
                let driverApiDataUnCompressed = fflate.unzlibSync(binData);
                let driverApiDataUnCompressedString = fflate.strFromU8(driverApiDataUnCompressed)
                let driverIntermediateObject = JSON.parse(driverApiDataUnCompressedString)
                
                allDrivers = driverIntermediateObject.data.map(data => driver.parseApiDriverObject(data));

                console.log("allDrivers :"+JSON.stringify(allDrivers));
            }

        } catch (error) {

        }
        return Promise.resolve(allDrivers);
    }

    async getBannedDrivers(filterData){
        let allDrivers = []
        const driver=new Driver()
        try {
            if (!this.isIntegrated) {
                
            }
            else {
                let data = {
                    "terminalId": filterData.terminalId,
                }
                const url = this.ApiEndPoint + "/activebanneddrivers";
                const driverApiData = await axios.post(url, data);

                //locationApiData = zlib.inflateSync(Buffer.from(locationApiData.data, 'base64')).toString();
                const strData = atob(driverApiData.data);
                // Convert binary string to character-number array
                const charData = strData.split("").map((x) => { return x.charCodeAt(0); });
                // Turn number array into byte-array
                const binData = new Uint8Array(charData);
                // Use this Code to Decode the String

                //Uncompress API Call//
                let driverApiDataUnCompressed = fflate.unzlibSync(binData);
                let driverApiDataUnCompressedString = fflate.strFromU8(driverApiDataUnCompressed)
                let driverIntermediateObject = JSON.parse(driverApiDataUnCompressedString)
                
                allDrivers = driverIntermediateObject.data.map(data => driver.parseApiDriverObject(data));
            }

        } catch (error) {

        }
        return Promise.resolve(allDrivers);
    }


    async getDriversByTerminalId(terminalId, searchText) {
        const driver = new Driver();
        let driverObject = [];
        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/getbyterminalid";
                const data = {
                    "terminalId": terminalId,
                    "search": searchText
                }
                const driverApiData = await axios.post(url, data);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async getDriversByLocationID(locationId, searchData) {
        let allDrivers = []
        const driver = new Driver()
        try {
            if (!this.isIntegrated) {
                
            }
            else {
                let data = {
                    "locationId": locationId,
                    "search": searchData,
                    // "blocktype": isShipperOrConsignee
                }
                const url = this.ApiEndPoint + "/getdriverbylocationid";
                const driverApiData = await axios.post(url, data);
                

                allDrivers = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
            }

        } catch (error) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(allDrivers);


    }

    async blockDriverForLocation(driverdata) {
        const driver = new Driver();
        let driverObject = [];
        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/blockdriver";

                const driverApiData = await axios.post(url, driverdata);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }
    async unBlockDriverForLocation(driverdata) {
        const driver = new Driver();
        let driverObject = [];
        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/deletebanneddriversbylocationid";

                const driverApiData = await axios.post(url, driverdata);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);

    }

    async getDriverPrefSetting() {
        const driver = new Driver();
        let driverObject = [];
        try {
            // API object call.
            const url = this.ApiEndPoint + "/getdriverprefsettings";

            const driverApiData = await axios.get(url);
            driverObject = driverApiData.data.data; //.map(data => driver.parseApiDriverObject(data));
            

        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async getDriverPrefData(driverid) {
        const driver = new Driver();
        let driverObject = [];
        try {
            // API object call.
            const url = this.ApiEndPoint + "/getdriverprefdata/" + driverid;

            const driverApiData = await axios.get(url);
            driverObject = driverApiData.data.data; //.map(data => driver.parseApiDriverObject(data));
            // 

        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async saveDriverPreference(prefSettings, driverDataForSave, driverId) {
        try {
            const data = {};
            data.driverid = driverId;
            data.pref_values = [];

            for (let loopSave = 0; loopSave < driverDataForSave.length; loopSave++) {
                const driverPref = driverDataForSave[loopSave];
                const obj = {}
                obj.id = driverPref.id !== undefined ? driverPref.id : '';
                obj.typeid = driverPref.preftypeId;
                let prefValues = "{";

                const groupInfo = prefSettings.filter(it => it.groupId === driverPref.prefgroupId);

                if (groupInfo.length) {
                    const typeInfo = groupInfo[0].type.filter(it => it.typeId === driverPref.preftypeId);
                    if (typeInfo.length) {
                        const typeData = typeInfo[0];

                        for (let loopPref = 0; loopPref < typeData.possibleValues.length; loopPref++) {
                            const selectedData = driverPref.selectedValues.filter(it => it.column
                                === typeData.possibleValues[loopPref].column);
                            if (selectedData.length) {

                                prefValues = prefValues + "'" + selectedData[0].column + "' : '" + selectedData[0].value + "', ";
                            }
                        }
                    }
                }

                

                obj.prefvalues = prefValues.substr(0, prefValues.length - 2) + "}";

                data.pref_values.push(obj);
            }

            

            const url = this.ApiEndPoint + "/savedriverprefdata";

            const driverApiData = await axios.post(url, data);

        }
        catch (err) {
            return Promise.reject("There is a problem on saving driver preference. Please try again!");
        }
        return Promise.resolve("Driver Preference is saved successfully!");
    }

    async getDriverScheduleByDriverID(driverid) {
        const driver = new Driver();
        let driverObject = [];

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                const url = this.ApiExternalEndPoint + "/drivers/" + driverid;
                const driverApiData = await axios.get(url);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver schedule data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }


    async getgeocodinglatitudelongitude(city) {
        const driver = new Driver();
        let driverObject = [];
        

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.parseApiDriverObject(driverData[0]);
            } else {
                const url = this.ApiEndForSamsara + "/locations/geocoding/?city=" + city;
                const driverApiData = await axios.get(url);
                driverObject = driverApiData.data.data
                console.log("driverObject",driverObject) 

            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver schedule data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }



    async getAllStates() {
        const state = new Driver()
        let stateObject = [];

        try {
            if (!this.isIntegrated) {
                const stateData = state.sampleDriver;
                stateObject = state.sampleDriver.map(data => state.parseApiDriverObject(data))
            } else {
                const url = this.ApiExternalEndPoint + "/state";
                const stateApiData = await axios.get(url);
                stateObject = stateApiData.data.data.map(data => state.parseApiDriverObject(data));
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(stateObject);
    }

    async getAllCity() {
        const city = new Driver()
        let cityObject = [];

        try {
            if (!this.isIntegrated) {
                const cityData = city.sampleDriver;
                cityObject = city.sampleDriver.map(data => city.parseApiDriverObject(data))
            } else {
                const url = this.ApiExternalEndPoint + "/city";
                const cityApiData = await axios.get(url);
                cityObject = cityApiData.data.data.map(data => city.parseApiDriverObject(data));
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(cityObject);
    }

    async getAllZip() {
        const zip = new Driver()
        let zipObject = [];

        try {
            if (!this.isIntegrated) {
                const zipData = zip.sampleDriver;
                zipObject = zip.sampleDriver.map(data => zip.parseApiDriverObject(data))
            } else {
                const url = this.ApiExternalEndPoint + "/zip";
                const zipApiData = await axios.get(url);
                zipObject = zipApiData.data.data.map(data => zip.parseApiDriverObject(data));
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(zipObject);
    }

    async getCitybyState(state) {
        const driver = new Driver()
        const cityByStateObj = [];

        try {
            if (!this.isIntegrated) {
                cityByStateObj = driver.sampleDriver.map(data => driver.parseApiDriverObject(data))
            } else {
                const url = this.ApiExternalEndPoint + "/citybystate";
                const getCityApiData = await axios.get(url);
                cityByStateObj = getCityApiData.data.data.map(data => driver.parseApiDriverObject(data))
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(cityByStateObj);
    }

    async getCitybyState(state) {
        const driver = new Driver()
        const cityByStateObj = [];

        try {
            if (!this.isIntegrated) {
                cityByStateObj = driver.sampleDriver.map(data => driver.parseApiDriverObject(data))
            } else {
                const url = this.ApiExternalEndPoint + "/citybystate";
                let data = {
                    state: state
                }
                const getCityApiData = await axios.get(url, data);
                cityByStateObj = getCityApiData.data.data.map(data => driver.parseApiDriverObject(data))
            }
        } catch (err) {
            return Promise.reject("There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(cityByStateObj);
    }
    

    async getDriverSchedule(driverid, date) {
        const driver = new Driver()
        let driverScheduleObj = [];
        try {
            // const url = this.ApiEndPoint + "/getdriverschedule";
            const url = this.ApiEndPoint + "/getdriverschedulesbydriverid";
            const dateData = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate());
            let data = {
                driver_id: driverid.toString(),
                // startdate: DateTime.local().startOf("week").minus({days : 1}).toMillis(),
                // weekday: 1
            }
            const driverSchedule = await axios.post(url, data);
            return Promise.resolve(driverSchedule.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }

    async addDriverSchedule(data) {
        try {
            const url = this.ApiEndPoint + "/adddriverschedule";
            const addDriverScheduleResponse = await axios.post(url, data);
            return Promise.resolve(addDriverScheduleResponse.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }
    async updateDriverSchedule(data) {
        try {
            const url = this.ApiEndPoint + "/updatedriverschedule";
            const updateDriverScheduleResponse = await axios.post(url, data);
            return Promise.resolve(updateDriverScheduleResponse.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }

    async addOverrideSchedule(data) {
        try {
            const url = this.ApiEndPoint + "/addoverrideschedule";
            const overrideScheduleResponse = await axios.post(url, data);
            return Promise.resolve(overrideScheduleResponse.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }
    async UpdateOverrideSchedule(data) {
        try {
            const url = this.ApiEndPoint + "/updateoverrideschedule";
            const overrideScheduleResponse = await axios.post(url, data);
            return Promise.resolve(overrideScheduleResponse.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }

    async addOverrideEditSchedule(data) {
        try {
            const url = this.ApiEndPoint + "/adddriveroverrideschedulevalues";
            const overrideScheduleResponse = await axios.post(url, data);
            return Promise.resolve(overrideScheduleResponse.data.data);            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }
    }

    async deleteDriverSchedule(driverid, dbId, date, startTime, duration, isAvailable) {
        const driver = new Driver()
        let driverScheduleObj = {};

        try {
            const url = this.ApiEndPoint + "/driverschedule/" + dbId;
            let data = {
                id: dbId,
                driverid: driverid.toString(),
                date: new Date(date).getTime().toString(),
                type: "custom",
                starthour: startTime,
                startminute: 0,
                weekday: new Date(date).getUTCDay(),
                duration: duration,
                isAvailable: isAvailable
            }
            const driverSchedule = await axios.delete(url, data);
            driverScheduleObj = driver.parseApiDriverSchedule(driverSchedule.data.data);

        } catch (err) {
            return Promise.reject("There is a problem on retrieving schedule data. Please try again!");
        }

        return Promise.resolve(driverScheduleObj);
    }

    async getBannedDriversByLocation (filterData) {
        let bannedDrivers = [];
        const driver = new Driver();

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                bannedDrivers = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            }
            else{
                let dataObj = {
                    "location_id" :  filterData
                }
                const url = this.ApiEndPoint + "/getbanneddriversbylocationid";
                const driverApiData = await axios.post(url, dataObj);
                bannedDrivers = driverApiData.data.data
            }
        } catch (err) {
            console.log(err)
        }
        return Promise.resolve(bannedDrivers);
    } 

    async addBannedDriver (driverData) {
        let bannedDriversAdd = [];
        const driver = new Driver();

        try{
            if(!this.isIntegrated){
                const driverData = driver.sampleDriver;
                bannedDriversAdd = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else{
                const url = this.ApiEndPoint + "/addbanneddriversbylocation";
                const driverApiData = {
                    driver_id: driverData.driver_id,
                    location_id: driverData.location_id,
                    reason : driverData.reason
                }
                const sApiData= await axios.post(url, driverApiData);
                
                bannedDriversAdd = sApiData.data.data

            }
        } catch (err) {
        }
    }
    async getoverridescheduledriverid(driver_id) {
        let overridedriverid=[]  
          if (!this.isIntegrated) {           
          } else {
            let data = {
                driver_id: driver_id,          
            };
            const url = this.ApiEndPoint + "/getscheduleoverridesbydriverid";
            const overridescheduleobj = await axios.post(url, data);        
            var getoverrideschedule = overridescheduleobj.data.data;
            overridedriverid = getoverrideschedule;         
          }
        
        return Promise.resolve(overridedriverid);
      }
      async createoverride(data) {
        let addoverride = [];
       
          if (!this.isIntegrated) {
            
          } else {
            
            const url = this.ApiEndPoint + "/addoverrideschedule";
            const addApiData = await axios.post(url, data);
            let addOverridedatemodal = addApiData.data.data
            addoverride = addOverridedatemodal  
          }
        return Promise.resolve(addoverride);
      }

      async deleteoverrideschedulebyid(data) {
          const url = this.ApiEndPoint + "/deletedriverschedule";

          let payload = {
            "id":data
          }

          const addApiData = await axios.post(url, payload);
          return Promise.resolve(addApiData.data.data);
      }
      async getOverridesbyoverridelistid(id) {
     
        const driver = new Driver();
        let driverObject =[]
        try {
           
                // API object call.
                const url = this.ApiEndPoint + "/getoverridesbyoverridelistid/" + id;
                
                const drivergetApiData = await axios.get(url);
                driverObject = drivergetApiData.data.data
            
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       
    
        return Promise.resolve(driverObject);
    }
    
    async addDriverSchedulePreferences (data) {
        let addSchedulePref = []
        const driver = new Driver();
        try{

            if(!this.isIntegrated) {
    
            } else {
                const url = this.ApiEndPoint + "/adddriverschedulepreferences";
                const payload = {
                        driver_id : data.driver_id,
                        nights_out : data.nights_out,
                        day : data.day,
                        created_by : "febba33b-8ad3-43a0-901f-83737e663ac4"
                }
                const addApiData = await axios.post(url, payload);
                addSchedulePref = addApiData.data.data
            }
        } catch (err) {
            console.log(err)
        }
    }
    async getSchedulePreferencesbyId (id) {
        let SchedulePref = []
        try{
            if(!this.isIntegrated) {

            } else {
                const payload = {
                    driver_id : id
                }
                const url = this.ApiEndPoint + "/getdriverschedulepreferencesbybydriverid";
                const addApiData = await axios.post(url, payload)
                SchedulePref = addApiData.data.data;
            }
        } catch (err) {
            console.log(err)
        }
        return Promise.resolve(SchedulePref);
    }
    async updateSchedulePreferences (data) {
        let SchedulePref = []
        const driver = new Driver();
        try{
            if(!this.isIntegrated) {
    
            } else {
                const url = this.ApiEndPoint + "/updatedriverschedulepreferences";
                const payload = {
                    id : data.id,
                    driver_id : data.driver_id,
                    nights_out : data.nights_out,
                    day : data.day
                }
                const addApiData = await axios.post(url,payload)
                SchedulePref = addApiData.data.data
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export default DriverService;