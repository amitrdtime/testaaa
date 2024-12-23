import axios from "axios";

// Application Specific
import LUTRule from "../../src/models/loadunloadruleModel";
import BaseService from "./baseService";

class LUTRuleService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  async getAllLUTRules() {
    const lutrule = new LUTRule();
    let ruleObject = [];
    try {
      if (!this.isIntegrated) {
        throw Error("Not integrated with API");
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/lutrulesbyallcgs";
        const rulesApiData = await axios.get(url);
        ruleObject = rulesApiData.data.data.map((data) =>
          lutrule.parseApiLUTCGRuleObject(data)
        );
        
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving commodity group data. Please try again!"
      );
    }

    return Promise.resolve(ruleObject);
  }

  async getLUTRule(id) {
    const lutrule = new LUTRule();
    let ruleObject = [];
    try {
      if (!this.isIntegrated) {
        throw Error("Not integrated with API");
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/lutrulesbyallcgs/" + id;
        const rulesApiData = await axios.get(url);
        ruleObject = lutrule.parseApiLUTCommodityRuleObject(
          rulesApiData.data.data
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving terminal data. Please try again!"
      );
    }

    return Promise.resolve(ruleObject);
  }

  // Again filterLUTRules api integrate
  async filterLUTRules(filterData) {
    const lutRules = new LUTRule();
    let ruleObject = [];
    // Call API using Await
    if (!this.isIntegrated) {
      const loadunloadData = lutRules.sampleLoadunload.filter(function (luflr) {
        return luflr.name === data;
      });

      
      if (loadunloadData.length > 0) {
        ruleObject = loadunloadData;
      } else {
        ruleObject = lutRules.sampleLoadunload.map((data) =>
          lutRules.parseApiLUTCGRuleObject(data)
        );
      }
    } else {
      // API object call.
      const url = this.ApiEndPoint + "/filterlutrulesbyallcgs";
      const requestData = filterData;
      
      const loadunloadApiData = await axios.post(url, requestData);
      
      ruleObject = loadunloadApiData.data.data.map((data) =>
        lutRules.parseApiLUTCGRuleObject(data)
      );
    }
    return Promise.resolve(ruleObject);
  }

  //end api integrate

  async getLutrulesbyshipper(locationId, search) {
    let allShipper = [];
    const shipper = new LUTRule();
    try {
      if (!this.isIntegrated) {
        throw Error("Not integrated with API");
      } else {
        // API object call.
        let data = {
          locationId: locationId,
          search: search,
        };
        const url = this.ApiEndPoint + "/lutrulesbyshipper";
        const rulesApiData = await axios.post(url, data);
        

        allShipper = rulesApiData.data.data.map((data) =>
          shipper.parseApiLUTCommodityRuleObject(data)
        );
        
      }
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving All Shipper data. Please try again!"
      );
    }

    return Promise.resolve(allShipper);
  }

  async createLUTRule(data) {
    let sPools = [];
    const shipper = new LUTRule();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/lutrules";
        const apiData = {
          actiontype: data.actiontype,
          loadflag: data.loadflag,
          cgid: data.cgid,
          commodityid: data.commodityid === undefined ? null : data.commodityid,
          shipperid: data.locationid === undefined ? null : data.locationid,
          loadtime: data.loadtime === undefined ? null : data.loadtime,
          unloadtime: data.unloadtime === undefined ? null : data.unloadtime,
        };
        const sApiData = await axios.post(url, apiData);
        

        sPools = sApiData.data.data.map((data) =>
          shipper.parseApiLUTCommodityRuleObject(data)
        );
      }
    } catch (error) {
      return Promise.reject("Error: Unable to add the shipper.");
    }
    return Promise.resolve(sPools);
  }

  // http://localhost:4000/api/lutrules/550
  async updateLUTRule(data) {
    let lutRules = [];
    const ruleObject = new LUTRule();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/lutrules/" + data.id;
        const apiData = {
          id: data.id,
          actiontype: data.actiontype,
          loadflag: data.loadflag,
          cgid: data.cgid,
          commodityid: data.commodityid === undefined ? null : data.commodityid,
          shipperid: data.shipperid === undefined ? null : data.shipperid,
          loadtime: data.loadtime === undefined ? null : data.loadtime,
          unloadtime: data.unloadtime === undefined ? null : data.unloadtime,
        };
        const spApiData = await axios.put(url, apiData);
        

        lutRules = spApiData.data.data.map((i) =>
          ruleObject.parseApiLUTCommodityRuleObject(i)
        );

        // lutRules = ruleObject.parseApiLUTCommodityRuleObject(
        //   spApiData.data.data
        // );
      }
    } catch (error) {
      return Promise.reject("Error: Unable to update the shipper.");
    }
    return Promise.resolve(lutRules);
  }

  async deleteLUTRule(data) {
    let sPool = [];
    const ruleObject = new LUTRule();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/lutrules/" + data.id;
        const spApiData = await axios.delete(url, data);

        

        sPool = spApiData.data.data.map((data) =>
          ruleObject.parseApiLUTCommodityRuleObject(data)
        );
      }
    } catch (error) {
      
    }
    return Promise.resolve(sPool);
  }

  async getDefaultLutRules() {
    let lutRules = [];
    const ruleObject = new LUTRule();
    try {
      if (!this.isIntegrated) {
        
      } else {
        const url = this.ApiEndPoint + "/getdefaultrules";
        const spApiData = await axios.get(url);

        

        lutRules = spApiData.data.data.map((data) =>
          ruleObject.parseApiLUTCommodityRuleObject(data)
        );
      }
    } catch (error) {
      
    }
    return Promise.resolve(lutRules);
  }
}

export default LUTRuleService;
