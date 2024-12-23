import React, { useState, useEffect, useContext } from 'react';
import Modal from "react-bootstrap/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { DateTime } from "luxon";
import Button from "react-bootstrap/Button";
import TerminalService from "../../services/terminalService";
import { Autocomplete, TreeView, TreeItem } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UserService from "../../services/userService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { ContextData } from "../../components/appsession";
//import PlanningProfileList from "../planningProfileList/planningProfileList";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const PlanningProfileList = (props) => {
  const user = props.user;
  const updateUser = props.updateUser;

  const planningdata = useContext(ContextData);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [allTerminal, setAllTerminal] = useState([]);
  const [terminal_id, setTerminal_id] = useState()
  const [planningDataCg, setPlanningDataCg] = useState([])
  const [planningDataShippers, setPlanningDataShippers] = useState([])
  const [planningProfile, setPlanningProfile] = useState([]);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [planningprofileName, setPlanningprofileName] = useState();
  const [selectedShippers, setSelectedShippers] = useState([]);
  const [editplannigdata, setPlanningdata] = useState([]);

  console.log('planningDataCg', planningDataCg);
  const useViewStyles = makeStyles({
    root: {}
  });
  const useItemStyles = makeStyles(theme => ({
    root: {
      "& > .MuiTreeItem-content > .MuiTreeItem-label": {
        display: "flex",
        alignItems: "center",
        padding: "4px 0",
        background: "transparent !important",
        pointerEvents: "none"
      },
      "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
        content: "''",
        display: "inline-block",
        width: 12,
        height: 12,
        marginRight: 8,
        border: "1px solid #ccc",
        background: "white"
      }
    },
    iconContainer: {
      marginRight: 12,
      "& > svg": {
        padding: 8,
        "&:hover": {
          opacity: 0.6
        }
      }
    },
    label: {
      padding: 0
    },
    selected: {
      "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
        background: theme.palette.primary.main,
        border: "1px solid transparent"
      }
    }
  }));
  const classesView = useViewStyles();
  const classesItem = useItemStyles();

  useEffect(() => {
    const terminal = new TerminalService();
    terminal.getAllTerminals().then(res => setAllTerminal(res))
    const allPlannerProfiles = new UserService();
    allPlannerProfiles.getAllPlanningProfiles().then(res => setPlanningProfile(res));
  }, [])

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [dataResult, setDataResult] = useState(process(planningProfile, dataState));
  const dataStateChange = (event) => {
    setDataResult(process(planningProfile, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(planningProfile, dataState));
  }, [planningProfile]);

  const created_atplanningtable = (props) => {
    let date = Date.parse(props.dataItem.created_at)

    if (isNaN(date)) {
      return (
        <td>      { }
        </td>)
    }
    else {
      return (
        <td>      {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy,hh:mm a").toString()}
        </td>)
    }

  }

  const handleProfileNameChange = (event) => {
    setPlanningprofileName(event.target.value);
  }

  const handleChange = async (e, value) => {
    setTerminal_id(value.code);
    const userService = new UserService();
    const response = await userService.planningProfileByTerminalId(value.code)
    const commodity_groups = response.data.data.commodity_groups;
    const shippers = response.data.data.shippers.slice(0, 100);
    setPlanningDataCg(commodity_groups);
    setPlanningDataShippers(shippers);
    setModalOpen(true)


  }

  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    console.log({ event }, { nodeIds })
    if (event.target.nodeName === "svg") {
      return;
    }
    const selectedNode = nodeIds[0];
    if (selectedNode.includes("shippercg_")) {
      let node_split = selectedNode.split("_");
      let parent_node = node_split[1];
      let selected_cg = node_split[2];
      let shipper_array = selectedShippers;
      let index = shipper_array.findIndex(x => x.name === parent_node);
      if (index !== -1) {
        shipper_array[index].commodity_groups.push(selected_cg);
      }
      else {
        let shipperObject = {
          "name": parent_node,
          "commodity_groups": [selected_cg]
        }
        shipper_array.push(shipperObject)
      }
      setSelectedShippers(shipper_array)
    }
    if (selected.includes(selectedNode)) {
      if (selectedNode.includes("shippercg_")) {
        let node_split = selectedNode.split("_");
        let parent_node = node_split[1];
        let selected_cg = node_split[2];
        let shipper_array = selectedShippers;
        let index = shipper_array.findIndex(x => x.name == parent_node);
        if (index !== -1) {
          shipper_array[index].commodity_groups = shipper_array[index].commodity_groups.filter(cg => cg !== selected_cg);
        }
        setSelectedShippers(shipper_array)
      }
      setSelected(selected.filter(id => id !== selectedNode));
    } else {
      setSelected([selectedNode, ...selected]);
    }
  }

  const updatePlanningProfile = async () => {

    if (!planningprofileName) {
      NotificationManager.error("Enter Planning Profile Name", "Error");
    }
    else {
      let cg_to_save = selected.filter(x => x.includes("cgel_"));
      cg_to_save = cg_to_save.map(x => x.replace("cgel_", ""));
      if ((cg_to_save.length == 0) && (selectedShippers.length == 0)) {
        NotificationManager.error("Select the access profile before saving", "Error");
      }
      else {
        let planningprofile_json = {
          "terminal_id": terminal_id,
          "commodity_groups": cg_to_save,
          "shippers": selectedShippers
        }
        let request_data = {
          "id": editplannigdata[0].id,
          "name": planningprofileName,
          "terminal_id": terminal_id,
          "planningprofile_json": JSON.stringify(planningprofile_json),
          "created_by": planningdata.userId
        }
        const userService = new UserService();
        let response = await userService.updateplanningprofile(request_data);
        console.log("responseafetrsave", response)
        if (response.data.data[0]) {
          // setPlanningProfile(refreshkendotable)
          setOpenConfirmationModal(false);
          NotificationManager.success("Planning profile updated successfully", "success");
          const allPlannerProfiles = new UserService();
          allPlannerProfiles.getAllPlanningProfiles().then(res => setPlanningProfile(res));
          console.log("hellllll")

          setPlanningDataCg([]);
          setPlanningDataShippers([]);
          setPlanningprofileName([]);
          setExpanded([]);
          setSelected([]);

        }


      }
    }
  }

  const EditPlanningprofile = (props) => {
    return (
      <td className="adjustbutton">
        <button
          type="button"
          class="btn_blue_smadjust btn-blue ml_10"
          onClick={() => editplanningprofile(props.dataItem)}
        >
          <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>
          EDIT
        </button>
      </td>
    );
  };

  const editplanningprofile = async (data) => {

    const userService = new UserService();
    const getresponse = await userService.getplanningprofilebyid(data.id);

    setPlanningprofileName(getresponse[0].name)

    const planningjs = JSON.parse(getresponse[0].planningprofile_json);
    const selectedcommodity = planningjs.commodity_groups.map((e) => `cgel_${e}`)
    const selectedshipper = planningjs.shippers.map((e) => e.commodity_groups.map((p) => `shipper_${e.name}_${p}`))
    const selectedshippercg = planningjs.shippers.map((e) => e.commodity_groups.map((p) => `shippercg_${e.name}_${p}`))
    const childlevelselectedshipper = planningjs.shippers.map((e) => `shipperel_${e.name}`)
    const allselectedshipper = []

    for (let i = 0; i < selectedshippercg.length; i++) {
      for (let j = 0; j < selectedshippercg[i].length; j++) {
        allselectedshipper.push(selectedshippercg[i][j])
      }
    }

    for (let p = 0; p < childlevelselectedshipper.length; p++) {
      allselectedshipper.push(childlevelselectedshipper[p])
    }
    for (let i = 0; i < selectedshipper.length; i++) {
      allselectedshipper.push("shipper_top", "shipper_cg_top")
      for (let j = 0; j < selectedshipper[i].length; j++) {
        allselectedshipper.push(selectedshipper[i][j])
      }
    }
    console.log("allselectedshipper", allselectedshipper)

    console.log("plan", planningjs);
    console.log("seletedshipper", selectedshipper);

    setSelected([...selectedcommodity, ...allselectedshipper]);

    setPlanningdata(getresponse);
    const response = await userService.planningProfileByTerminalId(data.terminal_id)
    const commodity_groups = response.data.data.commodity_groups;
    const shippers = response.data.data.shippers.slice(0, 100);
    setPlanningDataCg(commodity_groups);
    setPlanningDataShippers(shippers);


    setOpenConfirmationModal(true);
  };
  console.log("new", selected);

  const Editplanningprofile = (props) => (
    <EditPlanningprofile
      {...props}
      editplanningprofile={(e) => editplanningprofile(e)}
    />
  );
  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="table-responsive">
                {
                  planningProfile && planningProfile?.length > 0 ? (
                    <React.Fragment>
                      <Grid
                        filter={dataState.filter}
                        sort={dataState.sort}
                        sortable={true}
                        filterable={true}
                        pageable={{
                          pageSizes: [5, 10, 20, 25, 50, 100],
                          info: true,
                          previousNext: true,
                          buttonCount: 10
                        }}
                        resizable={true}
                        skip={dataState.skip}
                        take={dataState.take}
                        data={dataResult && dataResult}
                        onDataStateChange={dataStateChange}
                      >
                        <GridColumn
                          title="Action" cell={Editplanningprofile}
                        />
                        <GridColumn
                          field="name"
                          title="Name" />
                        <GridColumn
                          field="terminal.terminal"
                          title="Terminal Id" />
                        <GridColumn
                          field="created_at"
                          title="Created At"
                          cell={created_atplanningtable}
                        />
                     
                        <GridColumn
                    field="is_default_planner"
                    sortable={true}
                    cell={(e) => {
                      return (
                        <td>                      
                          <FormControlLabel 
                          control=
                          {
                          <Checkbox color="black" checked={e.dataItem.is_default_planner ? true : false}  />
                          
                        
                        }

                          labelPlacement="start" />
                        </td>
                      );
                    }}
                    title="Default planning profile"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                  />

                     
                      </Grid>
                    </React.Fragment>
                  )
                    : "NO Data"
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={openConfirmationModal}
        onHide={() => setOpenConfirmationModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Planning profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="planning_profile_popup_continue">
            <button
              type="button"
              className="btn_blue btn-blue ml_10" onClick={updatePlanningProfile} >
              Save
            </button>
          </div>

          <label for="exampleFormControlInput1">Terminal</label>
          <div className="meterial_autocomplete">
            <Autocomplete
              disablePortals
              id="terminals"
              options={allTerminal}
              defaultValue={{ full_terminal_name: editplannigdata[0]?.terminal?.terminal }}
              getOptionLabel={(options) => `${options.full_terminal_name}`}
              sx={{ width: 300 }}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} variant="outlined"
                fullWidht={true} placeholder="Select a Terminal" />}
            />
          </div>
          {/* <div className="planning_profile_popup_continue">
                        <Button onClick={() => populateAccessTree(terminal_id)}>Continue</Button>
                    </div> */}


          <label for="exampleFormControlInput1">Planning Profile Name</label>

          <div className="planning_profile_popup_textbox">
            <div className="meterial_autocomplete">
              <TextField id="outlined-basic"
                placeholder="Enter Planning Profile Name"
                variant="outlined"
                defaultValue={editplannigdata[0]?.name}
                value={planningprofileName}
                onChange={handleProfileNameChange}
              />
            </div>
          </div>



          <div className="plnning_treeview_section">
            <TreeView
              classes={classesView}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expanded}
              selected={selected}
              onNodeToggle={handleToggle}
              onNodeSelect={handleSelect}
              multiSelect
            >
              {planningDataCg && planningDataCg.length > 0 &&
                <>
                  <TreeItem classes={classesItem} id="cg_top" nodeId="cg_top" label="Commodity Groups">
                    {planningDataCg.map((data, i) => (
                      <TreeItem classes={classesItem} key={data.code} id={data.code} nodeId={"cgel_" + data.code} label={data.description} />
                    ))}
                  </TreeItem>
                </>
              }
              {planningDataShippers && planningDataShippers.length > 0 &&
                <>
                  <TreeItem classes={classesItem} nodeId="shipper_top" label="Shippers">
                    {planningDataShippers.map((data, index) => (
                      <TreeItem classes={classesItem} key={data.company_location_id} id={data.company_location_id} nodeId={"shipperel_" + data.company_location_id} label={data.location_name} >
                        <TreeItem classes={classesItem} key={data.company_location_id} id={data.company_location_id} nodeId="shipper_cg_top" label="Commodity Groups">
                          {planningDataCg.map((cg_data, i) => (
                            <TreeItem classes={classesItem} key={cg_data.code} id={cg_data.code} nodeId={"shippercg_" + data.company_location_id + "_" + cg_data.code} label={cg_data.description} />
                          ))}
                        </TreeItem>
                      </TreeItem>
                    ))}
                  </TreeItem>
                </>
              }
            </TreeView>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default PlanningProfileList;