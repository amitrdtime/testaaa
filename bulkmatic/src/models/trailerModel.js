class Trailer {
    constructor(){


    }
    sampleTrailer=[
        {
            name:"Administrator",
            id:"1",
            code: '123'
        },
        {
            name:"Planner Manager",
            id:"2",
            code: '123'
        },
        {
            name:"Yard Manager",
            id:"3",
            code: '123'
        },
        {
            name:"Planner",
            id:"4",
            code: '123'
        }
    ]
    parseApiTrailerObject(trailer){
        const trailerObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        trailerObject.id  = trailer.id;
        trailerObject.trailer_id = trailer.trailer_id;
        trailerObject.eqfleetcode = trailer.eqfleetcode;     
        trailerObject.equnitcode = trailer.equnitcode;
        trailerObject.eqtype  = trailer.eqtype;
        trailerObject.eqmake = trailer.eqmake;     
        trailerObject.eqtypegroup = trailer.eqtypegroup;
        trailerObject.eqmodel  = trailer.eqmodel;
        trailerObject.eqyear = trailer.eqyear;     
        trailerObject.eqstat = trailer.eqstat;
        trailerObject.eqvin  = trailer.eqvin;
        trailerObject.eqdescription = trailer.eqdescription;     
        trailerObject.eqlicenseplate = trailer.eqlicenseplate;
        trailerObject.eqlicensestate  = trailer.eqlicensestate;
        trailerObject.eqlicensecountry = trailer.eqlicensecountry;     
        trailerObject.eqlicenserenewaldate = trailer.eqlicenserenewaldate;
        trailerObject.eq1stmetertype  = trailer.eq1stmetertype;
        trailerObject.eq1stmeteroriginalreading = trailer.eq1stmeteroriginalreading;     
        trailerObject.eq1stmeteroriginalreadingdate = trailer.eq1stmeteroriginalreadingdate;
        trailerObject.eq1stmeterreading  = trailer.eq1stmeterreading;
        trailerObject.eq1stmeteraccumulatedusage = trailer.eq1stmeteraccumulatedusage;     
        trailerObject.eq1stmetermonthlyaverage = trailer.eq1stmetermonthlyaverage;
        trailerObject.eq1stmeterestlife  = trailer.eq1stmeterestlife;
        trailerObject.eq1stmeterprojlife = trailer.eq1stmeterprojlife;     
        trailerObject.eq1stmetervarlife = trailer.eq1stmetervarlife;
        trailerObject.eq1stmeterreadingdate  = trailer.eq1stmeterreadingdate;
        trailerObject.eq1stmeterweighteddailyusage = trailer.eq1stmeterweighteddailyusage;     
        trailerObject.eq2ndmetertype = trailer.eq2ndmetertype;
        trailerObject.eq2ndmeteroriginalreading  = trailer.eq2ndmeteroriginalreading;
        trailerObject.eq2ndmeteroriginalreadingdate = trailer.eq2ndmeteroriginalreadingdate;     
        trailerObject.eq2ndmeterreading = trailer.eq2ndmeterreading;
        trailerObject.eq2ndmeteraccumulatedusage  = trailer.eq2ndmeteraccumulatedusage;
        trailerObject.eq2ndmetermonthlyaverage = trailer.eq2ndmetermonthlyaverage;     
        trailerObject.eq2ndmeterestlife = trailer.eq2ndmeterestlife;
        trailerObject.eq2ndmeterreadingdate  = trailer.eq2ndmeterreadingdate;
        trailerObject.eq2ndmeterweighteddailyusage = trailer.eq2ndmeterweighteddailyusage;     
        trailerObject.eqwheelbase = trailer.eqwheelbase;
        trailerObject.eqgrossweight  = trailer.eqgrossweight;
        trailerObject.eqcustomercode = trailer.eqcustomercode;     
        trailerObject.equnitcode = trailer.equnitcode;
        trailerObject.eqassetid  = trailer.eqassetid;
        trailerObject.maintdate = trailer.maintdate;     
        trailerObject.messages = trailer.messages;
        trailerObject.lastserviceDate  = trailer.lastserviceDate;
        trailerObject.pmdays = trailer.pmdays;
        trailerObject.pm_due_date_utc = trailer.pm_due_date_utc;
        trailerObject.drybulk = trailer.drybulk;
        trailerObject.dryselfLoader  = trailer.dryselfLoader;
        trailerObject.drystraight = trailer.drystraight;     
        trailerObject.drydustcollector = trailer.drydustcollector;
        trailerObject.drybottomdrop  = trailer.drybottomdrop;
        trailerObject.drycooler = trailer.drycooler;     
        trailerObject.dryfilltubes = trailer.dryfilltubes;
        trailerObject.dryfilltubeslocation  = trailer.dryfilltubeslocation;
        trailerObject.drycatwalk_topsafetyconfig = trailer.drycatwalk_topsafetyconfig;     
        trailerObject.dryisleadtrailer = trailer.dryisleadtrailer;
        trailerObject.driver_side_tag  = trailer.driver_side_tag;
        trailerObject.drynumberofhosetubes  = trailer.drynumberofhosetubes;
        trailerObject.liquid = trailer.liquid;     
        trailerObject.liquidunloadconfig = trailer.liquidunloadconfig;
        trailerObject.liquidisinsualted  = trailer.liquidisinsualted;
        trailerObject.liquidhasintransitheat = trailer.liquidhasintransitheat;     
        trailerObject.liquidpump = trailer.liquidpump;
        trailerObject.liquidislargecube  = trailer.liquidislargecube;
        trailerObject.liquidnumberofcxle = trailer.liquidnumberofcxle;     
        trailerObject.liquidchassis = trailer.liquidchassis;
        trailerObject.van  = trailer.van;
        trailerObject.driver_side_tag  = trailer.driver_side_tag;

        trailerObject.vandimensions = trailer.vandimensions;     
        trailerObject.vandoorconfiguration = trailer.vandoorconfiguration;
        trailerObject.vanisfoodgrad  = trailer.vanisfoodgrad;
        trailerObject.vaninhouse = trailer.vaninhouse;     
        trailerObject.dryisleadtrailer = trailer.dryisleadtrailer;
        trailerObject.is_active  = trailer.is_active;
        trailerObject.last_modified_date = trailer.last_modified_date;     
        trailerObject.last_modified_by = trailer.last_modified_by;
        trailerObject.isActive = trailer.isActive;
        trailerObject.cgCode = trailer.cgCode;
        trailerObject.cgName = trailer.cgName;
        trailerObject.cgId = trailer.cgId;
        trailerObject.equipment_type = trailer.equipment_type;
        trailerObject.latitude = trailer.latitude;
        trailerObject.longitude = trailer.longitude;
        trailerObject.location_name = trailer.location_name;
        trailerObject.location_code = trailer.location_code;
        trailerObject.bpatrailerterminal = trailer.bpatrailerterminal;
        trailerObject.commoditygroup = trailer.commoditygroup;
        trailerObject.terminal_full_name = trailer.terminal_full_name === "undefined - undefined" ? "No Data":trailer.terminal_full_name;
        trailerObject.commoditygroup_full_name = trailer.commoditygroup_full_name === "undefined - undefined"?"No Data":trailer.commoditygroup_full_name;

        trailerObject.terminal_full_name_cg = trailer.terminal_full_name === "undefined - undefined" ? "No Data" : trailer.terminal_full_name;
        trailerObject.region = trailer.region;

        trailerObject.commoditygroup_full_name_cg = trailer.commoditygroup_full_name;
        trailerObject.terminal = trailer.terminal;


        return trailerObject;
    }

    parseApiTrailerByCGObject(trailer){
        const trailerObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        trailerObject.id  = trailer.trailerid;
        trailerObject.eqmake = trailer.eqmake;     
        trailerObject.eqmodel  = trailer.eqmodel;
        trailerObject.eqyear = trailer.eqyear;     
        trailerObject.eqvin  = trailer.eqvin;
        trailerObject.eqdescription = trailer.eqdescription;     

        trailerObject.is_active  = trailer.is_active;
        trailerObject.last_modified_date = trailer.last_modified_date;     
        trailerObject.last_modified_by = trailer.last_modified_by;
        trailerObject.isActive = trailer.isActive;
       

        return trailerObject;
    }
}

export default Trailer;