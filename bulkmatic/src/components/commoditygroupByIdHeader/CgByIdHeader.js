import React, { useState, useContext, useEffect,useRef } from "react";
import Button from "react-bootstrap/Button";
import LUTRuleService from "../../services/loadunloadruleService";
import { ContextData } from "../../components/appsession";
import CommoditygroupService from "../../services/commoditygroupService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
const CgByIdHeader = (props) => {
  const [userData, setuserData] = useContext(ContextData);

  const planners = userData.roles?.map((e) => e.permissionAccess)

  const commodity = planners[0].filter(element => element.permission === "Commodity Groups")
  const { commoditygroupById, allTrailersDetails } = props;
 


  // This state for Load Time
  const [yes, setYes] = useState(
  );
  const [no, setNo] = useState(
    commoditygroupById.lutformatted.loadtime.no.loadtime
  );
  const [tl, setTl] = useState(
    commoditygroupById.lutformatted.loadtime.tl.loadtime
  );
  const [nb, setNb] = useState(
    commoditygroupById.lutformatted.loadtime.nb.loadtime
  );
  //  This state for Unload Time
  const [yesUnLoad, setYesUnLoad] = useState(
    commoditygroupById.lutformatted.unloadtime.yes.unloadtime
  );
  const [noUnLoad, setNoUnLoad] = useState(
    commoditygroupById.lutformatted.unloadtime.no.unloadtime
  );
  
  // This IsEdit state for Load Time
  const [isEditforYes, setIsEditforYes] = useState(true);
  const [isEditforNo, setIsEditforNo] = useState(true);
  const [isEditforTl, setIsEditforTl] = useState(true);
  const [isEditforNB, setIsEditforNB] = useState(true);
  const [isEditforYesUnLoad, setIsEditforYesUnLoad] = useState(true);
  const [isEditforNoUnLoad, setIsEditforNoUnLoad] = useState(true);
  
/// Reset state for loadtime or unload time used for header part
 const [isResetforYes, setIsResetforYes] = useState("")
 const [isResetforNo, setIsResetforNo] = useState("") 
 const [isResetforTl, setIsResetforTl] = useState("") 
 const [isResetforNb, setIsResetforNb] = useState("") 
 const [isResetforunloadYes, setIsResetforunloadYes] = useState("") 
 const [isResetforunloadNo, setIsResetforunloadNo] = useState("") 
 const resetRefyes = useRef(null)
 const resetRefno = useRef(null)
 const resetReftl = useRef(null)
 const resetRefnb = useRef(null)
 const resetRefunloadyes = useRef(null)
 const resetRefunloadno = useRef(null)


/// End
  const [tabSelected, settabSelected] = useState({
    details: true,
    Trailers: false,
    shipper: false,
    dedicatedtrailers: false,
    shipperPool: false,
    consigee: false,
  });
  

  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        Trailers: false,
        shipper: false,
        dedicatedtrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "Trailers") {
      settabSelected({
        details: false,
        Trailers: true,
        shipper: false,
        dedicatedtrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "shipper") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: true,
        dedicatedtrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "dedicatedtrailers") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedtrailers: true,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "shipperPool") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedtrailers: false,
        shipperPool: true,
        consigee: false,
      });
    }
    if (tabname === "consigee") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedtrailers: false,
        shipperPool: false,
        consigee: true,
      });
    }
    props.parentcallback(tabname);
  };

  const editInfoHandler = () => setIsEditforYes(false);

  const editforNo = () => setIsEditforNo(false);

  const editforTl = () => setIsEditforTl(false);

  const editforNB = () => setIsEditforNB(false);

  const editforYesUnloadTime = () => setIsEditforYesUnLoad(false);

  const editforNoUnloadTime = () => setIsEditforNoUnLoad(false);

  const cancelSaveUser = () => setIsEditforYes(true);

  const cancelForNO = () => setIsEditforNo(true);

  const cancelForTl = () => setIsEditforTl(true);

  const cancelForNB = () => setIsEditforNB(true);

  const cancelForYesUnloadTime = () => setIsEditforYesUnLoad(true);

  const cancelForNoUnloadTime = () => setIsEditforNoUnLoad(true);

  const handleResetForLoadUnload = async (name) => {
    switch (name) {
      case "Yes":
        var id = commoditygroupById.lutformatted.loadtime.yes.id;
        var payload = {
          id: id,
        };
        const locationServiceyes1 = new LUTRuleService();
        const data1 = await locationServiceyes1.deleteLUTRule(payload);
        if (data1.length > 0) {
           //window.location.reload();
           setIsResetforYes(data1[0].lutformatted.loadtime.yes.loadtime)
           resetRefyes.current.value=data1[0].lutformatted.loadtime.yes.loadtime
      
         props.callbackAfterrefresh(data1) 
           
        }
        break;
      case "No":
        var id = commoditygroupById.lutformatted.loadtime.no.id;
        var payload = {
          id: id,
        };
        const locationService2 = new LUTRuleService();
        const data2 = await locationService2.deleteLUTRule(payload);

        if (data2.length > 0) {
          setIsResetforNo(data2[0].lutformatted.loadtime.no.loadtime)
          resetRefno.current.value=data2[0].lutformatted.loadtime.no.loadtime
          props.callbackAfterrefresh(data2) 
        }
        break;
        case "TL":
          var id = commoditygroupById.lutformatted.loadtime.tl.id;
          var payload = {
            id: id,
          };
          const locationService4 = new LUTRuleService();
          const data4 = await locationService4.deleteLUTRule(payload);
  
          if (data4.length > 0) {
            setIsResetforTl(data4[0].lutformatted.loadtime.tl.loadtime)
            resetReftl.current.value=data4[0].lutformatted.loadtime.tl.loadtime
            props.callbackAfterrefresh(data4) 
          }
          break;
      case "NB":
        var id = commoditygroupById.lutformatted.loadtime.nb.id;
        var payload = {
          id: id,
        };
        const locationService3 = new LUTRuleService();
        const data3 = await locationService3.deleteLUTRule(payload);
        if (data3.length > 0) {
          setIsResetforNb(data3[0].lutformatted.loadtime.nb.loadtime)
          resetRefnb.current.value=data3[0].lutformatted.loadtime.nb.loadtime
          
          props.callbackAfterrefresh(data3) 
        }
        break;
     
      case "YesReset":
        var id = commoditygroupById.lutformatted.unloadtime.yes.id;
        var payload = {
          id: id,
        };
        const locationServiceyes5 = new LUTRuleService();
        const data5 = await locationServiceyes5.deleteLUTRule(payload);

        if (data5.length > 0) {
         // setIsEditforYes(data5[0].lutformatted.loadtime.yes.id)
      
         setIsResetforunloadYes(data5[0].lutformatted.unloadtime.yes.unloadtime)
         resetRefunloadyes.current.value=data5[0].lutformatted.unloadtime.yes.unloadtime
          props.callbackAfterrefresh(data5) 
        }
        break;
      case "NoReset":
        var id = commoditygroupById.lutformatted.unloadtime.no.id;
        var payload = {
          id: id,
        };
        const locationService6 = new LUTRuleService();
        const data6 = await locationService6.deleteLUTRule(payload);


        if (data6.length > 0) {
          setIsResetforunloadNo(data6[0].lutformatted.unloadtime.no.unloadtime)
          resetRefunloadno.current.value=data6[0].lutformatted.unloadtime.no.unloadtime
        
          props.callbackAfterrefresh(data6) 
        }
        break;
      default:
        break;
    }
  };

  const handleSaveForLoadUnLoad = async (saveName) => {
    switch (saveName) {
      case "Yes":
        if (commoditygroupById.lutformatted.loadtime.yes.id === null) {
          var payload = {
            actiontype: "PU",
            loadflag: "Yes",
            cgid: commoditygroupById.code,
            loadtime: yes,
          };
          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);

          if (data.length > 0) {
            setIsEditforYes(data[0].loadtime)
            props.callbackAftersave()
           //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.loadtime.yes.id;
          var payload = {
            id: id,
            actiontype: "PU",
            loadflag: "Yes",
            cgid: commoditygroupById.code,
            loadtime: yes,
          };
          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            //window.location.reload();
            setIsEditforYes(data[0].loadtime)
            props.callbackAftersave()
          }
        }
        break;
      case "No":
        if (commoditygroupById.lutformatted.loadtime.no.id === null) {
          var payload = {
            actiontype: "PU",
            loadflag: "No",
            cgid: commoditygroupById.code,
            loadtime: no,
          };
          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);

          if (data.length > 0) {
            setIsEditforNo(data[0].loadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.loadtime.no.id;
          var payload = {
            id: id,
            actiontype: "PU",
            loadflag: "No",
            cgid: commoditygroupById.code,
            loadtime: no,
          };
          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            setIsEditforNo(data[0].loadtime)
            props.callbackAftersave()
           // window.location.reload();
          }
        }
        break;
      case "NB":
        if (commoditygroupById.lutformatted.loadtime.nb.id === null) {
          var payload = {
            actiontype: "PU",
            loadflag: "NB",
            cgid: commoditygroupById.code,
            loadtime: nb,
          };
          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);
          if (data.length > 0) {
            setIsEditforNB(data[0].loadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.loadtime.nb.id;
          var payload = {
            id: id,
            actiontype: "PU",
            loadflag: "NB",
            cgid: commoditygroupById.code,
            loadtime: nb,
          };

          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            setIsEditforNB(data[0].loadtime)
            props.callbackAftersave()

            //window.location.reload();
          }
        }
        break;
      case "TL":
        if (commoditygroupById.lutformatted.loadtime.tl.id === null) {
          var payload = {
            actiontype: "PU",
            loadflag: "TL",
            cgid: commoditygroupById.code,
            loadtime: tl,
          };
          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);

          if (data.length > 0) {
            setIsEditforTl(data[0].loadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.loadtime.tl.id;
          var payload = {
            id: id,
            actiontype: "PU",
            loadflag: "TL",
            cgid: commoditygroupById.code,
            loadtime: tl,
          };

          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            setIsEditforTl(data[0].loadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        }
        break;

      case "YesUnload":
        if (commoditygroupById.lutformatted.unloadtime.yes.id === null) {
          var payload = {
            actiontype: "DP",
            loadflag: "Yes",
            cgid: commoditygroupById.code,
            unloadtime: yesUnLoad,
          };

          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);

          if (data.length > 0) {
            setIsEditforYesUnLoad(data[0].unloadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.unloadtime.yes.id;
          var payload = {
            id: id,
            actiontype: "DP",
            loadflag: "Yes",
            cgid: commoditygroupById.code,
            unloadtime: yesUnLoad,
          };

          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            setIsEditforYesUnLoad(data[0].unloadtime)
            props.callbackAftersave()

           // window.location.reload();
          }
        }
        break;
      case "NoUnload":
        if (commoditygroupById.lutformatted.unloadtime.no.id === null) {
          var payload = {
            actiontype: "DP",
            loadflag: "No",
            cgid: commoditygroupById.code,
            unloadtime: noUnLoad,
          };

          const lutServices = new LUTRuleService();
          const data = await lutServices.createLUTRule(payload);

          if (data.length > 0) {
            setIsEditforNoUnLoad(data[0].unloadtime)
            props.callbackAftersave()
            //window.location.reload();
          }
        } else {
          var id = commoditygroupById.lutformatted.unloadtime.no.id;
          var payload = {
            id: id,
            actiontype: "DP",
            loadflag: "No",
            cgid: commoditygroupById.code,
            unloadtime: noUnLoad,
          };
          const locationServiceyes = new LUTRuleService();
          const data = await locationServiceyes.updateLUTRule(payload);

          if (data.length > 0) {
            setIsEditforNoUnLoad(data[0].unloadtime)
            props.callbackAftersave()

           // window.location.reload();
          }
        }
      default:
        break;
    }
  };

  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          defaultChecked={tabSelected.details}
          onClick={(e) => tabClickHandler(e, "details")}
        />
    
        <label htmlFor="tabone">Details</label>
        <div className="tab">
          <div className="profile_top" style={{ "paddingLeft": "0" }}>
            <div className="profile_top_left">
              <div>
                <p className="profile_top_left_text">
                  {commoditygroupById.name}
                </p>
                <p className="profile_bottom_left_text">
                  Commodity Group Code: {commoditygroupById.code}
                </p>
              </div>
            </div>
            <div className="profile_top_right">
              <div
                className="online_sign"
                style={
                  commoditygroupById.isActive
                    ? {}
                    : { backgroundColor: "#d3e3d7" }
                }
              ></div>
            </div>
          </div>
          <table className="table table-borderless table-centered m-0 special_fonts bg-light commodity_override">
            <thead className="table-light">
              <tr className="commodity_override_deep">
                <th colSpan={4}>Load Time</th>
              </tr>
              <tr>
                <th>Yes</th>
                <th>No</th>
                <th>TL</th>
                <th>NB</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="number"
                    name="yes"
                    onInput={(e) => setYes(e.target.value)}
                    className={
                      !isEditforYes
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    defaultValue={
                      isResetforYes ===""?  commoditygroupById.lutformatted.loadtime.yes.loadtime:isResetforYes
                    }
                    ref={resetRefyes}
                    placeholder="e.g. 30mins"
                    disabled={isEditforYes}
                  />
                  {isEditforYes ? 
                  <>
                  
                
                  {  
                      
                      commodity[0].isEdit ?
                        <div onClick={(e) => editInfoHandler()}>
                          <i
                            className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                            aria-hidden="true"
                            style={{ color: "#0066ff" }}
                          ></i>
                        </div>
                        :<div>
                          <i
                            className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                            aria-hidden="true"
                            style={{ color: "#8174b5" }}
                          ></i>
                        </div>
                    }
                   </>

                   : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("Yes")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => cancelSaveUser()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.loadtime.yes.id !== null ? (
                    commodity[0].isEdit ?
                    <Button className="mt_10"
 
                     onClick={() => handleResetForLoadUnload("Yes")}>
                      Reset
                    </Button>:
                   <Button disabled>
                   Reset
                 </Button>

                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="no"
                    onInput={(e) => setNo(e.target.value)}
                    className={
                      !isEditforNo
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    // defaultValue={
                    //   commoditygroupById.lutformatted.loadtime.no.loadtime
                    // }
                    defaultValue={
                      isResetforNo ===""?  commoditygroupById.lutformatted.loadtime.no.loadtime:isResetforNo
                    }
                    ref={resetRefno}
                    placeholder="e.g. 30mins"
                    disabled={isEditforNo}
                  />
                  {isEditforNo ? (
                     <>
                  
                
                     {  
                         
                         commodity[0].isEdit ?
                           <div onClick={(e) => editforNo()}>
                             <i
                               className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                               aria-hidden="true"
                               style={{ color: "#0066ff" }}
                             ></i>
                           </div>
                           :<div>
                             <i
                               className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                               aria-hidden="true"
                               style={{ color: "#8174b5" }}
                             ></i>
                           </div>
                       }
                      </>
   
                     ) : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("No")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => cancelForNO()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.loadtime.no.id !== null ? (
                     commodity[0].isEdit ?
                    <Button className="mt_10"

                    onClick={() => handleResetForLoadUnload("No")}>
                      Reset
                    </Button>:
                     <Button disabled>
                     Reset
                   </Button>

                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="Tl"
                    onInput={(e) => setTl(e.target.value)}
                    className={
                      !isEditforTl
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    // defaultValue={
                    //   commoditygroupById.lutformatted.loadtime.tl.loadtime
                    // }
                    defaultValue={
                      isResetforTl ===""?  commoditygroupById.lutformatted.loadtime.tl.loadtime:isResetforTl
                    }
                    ref={resetReftl}
                    placeholder="e.g. 30mins"
                    disabled={isEditforTl}
                  />
                  {isEditforTl ? (
                    <>
                  
                
                    {  
                        
                        commodity[0].isEdit ?
                          <div onClick={(e) => editforTl()}>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#0066ff" }}
                            ></i>
                          </div>
                          :<div>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#8174b5" }}
                            ></i>
                          </div>
                      }
                     </>
  
                    ) : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("TL")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => cancelForTl()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.loadtime.tl.id !== null ? (
                     commodity[0].isEdit ?
                    <Button className="mt_10"

                    onClick={() => handleResetForLoadUnload("TL")}>
                      Reset
                    </Button>:
                    <Button disabled>
                    Reset
                  </Button>

                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="Nb"
                    onInput={(e) => setNb(e.target.value)}
                    className={
                      !isEditforNB
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    // defaultValue={
                    //   commoditygroupById.lutformatted.loadtime.nb.loadtime
                    // }
                    defaultValue={
                      isResetforNb ===""?  commoditygroupById.lutformatted.loadtime.nb.loadtime:isResetforNb
                    }
                    ref={resetRefnb}
                    placeholder="e.g. 30mins"
                    disabled={isEditforNB}
                  />
                  {isEditforNB ? (
                    <>
                  
                
                    {  
                        
                        commodity[0].isEdit ?
                          <div onClick={(e) => editforNB()}>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#0066ff" }}
                            ></i>
                          </div>
                          :<div>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#8174b5" }}
                            ></i>
                          </div>
                      }
                     </>
  
                    ) : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("NB")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => cancelForNB()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.loadtime.nb.id !== null ? (
                    commodity[0].isEdit ?
                    <Button className="mt_10"

                    onClick={() => handleResetForLoadUnload("NB")}>
                      Reset
                    </Button>:
                     <Button disabled>
                     Reset
                   </Button>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table table-borderless table-centered m-0 special_fonts bg-light commodity_override">
            <thead className="table-light">
              <tr className="commodity_override_deep">
                <th colSpan={3}>Unload Time</th>
              </tr>
              <tr>
                <th>
                  Yes
                  {/* <i
                    class="fa fa-refresh reset_comodity"
                    aria-hidden="true"
                  ></i> */}
                </th>
                <th>
                  No
                  {/* <i
                    class="fa fa-refresh reset_comodity"
                    aria-hidden="true"
                  ></i> */}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="number"
                    name="yesUnload"
                    onInput={(e) => setYesUnLoad(e.target.value)}
                    className={
                      !isEditforYesUnLoad
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    // defaultValue={
                    //   commoditygroupById.lutformatted.unloadtime.yes.unloadtime
                    // }
                    defaultValue={
                      isResetforunloadYes
                      ===""?  commoditygroupById.lutformatted.unloadtime.yes.unloadtime:isResetforunloadYes

                    }
                    ref={resetRefunloadyes}

                    placeholder="e.g. 30mins"
                    disabled={isEditforYesUnLoad}
                  />
                  {isEditforYesUnLoad ? (
                     <>
                  
                
                     {  
                         
                         commodity[0].isEdit ?
                           <div onClick={(e) => editforYesUnloadTime()}>
                             <i
                               className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                               aria-hidden="true"
                               style={{ color: "#0066ff" }}
                             ></i>
                           </div>
                           :<div>
                             <i
                               className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                               aria-hidden="true"
                               style={{ color: "#8174b5" }}
                             ></i>
                           </div>
                       }
                      </>
   
                     ) : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("YesUnload")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => cancelForYesUnloadTime()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.unloadtime.yes.id !==
                    null ? (
                      commodity[0].isEdit ?
                    <Button className="mt_10"

                      onClick={() => handleResetForLoadUnload("YesReset")}
                    >
                      Reset
                    </Button>:
                     <Button
                    disabled
                   >
                     Reset
                   </Button>

                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="noUnload"
                    onInput={(e) => setNoUnLoad(e.target.value)}
                    className={
                      !isEditforNoUnLoad
                        ? "after_edit_comodity"
                        : "before_edit_comodity"
                    }
                    // defaultValue={
                    //   commoditygroupById.lutformatted.unloadtime.no.unloadtime
                    // }
                    defaultValue={
                      isResetforunloadNo
                      ===""?  commoditygroupById.lutformatted.unloadtime.no.unloadtime:isResetforunloadNo

                    }
                    ref={resetRefunloadno}
                    placeholder="e.g. 30mins"
                    disabled={isEditforNoUnLoad}
                  />
                  {isEditforNoUnLoad ? (
                    <>
                  
                
                    {  
                        
                        commodity[0].isEdit ?
                          <div onClick={(e) => editforNoUnloadTime()}>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#0066ff" }}
                            ></i>
                          </div>
                          :<div>
                            <i
                              className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                              aria-hidden="true"
                              style={{ color: "#8174b5" }}
                            ></i>
                          </div>
                      }
                     </>
  
                    ) : (
                    <div className="save_button_sec">
                      <button
                        className="btn btn-primary btn-sm mr_10"
                        type="submit"
                        onClick={() => handleSaveForLoadUnLoad("NoUnload")}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => cancelForNoUnloadTime()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {commoditygroupById.lutformatted.unloadtime.no.id !== null ? (
                      commodity[0].isEdit ?
                    <Button className="mt_10"

                     onClick={() => handleResetForLoadUnload("NoReset")}>
                      Reset
                    </Button>:
                    <Button disabled>
                    Reset
                  </Button>

                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <input
          type="radio"
          name="tabs"
          id="tabtwo"
          checked={tabSelected.trailers}
          onClick={(e) => tabClickHandler(e, "Trailers")}
        /> */}
        {/* <label for="tabtwo">Trailers</label> */}
        <div className="tab">
          <div className="profile_top" style={{ "paddingLeft": "0" }}>
            <div className="profile_top_left">
              <div>
                <p className="profile_top_left_text">
                  {commoditygroupById.name}
                </p>
                <p className="profile_bottom_left_text">
                  commoditygroupById: {commoditygroupById.id}
                </p>
              </div>
            </div>
            <div className="profile_top_right">
              <div className="online_sign"></div>
            </div>
          </div>

          <div className="profile_bottom">
            <div className="profile_bottom_drescription">
              <p className="profile_bottom_drescription_heading">
                Total No Of Trailers in Group: {allTrailersDetails?.length}
              </p>
            </div>
            <div className="profile_bottom_drescription">
              <p className="profile_bottom_drescription_heading ">
                Description:
              </p>
              <p className="profile_bottom__heading_drescription df">
                {commoditygroupById.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CgByIdHeader;
