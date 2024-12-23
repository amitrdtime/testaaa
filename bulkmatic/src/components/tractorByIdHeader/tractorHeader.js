import { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoogleMapReact from "google-map-react";
import Map from "./Map";
import { Tooltip } from "@material-ui/core";
import TractorService from "../../services/tractorService";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import "./trimble_map.css";

const TractorHeaderInfo = (props) => {
  const { tractorById } = props;
  console.log("lats1", props)

  const [modalShow, setModalShow] = useState(false);
  const [loc, setloc] = useState([]);
  const [latlong, setlatlong] = useState({});

  let tractorStatusClass = null;

  if (!tractorById.is_active) {
    tractorStatusClass = "offline_sign";
  }
  else if ((tractorById.is_active === true) && (tractorById.status === "In Shop")) {
    tractorStatusClass = "in_shop_circle";
  }
  else {
    tractorStatusClass = "online_sign";
  }

  const openLocationModal = (e) => {

    setModalShow(true);
  };

  useEffect(async () => {
    if (tractorById.vin) {
      const tractorService = new TractorService();
      const vinid = await tractorService.getidfromvin(tractorById.vin)
      setlatlong(vinid)
    }
  }, [])
  const latt = latlong.gps?.latitude.toFixed(4)
  const long = latlong.gps?.longitude.toFixed(4)
  console.log("lat", latt)
  console.log("lat1", long)

  
  useEffect(() => {
   
    if(long || latt){
     
      TrimbleMaps.APIKey = 'EC4C17331DA1244E83DF701D69E9636D';
      const map = new TrimbleMaps.Map({
        container: 'map', // container id
        style: TrimbleMaps.Common.Style.TRANSPORTATION, //hosted style id
        
        center:  new TrimbleMaps.LngLat(long,latt), // starting position
        zoom: 12 // starting zoom

      });
      
      const marker = new TrimbleMaps.Marker({
        draggable: true
    }).setLngLat([long,latt]).addTo(map);
       console.log("callllled1",marker)
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
              {tractorById.tractor_id} - {tractorById.description}
            </p>
          </div>
          <div className="col-md-4">
            {/* <p className="profile_left_text_trailers">
                Terminal: {tractorById?.terminal_name ?? "No Data"}
              </p> */}
            <div className="profile_top_left_text1">
              Terminal:{" "}
              <text className="text_color_white">
                {tractorById.terminal_name
                  ? tractorById.terminal_name
                  : "No Data"}
              </text>
            </div>
          </div>

          <div className="col-md-4 d-flex justify-content-sm-between">
            {/* <p className="profile_left_text_trailers">
                Region: {tractorById.region ?? "No Data"}
              </p> */}
            <div className="profile_top_left_text1">
              Region:{" "}
              <text className="text_color_white">
                {tractorById.region ? tractorById.region : "No Data"}
              </text>
            </div>
            <Tooltip title={tractorById.status}>
              <div className={tractorStatusClass}></div>
            </Tooltip>
          </div>
        </div>
        <div className="row blue_header_twosidespace">
          <div className="col-md-4">
            <div className="title_for_trailer">
              <span>
                License Plate:
                <text className="text_color_white">
                  {tractorById.license_plate ?? "No Data"}
                </text>
              </span>

              <span>
                License State:
                <text className="text_color_white">
                  {tractorById.license_state ?? "No Data"}
                </text>
              </span>

              <span>
                Next PM Date:{" "}
                <text className="text_color_white">
                  {tractorById.pm_due_date_utc === null
                    ? " No Data"
                    : convertDateTime(tractorById.pm_due_date_utc)}
                </text>
              </span>
            </div>
          </div>

          <div className="col-md-4"></div>

          <div className="col-md-4">
            <div className="profile_bottom_drescription">
              <div className="profile_bottom_left_text">Current Location: </div>

              <p className="text_color_white">
                {latt ? latt : "No Data"},&nbsp;{" "}
                {long ? long : "No Data"}
                <span className="icon_for_location">
                  <i
                    class="fa fa-map-marker"
                    aria-hidden="true"
                    onClick={(e) => openLocationModal(e)}
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

export default TractorHeaderInfo;
