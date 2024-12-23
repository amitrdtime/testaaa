class Tractor {
    constructor() {
    }
    sampleTractor = [
        {
            "id": "1",
            "name": "TAFE ",
            "code": "2"
        },
        {
            name: "Planner Manager",
            id: "2",
            code: '123'
        },
        {
            name: "Yard Manager",
            id: "3",
            code: '123'
        },
        {
            name: "Planner",
            id: "4",
            code: '123'
        }
    ]
    parseApiTractorObject(tractors) {
        // 
        const tractorObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        tractorObject.id= tractors.id;
        tractorObject.source_system = tractors.source_system; 
        tractorObject.company_id = tractors.company_id; 
        tractorObject.tractor_id= tractors.tractor_id; 
        tractorObject.equipment_id= tractors.equipment_id; 
        tractorObject.fleetcode= tractors.fleetcode;
        tractorObject.unitcode=  tractors.unitcode; 
        tractorObject.make= tractors.make;
        tractorObject.model= tractors.model; 
        tractorObject.model_year= tractors.model_year;
        tractorObject.status= tractors.status;
        tractorObject.vin= tractors.vin;
        tractorObject.equipment_type= tractors.equipment_type;
        tractorObject.description = tractors.description; 
        tractorObject.license_plate = tractors.license_plate; 
        tractorObject.license_state= tractors.license_state; 
        tractorObject.license_country= tractors.license_country; 
        tractorObject.license_renewal_date= tractors.license_renewal_date;
        tractorObject.first_meter_type=  tractors.first_meter_type; 
        tractorObject.first_meter_original_reading= tractors.first_meter_original_reading;
        tractorObject.first_meter_original_reading_date= tractors.first_meter_original_reading_date; 
        tractorObject.first_meter_reading= tractors.first_meter_reading;
        tractorObject.first_meter_accumulated_usage= tractors.first_meter_accumulated_usage;
        tractorObject.first_meter_monthly_average= tractors.first_meter_monthly_average;
        tractorObject.first_meter_est_life = tractors.first_meter_est_life; 
        tractorObject.first_meter_proj_life = tractors.first_meter_proj_life; 
        tractorObject.first_meter_var_life= tractors.first_meter_var_life; 
        tractorObject.first_meter_reading_date= tractors.first_meter_reading_date; 
        tractorObject.first_meter_weighted_daily_usage= tractors.first_meter_weighted_daily_usage;
        tractorObject.second_meter_type=  tractors.second_meter_type; 
        tractorObject.second_meter_original_reading= tractors.second_meter_original_reading;
        tractorObject.second_meter_original_reading_date= tractors.second_meter_original_reading_date; 
        tractorObject.second_meter_reading= tractors.second_meter_reading;
        tractorObject.second_meter_accumulated_usage= tractors.second_meter_accumulated_usage;
        tractorObject.second_meter_monthly_average= tractors.second_meter_monthly_average;
        tractorObject.second_meter_est_life = tractors.second_meter_est_life; 
        tractorObject.second_meter_reading_date = tractors.second_meter_reading_date; 
        tractorObject.second_meter_weighted_daily_usage= tractors.second_meter_weighted_daily_usage; 
        tractorObject.wheelbase= tractors.wheelbase; 
        tractorObject.gross_weight= tractors.gross_weight;
        tractorObject.tare_weight=  tractors.tare_weight; 
        tractorObject.tran_description= tractors.tran_description;
        tractorObject.sleeper_daycab= tractors.sleeper_daycab; 
        tractorObject.wetkit= tractors.wetkit;
        tractorObject.blower= tractors.blower;
        tractorObject.transmission_auto_manual= tractors.transmission_auto_manual;
        tractorObject.governing_speed_limit= tractors.governing_speed_limit;
        tractorObject.double_certification=  tractors.double_certification; 
        tractorObject.overweight_permit= tractors.overweight_permit;
        tractorObject.last_modified_date= tractors.last_modified_date; 
        tractorObject.last_modified_by= tractors.last_modified_by;
        tractorObject.pm_due_date_utc= tractors.pm_due_date_utc;
        tractorObject.is_active = tractors.is_active;
        tractorObject.latitude = tractors.latitude;
        tractorObject.longitude = tractors.longitude;
        tractorObject.terminal = tractors.terminal;
        tractorObject.region = tractors.terminal.region;
        tractorObject.terminal_name = tractors.terminal?.terminal_id + ' - ' + tractors.terminal?.city;

        try {
            tractorObject.terminal_id = tractors.terminal_id;
            tractorObject.terminal_full_name = "No Data";

            if (tractors?.terminal?.terminal_id?.trim() !== '') {
                tractorObject.terminal_full_name = "";
                tractorObject.terminal_full_name += tractors.terminal.terminal_id.trim();
            }
            if (tractors?.terminal?.city.trim() !== '') {
                tractorObject.terminal_full_name += " - " + tractors.terminal.city.trim()
            }
        }
        catch {
            tractorObject.terminal_id = "No Data";
            tractorObject.terminal_full_name = "No Data";
        }
        


        return tractorObject;
    }
}

export default Tractor;