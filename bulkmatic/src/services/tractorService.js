import axios from 'axios';

// Application Specific
import Tractor from '../models/tractorModel';
import BaseService from './baseService';

class TractorService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    

    async getAllTractors(filterData) {
        const tractor = new Tractor();
        let tractorObject = []
        try {
            if (!this.isIntegrated) {
                const tractorData = tractor.sampleTractor;

                tractorObject = tractor.sampleTractor.map(data => tractor.parseApiTractorObject(data));
            } else {
                // API object call.
                 
                const url = this.ApiEndPoint + "/gettractorbyterminalid";

                const tractorApiData = await axios.post(url,filterData);
                var tracDt = tractorApiData.data.data;

                tractorObject = tracDt.map(data => tractor.parseApiTractorObject(data));
                

            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving Tractor data. Please try again!");
        }       

        return Promise.resolve(tractorObject);
    }   
    
    async getTractor(tractor_id) {
     
        const tractor = new Tractor();
        let tractorObject 
        try {
            if (!this.isIntegrated) {
                const tractorData = tractor.sampleTractor.filter(function(trctr) {
                    return trctr.roleId === tractor_id;
                });

                tractorObject = tractor.parseApiTractorObject(tractorData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/tractors/" + tractor_id;
                const tractorApiData = await axios.get(url);
                tractorObject = tractorApiData.data.data[0]   
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving Tractor data. Please try again!");
        }       

        return Promise.resolve(tractorObject);
    }

    async getidfromvin(vin) {
     
        const tractor = new Tractor();
        let tractorObject 
        try {
            if (!this.isIntegrated) {
                const tractorData = tractor.sampleTractor.filter(function(trctr) {
                    return trctr.roleId === tractor_id;
                });

                tractorObject = tractor.parseApiTractorObject(tractorData[0]);
            } else {
                // API object call.
                const url = this.ApiEndForSamsara + "/getlatlongfromvin?vin=" + vin;
               console.log("url",url)
                const tractorApiData = await axios.get(url);
                tractorObject = tractorApiData.data.data.data[0]  
                console.log("tractorObject",tractorObject) 

            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving Tractor data. Please try again!");
        }       

        return Promise.resolve(tractorObject);
    }


    async filterTractors(filterData) {
        const tractor = new Tractor();
        let tractorObject = []
        // Call API using Await
        if (!this.isIntegrated) {
            const tractorData = tractor.sampleTractor.filter(function (trctr) {
                return trctr.name === data;
            });

            
            if (tractorData.length > 0) {
                tractorObject = tractorData;
            }
            else {
                tractorObject = tractor.sampleTractor.map(data => tractor.parseApiTractorObject(data));
            }
     

        } else {
            // API object call.
            const url = this.ApiEndPoint + "/filtertractors";
            const requestData = {
                search: filterData.search,
                type : filterData.type,
                region: filterData.region,
                terminalId : filterData.terminalId,
                status : filterData.status,
            };
            
                const tractorsApiData = await axios.post(url,requestData);
                
                tractorObject = tractorsApiData.data.data.map(data => tractor.parseApiTractorObject(data));
                

        }


        return Promise.resolve(tractorObject);
    }
}
   
export default TractorService;