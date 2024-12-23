import axios from 'axios';

// Application Specific
import Commodity from '../models/commodityModel';

import BaseService from './baseService';

class CommodityService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    
    

    async getCommodity(CommodityId) {   
        const commodity = new Commodity();
        let commodityObject = []
        try {
            if (!this.isIntegrated) {
                const commodityData = commodity.samplecommodity.filter(function(commo) {
                    return commo.roleId === CommodityId;
                });
                commodityObject = commodity.parseApiCommodityObject(commodityData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/commodities/" + CommodityId;
                const commodityApiData = await axios.get(url);
                commodityObject = commodity.parseApicommodityObject(commodityApiData.data.data);   
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving commoditygroup data. Please try again!");
        }       

        return Promise.resolve(commodityObject);
    }

    async getAllCommodities() {
        const commodity = new Commodity();
        let commodityObject = []
        try {
            if (!this.isIntegrated) {
                const commodityData = commodity.samplecommodity;
    
               
                commodityObject = commodity.samplecommodity.map(data => commodity.parseApiCommodityObject(data));
            } else {
                // API object call.
                 
                const url = this.ApiEndPoint + "/commodities";
                const commodityApiData = await axios.get(url);
                commodityObject = commodityApiData.data.data.map(data => commodity.parseApiCommodityObject(data));
                // 

            }
        } catch (err){
            return Promise.reject("There is a problem on retrieving commodity data. Please try again!");
        }       

        return Promise.resolve(commodityObject);
    }  
    async getAllCommodityByGroupIds() {
        const commodity = new Commodity();
        let commodityObject = []
        try {
            if (!this.isIntegrated) {
                const commodityApiData = commodity.samplecommodity;
    
               
                commodityObject = commodity.samplecommodity.map(data => commodity.parseApiCommodityObject(data));
            } else {
                // API object call.
                 
                const url = this.ApiEndPoint + "/commoditiesbyGroupIds";
                const commodityApiData = await axios.get(url);
                commodityObject = commodityApiData.data.data.map(data => commodity.parseApiCommodityObject(data));
                // 

            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving trailer data. Please try again!");
        }       

        return Promise.resolve(commodityObject);
    }  
    
    

    async getAllCommodityPkIds(id) {
        const commodity = new Commodity();
        let commodityObject = []
        try {
            if (!this.isIntegrated) {
                const commodityApiData = commodity.samplecommodity;
    
               
                commodityObject = commodity.samplecommodity.map(data => commodity.parseApiCommodityObject(data));
            } else {
                // API object call.
                 
                const url = this.ApiEndPoint + "/commoditiesbyGroupPkIds";
                const commodityApiData = await axios.post(url,id);
                commodityObject = commodityApiData.data.data.map(data => commodity.parseApiCommodityObject(data));
                

            }
        } catch (err){
            return Promise.reject("There is a problem on retrieving trailer data. Please try again!");
        }       

        return Promise.resolve(commodityObject);
    }        
}
   
export default CommodityService;