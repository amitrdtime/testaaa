import axios from 'axios';

// Application Specific
import Terminal from '../models/terminalModel';
import BaseService from './baseService';
import TractorForTerminal from "../models/tractorModel"
import Driver from '../models/driverModel';

class TerminalService extends BaseService {
    constructor() {
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async getTerminal(terminalId) {
        const terminal = new Terminal();
        let terminalObject = []
        try {
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal.filter(function (tml) {
                    return tml.roleId === terminalId;
                });

                terminalObject = terminal.parseApiTerminalObject(terminalData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/terminals/" + terminalId;
                const terminalApiData = await axios.get(url);
                terminalObject = terminal.parseApiTerminalObject(terminalApiData.data.data);
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }

    async getAllTerminals() {
        const terminal = new Terminal();
        let terminalObject = []
        try {
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal;
                terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
            } else {
                // API object call.

                const url = this.ApiEndPoint + "/terminals";
                const terminalApiData = await axios.get(url);
                terminalObject = terminalApiData.data.data.map(data => terminal.parseApiTerminalObject(data));
                

            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }
    async filterTerminal(filterData) {
        const terminal = new Terminal();
        let terminalObject = []
        // Call API using Await
        if (!this.isIntegrated) {
            const terminalData = terminal.sampleTerminal.filter(function (ter) {
                return ter.name === filterData;
            });

            
            if (terminalData.length > 0) {
                terminalObject = terminalData;
            }
            else {
                terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
            }
            

        } else {
           

        }


        return Promise.resolve(terminalObject);
    }

    async searchTerminals(filterData) {
        const terminal = new Terminal();
        let terminalObject = []
        try {
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal;
                terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
            } else {
                // API object call.

                const url = this.ApiEndPoint + "/filterterminals";
                const data = {
                    search: filterData.search,
                    name: filterData.name,
                    code: filterData.code,
                    city: filterData.city,
                    state: filterData.state,
                    zip: filterData.zip,
                    isactive: null
                }
                const terminalApiData = await axios.post(url, data);
                terminalObject = terminalApiData.data.data.map(data => terminal.parseApiTerminalObject(data));
                
            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }

    async getTerminalByIds(ids) {
        const terminal = new Terminal();
        let terminalObject = []
        let response =[]
        // Call API using Await
        try{
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal.filter(function (ter) {
                    return ter.name === filterData;
                });

                
                if (terminalData.length > 0) {
                    terminalObject = terminalData;
                }
                else {
                    terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
                }
               

            } else {
                // API object call.
                let data = {
                    "terminal_ids": ids
                };
                const url = this.ApiEndPoint + "/terminalbyIds";
                const terminalApiData = await axios.post(url, data);
                terminalObject = terminalApiData.data.data.map(data => terminal.parseApiTerminalObject(data));          
            }
        } catch (err){
            
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }

    async filterTerminalByIdsText(ids, search) {
        const terminal = new Terminal();
        let terminalObject = []
        try{
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal.filter(function (ter) {
                    return ter.name === filterData;
                });

                
                if (terminalData.length > 0) {
                    terminalObject = terminalData;
                }
                else {
                    terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
                }

            } else {
                // API object call.
                let data = {
                    "terminal_ids": ids,
                    "search": search
                };

                const url = this.ApiEndPoint + "/getTerminalByIdsText";
                const terminalApiData = await axios.post(url, data);
                terminalObject = terminalApiData.data.data.map(data => terminal.parseApiTerminalObject(data));
            }
        } catch (err){
            
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }

    async getTractorsByTerminalID(terminalId, searchData) {
        let allTractors = []
        const tractor=new TractorForTerminal()
        try {
            if (!this.isIntegrated) {
                
            }
            else {
                let data = {
                    "terminal_id": terminalId,
                    "search": searchData
                }
                const url = this.ApiEndPoint + "/gettractorbyterminalid";
                const tractorApiData = await axios.post(url, data);
                
                allTractors = tractorApiData.data.data.map(data => tractor.parseApiTractorObject(data));
            }

        } catch (error) {

        }
        return Promise.resolve(allTractors);
    }
    async getDriversByTerminalID(terminalId, searchText){
        let allDrivers = []
        const driver=new Driver()
        
        try {
            if (!this.isIntegrated) {
                
            }
            else {
                const data = {
                    terminalId: terminalId,
                    search: searchText,
                  };
                const url = this.ApiEndPoint + "/getDriversbyTerminalId";
                const driverApiData = await axios.post(url, data);
                

                allDrivers = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
            }

        } catch (error) {

        }
        return Promise.resolve(allDrivers);
    

    }

    async getAllState() {
        const state = new Terminal();
        let stateObject = []
        try {
            if (!this.isIntegrated) {
                const stateData = state.sampleTerminal;
                
                stateObject = state.sampleTerminal.map(data => state.parseApiTerminalObject(data));
            } else {

                const url = this.ApiExternalEndPoint + "/state";
                const stateApiData = await axios.get(url);
                stateObject = stateApiData.data.data.map(data => state.parseApiTerminalObject(data));
            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(stateObject);
    }

    async getAllCity() {
        const city = new Terminal();
        let cityObject = []
        try {
            if (!this.isIntegrated) {
            } else {

                const url = this.ApiExternalEndPoint + "/city";
                const cityApiData = await axios.get(url);
                cityObject = cityApiData.data.data.map(city => key={city}, city)

            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(cityObject);
    }

    async getAllZip() {
        const zip = new Terminal();
        let zipObject = []
        try {
            if (!this.isIntegrated) {
                
            } else {

                const url = this.ApiExternalEndPoint + "/city";
                const zipApiData = await axios.get(url);
               
                zipObject = zipApiData.data.data.map(zip => key={zip}, zip)
               

            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(zipObject);
    }

    async getCitybyState(state){
        const terminal = new Terminal()
        const cityByStateObj = [];

        try{
            if(!this.isIntegrated){
                cityByStateObj = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data))
            } else{
                const url = this.ApiExternalEndPoint + "/citybystate";
                let data = {
                    state : state
                }
                const getCityApiData = await axios.get(url, data);
                cityByStateObj = getCityApiData.data.data.map(data => terminal.parseApiTerminalObject(data))
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(cityByStateObj);
    }


    async filterRegionTerminal(filterData) {
        const terminal = new Terminal();
        let terminalObject = []
        try {
            if (!this.isIntegrated) {
                const terminalData = terminal.sampleTerminal;
                terminalObject = terminal.sampleTerminal.map(data => terminal.parseApiTerminalObject(data));
            } else {
                // API object call.

                const url = this.ApiEndPoint + "/filterterminals";
                const data = {
                    search: filterData.search,                
                    region: filterData.region,
                   
                }
                const terminalApiData = await axios.post(url, data);
                terminalObject = terminalApiData.data.data.map(data => terminal.parseApiTerminalObject(data));
                
            }
        } catch (err) {
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }
    async getTerminalByTerminalIds(ids) {
        const terminal = new Terminal();
        let terminalObject = []
        // Call API using Await
        try{
                // API object call.
                let data = {
                    "terminal_id": ids
                };
                const url = this.ApiEndPoint + "/getterminalsbyterminalids";
                const terminalApiData = await axios.post(url, data);
                terminalObject = terminalApiData.data.data;        
            
        } catch (err){
            
            return Promise.reject("Failure: Unable to retrieve terminal list. Please try refreshing again!");; //"There is a problem on retrieving terminal data. Please try again!");
        }

        return Promise.resolve(terminalObject);
    }

}

export default TerminalService;