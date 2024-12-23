class Terminal {
    constructor(){

    }

    sampleTerminal=[
        {
            name:"Administrator",
            id:"1",
            code: '123',
            isActive : true, //? true : false;
            address : '123',
            city : '123',
            state : '123',
            zip : '123',
            fax : '123',
            phone : '123',
            email : '123',
            address1 : '123',
            address2 : '123',
            region : '123',
            timezone : '123',
            lattiude : '123',
            longitude : '123',
            isshop : false,
            iswash : false,
            isshipper : false,
            isconsignee : false,
            israilyard : false,
            isdroplot : false,
            defaultplannerid : '123'
        },
        {
            name:"Planner Manager",
            id:"2",
            code: '123',
            isActive : true, //? true : false;
            address : '123',
            city : '123',
            state : '123',
            zip : '123',
            fax : '123',
            phone : '123',
            email : '123',
            address1 : '123',
            address2 : '123',
            region : '123',
            timezone : '123',
            lattiude : '123',
            longitude : '123',
            isshop : false,
            iswash : false,
            isshipper : false,
            isconsignee : false,
            israilyard : false,
            isdroplot : false,
            defaultplannerid : '123'
        },
        {
            name:"Yard Manager",
            id:"3",
            code: '123',
            isActive : true, //? true : false;
            address : '123',
            city : '123',
            state : '123',
            zip : '123',
            fax : '123',
            phone : '123',
            email : '123',
            address1 : '123',
            address2 : '123',
            region : '123',
            timezone : '123',
            lattiude : '123',
            longitude : '123',
            isshop : false,
            iswash : false,
            isshipper : false,
            isconsignee : false,
            israilyard : false,
            isdroplot : false,
            defaultplannerid : '123'
        },
        {
            name:"Planner",
            id:"4",
            code: '123',
            isActive : true, //? true : false;
            address : '123',
            city : '123',
            state : '123',
            zip : '123',
            fax : '123',
            phone : '123',
            email : '123',
            address1 : '123',
            address2 : '123',
            region : '123',
            timezone : '123',
            lattiude : '123',
            longitude : '123',
            isshop : false,
            iswash : false,
            isshipper : false,
            isconsignee : false,
            israilyard : false,
            isdroplot : false,
            defaultplannerid : '123'
        }
    ]
    parseApiTerminalObject(terminal){
        const terminalObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        terminalObject.name = terminal.name;
        terminalObject.code = terminal.code;
        terminalObject.full_terminal_name = terminal.code + ' - ' + terminal.name;
        terminalObject.id = terminal.id;
        terminalObject.isActive = terminal.isActive; //? true : false;
        terminalObject.address = terminal.address;
        terminalObject.city = terminal.city;
        terminalObject.state = terminal.state;
        terminalObject.zip = terminal.zip;
        terminalObject.fax = terminal.fax;
        terminalObject.phone = terminal.phone;
        terminalObject.email = terminal.email;
        terminalObject.address1 = terminal.address1;
        terminalObject.address2 = terminal.address2;
        terminalObject.newaddress =  terminal.address2 ? terminal.address1 + ' , ' + terminal.address2 : terminal.address1;
        terminalObject.region = terminal.region;
        terminalObject.timezone = terminal.timezone;
        terminalObject.latitude = terminal.latitude;
        terminalObject.longitude = terminal.longitude;
        terminalObject.isshop = terminal.isshop
        terminalObject.iswash = terminal.iswash;
        terminalObject.isshipper = terminal.isshipper;
        terminalObject.isconsignee = terminal.isconsignee;
        terminalObject.israilyard = terminal.israilyard;
        terminalObject.isdroplot = terminal.isdroplot;
        terminalObject.defaultplannerid = terminal.defaultplannerid;
        terminalObject.isActive = terminal.isActive === null || terminal.isActive === undefined? true : terminal.isActive;  
        terminalObject.new_address =  terminal.address2 ? terminal.address1 + ' , ' + terminal.address2 : terminal.address1;
        terminalObject.new_state_zip =  terminal.zip ? terminal.state + ' , ' + terminal.zip : terminal.state;
        terminalObject.address_city_state_zip = `${terminal.city} , ${terminal.state} , ${terminal.zip}`;
        return terminalObject;
    }
}

export default Terminal;