import React, { useState, useEffect, useContext } from "react";
import User from "../../assets/images/users/user-2.jpg";
import UserService from "../../services/userService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { ContextData } from "../appsession/index";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { Tooltip } from "@material-ui/core";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const Userprofileheader = (props) => {
  const { user, allUserTerminals, accessDisabled } = props;
  const [tabSelected, settabSelected] = useState({
    profile: true,
    planning: false,
  });
  const [userData, setuserData] = useContext(ContextData);
  const [displayPlanningTab, setDisplayPlanningTab] = useState(null);
  const [isEditDisabled, setisEditDisabled] = useState(true);
  const [userDataToupdate, setuserDataToupdate] = useState({});
  const [selectedTerminalOptions, setSelectedTerminalOptions] = useState([]);
  const [allterminalOptions, setTerminalOptions] = useState([]);
  //

  const tabClickHandler = (e, tabname) => {
    if (tabname === "profile") {
      settabSelected({
        profile: true,
        planning: false,
      });
    } else {
      settabSelected({
        profile: false,
        planning: true,
      });
    }
    props.parentcallback(tabname, user);
  };
  const editInfoHandler = () => {
    setisEditDisabled(false);
  };

  useEffect(() => {
    let allterminal = [];
    for (let i = 0; i < allUserTerminals.length; i++) {
      let obj = {
        label: `${allUserTerminals[i].code} - ${allUserTerminals[i].name}` ,
        value: allUserTerminals[i].id,
      };
      allterminal.push(obj);
    }
    setTerminalOptions(allterminal);
  }, [allUserTerminals.length]);

  useEffect(() => {
    if(user?.roles[0]?.permissionAccess && user.roles[0]?.permissionAccess?.length > 0) {
      const planningAccess = user.roles?.[0].permissionAccess.find(x => x.permission ==="Planning");
      
      if(planningAccess.isEdit) {
        
        setDisplayPlanningTab(true);
      }
      else {
        setDisplayPlanningTab(false);
      }
    }
  },[user?.roles])

  const initialValues = {
    phone: user.Phone ? user.Phone : "",
    address: user.Address ? user.Address : "",
    email: user.Email ? user.Email : "",
    planner: user.Planner ? user.Planner : "",
    terminal: user.Terminal ? user.Terminal : "",
    eTractor: user.ETractor ? user.ETractor : "",
  };
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

  const validation = yup.object().shape({
    phone: yup.string()
      .required("Phone number is required")
      .matches(phoneRegex, "Phone number is not valid"),
    address: yup.string().required("Address is required"),
  });

  const cancelSaveUser = () => {
    // setuserDataToupdate((prevState) => ({
    //   ...prevState,
    //   address: user.Address,
    //   phone: user.Phone,
    //   eTractor: user.ETractor,
    //   planner: user.Planner,
    //   terminal: user.Terminal,
    // }));
    user.Address = user.address
    user.Phone = user.Phone
    user.ETractor = user.ETractor
    user.Planner = user.Planner
    user.Terminal = user.Terminal
    // 
    setisEditDisabled(true);
  };

  const saveUserDetails = (values) => {

    user.Address = values.address ?? user.address
    user.Phone = values.phone ?? user.Phone
    user.ETractor = values.ETractor ?? user.ETractor
    user.Planner = values.planner ?? user.Planner
    user.Terminal = values.Terminal ?? user.Terminal

    const userService = new UserService();
    const updateuserResponse = userService
      .updateUser(user)
      .then(function () {
        NotificationManager.success("Profile edited successfully", "Success");
        setisEditDisabled(true);
      })
      .catch((err) => {
        NotificationManager.error("Profile update is unsuccessful!", "error");
      });
  };

  function getterminalDropdownButtonLabel({ placeholderButtonLabel }) {
    let label = "";
    for (let i = 0; i < selectedTerminalOptions.length; i++) {
      label = label + selectedTerminalOptions[i].label + ", ";
      if (label.length > 6) {
        label = label.substring(0, 6) + "...";
        break;
      }
    }
    return `${placeholderButtonLabel}: ${label}`;
  }

  function onChangeforTerminal(option) {
    setSelectedTerminalOptions(option);
  }

  const filterData = {
    terminalId: selectedTerminalOptions.map((o) => o.value),
  };

  useEffect(() => {
    props.parentCallBackForTerminalFilterDriver(filterData);
    props.parentCallBackForTerminalFilterTrailer(filterData)
  }, [selectedTerminalOptions]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      enableReinitialize="true"
      onSubmit={saveUserDetails}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          <div className="row df mt_30">
            <div className="tabs">
              <input
                type="radio"
                name="tabs"
                id="tabone"
                defaultChecked={tabSelected.profile}
                onClick={(e) => tabClickHandler(e, "profile")}
              />
              <label htmlFor="tabone">Profile</label>
              <div className="tab">
                <div className="profile_top">
                  <div className="profile_top_left">
                    {/* <img
                      src={User}
                      alt="contact-img"
                      title="contact-img"
                      className="rounded-circle avatar-sm"
                    /> */}
                    <div>
                      <p className="profile_top_left_text_user">{user.userName}</p>
                    </div>
                  </div>
                  <div className="df">
                    {isEditDisabled ? (
                      <div onClick={(e) => editInfoHandler()}>
                        {accessDisabled ? null :  <i
                          className="fa fa-pencil-square edit_icon_blue_sec"
                          aria-hidden="true"
                        ></i>}
                        {/* <i
                          className="fa fa-pencil-square edit_icon_blue_sec"
                          aria-hidden="true"
                        ></i> */}
                      </div>
                    ) : (
                      <div className="save_button_sec">
                        {" "}
                        <button
                          className="btn_white btn-white mr_10"
                          type="submit"
                        >
                          {" "}
                          Save
                        </button>
                        <button
                          className="btn_white btn-white "
                          onClick={(e) => cancelSaveUser()}
                        >
                          {" "}
                          Cancel
                        </button>
                      </div>
                    )}
                    <div className="profile_top_right_user">
                      <Tooltip title={user.isActive ? "Active" : "Inactive"}>
                        <div className={user.isActive ? "online_sign" : "offline_sign"}></div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="profile_bottom">
                  <div className="profile_bottom_drescription">
                    <p className="profile_bottom_drescription_heading">
                      Contact
                    </p>
                    <p className="profile_bottom__heading_drescription mt_5 df">
                      <div className="edit_first">Phone:</div>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="123-456-7890"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          className={
                            !isEditDisabled ? "after_edit" : "before_edit"
                          }
                          value={values.phone ?? user.Phone}
                          disabled={isEditDisabled}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="phone"
                          render={(error) => <div className="errormessageuser">{error}</div>}
                        />
                      </div>
                    </p>
                    <p className="profile_bottom__heading_drescription mt_5 df">
                      <div className="edit_first">Address:</div>
                      <div>
                        <input
                          type="text"
                          name="address"
                          className={
                            !isEditDisabled ? "after_edit" : "before_edit"
                          }
                          value={values.address ?? user.Address}
                          disabled={isEditDisabled}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="address"
                          render={(error) => <div className="errormessageuser" >{error}</div>}
                        />
                      </div>
                    </p>
                    <p className="profile_bottom__heading_drescription mt_5 df">
                      <div className="edit_first">E-mail:</div>
                      <div>
                        <input
                          type="text"
                          name="email"
                          className="before_edit"
                          value={values.email ?? user.Email}
                          disabled={true}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </p>
                  </div>

                  <div className="profile_bottom_drescription">
                    <p className="profile_bottom_drescription_heading">
                      User Information
                    </p>
                    <p className="profile_bottom__heading_drescription mt_5 df">
                      <div className="edit_first">AD_ID:</div>
                      <div>
                        <input
                          type="text"
                          name="adId"
                          className="before_edit"
                          value={values.adId ?? user.AdId}
                          disabled={true}
                        ></input>
                      </div>
                    </p>
                    <p className="profile_bottom__heading_drescription mt_5 df">
                      <div className="edit_first">Loadmaster ID:</div>
                      <div>
                        <input
                          type="text"
                          name="loadmasterId"
                          className="before_edit"
                          value={values.loadmasterId ?? user.LoadmasterID}
                          disabled={true}
                        />
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              {displayPlanningTab? (
                <>
                  <input
                  type="radio"
                  name="tabs"
                  id="tabtwo"
                  defaultChecked={tabSelected.planning}
                  onClick={(e) => tabClickHandler(e, "Planning")}
                />
              <label htmlFor="tabtwo">Planning</label>
              <div className="tab">
                <div className="profile_top">
                  <div className="df">
                    <div className="profile_top_left">
                      {/* <img
                        src={User}
                        alt="contact-img"
                        title="contact-img"
                        className="rounded-circle avatar-sm"
                      /> */}
                    <div>
                      <p className="profile_top_left_text_user">{user.userName}</p>
                    </div>
                  </div>

                </div>
                <div className="df">
                  {isEditDisabled ? (
                    <div onClick={(e) => editInfoHandler()}>
                      {accessDisabled ? null :  <i
                          className="fa fa-pencil-square edit_icon_blue_sec"
                          aria-hidden="true"
                        ></i>}
                      {/* <i
                        className="fa fa-pencil-square edit_icon_blue_sec"
                        aria-hidden="true"
                      ></i> */}
                    </div>
                  ) : (
                    <div className="save_button_sec">
                      {" "}
                      <button
                        type="submit"
                        className="btn_white btn-white mr_10"
                      >
                        {" "}
                        Save
                      </button>
                      <button
                        className="btn_white btn-white "
                        onClick={(e) => cancelSaveUser(e)}
                      >
                        {" "}
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="profile_top_right_user">
                    <Tooltip title={user.isActive ? "Active" : "Inactive"}>
                      <div
                        className={
                          user.isActive ? "online_sign" : "offline_sign"
                        }
                      ></div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="profile_bottom">
                <div className="profile_bottom_drescription">
                  <p className="profile_bottom_drescription_heading">
                    Contact
                  </p>
                  <p className="profile_bottom__heading_drescription mt_5 df">
                    <div className="edit_first">Phone:</div>{" "}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="123-456-7890"
                        className={
                          !isEditDisabled ? "after_edit" : "before_edit"
                        }
                        value={values.phone ?? user.Phone}
                        disabled={isEditDisabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="phone"
                        render={(error) => <div className="errormessageuser">{error}</div>}
                      />
                    </div>
                  </p>
                  <p className="profile_bottom__heading_drescription mt_5 df">
                    <div className="edit_first">Address:</div>
                    <div>
                      <input
                        type="text"
                        name="address"
                        className={
                          !isEditDisabled ? "after_edit" : "before_edit"
                        }
                        value={values.address ?? user.Address}
                        disabled={isEditDisabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="address"
                        render={(error) => (
                          <div className="errormessageuser">{error}</div>
                        )}
                      />
                    </div>
                  </p>
                  <p className="profile_bottom__heading_drescription mt_5 df">
                    <div className="edit_first">E-mail:</div>
                    <div>
                      <input
                        type="text"
                        name="email"
                        className="before_edit"
                        value={values.email ?? user.Email}
                        disabled={true}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </p>
                </div>
             
               
  
                <div className="profile_bottom_drescription">
                  <p className="profile_bottom_drescription_heading">
                    User Information
                  </p>
                  <p className="profile_bottom__heading_drescription mt_5 df">
                    <div className="edit_first">AD_ID:</div>
                    <div>
                      <input
                        type="text"
                        name="adId"
                        className="before_edit"
                        value={user.AdId}
                        disabled={true}
                      />
                    </div>
                  </p>
                  <p className="profile_bottom__heading_drescription mt_5 df">
                    <div className="edit_first">Loadmaster ID:</div>
                    <div>
                      <input
                        type="text"
                        name="loadmasterId"
                        className="before_edit"
                        value={user.LoadmasterID}
                        disabled={true}
                      />
                    </div>
                  </p>
                </div>
              </div>
              <NotificationContainer />
            </div>
            
            </>
              ) : (
                ""
              )}

            </div>
           
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Userprofileheader;
