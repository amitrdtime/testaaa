import axios from 'axios';

// Application Specific
import Driver from '../models/driverModel';
import BaseService from './baseService';

class PlannerService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    

    async getPlanner(driverId) {   
        const driver = new Driver();
        let driverObject = []
        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver.filter(function(dvr) {
                    return dvr.roleId === driverId;
                });
    
                
              
                driverObject = driver.parseApiDriverObject(driverData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/drivers/" + driverId;
                const driverApiData = await axios.get(url);
                driverObject = driver.parseApiDriverObject(driverApiData.data.data);    
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       

        return Promise.resolve(driverObject);
    }

    async getAllPlanners() {
       
        const driver = new Driver();
        let driverObject = [];

        try {
            if (!this.isIntegrated) {
                const driverData = driver.sampleDriver;
                driverObject = driver.sampleDriver.map(data => driver.parseApiDriverObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/drivers";
                const driverApiData = await axios.get(url);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       

        return Promise.resolve(driverObject);
    } 
    async filterPlanners(filtertext){
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
                    "search": filtertext
                }
                const driverApiData = await axios.post(url, data);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       
        return Promise.resolve(driverObject);
    }

    async searchPlanners(filtertext) {
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
                    "search": filtertext
                }
                const driverApiData = await axios.post(url, data);
                driverObject = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
                
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       
        return Promise.resolve(driverObject);
    } 

    async getPlannersByTerminalId(terminalId, searchText) {
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
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       
        return Promise.resolve(driverObject);
    }
    
}
   
export default PlannerService;