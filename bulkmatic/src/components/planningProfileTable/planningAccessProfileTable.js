import React,{useState,useEffect, useContext}  from "react";
import Modal from "react-bootstrap/Modal";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import TextField from "@material-ui/core/TextField";
import TerminalService from "../../services/terminalService";
import Autocomplete from "@material-ui/lab/Autocomplete";

const PlanningAccessProfileTable = () => {
const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
const[allTerminals,setAllTerminals]=useState([]);

useEffect(() => {
  const getAllTerminal = new TerminalService();
  getAllTerminal.getAllTerminals().then((res) => {
    setAllTerminals(res);
    
  });
}, []);

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
                    className="btn_blue btn-blue ml_10" onClick={() => setOpenConfirmationModal(true)} >
                    ADD
                  </button> 
                </div>
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
              Create Planning profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <label htmlFor="exampleFormControlInput1">Name *</label>
            <input
              type="text"
              name="name"
              class="form-control label_padding"
              placeholder="e.g. Jane Doe"
            />     
            <label htmlFor="exampleFormControlInput1">Terminals *</label>
              <div className="meterial_autocomplete">
                <Autocomplete
                  id="combo-box-demo"
                  options={allTerminals}
                  getOptionLabel={(option) =>
                    option.full_terminal_name
                  }
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      fullWidht={true}
                      {...params}         
                      placeholder="terminals..."      
                  >
                    </TextField>
                  )}
                />
              </div>      
          </Modal.Body>
          <Modal.Footer>
          <Button >save</Button>
            <Button onClick={(e) => setOpenConfirmationModal(false)}>close</Button>
          </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlanningAccessProfileTable;
