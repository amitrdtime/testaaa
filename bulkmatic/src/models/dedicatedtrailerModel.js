class DedicatedTrailer {
    constructor() {


    }
    
    parseApiDedicatedTrailerObject(location) {
        const dedicatedTrailerObj = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        dedicatedTrailerObj.id = location.id;
        dedicatedTrailerObj.cgId = location.cgId;
        dedicatedTrailerObj.CommodityGroup=location.trailer.commodity_group;
        dedicatedTrailerObj.EffectiveDate=location.effective_date;
        dedicatedTrailerObj.ExpirationDate=location.expiration_date; 
        
        dedicatedTrailerObj.trailerid = location.trailer_id;
        dedicatedTrailerObj.make = location.trailer.make;
        dedicatedTrailerObj.model = location.trailer.model;
        dedicatedTrailerObj.code = location.code;
        dedicatedTrailerObj.fleetcode = location.trailer?.fleet_code;
        dedicatedTrailerObj.lic = location.trailer?.license_state;
        dedicatedTrailerObj.qrcode = location.trailer?.driver_side_tag;
        dedicatedTrailerObj.is_active = location.trailer?.is_active;
        dedicatedTrailerObj.terminal_full_name = location.trailer?.terminal_full_name;
        dedicatedTrailerObj.region = location.trailer?.region;
        dedicatedTrailerObj.pm_due_date_utc = location.trailer?.pm_due_date_utc;
        dedicatedTrailerObj.driver_side_tag = location.trailer?.driver_side_tag;

        dedicatedTrailerObj.TargetCount=location.targetcount;

        return dedicatedTrailerObj;
    }
}

export default DedicatedTrailer;