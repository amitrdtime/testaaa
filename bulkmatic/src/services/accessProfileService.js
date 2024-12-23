import axios from 'axios';

// Application Specific
import AccessProfile from '../models/accessProfileModel';
import BaseService from './baseService';

class AccessProfileService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    
    
    async getAccessProfile() {
        const apObject = new AccessProfile();
        let acessProfileObject = [];

        try {
            if (!this.isIntegrated) {
                const acessProfileObject = apObject.nodesSample;
                
    
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/populateaccessprofile";
                const apApiData = await axios.get(url);
                acessProfileObject = apApiData.data.data; //apObject.parseApiAccessProfileObject(apApiData.data.data);
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }       

        return Promise.resolve(acessProfileObject);
    } 
        
}
   
export default AccessProfileService;