import axios from 'axios';

// Application Specific
import Yard from '../models/yardModel';
import BaseService from './baseService';

class YardService extends BaseService {
    constructor() {
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async filterYards(filterData, startts, endts) {
        const yard = new Yard();
        let yardObject = []
        // Call API using Await
        if (!this.isIntegrated) {
            const yardData = yard.sampleYard.filter(function (yard) {
                return yard.name === filterData;
            });

            if (yardData.length > 0) {
                if (yardData.length === 1)
                    yardObject = yard.parseApiYardObject(yardData[0]);
                else {
                    yardObject = yard.sampleYard.map(item =>
                        yard.parseApiYardObject(item)
                    );
                }
            }
            else {
                yardObject = yard.sampleYard.map(item =>
                    yard.parseApiYardObject(item)
                );
            }
        } else {
            // API object call.
            const url = this.ApiEndPoint + "/filteryardchecks";
            const data = {
                "search": filterData,
                "startts": startts,
                "endts": endts
            }
            const yardApiData = await axios.post(url, data);
            yardObject = yardApiData.data.data.map(data => yard.parseApiYardObject(data));
        }


        return Promise.resolve(yardObject);
    }
    async addYard(data) {
        
        const yard = new Yard();
        let yardObject = []
        if (!this.isIntegrated) {
            // do
        }
        else {
            const url = this.ApiEndPoint + "/addyardcheck";
            const yardApiData = await axios.post(url, data);
            return Promise.resolve(yardApiData);
        }
    }
    async addYardChkTrailer(data) {
        const yard = new Yard();
        let yardObject = []
        try {
            if (!this.isIntegrated) {
                // do
            }
            else {

                const url = this.ApiEndPoint + "/addyardchecktrailer";

                const yardApiData = await axios.post(url, data);
                //yardObject = yardApiData.data.data.map(data => yard.parseApiYardObject(data));
                let Addyardchecktrailer = yardApiData.data
                yardObject = Addyardchecktrailer

            }
        }
        catch (err) {
            return Promise.reject(" This Trailer Has Already Been Added");
        }



        return Promise.resolve(yardObject);
    }

    
    async submitYardChkTrailer(data) {
        const yard = new Yard();
        let yardObject = []
        if (!this.isIntegrated) {
            // do
        }
        else {
            try {
                const url = this.ApiEndPoint + "/submityardcheck";

                const yardApiData = await axios.post(url, data);
                yardObject = yardApiData.data.data.map(data => yard.parseApiYardObject(data));
                if (yardObject.length > 0) {
                    return Promise.resolve(yardObject);
                }
                
            } catch (error) {
                return Promise.resolve(yardObject);
            }
        }


    }
    async updateYardChkTrailer(data) {
        
        const yard = new Yard();

        let yardObject = []
        if (!this.isIntegrated) {
            // do
        }
        else {
           
                const url = this.ApiEndPoint + "/updateyardcheck";
                // const data = {
                //     yardcheck_id: yarddata.yardcheck_id,
                //     is_confirm: yarddata.is_confirmation,
                //     is_redflag: yarddata.is_redflag,
                //     is_status: yarddata.status,
                //     trailer_id: yarddata.trailer_id,
                //     comment: yarddata.comment,
               
                // }
                // console.log("data",data)


                const yardApiData = await axios.post(url, data);
                //yardObject = yardApiData.data.data.map(data => yard.parseApiYardObject(data));
                let updatedList = yardApiData.data.data
                yardObject = updatedList


          
            return Promise.resolve(yardObject);
        }

    }
    async getbyyards(terminalId) {
        const yard = new Yard();
        let yardObject = [];

        if (!this.isIntegrated) {
           
        } else {
            const url = this.ApiEndPoint + "/yardchecks";
            const data = {
                "terminalid": terminalId,       
            }
            const yardApiData = await axios.post(url, data);
            yardObject = yardApiData.data.data.map(data => yard.parseApiYardObject(data));
            return Promise.resolve(yardObject);
        }      
    }

    async getYardCheckInformation(id) {
        const yard = new Yard();
        let yardCheckObject = []
        // Call API using Await
        if (!this.isIntegrated) {
        } else {
            // API object call.
            const url = this.ApiEndPoint + "/yardchecks/"+ id;
            yardCheckObject = await axios.get(url);
        }
        return Promise.resolve(yardCheckObject?.data);
    }
}

export default YardService;