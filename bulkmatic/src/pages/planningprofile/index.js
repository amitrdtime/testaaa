import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../../components/header";

import AppBar from "../../components/appbar";

import PlanningProfileHeader from "../../components/planningProfileHeader/planningProfileHeader";


function PlanningProfile() {


  return (

    <div id="wrapper">

      <Header ></Header>

      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
    <PlanningProfileHeader />
    </div>
    </div>

    </div>
    </div>

  );

}
export default PlanningProfile;