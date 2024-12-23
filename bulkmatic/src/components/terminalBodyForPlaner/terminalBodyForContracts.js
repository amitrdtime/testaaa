import React, { useEffect, useState,useContext } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg";
import ContactService from "../../services/contactService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Tooltip } from "@material-ui/core";
import { ContextData } from "../../components/appsession";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

;

const TerminalBodyForContracts = (props) => {
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{
      field: '',
      dir: 'desc'
    }],
  });
  const { terminal, accessDisabled } = props;
  const [filterData, setFilterData] = useState("");
  const [isReloadAgain, setIsReloadAgain] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [contactDataForAdd, setcontactDataForAdd] = useState({});
  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dataResult, setDataResult] = useState(process(allContacts, dataState));
  const [userData, setuserData] = useContext(ContextData);
  const [singleData, setSingleData] = useState([]);


  const planners = userData.roles?.map((e) => e.permissionAccess)

  const terminalaccess = planners[0].filter(element => element.permission === "Terminals")

  const terminalId = terminal.id;

  
  const dataStateChange = (event) => {
    setDataResult(process(allContacts, event.dataState));
    setDataState(event.dataState);
  };


  useEffect(() => {
    setDataResult(process(allContacts, dataState));
  }, [allContacts]);

  const openDeleteContactModal = (contact) => {
    setSingleData(contact);
    setshowDeleteModal(true);
  };
  useEffect(async () => {
    const contactService = new ContactService();

    try {
      setLoading(true);
      const apiContacts = await contactService.getContactsByTerminalId(
        terminalId,
        filterData
      );
      props.parentCallBackForContacts(apiContacts);
      if (apiContacts.length > 0) {
        setAllContacts(apiContacts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

    }
  }, [filterData]);

  const SearchContacts = (e) => {
    setFilterData(e.target.value);
  };

  const SearchContactsByButton = async () => {
    const contactService = new ContactService();
    contactService
      .getContactsByTerminalId(terminalId, filterData)
      .then(function (contacts) {
        console.log(contacts);
        setAllContacts(contacts);
        props.parentCallBackForContacts(contacts);
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SearchContactsByButton();
    }
  };
  const nameChangeHandler = (value) => {
    setcontactDataForAdd((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const titleChangeHandler = (value) => {
    setcontactDataForAdd((prevState) => ({
      ...prevState,
      title: value,
      terminal_id: terminalId.toString(),

    }));
  };
  const phoneChangeHandler = (value) => {
    setcontactDataForAdd((prevState) => ({
      ...prevState,
      phone: value,
    }));
  };

  const emailChangeHandler = (value) => {
    setcontactDataForAdd((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const saveContactHandler = async () => {

    const contactService = new ContactService();
    try {

      const apiContacts = await contactService.createContact(contactDataForAdd);

      if (apiContacts.length > 0) {
        setAllContacts(apiContacts)
        setModalShow(false)
        props.parentCallBackForContacts(apiContacts);
      }
      NotificationManager.success(" Terminal Contact Added successfully", "Success")
    }
    catch (error) {

      NotificationManager.error(" Terminal Contact can not be added", "Error")

    }

  }

  /// Delete API call Here ///
  
  // const removeContact = async () => {
   
  // };

  /// End ////

  const Deletecontacts = props =>{
    return (
    <td className="adjustbutton">
      
       {
      terminalaccess[0].isEdit ?
   
    <button
      type="button"
      class="btn_blue_smadjust btn-blue ml_10"
      onClick={()=> props.openDeleteContactModal(props.dataItem)}
    >
      <i
        class="fa fa fa-trash mr_5 del_icon"
        aria-hidden="true"
      ></i>
      DELETE
    </button>:
    <button
    type="button"
    class="btn_blue_smadjust btn-blue ml_10"
   disabled
  >
    <i
      class="fa fa fa-trash mr_5 del_icon"
      aria-hidden="true"
    ></i>
    DELETE
  </button>


      }
  </td>
    )
  }

  const removeContact = async () => {
    const contactService = new ContactService();
    try {
      let payload = {
        "id" : singleData.id
      }
      const DeleteContacts = await contactService.removeContact(payload);

      if (DeleteContacts.length > 0) {
        console.log('DeleteContacts',DeleteContacts);
        setAllContacts(DeleteContacts)
        setshowDeleteModal(false)
        props.parentCallBackForContacts(DeleteContacts);
      }
      NotificationManager.success(" Terminal Contact Deleted successfully", "Success")
    
    } catch (error) {
      return NotificationManager.error(
        "Contact is not deleted",
        "Error"
      );
    }
  };

const DeleteContact = props =><Deletecontacts {...props}  
                openDeleteContactModal={openDeleteContactModal} 
       />
  

  return (
    <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body special_card_padding">
            <h2 className="header-title">Contacts</h2>

            <div className="table-responsive">
              {allContacts?.length > 0 ? (


                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    buttonCount: 10,
                    info: true,
                    previousNext: true,
                    pageSizes: true,
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  onRowClick={(e) => props.parentcallback(true, e.dataItem)}

                >
                  <GridColumn field="name" title="Name" />
                  <GridColumn field="title" title="Title" />

                  <GridColumn title="Action" 
                 
                 cell={DeleteContact}/>


                </Grid>
              ) : (

                  <p className="contactdata">No Data Found</p>
              )
              }
              <NotificationContainer />
            </div>
            <div className="add_icon">
           {
             terminalaccess[0].isEdit ?
             <Tooltip title="Add Contact">
             <button
                  type="button"
                  className="btn_blue btn-blue mr_10 mb-20 mt_10"
                  onClick={() => setModalShow(true)}
                >
                  ADD
                </button>
              </Tooltip>:
              <Tooltip title="Add Contact">
               <button
                type="button"
                className="btn_blue btn-blue mr_10 mb-20 mt_10"
                disabled
              >
                ADD
              </button>
              </Tooltip>
           }
            
            </div>
         
        </div>
      </div>
      {/* Modal For Add */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >


        <Modal.Header closeButton>

          <Modal.Title id="contained-modal-title-vcenter">
            ADD CONTACT
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div class="form-group">
            <label for="exampleFormControlInput1">Name</label>
            <input
              type="text"
              name="name"
              class="form-control"
              id="txtPermissionDesc"
              onChange={(event) => nameChangeHandler(event.target.value)}
              placeholder="e.g. Terminal Planner"
            />

            <label for="exampleFormControlInput1">Title</label>
            <input
              type="text"
              name="title"
              class="form-control"
              id="txtPermissionDesc"
              onChange={(event) => titleChangeHandler(event.target.value)}
              placeholder="e.g. Terminal Planner"
            /> 

            {/* <label for="exampleFormControlInput1">Phone</label>
            <input
              type="number"
              name="phone"
              class="form-control"
              id="txtPermissionDesc"
              onChange={(event) => phoneChangeHandler(event.target.value)}
              placeholder="e.g. 1234567890"
            /> */}
{/* 
            <label for="exampleFormControlInput1">Email</label>
            <input
              type="text"
              name="email"
              class="form-control"
              id="txtPermissionDesc"
              onChange={(event) => emailChangeHandler(event.target.value)}
              placeholder="e.g. abc@xyz.com"
            /> */}

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
          <Button type="submit" onClick={(e) => saveContactHandler(e)}>
            Save
          </Button>
        </Modal.Footer>

      </Modal>
       {/* modal for Delete */}

       <Modal
        show={showDeleteModal}
        onHide={() => setshowDeleteModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Terminal Contact
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="form-group">
            <p>Do you want to Delete Terminal Contact {} ?</p>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
           <Button onClick={(e) => removeContact(e)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TerminalBodyForContracts;
