import {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoogleMapReact from "google-map-react";
import { Tooltip } from "@material-ui/core";
import Map from "./Map";

const LocationHeaderInfo = (props) => {
    const {locationById} = props;
    const [modalShow, setModalShow] = useState(false);
    const [loc, setloc] = useState([]);

    const openLocationModal = (e) => {
        setModalShow(true);
      };

      useEffect(() => {
        if (locationById?.longitude || latitude) {
          let obj = {
            lat: Number(locationById?.latitude),
            lng: Number(locationById?.longitude),
          };
          setloc([obj]);
        }
      }, [Object.keys(locationById).length > 0]);

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
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            CURRENT LOCATION
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "300px", width: "100%" }}>
            {
              <GoogleMapReact defaultCenter={loc[0]} defaultZoom={15}>
                {loc.map((index) => {
                  return (
                    <Map
                      key={index}
                      lat={index.lat}
                      lng={index.lng}
                      text={
                        <i
                          class="fa fa-map-marker ml_10 cp"
                          aria-hidden="true"
                        ></i>
                      }
                    />
                  );
                })}
              </GoogleMapReact>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
        </>

    )
}

export default LocationHeaderInfo;