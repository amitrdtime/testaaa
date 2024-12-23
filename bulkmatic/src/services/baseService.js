const appConfig = require("../Config.json");

class BaseService {
    constructor(){
        this.environment = appConfig.environment;
        this.dynamoDbPrefix = "";
        this.ApiEndPoint = "http://localhost:4000/api"
        this.ApiAdminEndPoint = "http://localhost:4000/admin-api"
        this.ApiEndForSamsara = "http://localhost:4000/external/api"
        this.ApiKey = "";

        switch(this.environment.toUpperCase())
        {
            case "LOCAL":
                this.dynamoDbPrefix = "";
                this.ApiEndPoint = appConfig.local.apiUrl + "/api";
                this.ApiAdminEndPoint = appConfig.local.apiUrl + "/admin-api"
                this.ApiKey = appConfig.local.key;
                break;
            case "DEV":
                this.dynamoDbPrefix = "";
                this.ApiEndPoint = appConfig.dev.apiUrl + "/api";
                this.ApiAdminEndPoint = appConfig.dev.apiUrl + "/admin-api"
                this.ApiEndForSamsara = appConfig.dev.apiUrl + "/external/api"
                this.ApiKey = appConfig.dev.key
                break;
            case "QA":
                this.dynamoDbPrefix = "";
                this.ApiEndPoint = appConfig.qa.apiUrl + "/api";
                this.ApiAdminEndPoint = appConfig.qa.apiUrl + "/admin-api"
                this.ApiEndForSamsara = appConfig.qa.apiUrl + "/external/api"
                this.ApiKey = appConfig.qa.key
                break;
            case "LIVE":
                this.dynamoDbPrefix = "";
                this.ApiEndPoint = appConfig.live.apiUrl + "/api";
                this.ApiExternalEndPoint = appConfig.live.apiUrl + "/external/api";
                this.ApiEndForSamsara = appConfig.live.apiUrl + "/external/api"
                this.ApiAdminEndPoint = appConfig.live.apiUrl + "/admin-api"
                this.ApiKey = appConfig.live.key
                break;
        }       
    }
}

export default BaseService;