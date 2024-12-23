import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { CellRender, RowRender } from "./renderers";
import LUTRuleService from "../../services/loadunloadruleService";
import { Tooltip } from "@material-ui/core";

function CommoditygroupByIdHeader(props) {
 
  const { lutformatted } = commoditygroupById;
  let t = [];
  t.push(lutformatted);
  const [lutdata, setLutdata] = useState(t);

  const [editField, setEditField] = useState(undefined);
  const [changes, setChanges] = useState(false);

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

  const enterEdit = (dataItem, field) => {
    const newData = lutdata.map((item) => ({
      ...item,
      inEdit: item.loadtime.yes.id === dataItem.loadtime.yes.id,
    }));

    setLutdata(newData);
    setEditField(field);
  };

  const exitEdit = async () => {
    const field = editField;
    const newDataTemp = lutdata.map((item) => ({ ...item, inEdit: undefined }));
    const newData = newDataTemp.length > 0 ? newDataTemp[0] : null;
    const fields = field.split(".");
    let data = {};
    if (newData) {
      const id = newData[fields[0]][fields[1]]["id"];
      if (id === null) {
        // perform post call
        const obj = {};
        obj.id = null;
        obj.cgid = commoditygroupById.code;
        obj.actiontype = field.startsWith("unloadtime") ? "DP" : "PU";
        obj.loadflag = field.split(".")[1];
        obj.loadtime = field.startsWith("unloadtime")
          ? newData[field]
          : newData[field];
        try {
          const res = await new LUTRuleService().createLUTRule(obj);
          if (res?.length > 0) {
            let updateloadunloadtime = [];
            updateloadunloadtime.push(res[0].lutformatted);
            setLutdata(updateloadunloadtime);
            setEditField(undefined);
          }
          NotificationManager.success(
            "commoditygroup Load Time create successfully",
            "Success",
            2500
          );
        } catch (error) {
          NotificationManager.error(
            "commoditygroup Load Time craeted failed",
            "Error",
            2500
          );
        }
      } else {
        // perform put call.
        const obj = {};
        obj.id = id;
        obj.cgid = commoditygroupById.code;
        obj.actiontype = field.startsWith("unloadtime") ? "DP" : "PU";
        obj.loadflag = field.split(".")[1];
        obj.loadtime = field.startsWith("unloadtime")
          ? newData[field]
          : newData[field];
        try {
          const res = await new LUTRuleService().updateLUTRule(obj);
          if (res?.length > 0) {
            let updateloadunloadtime = [];
            updateloadunloadtime.push(res[0].lutformatted);
            setLutdata(updateloadunloadtime);
            setEditField(undefined);
          }
          NotificationManager.success(
            "commoditygroup Load Time Updated successfully",
            "Success",
            2500
          );
        } catch (error) {
          NotificationManager.error(
            "commoditygroup Load Time Update failed",
            "Error",
            2500
          );
        }
      }
    }
  };

  const itemChange = (event) => {
    let field = event.field || "";
    event.dataItem[field] = event.value;
    let newData = lutdata.map((item) => ({
      ...item,
    }));

    switch (field) {
      case "loadtime.yes.loadtime":
        newData = newData.map((item) => {
          if (
            item.loadtime.yes.loadtime === event.dataItem.loadtime.yes.loadtime
          ) {
            item.loadtime.yes.loadtime = event.value;
          }
          return item;
        });
        break;
      case "loadtime.yes.id":
        newData = newData.map((item) => {
          if (item.loadtime.yes.id === event.dataItem.loadtime.yes.id) {
            item.loadtime.yes.id = event.value;
          }
          return item;
        });
        break;
      case "loadtime.no.loadtime":
        newData = newData.map((item) => {
          if (
            item.loadtime.no.loadtime === event.dataItem.loadtime.no.loadtime
          ) {
            item.loadtime.no.loadtime = event.value;
          }
          return item;
        });
        break;
      case "loadtime.no.id":
        newData = newData.map((item) => {
          if (item.loadtime.no.id === event.dataItem.loadtime.no.id) {
            item.loadtime.no.id = event.value;
          }
          return item;
        });
        break;
      case "unloadtime.yes.loadtime":
        newData = newData.map((item) => {
          if (
            item.unloadtime.yes.loadtime ===
            event.dataItem.unloadtime.yes.loadtime
          ) {
            item.unloadtime.yes.loadtime = event.value;
          }
          return item;
        });
        break;
      case "unloadtime.yes.id":
        newData = newData.map((item) => {
          if (item.unloadtime.yes.id === event.dataItem.unloadtime.yes.id) {
            item.unloadtime.yes.id = event.value;
          }
          return item;
        });
        break;
      case "unloadtime.no.loadtime":
        newData = newData.map((item) => {
          if (
            item.unloadtime.no.loadtime ===
            event.dataItem.unloadtime.no.loadtime
          ) {
            item.unloadtime.no.loadtime = event.value;
          }
          return item;
        });
        break;
      case "unloadtime.no.id":
        newData = newData.map((item) => {
          if (item.unloadtime.no.id === event.dataItem.unloadtime.no.id) {
            item.unloadtime.no.id = event.value;
          }
          return item;
        });
        break;

      default:
        break;
    }
    setChanges(true);
  };

  const customCellRender = (td, props) => (
    <CellRender
      originalProps={props}
      td={td}
      enterEdit={enterEdit}
      editField={editField}
    />
  );
  const customRowRender = (tr, props) => (
    <RowRender
      originalProps={props}
      tr={tr}
      exitEdit={exitEdit}
      editField={editField}
    />
  );

  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          checked={tabSelected.details}
          onClick={(e) => tabClickHandler(e, "details")}
        />
        <label for="tabone">Details</label>
        <div className="tab">
          <div className="profile_top" style={{ "padding-left": "0" }}>
            <div className="profile_top_left">
              <div>
                {/* <p className="profile_top_left_text">
                  {commoditygroupById.name}
                </p> */}
                <p className="profile_top_left_text1">
                  Commodity Group Code  : {commoditygroupById.code}
                </p>
              </div>
            </div>
            <div className="profile_top_right">
              <Tooltip title={commoditygroupById.isActive ? "Active" : "Inactive"}>
                <div
                  className="online_sign"
                  style={
                    commoditygroupById.isActive
                      ? {}
                      : { backgroundColor: "#d3e3d7" }
                  }
                ></div>
              </Tooltip>
            </div>
          </div>
          <>
            <Grid
              data={lutdata ? lutdata : data}
              onItemChange={itemChange}
              cellRender={customCellRender}
              rowRender={customRowRender}
              editField={editField}
              // editField="inEdit"
              reorderable={true}
            >
              <Column>
                <Column title="Load Time">
                  <Column
                    field="loadtime.yes.loadtime"
                    title="Yes"
                    editor="numeric"
                  />
                  <Column
                    field="loadtime.no.loadtime"
                    title="No"
                    editor="numeric"
                  />
                  <Column
                    field="loadtime.tl.loadtime"
                    title="Tl"
                    editor="numeric"
                  />
                  <Column
                    field="loadtime.nb.loadtime"
                    title="NB"
                    editor="numeric"
                  />
                </Column>
              </Column>
              <Column>
                <Column title="Unload Time">
                  <Column
                    field="unloadtime.yes.unloadtime"
                    title="Yes"
                    editor="numeric"
                  />
                  <Column
                    field="unloadtime.no.unloadtime"
                    title="No"
                    editor="numeric"
                  />
                </Column>
              </Column>

            </Grid>
          </>

        </div>
        <NotificationContainer />
        <input
          type="radio"
          name="tabs"
          id="tabtwo"
          checked={tabSelected.trailers}
          onClick={(e) => tabClickHandler(e, "Trailers")}
        />
        <label for="tabtwo">Trailers</label>
        <div className="tab">
          <div className="profile_top" style={{ "padding-left": "0" }}>
            <div className="profile_top_left">
              <div>
                <p className="profile_top_left_text">
                  {commoditygroupById.name}
                </p>
                <p className="profile_top_left_text">
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
            {/* <div className="profile_bottom_drescription">
              <p className="profile_bottom_drescription_heading ">
                Description:
              </p>
              <p className="profile_bottom__heading_drescription df">
                {commoditygroupById.description}
              </p>
            </div> */}
          </div>
        </div>
      </div>

    </div>
  );
}

export default CommoditygroupByIdHeader;
