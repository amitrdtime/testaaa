import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../../components/header";
import AppBar from "../../components/appbar";


function Landing() {
    return (
      <>
        <Header></Header>
        <AppBar></AppBar>
        <div>
            Authenticated
        </div>
      </>
    );
  }

  export default Landing;