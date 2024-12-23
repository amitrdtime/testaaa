import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import TextField from "@material-ui/core/TextField";
import TerminalService from "../../services/terminalService";
import { Autocomplete, TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UserService from "../../services/userService";
import PlanningProfileList from "../planningProfileList/planningProfileList";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import { ContextData } from "../../components/appsession";

const PlanningProfile = () => {
  const [userData, setUserData] = useContext(ContextData);
  const planningdata = useContext(ContextData);
    const [modalOpen, setModalOpen] = useState(false)
    const [allTerminal, setAllTerminal] = useState([])
    const [terminal_id, setTerminal_id] = useState()
    const [planningDataCg, setPlanningDataCg] = useState([])
    const [planningDataShippers, setPlanningDataShippers] = useState([])
    const [planningProfile, setPlanningProfile] = useState([]);
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [planningprofileName, setPlanningprofileName] = useState();
    const [selectedShippers, setSelectedShippers] = useState([]);
    const [tablerefreshdata, settablerefreshdata] = useState([])
    const [defaultPlanerChecked, setdefaultPlanerChecked] = useState(false)
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

    const handleProfileNameChange = (event) => {
        setPlanningprofileName(event.target.value);
    }
	const handledefaultplanner =(event)=>{
		setdefaultPlanerChecked(event.target.checked);
	}
    const handleChange =async (e, value) => {
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
    const savePlanningProfile = async () => {

        if (!planningprofileName) {
            NotificationManager.error("Enter Planning Profile Name", "Error");
        }
        else {
            let cg_to_save = selected.filter(x => x.includes("cgel_"));
            cg_to_save = cg_to_save.map(x => x.replace("cgel_", ""));
            let planningprofile_json = {
                "terminal_id": terminal_id,
                "commodity_groups": cg_to_save,
                "shippers": selectedShippers
            }
            let request_data = {
                "name": planningprofileName,
                "terminal_id": terminal_id,
                "planningprofile_json": JSON.stringify(planningprofile_json),
                "created_by": planningdata.userId,
				"is_default_planner":defaultPlanerChecked
            }
            const userService = new UserService();
            let response = await userService.createPlanningProfile(request_data);
            if (response.data.data.id) {
                setModalOpen(false);
                NotificationManager.success("Planning profile Added successfully", "success");
                const allPlannerProfiles = new UserService();
                allPlannerProfiles.getAllPlanningProfiles().then(res => setPlanningProfile(res));              
                setPlanningDataCg([]);
                setPlanningDataShippers([]); 
                setPlanningprofileName([]);
                setExpanded([]);
                setSelected([]);

            }
        }
    }
    const openAddModal=()=>{setModalOpen(true); setPlanningDataCg([]);setPlanningDataShippers([]); setPlanningprofileName([]);setExpanded([]);setSelected([])}

    return (
        <>
           
            <div className="row">
                <div className="col-xl-12 ml_12">
                    <div className="card card_shadow">
                        <div className="card-body ">
                            <div className="table-responsive">
                                <div className="addbutton role_add_adjust">
                                    <button
                                        type="button"
                                        className="btn_blue btn-blue ml_10" onClick={() => openAddModal()} >
                                        ADD
                                    </button>

                                </div>



                                <PlanningProfileList user={userData} updateUser={setUserData} planningProfile={planningProfile} />
                            </div>
                        </div>
                        <NotificationContainer />
                    </div>
                </div>
            </div>
            <Modal
                show={modalOpen}
                onHide={() => setModalOpen(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Planning Profile
                    </Modal.Title>
                </Modal.Header>



                <Modal.Body>
                    <div className="planning_profile_popup_continue">
                        <button
                            type="button"
                            className="btn_blue btn-blue ml_10" onClick={savePlanningProfile} >
                            Save
                        </button>
                    </div>

                    <label for="exampleFormControlInput1">Terminal</label>
                    <div className="meterial_autocomplete">
                        <Autocomplete
                            disablePortal
                            id="terminals"
                            options={allTerminal}
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
                                value={planningprofileName}
                                onChange={handleProfileNameChange}
                            />
                        </div>
                    </div>
					<div className="mt_10 yard_chk">
                            <label for="typeHeadEditIsConfirmation">Default planning profile</label>
                            <input type="checkbox" className=' ml_6'
							onChange={handledefaultplanner}						   
                          />
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
    );
};

export default PlanningProfile;
