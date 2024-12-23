import {useState,useEffect} from "react";
import { Tooltip } from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoogleMapReact from "google-map-react";
import { DateTime } from "luxon";
import Map from "../MapComponent";
import DriverService from "../../services/driverService";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";

const DriverHeaderInfo = (props) => {
    const {driverById} = props;
    console.log("driverById",driverById.city)
    const [modalShow, setModalShow] = useState(false);
    const [latlong, setlatlong] = useState({});


    const openLocationModal = (e) => {
        setModalShow(true);
      };

      useEffect(async () => {
        if (driverById.city) {
          const driverService = new DriverService();
          const geocoding = await driverService.getgeocodinglatitudelongitude(driverById.city)
          setlatlong(geocoding)
        }
      }, [])
  const latt = latlong.Coords?.Lat
  const long = latlong.Coords?.Lon
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
            {driverById.driver_id} - {driverById.newname}
          </p>
        </div>

        <div className="col-md-5">
          <div className="profile_top_left_text1">
            Terminal:{" "}
            <text className="text_color_white">
              {driverById.terminal_full_name
                ?? "No Data"}
            </text>
          </div>
        </div>

        <div className="col-md-3 d-flex justify-content-sm-between">
          <div className="profile_top_left_text1">
            Region:{" "}
            <text className="text_color_white">
              {driverById.region ? driverById.region : "No Data"}
            </text>
          </div>
          <Tooltip title={driverById.is_active ? "Active" : "Inactive"}>
            <div
              className={driverById.is_active ? "online_sign" : "offline_sign"}
            ></div>
          </Tooltip>
        </div>
      </div>
      <div className="row blue_header_twosidespace">
        <div className="col-md-4">
          <div className="title_for_trailer">
            <span>
              Driver Type:{" "}
              <text className="text_color_white">
                {driverById.driver_type_class
                  ? driverById.driver_type_class
                  : "No Data"}
              </text>
            </span>
            <span>
              Email:
              <text className="text_color_white">
                {driverById.Email ? driverById.Email : "No Data"}
              </text>
            </span>

            <span>
              Cell:{" "}
              <text className="text_color_white">
                {driverById.cell_phone ? driverById.cell_phone : "No Data"}
              </text>
            </span>

            <span>
              Birth Date:{" "}
              <text className="text_color_white">
                {driverById.birth_date === null
                  ? "No Data"
                  : DateTime.fromISO(driverById.birth_date)
                      .toFormat("MM-dd-yyyy")
                      .toString()}
              </text>
            </span>
          </div>
        </div>

        <div className="col-md-5"></div>

        <div className="col-md-3">
          <div className="title_for_trailer">
            <span>
              Address:
              <text className="text_color_white">
                {driverById.address ?? ""}
                  <br/>
                  {driverById.city || driverById.state || driverById.zip ?
                    `${driverById.city}, ${driverById.state}, ${driverById.zip}` : "No Data"
                  }
              </text>
            </span>
          </div>
          <p className="text_color_white">
            {latt ? latt : "No Data"}
            ,&nbsp;
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

export default DriverHeaderInfo;
