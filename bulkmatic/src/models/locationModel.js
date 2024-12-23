class Location {
  constructor() {}
  sampleLocations = [
    {
      id: "1",
      name: "TAFE",
      code: "2",
      type: "test",
      Address: "test Address",
      state: "west bengal",
      zip: "700001",
      city: "kolkata",
      isTerminal: true,
      isShipper: false,
      isConsignee: true,
      isRailyard: true,
      isDroplot: true,
      isshop: true,
      iswash: true,
      lattiude: "-0.2345",
      longitude: "2132132",
      region: "east",
    },
    {
      name: "Planner Manager",
      id: "2",
      code: "123",
      type: "test",
      Address: "test Address",
      state: "west bengal",
      zip: "700001",
      city: "kolkata",
      isTerminal: true,
      isShipper: true,
      isConsignee: true,
      isRailyard: true,
      isDroplot: true,
      isshop: true,
      iswash: true,
      lattiude: "-0.2345",
      longitude: "2132132",
      region: "east",
    },
    {
      name: "Yard Manager",
      id: "3",
      code: "123",
      type: "test",
      Address: "test Address",
      state: "west bengal",
      zip: "700001",
      city: "kolkata",
      isTerminal: true,
      isShipper: true,
      isConsignee: true,
      isRailyard: true,
      isDroplot: true,
      isshop: true,
      iswash: true,
      lattiude: "-0.2345",
      longitude: "2132132",
      region: "east",
    },
    {
      name: "Planner",
      id: "4",
      code: "123",
      type: "test",
      Address: "test Address",
      state: "west bengal",
      zip: "700001",
      city: "kolkata",
      isTerminal: true,
      isShipper: true,
      isConsignee: true,
      isRailyard: true,
      isDroplot: true,
      isshop: true,
      iswash: true,
      lattiude: "-0.2345",
      longitude: "2132132",
      region: "east",
    },
  ];
  parseApiLocationObject(location) {
    const locationObject = {};
    //Define your Data Model based on the UI Requirement here.
    //Implementation should continue bu creating demo model.
    locationObject.name = location.name;
    locationObject.code = location.code;
    locationObject.id = location.id;
    locationObject.type = location.type;
    locationObject.address = location.address;
    locationObject.address1 = location.address1;
    locationObject.newaddress =  location.address ? location.address1 + ' , ' + location.address : location.address1;
    locationObject.state = location.state;
    locationObject.zip = location.zip;
    locationObject.isTerminal = location.isTerminal? location.isTerminal : location.isterminal;
    locationObject.isShipper = location.isshipper;
    locationObject.isConsignee = location.isconsignee;
    locationObject.isRailyard = location.israilyard;
    locationObject.isDroplot = location.isdroplot;
    locationObject.isShop = location.isshop;
    locationObject.isWash = location.iswash;
    locationObject.latitude = location.latitude;
    locationObject.longitude = location.longitude;
    locationObject.region = location.region;
    locationObject.shipperpoolid = location.shipperpoolid;
    locationObject.phone = location.phone;
    locationObject.email = location.email;
    locationObject.location_id = location.location_id;
    locationObject.hours_of_operation_endts = location.hours_of_operation_endts;
    locationObject.hours_of_operation_startts =
      location.hours_of_operation_startts;
    locationObject.city = location.city;
    locationObject.isActive = location.isActive === null || location.isActive === undefined? true : location.isActive;


    return locationObject;
  }
}

export default Location;
