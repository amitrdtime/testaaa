import axios from 'axios';
import BaseService from './baseService';

class AppFilterService extends BaseService {
    constructor() {
        super();
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async getAppFilterData(reload) {
        let appFilterObject = {}

        try {
            if (reload) {
                // API object call.
                const url = this.ApiEndPoint + "/appfilter/app";
                const appFilterData = await axios.get(url);

                // Put the object into storage
                localStorage.setItem('AppFilterObject', JSON.stringify(appFilterData.data.data));
                appFilterObject = appFilterData.data.data;
            }

            // Retrieve the object from storage
            const retrievedPlannerObject = localStorage.getItem('AppFilterObject');
            appFilterObject = JSON.parse(retrievedPlannerObject);


        } catch (err) {
            return Promise.reject("There is a problem on retrieving app filter data. Please try again!");
        }

        return Promise.resolve(appFilterObject);
    }

    getAppFilter() {
        let appFilterObject = {}

        try {
            // Retrieve the object from storage
            const retrievedPlannerObject = localStorage.getItem('AppFilterObject');
            appFilterObject = JSON.parse(retrievedPlannerObject);


        } catch (err) {
            return appFilterObject;
        }

        return appFilterObject;
    }

    async getUserFilterData(userId, reload) {
        let userFilterObject = {}

        try {
            if (reload) {
                // API object call.                
                const url = this.ApiEndPoint + "/appfilter/" + userId;
                const appFilterData = await axios.get(url);

                // Put the object into storage
                localStorage.setItem('UserFilterObject', JSON.stringify(appFilterData.data.data));
                userFilterObject = appFilterData.data.data;
            }

            // Retrieve the object from storage
            const retrievedPlannerObject = localStorage.getItem('UserFilterObject');
            userFilterObject = JSON.parse(retrievedPlannerObject);

        } catch (err) {
            return Promise.reject("There is a problem on retrieving app filter data. Please try again!");
        }

        return Promise.resolve(userFilterObject);
    }

    getUserFilter() {
        let userFilterObject = {}

        try {

            // Retrieve the object from storage
            const retrievedPlannerObject = localStorage.getItem('UserFilterObject');
            userFilterObject = JSON.parse(retrievedPlannerObject);

        } catch (err) {
            return userFilterObject;
        }

        return userFilterObject;
    }
}

export default AppFilterService;
