import Header from "../../components/header";
import AppBar from "../../components/appbar";
import React, { useState, useEffect, useContext } from "react";
import { ContextData } from "../../components/appsession";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlanningBoardService from "../../services/planingBoardService";
import AlertService from "../../services/alertService";
import TerminalService from "../../services/terminalService"; 
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const alerts = () => {
  const [userData, setuserData] = useContext(ContextData);
  const [isalertClicked, setisAlertClicked] = useState(false);
  const [is_reload, setisReload] = useState(false);
  const [allAlerts, setAllAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState([]);
  const [userTerminals, setUserTerminals] = useState([]);
  const [allTerminaldropdown, setallTerminaldropdown] = useState([]);
  const [selectedterminalsOptions, setSelectedTerminalsOptions] = useState([]);
  const [allRegiondropdown, setallRegiondropdown] = useState([]);
  const [selectedRegionOptions, setSelectedRegionOptions] = useState([]);
  const [allCommodityGroupDropdown, setAllCommodityGroupDropdown] = useState([]);
  const [selectedCommodityGroupOptions, setSelectedCommodityGroupOptions] = useState([]);
  const [allConsigneeDropdown, setAllConsigneeDropdown] = useState([]);
  const [allShipperDropdown, setAllShipperDropdown] = useState([]);
  const [allAlertTypeDropdown, setAllAlertTypeDropdown] = useState([]);
  const [selectedConsigneeOptions, setSelectedConsigneeOptions] = useState([]);
  const [selectedShipperOptions, setSelectedShipperOptions] = useState([]);
  const [selectedAlertTypeOptions, setSelectedAlertTypeOptions] = useState([]);

  const planningboardService = new PlanningBoardService();

  const getInitialData = async (terminals) => {
    const terminalService = new TerminalService();
    let terminalsData = await terminalService.getTerminalByIds(terminals)
      setUserTerminals(terminalsData);
      let regionList = []
      let terminalList = []
      let commodityGroupList = []
      let consigneeList = []
      let shipperList = []
      let alertTypeList = []
  
      let alertsResponse = await planningboardService.getAlerts();
      let alertsResponseData = alertsResponse.data;
      setAllAlerts(alertsResponseData);
      setAlerts(alertsResponseData);
      let unreadAlerts = alertsResponseData.filter(alert => !alert.isdismissed);
      setUnreadCount(unreadAlerts.length)
      let allCommoditygroups = [...new Set(alertsResponseData.map(alert => alert.commodity_group_description))]
      allCommoditygroups.map((commodityGroup, index) => {
        if(commodityGroup && commodityGroup !== "NULL" && commodityGroup !== "null") {
          let commodityGroupObj = {};
          commodityGroupObj.label = commodityGroup
          commodityGroupObj.value = index;
          commodityGroupList.push(commodityGroupObj)
        }
      })
      setAllCommodityGroupDropdown(commodityGroupList);
      setSelectedCommodityGroupOptions(commodityGroupList);
      let uniRegion = [...new Set(terminalsData.map(r => r.region))]
      let uniConsignee = [...new Set(alertsResponseData.map(c => c.consignee))]
      let uniShipper = [...new Set(alertsResponseData.map(s => s.shipper))]
      let uniAlert = [...new Set(alertsResponseData.map(a => a.alert_type))]
      uniRegion.map((regi, index) => {
        let regionObj = {};
        regionObj.label = regi;
        regionObj.value = index;
        regionList.push(regionObj)
      })
      setallRegiondropdown(regionList)
      setSelectedRegionOptions(regionList)
      userTerminals.map(term => {
        let terminalObj = {}
        terminalObj.label= `${term.code}-${term.city}`,
        terminalObj.value= term.code
        terminalList.push(terminalObj)
      })
      setallTerminaldropdown(terminalList)
      
      uniConsignee.map((consi, index) => {
        let consigneeObj = {}
        consigneeObj.label = consi;
        consigneeObj.value = index;
        consigneeList.push(consigneeObj)
      })
      setAllConsigneeDropdown(consigneeList)
      setSelectedConsigneeOptions(consigneeList)
      uniShipper.map((ship, index) => {
        let shipperObj = {}
          shipperObj.label = ship;
          shipperObj.value = index;
          shipperList.push(shipperObj)
      })
      setAllShipperDropdown(shipperList)
      setSelectedShipperOptions(shipperList)
      uniAlert.map((alert, index) => {
        let alertObj = {}
        alertObj.label = alert;
        alertObj.value = index;
        alertTypeList.push(alertObj)
      })
      setAllAlertTypeDropdown(alertTypeList)
      setSelectedAlertTypeOptions(alertTypeList)
  }
  const handelcallbackFromHeader = async (childdata) => {
    setisAlertClicked(childdata);
  };
  const dismissAlert = async (e) => {
    const alertId = e.currentTarget.id;
    const dismissAlertResponse = await planningboardService.dismissAlert(
      alertId
    );
    await refreshAlerts();
  };
  const refreshAlerts = async () => {
    const alertsResponse = await planningboardService.getAlerts();
    let filteredAlert = alertsResponse.data.filter((alert => selectedterminalsOptions?.map(o => o.value).includes(alert.terminal?.terminal_id) 
    && selectedConsigneeOptions?.map (o => o.label).includes(alert.consignee)
    && selectedShipperOptions?.map (o => o.label).includes(alert.shipper)
    && selectedAlertTypeOptions?.map (o => o.label).includes(alert.alert_type)
    && selectedCommodityGroupOptions?.map (o => o.label).includes(alert.commodity_group_description)
    ));
    setAlerts(filteredAlert);
    let unreadAlerts = filteredAlert.filter(alert => !alert.isdismissed);
    setUnreadCount(unreadAlerts.length)  
  };

  useEffect(async () => {
    const userTerminalIds = await userData.terminals;
    if (userTerminalIds?.length > 0) {
      await getInitialData(userData.terminals);
    }
  }, [userData.terminals]);

useEffect(() => {
  let filteredAlert = allAlerts.filter((alert => selectedterminalsOptions?.map(o => o.value).includes(alert.terminal?.terminal_id) 
  && selectedConsigneeOptions?.map (o => o.label).includes(alert.consignee)
  && selectedShipperOptions?.map (o => o.label).includes(alert.shipper)
  && selectedAlertTypeOptions?.map (o => o.label).includes(alert.alert_type)
  && selectedCommodityGroupOptions?.map (o => o.label).includes(alert.commodity_group_description)
  ));
  setAlerts(filteredAlert);
  let unreadAlerts = filteredAlert.filter(alert => !alert.isdismissed);
  setUnreadCount(unreadAlerts.length)
  },[selectedterminalsOptions.length, selectedConsigneeOptions.length, 
    selectedShipperOptions.length, selectedAlertTypeOptions.length, selectedCommodityGroupOptions.length])

  useEffect(() => {
    let terminals = []
    let filterTerminal =userTerminals.filter(terminal =>  selectedRegionOptions.map(o => o.label).includes(terminal.region))  
    for(let i=0; i< filterTerminal.length; i++){
      let terminalObj = {
        label: `${filterTerminal[i].code}-${filterTerminal[i].city}`,
        value: filterTerminal[i].code
      }
      terminals.push(terminalObj)
    }
    setallTerminaldropdown(terminals)
    setSelectedTerminalsOptions(terminals)
    },[selectedRegionOptions.length])

  function getDropdownLabel({ placeholderButtonLabel }) {
    return placeholderButtonLabel
  }

  function onChangeforTerminal(option) {
    setSelectedTerminalsOptions(option);
  }

  function onChangeforRegion(option) {
    setSelectedRegionOptions(option);
  }

  function onChangeforCommodityGroup(option) {
    setSelectedCommodityGroupOptions(option);
  }

  function onChangeforConsignee(option) {
    setSelectedConsigneeOptions(option);
  }
  function onChangeforShipper(option) {
    setSelectedShipperOptions(option);
  }
  function onChangeforAlert(option) {
    setSelectedAlertTypeOptions(option);
  }

  return (
    <div>
      <div id="wrapper">
        <Header
          userclicked={isalertClicked}
          parentcallback={handelcallbackFromHeader}
        ></Header>
        <AppBar unreadCount={unreadCount}></AppBar>
        <div className="sidebar-main-menu adjustwidth">
          <div className="twocolumn-menu-item d-block">
            <div className="title-box">
              <h5 className="menu-title">Alerts</h5>
            </div>
            <div>
              <p >
                Unread: {unreadCount}
              </p>
            </div>
            <div className="row df top_adjust">
              <div className="dropdownadjust">
                <ReactMultiSelectCheckboxes
                  options={[...allRegiondropdown]}
                  placeholderButtonLabel="Region"
                  getDropdownButtonLabel={getDropdownLabel}
                  value={selectedRegionOptions}
                  onChange={onChangeforRegion}
                  setState={setSelectedRegionOptions}
                />
              </div>

              <div className="multiselect ml_30 pr terminal_drop_fixed">
                <>
                  <div className="dropdownadjust">
                    <ReactMultiSelectCheckboxes
                      options={[...allTerminaldropdown]}
                      placeholderButtonLabel="Terminal"
                      getDropdownButtonLabel={getDropdownLabel}
                      value={selectedterminalsOptions}
                      onChange={onChangeforTerminal}
                      setState={setSelectedTerminalsOptions}
                    />
                  </div>
                </>
              </div>
            </div>
            <div className="row df top_adjust">
            <div className="dropdownadjust">
              <div className="mt-20">
                <ReactMultiSelectCheckboxes
                  options={[...allCommodityGroupDropdown]}
                  placeholderButtonLabel="Commodity Group"
                  getDropdownButtonLabel={getDropdownLabel}
                  value={selectedCommodityGroupOptions}
                  onChange={onChangeforCommodityGroup}
                  setState={setAllCommodityGroupDropdown}
                />
              </div>
              <div className="multiselect ml_30 pr terminal_drop_fixed">
                <div className="dropdownadjust">
                  <div className="mt-20">
                    <ReactMultiSelectCheckboxes
                      options={[...allConsigneeDropdown]}
                      placeholderButtonLabel="Consignee"
                      id="Consignee"
                      name="Consignee"
                      getDropdownButtonLabel={getDropdownLabel}
                      value={selectedConsigneeOptions}
                      onChange={onChangeforConsignee}
                      setState={setSelectedConsigneeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row df top_adjust">
              <div className="dropdownadjust">
                <div className="mt-20">
                  <ReactMultiSelectCheckboxes
                    options={[...allShipperDropdown]}
                    placeholderButtonLabel="Shipper"
                    id="Shipper"
                    name="Shipper"
                    getDropdownButtonLabel={getDropdownLabel}
                    value={selectedShipperOptions}
                    onChange={onChangeforShipper}
                    setState={setSelectedShipperOptions}
                  />
                </div>
              </div>
              <div className="multiselect ml_30 pr terminal_drop_fixed">
                <div className="dropdownadjust">
                  <div className="mt-20">
                    <ReactMultiSelectCheckboxes
                      options={[...allAlertTypeDropdown]}
                      placeholderButtonLabel="Alert Type"
                      id="Alert"
                      name="Alert"
                      getDropdownButtonLabel={getDropdownLabel}
                      value={selectedAlertTypeOptions}
                      onChange={onChangeforAlert}
                      setState={setSelectedAlertTypeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            {alerts && alerts?.length > 0 ? (
              <div className="alert_scroll">
                {alerts.map((alert) => (
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {alert.lm_order_id}
                      </Typography>
                      {alert.text.split("newline").map((item) => (
                        <Typography variant="subtitle1" color="text.secondary">
                          {item}
                        </Typography>
                      ))}
                    </CardContent>
                    <CardActions>
                      {!alert.isdismissed? (
                      <Button id={alert.id} onClick={dismissAlert} size="small">
                      Dismiss
                    </Button>
                      ): null}

                    </CardActions>
                  </Card>
                ))}
              </div>
            ) : (
              "No Alerts"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default alerts;
