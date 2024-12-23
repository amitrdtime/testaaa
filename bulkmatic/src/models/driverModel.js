class Driver {
    constructor() {

    }

    sampleDrivers = [
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
    
    parseApiDriverObject(drivers) {
        const driverObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        driverObject.ace_id = drivers.ace_id;
        driverObject.doubles_certified = drivers.doubles_certified;
        driverObject.hazmat_certified = drivers.hazmat_certified;
        driverObject.respirator_due = drivers.respirator_due;
        driverObject.medical_cert_exempt = drivers.medical_cert_exempt;
        driverObject.medical_cert_expire = drivers.medical_cert_expire;
        driverObject.ft_effective_date = drivers.ft_effective_date;
        driverObject.HazmatEndoresement = drivers.hazmat_endorsement;
        driverObject.HazmatCertifiedExpDate = drivers.hazmat_certified_exp_date;
        driverObject.HM126 = drivers.hm126;
        driverObject.HM126ExpDate = drivers.hm126expdate;
        driverObject.TWIC_No = drivers.twic_no;
        driverObject.TWIC_Date = drivers.twic_date;
        driverObject.TWIC_Expiry_Date = drivers.twic_expiry_date;
        driverObject.name = drivers.name;
        driverObject.code = drivers.code;
        driverObject.id = drivers.id;
        driverObject.driver_id = drivers.driver_id;
        driverObject.first_name = drivers.first_name;
        driverObject.driverfullName = drivers.driver_full_name;
        driverObject.last_name = drivers.name;
        driverObject.name_mid_initial = drivers.name_mid_initial;
        driverObject.newname =  drivers.driver_name ? drivers.first_name + ' ' + drivers.name_mid_initial + ' '+ drivers.driver_name : drivers.first_name;
        driverObject.driver_image_name = drivers.driver_image_name;
        driverObject.birth_date = drivers.birth_date;
        driverObject.cell_phone = drivers.cell_phone;
        driverObject.Email = drivers.email;
        driverObject.passport_date = drivers.passport_date;
        driverObject.passport_card = drivers.passport_card;
        driverObject.is_active = drivers.is_active;
        driverObject.address = drivers.address;
        driverObject.city = drivers.city;
        driverObject.equipment_type_id = drivers.equipment_type_id;
        driverObject.hire_date = drivers.hire_date;
        driverObject.last_home_date = drivers.last_home_date;
        driverObject.last_review_date = drivers.last_review_date;
        driverObject.license_date = drivers.license_date;
        driverObject.license_no = drivers.license_no;
        driverObject.license_state = drivers.license_state;
        driverObject.phone = drivers.phone;
        driverObject.physical_date = drivers.physical_date;
        driverObject.sex = drivers.sex;
        driverObject.state = drivers.state;
        driverObject.termination_date = drivers.termination_date;
        driverObject.zip = drivers.zip;
        driverObject.enhanced_license = drivers.enhanced_license;
        driverObject.driver_type_class = drivers.driver_type_class;
        driverObject.DutyStatus = drivers.DutyStatus;
        driverObject.IsInTrip = drivers.IsInTrip;
        driverObject.RemianingDrivingInMs = drivers.RemianingDrivingInMs;
        driverObject.ShiftRemainingInMs = drivers.ShiftRemainingInMs;
        driverObject.StartedAtTime = drivers.StartedAtTime;
        driverObject.AvailbleInMs = drivers.AvailbleInMs;
        driverObject.AvailbleInDays = drivers.AvailbleInDays;
        driverObject.AvailableInTomorrow = drivers.AvailableInTomorrow;
        driverObject.AvailableInTomorrowMs = drivers.AvailableInTomorrowMs;
        driverObject.AvailableInTomorrowDays = drivers.AvailableInTomorrowDays;
        driverObject.reason = drivers.reason;
        driverObject.SamsaraId = drivers.samsara_id;
        driverObject.is_active = drivers.is_active;
        driverObject.driver_name = drivers.driver_name;
        driverObject.terminal = drivers.terminal;
        driverObject.isBlock = drivers.isBlock;
        driverObject.driver = drivers.driver;
        driverObject.driver_terminal_fullname = drivers.terminal.terminal_full_name;
        driverObject.region = drivers.terminal.region;
        driverObject.driver_id = drivers.driver_id;
        

        driverObject.new_address =  drivers.address ? drivers.address + ' , ' + drivers.city : drivers.city;
        driverObject.new_state_zip =  drivers.zip ? drivers.state + ' , ' + drivers.zip : drivers.state;
        driverObject.isDefaultPlanner = drivers.isDefaultPlanner


        try {

            driverObject.terminal_full_name = "No Data";

            if (drivers?.terminal?.terminal_id.trim() !== '') {
                driverObject.terminal_full_name = "";
                driverObject.terminal_full_name += drivers.terminal.terminal_id.trim();
            }
            if (drivers?.terminal?.city.trim() !== '') {
                driverObject.terminal_full_name += " - " + drivers.terminal.city.trim()
            }
            driverObject.driver_full_name = "No Data";

            if (drivers?.first_name.trim() !== '') {
                driverObject.driver_full_name = "";
                driverObject.driver_full_name += drivers.driver_full_name.trim();
            }
            if (drivers?.name_mid_initial.trim() !== '') {
                driverObject.driver_full_name += " " + drivers.name_mid_initial
            }
            if (drivers?.driver_name.trim() !== '') {
                driverObject.driver_full_name += " " + drivers.driver_name.trim()
            }

        }
        catch {

        }
        

        return driverObject;
    }

    parseApiDriverSchedule(data){
        const obj = {};
        obj.id = data.id;
        obj.driver_id = data.driver_id;
        obj.start_time = data.start_time;
        obj.end_time = data.end_time;
        obj.block_type = data.block_type;
        obj.schedule_day = data.schedule_day;
        obj.created_by = data.created_by;
        obj.duration = data.duration;
        obj.updated_by = data.updated_by
        // obj.date = data.date;
        // obj.isAvailable = data.isAvailable;
        // obj.nightout = data.nightout === undefined? "YES" : data.nightout;
        return obj;
    }
}

export default Driver;