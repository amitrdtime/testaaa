import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import LUTRuleService from "../services/loadunloadruleService";

const ModalInput = ({ commodityObj, commoditygroup, setModalShow,callbackAftersave }) => {
  // This state for Load Time
  const [yes, setYes] = useState(
    commodityObj.lutformatted.loadtime.yes.loadtime
  );
  const [no, setNo] = useState(commodityObj.lutformatted.loadtime.no.loadtime);
  const [tl, setTl] = useState(commodityObj.lutformatted.loadtime.tl.loadtime);
  const [nb, setNb] = useState(commodityObj.lutformatted.loadtime.nb.loadtime);
  //  This state for Unload Time
  const [yesUnLoad, setYesUnLoad] = useState(
    commodityObj.lutformatted.unloadtime.yes.unloadtime
  );
  const [noUnLoad, setNoUnLoad] = useState(
    commodityObj.lutformatted.unloadtime.no.unloadtime
  );

  // This IsEdit state for Load Time
  const [isEditforYes, setIsEditforYes] = useState(true);
  const [isEditforNo, setIsEditforNo] = useState(true);
  const [isEditforTl, setIsEditforTl] = useState(true);
  const [isEditforNB, setIsEditforNB] = useState(true);

  // This IsEdit state for Unload Time
  const [isEditforYesUnLoad, setIsEditforYesUnLoad] = useState(true);
  const [isEditforNoUnLoad, setIsEditforNoUnLoad] = useState(true);

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
        try {
          var id = commodityObj.lutformatted.loadtime.yes.id;
          var payload = {
            id: id,
          };
          const locationServiceyes1 = new LUTRuleService();
          const data1 = await locationServiceyes1.deleteLUTRule(payload);
          callbackAftersave();
          if (data1.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "No":
        try {
          var id = commodityObj.lutformatted.loadtime.no.id;
          var payload = {
            id: id,
          };
          const locationService2 = new LUTRuleService();
          const data2 = await locationService2.deleteLUTRule(payload);
          callbackAftersave();
          if (data2.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "NB":
        try {
          var id = commodityObj.lutformatted.loadtime.nb.id;
          var payload = {
            id: id,
          };
          const locationService3 = new LUTRuleService();
          const data3 = await locationService3.deleteLUTRule(payload);
          callbackAftersave();
          if (data3.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "TL":
        try {
          var id = commodityObj.lutformatted.loadtime.tl.id;
          var payload = {
            id: id,
          };
          const locationService4 = new LUTRuleService();
          const data4 = await locationService4.deleteLUTRule(payload);
          callbackAftersave();
          if (data4.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "YesReset":
        try {
          var id = commodityObj.lutformatted.unloadtime.yes.id;
          var payload = {
            id: id,
          };
          const locationServiceyes5 = new LUTRuleService();
          const data5 = await locationServiceyes5.deleteLUTRule(payload);
          callbackAftersave();
          if (data5.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "NoReset":
        try {
          var id = commodityObj.lutformatted.unloadtime.no.id;
          var payload = {
            id: id,
          };
          const locationService6 = new LUTRuleService();
          const data6 = await locationService6.deleteLUTRule(payload);
          callbackAftersave();
          if (data6.length > 0) {
            setModalShow(false);
            //window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    } 
  };

  const handleSaveForLoadUnLoad = async (saveName) => {
    switch (saveName) {
      case "Yes":
        if (commodityObj.lutformatted.loadtime.yes.id === null) {
          try {
            var payload = {
              actiontype: "PU",
              loadflag: "Yes",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: yes,
            };
            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.loadtime.yes.id;
            var payload = {
              id: id,
              actiontype: "PU",
              loadflag: "Yes",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: yes,
            };
            
            const locationServiceyes = new LUTRuleService();
            const data = await locationServiceyes.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case "No":
        setNo(no);
        if (commodityObj.lutformatted.loadtime.no.id === null) {
          try {
            var payload = {
              actiontype: "PU",
              loadflag: "No",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: no,
            };
            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.loadtime.no.id;
            var payload = {
              id: id,
              actiontype: "PU",
              loadflag: "No",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: no,
            };
            
            const locationServiceyes = new LUTRuleService();
            const data = await locationServiceyes.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case "NB":
        setNb(nb);
        if (commodityObj.lutformatted.loadtime.nb.id === null) {
          try {
            var payload = {
              actiontype: "PU",
              loadflag: "NB",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: nb,
            };
            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.loadtime.nb.id;
            var payload = {
              id: id,
              actiontype: "PU",
              loadflag: "NB",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: nb,
            };
            
            const locationServiceyes = new LUTRuleService();
            const data = await locationServiceyes.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case "TL":
        setTl(tl);
        if (commodityObj.lutformatted.loadtime.tl.id === null) {
          try {
            var payload = {
              actiontype: "PU",
              loadflag: "TL",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: tl,
            };
            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.loadtime.tl.id;
            var payload = {
              id: id,
              actiontype: "PU",
              loadflag: "TL",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              loadtime: tl,
            };
            
            const locationService = new LUTRuleService();
            const data = await locationService.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case "YesUnload":
        setYesUnLoad(yesUnLoad);
        if (commodityObj.lutformatted.unloadtime.yes.id === null) {
          try {
            var payload = {
              actiontype: "DP",
              loadflag: "Yes",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              unloadtime: yesUnLoad,
            };

            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.unloadtime.yes.id;
            var payload = {
              id: id,
              actiontype: "DP",
              loadflag: "Yes",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              unloadtime: yesUnLoad,
            };

            
            const locationService = new LUTRuleService();
            const data = await locationService.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case "NoUnload":
        setNoUnLoad(noUnLoad);
        if (commodityObj.lutformatted.unloadtime.no.id === null) {
          try {
            var payload = {
              actiontype: "DP",
              loadflag: "No",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              unloadtime: noUnLoad,
            };

            
            const lutServices = new LUTRuleService();
            const data = await lutServices.createLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            var id = commodityObj.lutformatted.unloadtime.no.id;
            var payload = {
              id: id,
              actiontype: "DP",
              loadflag: "No",
              commodityid: commodityObj.id,
              cgid: commoditygroup.code,
              unloadtime: noUnLoad,
            };

            
            const locationServiceyes = new LUTRuleService();
            const data = await locationServiceyes.updateLUTRule(payload);
            callbackAftersave();
            if (data.length > 0) {
              setModalShow(false);
              //window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
      default:
        break;
    }
  };

  return (
    <div className="row df">
      <table className="table table-borderless table-centered m-0 special_fonts bg-light commodity_override">
        <thead className="table-light">
          <h5
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#212529",
            }}
          >
            {commodityObj.code}
          </h5>
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
                  !isEditforYes ? "after_edit_comodity" : "before_edit_comodity"
                }
                value={yes}
                placeholder="e.g. 30mins"
                disabled={isEditforYes}
              />
              {isEditforYes ? (
                <div onClick={(e) => editInfoHandler()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
              ) : (
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
              {commodityObj.lutformatted.loadtime.yes.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("Yes")}>
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
                  !isEditforNo ? "after_edit_comodity" : "before_edit_comodity"
                }
                defaultValue={commodityObj.lutformatted.loadtime.no.loadtime}
                placeholder="e.g. 30mins"
                disabled={isEditforNo}
              />
              {isEditforNo ? (
                <div onClick={(e) => editforNo()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
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
              {commodityObj.lutformatted.loadtime.no.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("No")}>
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
                  !isEditforTl ? "after_edit_comodity" : "before_edit_comodity"
                }
                defaultValue={commodityObj.lutformatted.loadtime.tl.loadtime}
                placeholder="e.g. 30mins"
                disabled={isEditforTl}
              />
              {isEditforTl ? (
                <div onClick={(e) => editforTl()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
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
              {commodityObj.lutformatted.loadtime.tl.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("TL")}>
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
                  !isEditforNB ? "after_edit_comodity" : "before_edit_comodity"
                }
                defaultValue={commodityObj.lutformatted.loadtime.nb.loadtime}
                placeholder="e.g. 30mins"
                disabled={isEditforNB}
              />
              {isEditforNB ? (
                <div onClick={(e) => editforNB()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
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
              {commodityObj.lutformatted.loadtime.nb.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("NB")}>
                  Reset
                </Button>
              ) : (
                ""
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-borderless table-centered special_fonts bg-light commodity_override mt_10">
        <thead className="table-light">
          <tr className="commodity_override_deep">
            <th colSpan={3}>Unload Time</th>
          </tr>
          <tr>
            <th>
              Yes
            </th>
            <th>
              No
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
                defaultValue={
                  commodityObj.lutformatted.unloadtime.yes.unloadtime
                }
                placeholder="e.g. 30mins"
                disabled={isEditforYesUnLoad}
              />
              {isEditforYesUnLoad ? (
                <div onClick={() => editforYesUnloadTime()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
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
              {commodityObj.lutformatted.unloadtime.yes.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("YesReset")}>
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
                defaultValue={
                  commodityObj.lutformatted.unloadtime.no.unloadtime
                }
                placeholder="e.g. 30mins"
                disabled={isEditforNoUnLoad}
              />
              {isEditforNoUnLoad ? (
                <div onClick={() => editforNoUnloadTime()}>
                  <i
                    className="fa fa-pencil-square edit_icon_blue_sec_commodity"
                    aria-hidden="true"
                    style={{ color: "#0066ff" }}
                  ></i>
                </div>
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
              {commodityObj.lutformatted.unloadtime.no.id !== null ? (
                <Button onClick={() => handleResetForLoadUnload("NoReset")}>
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
  );
};

export default ModalInput;
