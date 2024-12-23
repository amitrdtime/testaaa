import axios from "axios";

// Application Specific
import CommodityGroup from "../models/commoditygroupModel";
import Commodity from "../models/commodityModel";
import Trailer from "../models/trailerModel";
import BaseService from "./baseService";

class CommoditygroupService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  async getCommodityGroup(CommodityGroupId) {
    const commodityGroup = new CommodityGroup();
    let commodityGroupObject = [];
    try {
      if (!this.isIntegrated) {
        const commodityGroupData = commodityGroup.samplecommodityGroup.filter(
          function (cgr) {
            return cgr.roleId === CommodityGroupId;
          }
        );
        commodityGroupObject = commoditygroup.parseApiCommodityGroupObject(
          commodityGroupData[0]
        );
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/cggroups/" + CommodityGroupId;
        const commodityGroupApiData = await axios.get(url);
        commodityGroupObject = commodityGroup.parseApicommodityGroupObject(
          commodityGroupApiData.data.data
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving commoditygroup data. Please try again!"
      );
    }

    return Promise.resolve(commodityGroupObject);
  }
  async getAllCommodityGroups() {
    const commodityGroup = new CommodityGroup();
    let commodityGroupObject = [];
    try {
      if (!this.isIntegrated) {
        const commodityGroupData = commodityGroup.samplecommodityGroup;

        commodityGroupObject = commodityGroup.samplecommodityGroup.map((data) =>
          commodityGroup.parseApiCommodityGroupObject(data)
        );
      } else {
        // API object call.

        const url = this.ApiEndPoint + "/cggroups";
        const commodityGroupApiData = await axios.get(url);
        commodityGroupObject = commodityGroupApiData.data.data.map((data) =>
          commodityGroup.parseApiCommodityGroupObject(data)
        );
        
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return Promise.resolve(commodityGroupObject);
  }

  async getAllTrailerByCommodityGroupId(cgId, search) {
    let allTrailers = [];
    const trailer = new Trailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          cgid: cgId,
          search: search,
        };
        const url = this.ApiEndPoint + "/gettrailersbycgid";
        const trailercommodityApiData = await axios.post(url, data);
        

        allTrailers = trailercommodityApiData.data.data.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      }
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }
    return Promise.resolve(allTrailers);
  }
  async filterCommoditygroup(filterData) {
    
    const commodityGroup = new CommodityGroup();
    let commodityGroupObject = [];
    // Call API using Await
    if (!this.isIntegrated) {
      const commoditygoupData = commodityGroup.samplecommodityGroup.filter(
        function (flr) {
          return flr.name === data;
        }
      );

      
      if (commoditygoupData.length > 0) {
        commodityGroupObject = commoditygoupData;
      } else {
        commodityGroupObject = commodityGroup.samplecommodityGroup.map((data) =>
          commodityGroup.parseApiCommodityGroupObject(data)
        );
      }
    } else {
      // API object call.
      const url = this.ApiEndPoint + "/filtercggroups";
      // const requestData = filterData;
      const requestData = {
        code: filterData.code,
        description: filterData.description,
        search: filterData.search,
      };
      
      const commodityGroupApiData = await axios.post(url, requestData);
      
      commodityGroupObject = commodityGroupApiData.data.data.map((data) =>
        commodityGroup.parseApiCommodityGroupObject(data)
      );
      
    }
    return Promise.resolve(commodityGroupObject);
  }

  async getAllFilterTrailerByCommodityGroupId(cgId, search) {
    let allTrailers = [];
    const trailer = new Trailer();
    try {
      if (!this.isIntegrated) {
        
      } else {
        let data = {
          cgid: cgId,
          search: search,
        };
        const url = this.ApiEndPoint + "/getfiltertrailersbycgid";
        const trailercommodityApiData = await axios.post(url, data);
        

        allTrailers = trailercommodityApiData.data.data.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      }
    } catch (error) {}
    return Promise.resolve(allTrailers);
  }
}

export default CommoditygroupService;
