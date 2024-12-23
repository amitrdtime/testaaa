import React, { useState } from "react";
//import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import PlanningAccessProfileTable from "../../components/planningProfileTable/planningAccessProfileTable";
import PlanningProfile from "../../components/planningProfileTable/planningProfile";
import Planningtab from "../../components/planningProfileTable/planningtab";


const PlanningProfileHeader= () => {
    const [tabSelected, settabSelected] = useState({
        profile: true,
        accessprofile: false,
        planningProfile:false,
      });
      const tabClickHandler = (e, tabname) => {
        if (tabname === "Profile") {
          settabSelected({
            profile: true,
            accessprofile: false,
            planningProfile:false,
          });
        }
    
        if (tabname === "AccessProfile") {
         
          settabSelected({
            profile: false,
            accessprofile: true,
            planningProfile:false,
          });
        }
        if (tabname === "planningProfile") {
         
          settabSelected({
            profile: false,
            accessprofile: false,
            planningProfile:true
          });
        }
      };
  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          checked={tabSelected.profile}
          readOnly
          onClick={(e) => tabClickHandler(e, "Profile")  }
        />
        <label for="tabone">Profile</label>
        <div className="tab">
          <div className="profile_top" style={{ "color": "white" }}>
           Add Your Planning Profiles Below
          </div>
        </div>
        <input
          type="radio"
          name="tabs"
          id="tabthree"
          checked={tabSelected.planningProfile}
          readOnly
          onClick={(e) => tabClickHandler(e, "planningProfile")}
        />
        <label for="tabthree">Planning</label>
        <div className="tab">
          <div className="profile_top" style={{ "color": "white" }}>    
          planning Info 
          </div>
        </div>
      </div>
      {tabSelected.profile===true?
        <PlanningProfile/>:false}
      {tabSelected.accessprofile===true?
        <PlanningAccessProfileTable/>:false}
      {tabSelected.planningProfile===true?
        <Planningtab/>:false}

      </div>
  );
};

export default PlanningProfileHeader;