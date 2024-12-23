class commodityGroup {
    constructor() {


    }
    samplecommodityGroup = [
        {
            "id": "AC",
            "name": "CAUSTIC ACID",
            "code": "AC",
            "isActive": true,
            "commodities": [
                {
                    "id": "ALUMSUL",
                    "code": "ALUMSUL",
                    "name": "CORR.LIQ,ACIDIC,INORGANIC,N.O.S.,8,UN3264",
                    "isActive": true
                },
                {
                    "id": "CAUSOD",
                    "code": "CAUSOD",
                    "name": "CAUSTIC SODA",
                    "isActive": true
                },
                {
                    "id": "CAUSTIC",
                    "code": "CAUSTIC",
                    "name": "SODIUM HYDROXIDE 8",
                    "isActive": true
                },
            ]
        },
        {
            "id": "AD",
            "name": "ADIPIC ACID",
            "code": "AD",
            "isActive": true,
            "commodities": [
                {
                    "id": "ADIPIC",
                    "code": "ADIPIC",
                    "name": "ADIPIC ACID",
                    "isActive": true
                }
            ]
        }
    ]
    parseApiCommodityGroupObject(commodtyGroup) {
        const commodtyGroupObj = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        commodtyGroupObj.name = commodtyGroup.name;
        commodtyGroupObj.code = commodtyGroup.code;
        commodtyGroupObj.description = commodtyGroup.description;
        commodtyGroupObj.loadtime = commodtyGroup.loadtime;
        commodtyGroupObj.unloadtime = commodtyGroup.unloadtime;
        commodtyGroupObj.id = commodtyGroup.id;
        commodtyGroupObj.commodities = commodtyGroup.commodities;
        commodtyGroupObj.loadunload = commodtyGroup.loadunload;
        commodtyGroupObj.action_type = commodtyGroup.action_type;
        commodtyGroupObj.driver_load_flag = commodtyGroup.driver_load_flag;
        commodtyGroupObj.load_time = commodtyGroup.load_time;
        commodtyGroupObj.unload_time = commodtyGroup.unload_time;
        commodtyGroupObj.commodity_id = commodtyGroup.commodity_id;
        commodtyGroupObj.shipper_id = commodtyGroup.shipper_id;
        commodtyGroupObj.commoditygroup_id = commodtyGroup.commoditygroup_id;
        commodtyGroupObj.isActive = commodtyGroup.isActive;
        commodtyGroupObj.loadunload = commodtyGroup.loadunload;
        commodtyGroupObj.lastupdate = commodtyGroup.lastupdate;
        commodtyGroupObj.lutformatted = commodtyGroup.lutformatted;



        return commodtyGroupObj;
    }
}

export default commodityGroup;