import axios from 'axios';

// Application Specific
import Driver from '../models/driverModel';
import BaseService from './baseService';
import Contact from "../models/contactModel";

class ContactService extends BaseService {
    constructor() {
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async getContact(driverId) {
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
                const url = this.ApiEndPoint + "/drivers/" + driverId;
                const driverApiData = await axios.get(url);
                driverObject = driver.parseApiDriverObject(driverApiData.data.data);
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }

    async getAllContacts() {
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
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }

        return Promise.resolve(driverObject);
    }
    async filterContacts(filtertext) {
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
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async searchContacts(filtertext) {
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
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(driverObject);
    }

    async getContactsByTerminalId(terminalId, searchText) {
        const contact = new Contact();
        let contactObject = [];
        try {
            if (!this.isIntegrated) {
                const contactData = contact.sampleContacts;
                contactObject = contact.sampleContacts.map(data => contact.parseApiContactObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/filtercontactbyterminalid";
                const data = {
                    "terminalId": terminalId,
                    "search": searchText
                }
                const contactApiData = await axios.post(url, data);
                
                contactObject = contactApiData.data.data.map(data => contact.parseApiContactObject(data));
            }
        } catch (err) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
        }
        return Promise.resolve(contactObject);
    }

    async createContact(data) {
        const createcontact = new Contact();
        // Generate the model using map method.
        let contactObject = []
        try {
            if (!this.isIntegrated) {
                
            }
            else {

                const url = this.ApiEndPoint + "/contacts";
                const contactpApiData = await axios.post(url, data);
                

                contactObject = contactpApiData.data.data.map(data => createcontact.parseApiContactObject(data));
            }

        } catch (error) {
            return Promise.reject("Error: Unable to add the Terminal Contact.");
        }
        return Promise.resolve(contactObject);


    }

    async removeContact(data) {
        const deletecontact = new Contact();
        // Generate the model using map method.
        let contactObject = []
        try {
            if (!this.isIntegrated) {
                
            }
            else {

                const url = this.ApiEndPoint + "/deleteContact";
                const contactpApiData = await axios.post(url, data);

                console.log('delete',contactpApiData);
                //contactObject = contactpApiData.data.data;
                contactObject = contactpApiData.data.data.map(data => deletecontact.parseApiContactObject(data));
            }

        } catch (error) {
            return Promise.reject("Error: Unable to delete the Terminal Contact.");
        }
        return Promise.resolve(contactObject);


    }

}

export default ContactService;