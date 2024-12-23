class commodity {
    constructor() {


    }
    samplecommodity = [
        {
            "id": "10176571",
            "name": "PVB RESIN (POWDER)",
            "code": "10176571",
            "isActive": true,
            "cg_id": "NP",
            "cg_name": "PLASTIC",
            "cg_code": "NP",
            "cg_isActive": true
        },
        {
            "id": "10176626",
            "name": "PVB RESIN (POWDER)",
            "code": "10176626",
            "isActive": true,
            "cg_id": "PV",
            "cg_name": "PVC",
            "cg_code": "PV",
            "cg_isActive": true
        },
        {
            "id": "1220BIODA",
            "name": "12/20 BIODACCELLULOSE WOODPULP",
            "code": "1220BIODA",
            "isActive": true,
            "cg_id": "IN",
            "cg_name": "INEDIBLE",
            "cg_code": "IN",
            "cg_isActive": true
        }
       
       
       
    ]
    parseApiCommodityObject(commodity) {
        const commodityObj = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        commodityObj.id = commodity.id;
        commodityObj.name = commodity.name;
        commodityObj.code = commodity.code;
        commodityObj.description = commodity.description;
        commodityObj.loadtime = commodity.loadtime;
        commodityObj.unloadtime = commodity.unloadtime;
        

        return commodityObj;
    }
}

export default commodity;