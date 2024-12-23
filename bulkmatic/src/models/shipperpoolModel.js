class ShipperPool {
    constructor() {


    }
    
    parseApiShipperPoolObject(location) {
        const shipperPoolObj = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        shipperPoolObj.id = location.id;
        shipperPoolObj.locationId = location.locationid;
        shipperPoolObj.locationName = location.locationname;
        shipperPoolObj.cgId = location.cgid;
        shipperPoolObj.code = location.code;
        shipperPoolObj.description = location.description;
        shipperPoolObj.CommodityGroup=location.commoditygroup;
        //shipperPoolObj.targetcount=location.target_count;
        shipperPoolObj.EffectiveDate=location.effective_date;
        shipperPoolObj.ExpirationDate=location.expiration_date; 
        shipperPoolObj.shipperid = lutObj.shipperid;
        shipperPoolObj.shippers  = lutObj.shippers;   
        shipperPoolObj.commoditygroup_id= location.commoditygroup_id          

        return shipperPoolObj;
    }
}

export default ShipperPool;