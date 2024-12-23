class LoadunloadRule {
  constructor() {}
  sampleLoadunload = [
    {
      name: "Administrator",
      id: "1",
      code: "123",
    },
    {
      name: "Planner Manager",
      id: "2",
      code: "123",
    },
    {
      name: "Yard Manager",
      id: "3",
      code: "123",
    },
    {
      name: "Planner",
      id: "4",
      code: "123",
    },
  ];
  parseApiLoadunloadRuleObject(trailer) {
    const loadunloadRuleObject = {};
    //Define your Data Model based on the UI Requirement here.
    //Implementation should continue bu creating demo model.

    return loadunloadRuleObject;
  }

  parseApiLUTCGRuleObject(lutObj) {
    const loadunloadRuleObject = {};
    //Define your Data Model based on the UI Requirement here.
    //Implementation should continue bu creating demo model.
    loadunloadRuleObject.commoditygroupid = lutObj.commoditygroupid;
    loadunloadRuleObject.commodityid = lutObj.commodityid;
    loadunloadRuleObject.code = lutObj.code;
    loadunloadRuleObject.description = lutObj.description;
    loadunloadRuleObject.commoditygroup = lutObj.commoditygroup;
    loadunloadRuleObject.driverloadflag = lutObj.driverloadflag;
    loadunloadRuleObject.loadtime = lutObj.loadtime;
    loadunloadRuleObject.unloadtime = lutObj.unloadtime;
    loadunloadRuleObject.isActive = lutObj.isActive;
    loadunloadRuleObject.shipperid = lutObj.shipperid;
    loadunloadRuleObject.commodity = lutObj.commodity;
    loadunloadRuleObject.commoditygroupcode = lutObj.commoditygroupcode;
    loadunloadRuleObject.commoditygroupname = lutObj.commoditygroupname;
    loadunloadRuleObject.shipperid = lutObj.shipperid;
    loadunloadRuleObject.shippers  = lutObj.shippers;  

    return loadunloadRuleObject;
  }

  parseApiLUTCommodityRuleObject(lutObj) {

    const loadunloadRuleObject = {};

    
    //Define your Data Model based on the UI Requirement here.
    //Implementation should continue bu creating demo model.
    loadunloadRuleObject.actiontype = lutObj.actiontype;
    loadunloadRuleObject.commodity = lutObj.commodity;
    loadunloadRuleObject.commoditygroup = lutObj.commoditygroup;
    loadunloadRuleObject.commoditygroupid = lutObj.commoditygroupid;
    loadunloadRuleObject.commodityid = lutObj.commodityid;
    loadunloadRuleObject.commodities = lutObj.commodities;
    loadunloadRuleObject.driverloadflag = lutObj.driverloadflag;
    loadunloadRuleObject.id = lutObj.id;
    loadunloadRuleObject.isActive = lutObj.isActive;
    loadunloadRuleObject.loadtime = lutObj.loadtime;
    loadunloadRuleObject.shipperid = lutObj.shipperid;
    loadunloadRuleObject.unloadtime = lutObj.unloadtime;
    loadunloadRuleObject.code = lutObj.code;
    loadunloadRuleObject.description = lutObj.description;
    loadunloadRuleObject.loadunload = lutObj.loadunload;
    loadunloadRuleObject.lastupdate = lutObj.lastupdate;
    loadunloadRuleObject.lutformatted = lutObj.lutformatted;
    loadunloadRuleObject.shipperid = lutObj.shipperid;
    loadunloadRuleObject.shippers  = lutObj.shippers;
 
    return loadunloadRuleObject;
  }
}

export default LoadunloadRule;
