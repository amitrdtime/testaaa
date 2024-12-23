import axios from 'axios';
import BaseService from './baseService';

// Application Specific


class AlertService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    

    async getNotDismissedAlerts() {
        try {
          const url = this.ApiEndPoint + "/getnotdismissedalerts";
          const alertsdismissedResponse = await axios.get(url);
          let dismissAlerts = alertsdismissedResponse.data
          return dismissAlerts;
        } catch (err) {
          throw err;
        }
      }

      async filterAlert(filterData) {
        console.log("filterData",filterData)
        try {
          const url = this.ApiEndPoint + "/alertswithfilter";
          const data = {
            terminal_id: filterData.terminals,
            region: filterData.region,
            commodity:filterData.commoditygroup,
        }
          const alertsResponse = await axios.post(url, data);
         
          return alertsResponse;
        } catch (err) {
          throw err;
        }
      }
      
   
}
   
export default AlertService;