import axios from 'axios';

// Application Specific
import Trailer from '../models/trailerModel';
import Driver from '../models/driverModel';
import BaseService from './baseService';

class TrailerService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  async getTrailer(trailer_id) {
    const trailer = new Trailer();
    let trailerObject;
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer.filter(function (trlr) {
          return trlr.roleId === trailer_id;
        });

        trailerObject = trailer.parseApiTrailerObject(trailerData[0]);
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/trailers/" + trailer_id;
        const trailerApiData = await axios.get(url);
        trailerObject = trailerApiData.data.data[0];
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return Promise.resolve(trailerObject);
  }

  async getAllTrailers() {
    const trailer = new Trailer();
    let trailerObject = [];
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer;
        trailerObject = trailer.sampleTrailer.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/trailers";
        try {
          const trailerApiData = await axios.get(url);
          trailerObject = trailerApiData.data.data.map((data) =>
            trailer.parseApiTrailerObject(data)
          );
        } catch (error) {}
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return await Promise.resolve(trailerObject);
  }

  async getAllTrailersbyTerminalID(filterData) {
    const trailer = new Trailer();
    let trailerObject = [];
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer;
        trailerObject = trailer.sampleTrailer.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      } else {
        // API object call.
        let data = {
          terminal_id: filterData.terminal_id,
        };
        const url = this.ApiEndPoint + "/gettrailerbyterminalid";
        try {
          const trailerApiData = await axios.post(url, data);
          trailerObject = trailerApiData.data.data.map((data) =>
            trailer.parseApiTrailerObject(data)
          );
        } catch (error) {}
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return await Promise.resolve(trailerObject);
  }
  async getTrailersInPlanner(filterData) {
    const trailer = new Trailer();
    let trailerObject = [];
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer;
        trailerObject = trailer.sampleTrailer.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      } else {
        // API object call.
        let data = {
          terminal_id: filterData,
        };
        const url = this.ApiEndPoint + "/gettrailerbyterminalid";
        try {
          const trailerApiData = await axios.post(url, data);
          trailerObject = trailerApiData.data.data.map((data) =>
            trailer.parseApiTrailerObject(data)
          );
        } catch (error) {}
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return await Promise.resolve(trailerObject);
  }
////Trailers Tab in Planner
async gettrailerstabbydate(filterData) {
  const trailer = new Trailer();
  let trailerObject = [];
  try {
    if (!this.isIntegrated) {
      const trailerData = trailer.sampleTrailer;
      trailerObject = trailer.sampleTrailer.map((data) =>
        trailer.parseApiTrailerObject(data)
      );
    } else {
       // API object call.
       let data = {
        terminal_id: filterData,
      };
      // API object call.
      const url = this.ApiEndPoint + "/gettrailerstabdata";
      try {
        const trailerApiData = await axios.post(url,data);
        // trailerObject = trailerApiData.data.data.map((data) =>
        //   trailer.parseApiTrailerObject(data)
        trailerObject = trailerApiData.data.data
     console.log("trailerObject",trailerObject)
      } catch (error) {}
    }
  } catch (err) {
    return Promise.resolve(
      "There is a problem on retrieving trailer data. Please try again!"
    );
  }

  return await Promise.resolve(trailerObject);
}
  ////////end


  async getTrailerHistorybyTrailerid(trailer_id) {
    let trailerHistoryData = [];
    try {
      // API object call.
      let data = {
        trailer_id: trailer_id,
      };
      const url = this.ApiEndPoint + "/gettrailerhistorybytrailerid";
      try {
        trailerHistoryData = await axios.post(url, data);
      } catch (error) {}
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving the Trailer History. Please try again!"
      );
    }
    return await Promise.resolve(trailerHistoryData.data.data);
  }

  async gettrailerSpecificationsbytrailerid(trailer_id) {
    let trailerSpecificationData = [];
    try {
      // API object call.
      let data = {
        trailer_id: trailer_id,
      };
      const url = this.ApiEndPoint + "/gettrailerSpecificationsbytrailerid";
      try {
        trailerSpecificationData = await axios.post(url, data);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving the Trailer Specifications. Please try again!"
      );
    }
    return await Promise.resolve(trailerSpecificationData.data.data);
  }

  async searchTrailers(filterObj) {
    const trailer = new Trailer();
    let trailerObject = [];
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer;
        trailerObject = trailer.sampleTrailer.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      } else {
        // API object call.

        const url = this.ApiEndPoint + "/filtertrailers";
        const data = {
          search: filterObj.filtertext,
          terminalids: filterObj.dbids,
          cgs: filterObj.cgs,
        };
        const trailerApiData = await axios.post(url, data);
        trailerObject = trailerApiData.data.data.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }

    return Promise.resolve(trailerObject);
  }

  async getTrailersByTerminalId(terminalId, searchText) {
    const trailer = new Trailer();
    let trailerObject = [];
    try {
      if (!this.isIntegrated) {
        const trailerData = trailer.sampleTrailer;
        trailerObject = trailer.sampleTrailer((data) =>
          trailer.parseApiTrailerObject(data)
        );
      } else {
        // API object call.
        const url = this.ApiEndPoint + "/gettrailerbyterminalid";
        const data = {
          terminal_id: terminalId,
          search: searchText,
        };

        const trailerApiData = await axios.post(url, data);

        trailerObject = trailerApiData.data.data.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving driver data. Please try again!"
      );
    }
    return Promise.resolve(trailerObject);
  }

  async filterTrailers(filterData) {
    const trailer = new Trailer();
    let trailerObject = [];
    // Call API using Await
    if (!this.isIntegrated) {
      const trailerData = trailer.sampleTrailer.filter(function (tlfcr) {
        return tlfcr.name === data;
      });

      if (trailerData.length > 0) {
        trailerObject = trailerData;
      } else {
        trailerObject = trailer.sampleTrailer.map((data) =>
          trailer.parseApiTrailerObject(data)
        );
      }
    } else {
      // API object call.
      const url = this.ApiEndPoint + "/filtertrailers";
      const requestData = {
        search: filterData.search,
        terminalId: filterData.terminalId,
        region: filterData.region,
        type: filterData.type,
        status: filterData.status,
        cgs: filterData.cgs,
      };
      const trailersApiData = await axios.post(url, requestData);
      trailerObject = trailersApiData.data.data.map((data) =>
        trailer.parseApiTrailerObject(data)
      );
    }

    return Promise.resolve(trailerObject);
  }
}
   
export default TrailerService;