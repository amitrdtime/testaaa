import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoogleMapReact from "google-map-react";
import Map from "./Map";
import { Tooltip } from "@material-ui/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";

const TrailerHeaderInfo = (props) => {
  const { trailerById, convertDateTime } = props;

  const [modalShow, setModalShow] = useState(false);
  const [loc, setloc] = useState([]);

  let trailerStatusClass = null;
  if(!trailerById.is_active) {
    trailerStatusClass = "offline_sign";
  }
  else if((trailerById.is_active === true) && (trailerById.eqstat === "In Shop")) {
    trailerStatusClass = "in_shop_circle";
  }
  else {
    trailerStatusClass = "online_sign";
  }

  const openTrailerModal = (e) => {
    setModalShow(true);
  };
  // useEffect(() => {
  //   if (trailerById.longitude || trailerById.latitude) {
  //     let obj = {
  //       lat: Number(trailerById.latitude),
  //       lng: Number(trailerById.longitude),
  //     };
  //     setloc([obj]);
  //   }
  // }, [Object.keys(trailerById).length > 0]);

  useEffect(() => {
   
    if(modalShow){
      TrimbleMaps.APIKey = 'EC4C17331DA1244E83DF701D69E9636D';
      const map = new TrimbleMaps.Map({
        container: 'map', // container id
        style: TrimbleMaps.Common.Style.TRANSPORTATION, //hosted style id
        
        center:  new TrimbleMaps.LngLat( trailerById?.longitude,trailerById?.latitude), // starting position
        zoom: 12 // starting zoom

      });
      
      const marker = new TrimbleMaps.Marker({
        draggable: true
    }).setLngLat([trailerById?.longitude,trailerById?.latitude]).addTo(map);
      console.log("called1",marker)
       map.addControl(new TrimbleMaps.NavigationControl());

       const scale = new TrimbleMaps.ScaleControl({
         maxWidth: 80,
         unit: 'imperial'
       });
       map.addControl(scale);

    } 

  }, [modalShow])
 
  return (
    <>
      <div className="tab">
        <div className="row blue_header_twosidespace">
          <div className="col-md-4">
            <p className="profile_left_text_trailers">
              {trailerById?.trailer_id ? trailerById?.trailer_id : "No data"} - {trailerById?.commoditygroup.description ? trailerById?.commoditygroup.description : "No data"} ({trailerById?.commoditygroup.code ? trailerById?.commoditygroup.code : "No data"})
            </p>
          </div>
          <div className="col-md-4">
            <div className="profile_top_left_text1">
              Terminal:{" "}
              <text className="text_color_white">
                {trailerById?.terminal_full_name
                  ? trailerById?.terminal_full_name
                  : "No Data"}
              </text>
            </div>
          </div>
          <div className="col-md-4 d-flex justify-content-sm-between">
            <div className="profile_top_left_text1">
              Region:{" "}
              <text className="text_color_white">
                {trailerById.region ? trailerById.region : "No Data"}
              </text>
            </div>
            <Tooltip title={trailerById.eqstat}>
              <div className={trailerStatusClass}></div>
            </Tooltip>
          </div>
        </div>

        <div className="row blue_header_twosidespace">
          <div className="col-md-4">
            <div className="title_for_trailer">
              <span>
                License Plate:{" "}
                <text className="text_color_white">
                  {trailerById.eqlicenseplate
                    ? trailerById.eqlicenseplate
                    : "No Data"}
                </text>
              </span>
              <span>
                License State:{" "}
                <text className="text_color_white">
                  {trailerById.eqlicensestate
                    ? trailerById.eqlicensestate
                    : "No Data"}
                </text>
              </span>
              <span>
                Next PM Date:{" "}
                <text className="text_color_white">
                  {trailerById.pm_due_date_utc
                    ? convertDateTime(trailerById.pm_due_date_utc)
                    : "No Data"}
                </text>
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="profile_top_left_text1">
              Current Planner:{" "}
              <text className="text_color_white">
                {trailerById.planner === null ||
                trailerById.planner === undefined
                  ? "No Data"
                  : trailerById.planner}
              </text>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <p className="profile_bottom_drescription_heading">
                Current Location
              </p>
              <p className="text_color_white">
                {trailerById.latitude ? trailerById.latitude : "No Data"}
                ,&nbsp;
                {trailerById.longitude ? trailerById.longitude : "No Data"}
                <span className="icon_for_location">
                  <i
                    class="fa fa-map-marker ml_10 cp"
                    aria-hidden="true"
                    onClick={() => openTrailerModal(true)}
                  ></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            CURRENT LOCATION
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div id="map" style={{ height: "400px", width: "100%", }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrailerHeaderInfo;
