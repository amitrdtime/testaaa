import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Typeahead } from "react-bootstrap-typeahead";
import YardService from "../../services/yardService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import ProgressBar from "react-bootstrap/ProgressBar";
import { process } from "@progress/kendo-data-query";
import { ContextData } from "../../components/appsession";
import TerminalService from "../../services/terminalService";
import { DateTime } from "luxon";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { makeStyles } from "@material-ui/core/styles";
import Yard from "../../assets/images/users/Terminals_Icon.png";
import { Autocomplete } from "@material-ui/lab";
import { MenuItem, TextField } from "@material-ui/core";
const YardCheckTable = (props) => {
  const { notifyParentCount, accessDisabled, filteredTerminal } = props;
  const [userData, setuserData] = useContext(ContextData);
  const [modalShow, setModalShow] = useState(false);
  const [addDataForModal, setaddDataForModal] = useState({});
  const [isExtraInfoAvailable, setisExtraInfoAvailable] = useState({});
  const [terminaldropdown, setterminaldropdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yardCheckList, setyardCheckList] = useState([]);
  const [yardCheckListData, setyardCheckListData] = useState([]);

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [
        {
          field: "isActive",
          operator: "eq",
          value: true,
        },
      ],
    },
    sort: [],
  });

  const [dataResult, setDataResult] = useState(
    process(yardCheckListData, dataState)
  );

  const dataStateChange = (event) => {
    setDataResult(process(yardCheckListData, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(yardCheckListData, dataState));
  }, [yardCheckListData]);

  const gridWidth = 1800;

  const setPercentage = (percentage) => {
    return Math.round(gridWidth / 100) * percentage;
  };

  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      marginTop: "10px",
      fontWeight: "bold",
      fontSize: 15,
    },
  }));
  const classes = useStyles();

  useEffect(async () => {
    const userTerminalIds = await userData.terminals;
    if (userTerminalIds?.length > 0) {
      const terminalService = new TerminalService();
      let terminalInformation = await terminalService.getTerminalByIds(
        userTerminalIds
      );
      if (terminalInformation.length > 0) {
        let terminalDetails = [];
        let AccessTerminals = [];
        terminalInformation.forEach((element) => {
          let obj = {
            terminalName: element.code.trim() + " - " + element.city.trim(),
            terminalId: element.code,
          };
          terminalDetails.push(obj);
          AccessTerminals.push(element.code);
        });
        setterminaldropdown(terminalDetails);
      }
    }
  }, [userData]);

  useEffect(async () => {
    if (terminaldropdown.length > 0) {
      const yardService = new YardService();
      let AccessTerminals = [];
      terminaldropdown.forEach((element) => {
        AccessTerminals.push(element.terminalId);
      });
      let yardCheckList = await yardService.getbyyards(AccessTerminals);

      for (let i = 0; i < yardCheckList.length; i++) {
        yardCheckList[i].startTsFilter = DateTime.fromMillis(
          parseInt(yardCheckList[i].startTs)
        )
          .toLocal()
          .startOf("day")
          .toJSDate();
        yardCheckList[i].endTsFilter = DateTime.fromMillis(
          parseInt(yardCheckList[i].endTs)
        )
          .toLocal()
          .startOf("day")
          .toJSDate();
        if (yardCheckList[i].status === "open") {
          yardCheckList[i].status = "In Progress";
        } else {
          yardCheckList[i].status = "Completed";
        }
      }
      setyardCheckList(yardCheckList);
      console.log("called1")
      setyardCheckListData(yardCheckList);
      setLoading(false);
    }
  }, [terminaldropdown]);

  useEffect(() => {
    let yardCheckData = [...yardCheckList];
    const tempArray = [];
    if (filteredTerminal.length > 0) {
      yardCheckData.map((el) => {
        if (filteredTerminal.indexOf(el.terminalid) > -1) {
          tempArray.push(el);
        }
      });
      console.log("called2")

      setyardCheckListData(tempArray);

    } else {
      setyardCheckListData(yardCheckList);
      console.log("called3")

    }
    props.parentYardLength(yardCheckListData.length);
  }, [filteredTerminal, yardCheckListData.length]);

  const userClickHandler = (e, terminal) => {
    props.parentcallback(true, terminal);
  };
  const YardChangeHandler = (e, value) => {
    if (value) {
      setaddDataForModal((item) => ({
        ...item,
        terminalid: value.terminalId,
        startts: DateTime.now().toMillis(),
        endts: null,
        username: userData.userName,
      }));
    }
  };

  const addData = async () => {
    try {
      setLoading(true);
      
      const yardService = new YardService();
  await yardService.addYard(addDataForModal);

      let AccessTerminals = [];
      terminaldropdown.forEach((element) => {
        AccessTerminals.push(element.terminalId);
      });

      let yardCheckList = await yardService.getbyyards(AccessTerminals);
      for (let i = 0; i < yardCheckList.length; i++) {
        yardCheckList[i].startTsFilter = DateTime.fromMillis(
          parseInt(yardCheckList[i].startTs)
        )
          .toLocal()
          .startOf("day")
          .toJSDate();
        yardCheckList[i].endTsFilter = DateTime.fromMillis(
          parseInt(yardCheckList[i].endTs)
        )
          .toLocal()
          .startOf("day")
          .toJSDate();
        if (yardCheckList[i].status === "open") {
          yardCheckList[i].status = "In Progress";
        } else {
          yardCheckList[i].status = "Completed";
        }
      }
      console.log("afteradd",yardCheckList)
     
      setyardCheckList(yardCheckList);
      console.log("called4")

      //setLoading(false);
      notifyParentCount(yardCheckList.length);
      setModalShow(false);
      return (
        NotificationManager.success("Yard Check Created", "Success")

      )
     
    } catch (error) {
      NotificationManager.error("Adding Yard Check Failed", "Error");
    }
  };

  const onMouseOverHandler = (terminal) => {
    setisExtraInfoAvailable({
      id: terminal.id,
    });
  };

  return (
    <>
      <NotificationContainer />
      <div className="row">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="yardadd_button">
                <button
                  type="button"
                  class="btn_blue btn-blue "
                  onClick={() => setModalShow(true)}
                  disabled={accessDisabled ? true : false}
                  style={{ background: accessDisabled ? "#dddddd" : "" }}
                >
                  ADD
                </button>
              </div>
              <div className="table-responsive">
                <div>
                  <h2 className="header-title1">
                    Yard Checks:{" "}
                    {props.currentTerminalCount == 0
                      ? props.yardCheckLength
                      : props.currentTerminalCount}
                  </h2>
                </div>
                <div className="addbutton">
               
                  {yardCheckListData?.length > 0 ? (
                    <Grid
                      style={{
                        width: gridWidth,
                      }}
                      filter={dataState.filter}
                      filterable={true}
                      sort={dataState.sort}
                      sortable={true}
                      pageable={{
                        pageSizes: [5, 10, 20, 25, 50, 100],
                        pageSize: dataState.pageSize,
                        info: true,
                        previousNext: true,
                      }}
                      resizable={true}
                      skip={dataState.skip}
                      take={dataState.take}
                      data={dataResult}
                      onDataStateChange={dataStateChange}
                      onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                    >
                      <GridColumn
                        field="terminal_name"
                        title="Checklist"
                        width={setPercentage(10)}
                        cell={(e) => {
                          return (
                            <td style={{}} className="no-border yardchkres11">
                              <div className="active_outer">
                                <img
                                  src={Yard}
                                  alt="contact-img"
                                  title="contact-img"
                                  className="rounded-circle avatar-sm"
                                />
                                <div
                                  className={
                                    e.dataItem?.status == "In Progress"
                                      ? "inactive_sign"
                                      : "active_sign"
                                  }
                                ></div>
                              </div>
                            </td>
                          );
                        }}
                        filterable={false}
                      />
                      <GridColumn
                        field="terminal_name"
                        title="Terminal"
                        width={setPercentage(15)}
                        cell={(e) => {
                          return (
                            <td className="textadjust">
                              {window.innerHeight > window.innerWidth
                                ? "Terminal - "
                                : ""}
                              {e.dataItem.terminal_name
                                ? e.dataItem.terminal_name
                                : ""}
                            </td>
                          );
                        }}
                      />
                      <GridColumn
                        field="region"
                        title="Region"
                        width={setPercentage(10)}
                        cell={(e) => {
                          return (
                            <td className="textadjust">
                              {window.innerHeight > window.innerWidth
                                ? "Region - "
                                : ""}
                              {e.dataItem.region
                                ? e.dataItem.region
                                : ""}
                            </td>
                          );
                        }}
                      />
                      <GridColumn
                        field="username"
                        title="Performed By"
                        width={setPercentage(20)}
                        cell={(e) => {
                          return (
                            <td className="textadjust">
                              {window.innerHeight > window.innerWidth
                                ? "Performed By - "
                                : ""}
                              {e.dataItem.username
                                ? e.dataItem.username
                                : ""}
                            </td>
                          );
                        }}
                      />
                      <GridColumn
                        field="startTsFilter"
                        title="Created On"
                        filter={"date"}
                        format="{0:d},{0:t}"
                        width={setPercentage(15)}
                        cell={(e) => {
                          return (
                            <td className="textadjust">
                              {window.innerHeight > window.innerWidth
                                ? "Created On - "
                                : ""}
                              {DateTime.fromMillis(parseInt(e.dataItem.startTs))
                                .toFormat("MM-dd-yyyy , HH:mm")
                                .toString()}
                            </td>
                          );
                        }}
                      />
                      <GridColumn
                        field="endTsFilter"
                        title="Completed On"
                        filter={"date"}
                        format="{0:d},{0:t}"
                        width={setPercentage(15)}
                        cell={(e) => {
                          return (
                            <td className="textadjust">
                              {window.innerHeight > window.innerWidth
                                ? "Completed On - "
                                : ""}
                              {e.dataItem.endTs === null
                                ? ""
                                : DateTime.fromMillis(
                                    parseInt(e.dataItem?.endTs)
                                  )
                                    .toFormat("MM-dd-yyyy , t")
                                    .toString()}
                            </td>
                          );
                        }}
                      />
                      <GridColumn
                        field="status"
                        cell={(e) => {
                          return (
                            <td
                              className={classes.statuscolor}
                              style={{
                                color:
                                  e.dataItem.status === "In Progress"
                                    ? "#FFA500"
                                    : "#22bd4e",
                              }}
                            >
                              {window.innerHeight > window.innerWidth
                                ? "Status - "
                                : ""}
                              {e.dataItem.status}
                            </td>
                          );
                        }}
                        title="Status"
                        width={setPercentage(10)}
                        filterable={true}
                      />
                    </Grid>
                  ) : loading ? (
                    <div>
                      <ProgressBar animated now={100} />
                      <div className="middle loader--text1"> </div>
                    </div>
                  ) : (
                    <div>No data found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              SELECT TERMINAL
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div class="form-group">
              <Typeahead
                id="typeHeadCommodityGroup"
                labelKey={"terminalName"}
                onChange={YardChangeHandler}
                options={terminaldropdown}
                placeholder="Choose a Terminal..."
                clearButton
              />
            </div> */}
            <Autocomplete
              id="combo-box-demo"
              options={terminaldropdown}
              getOptionLabel={(option) => `${option.terminalName}`}
              onChange={YardChangeHandler}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Choose a Terminal Name..."
                  variant="outlined"
                />
              )}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setModalShow(false)}>Close</Button>
            <Button
              type="submit"
              onClick={(e) => addData()}
              disabled={terminaldropdown.length > 0 ? false : true}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default YardCheckTable;
