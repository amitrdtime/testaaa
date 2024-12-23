import {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoogleMapReact from "google-map-react";
import { Tooltip } from "@material-ui/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import "../tractorByIdHeader/trimble_map.css";
import Map from "./Map";

const LocationHeaderInfo = (props) => {
    const {locationById} = props;
    const [modalShow, setModalShow] = useState(false);
    const [loc, setloc] = useState([]);

    const openLocationModal = (e) => {
        setModalShow(true);
      };

      // useEffect(() => {
      //   if (locationById?.longitude || latitude) {
      //     let obj = {
      //       lat: Number(locationById?.latitude),
      //       lng: Number(locationById?.longitude),
      //     };
      //     setloc([obj]);
      //   }
      // }, [Object.keys(locationById).length > 0]);

      useEffect(() => {
   
        if(modalShow){
          TrimbleMaps.APIKey = 'EC4C17331DA1244E83DF701D69E9636D';
          const map = new TrimbleMaps.Map({
            container: 'map', // container id
            style: TrimbleMaps.Common.Style.TRANSPORTATION, //hosted style id
            
            center:  new TrimbleMaps.LngLat( locationById?.longitude,locationById?.latitude), // starting position
            zoom: 12 // starting zoom
    
          });
          
          const marker = new TrimbleMaps.Marker({
            draggable: true
        }).setLngLat([locationById?.longitude,locationById?.latitude]).addTo(map);
          console.log(marker)
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
            <div className="col-md-5">
              <p className="profile_left_text_location">
                {locationById.code} - {locationById.name}
              </p>
            </div>
            <div className="col-md-4">
              {" "}
              <div className="profile_top_left_text1">
                Terminal:{" "}
                <text className="text_color_white">
                  {locationById?.terminal_full_name
                    ? locationById?.terminal_full_name
                    : "No Data"}
                </text>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-sm-between">
              <div className="profile_top_left_text1">
                Region:{" "}
                <text className="text_color_white">
                  {locationById.region ? locationById.region : "No Data"}
                </text>
              </div>
              <Tooltip title={locationById.isActive ? "Active" : "In-active"}>
                <div
                  className={
                    locationById.isActive ? "online_sign" : "offline_sign"
                  }
                ></div>
              </Tooltip>
            </div>
          </div>

          <div className="row blue_header_twosidespace">
            <div className="col-md-5">
              <div className="title_for_location">
                <span>
                  Terminal:{" "}
                  <text className="text_color_white">
                    {locationById.isTerminal ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Shipper:{" "}
                  <text className="text_color_white">
                    {locationById.isShipper ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Consignee:{" "}
                  <text className="text_color_white">
                    {locationById.isConsignee ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Wash:{" "}
                  <text className="text_color_white">
                    {locationById.isWash ? "Yes" : "No"}
                  </text>
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text_padding_location">
                <span>
                  Shop:{" "}
                  <text className="text_color_white">
                    {locationById.isShop ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Railyard:{" "}
                  <text className="text_color_white">
                    {locationById.isRailyard ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Drop Lot:{" "}
                  <text className="text_color_white">
                    {locationById.isDroplot ? "Yes" : "No"}
                  </text>
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="title_for_trailer">
                <span>
                  Address:
                  <text className="text_color_white">
                    {locationById?.address ? locationById?.address + ", " : ""}
                    <br />
                    {locationById.city ? locationById.city + ", " : ""}

                    {locationById.state ? locationById.state + ", " : ""}
                    {locationById.zip ? locationById.zip : ""}
                  </text>
                </span>
              </div>


              <p className="text_color_white">
                {locationById.latitude ? locationById.latitude : "No Data"}
                ,&nbsp;
                {locationById.longitude ? locationById.longitude : "No Data"}

                <span className="icon_for_location">
                  <i
                    class="fa fa-map-marker ml_10 cp"
                    aria-hidden="true"
                    onClick={() => openLocationModal(true)}
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

    )
}

export default LocationHeaderInfo;