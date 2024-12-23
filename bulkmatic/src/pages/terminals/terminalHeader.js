import {useState, useEffect} from 'react';
import { Tooltip } from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AnyReactComponent from "../../common/AnyReactComponent";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";

const TerminalHeaderInfo = (props) => {
    const {terminal, loc} = props;
    const [modalShow, setModalShow] = useState(false);
  
    const openLocationModal = (e) => {
      setModalShow(true);
      };
      let latt = terminal?.latitude
      let long = terminal?.longitude
      useEffect(() => {
        
        if(modalShow){
          TrimbleMaps.APIKey = 'EC4C17331DA1244E83DF701D69E9636D';
            
            const chart = new TrimbleMaps.Map({
              container: "chart", // container id
              style: TrimbleMaps.Common.Style.TRANSPORTATION, //hosted style id
              
              center:  new TrimbleMaps.LngLat(long,latt), // starting position
              zoom: 12 // starting zoom
      
            });
            const marker = new TrimbleMaps.Marker({
              draggable: true
          }).setLngLat([long,latt]).addTo(chart);
             chart.addControl(new TrimbleMaps.NavigationControl());
      
             const scale = new TrimbleMaps.ScaleControl({
               maxWidth: 80,
               unit: 'imperial'
             });
             chart.addControl(scale);
          
        } 
    
      }, [modalShow])

     return(
        <>
        <div className="tab">
          <div className="row blue_header_twosidespace">
            <div className="col-md-9">
              
                <p className="profile_left_text_trailers">
                  {terminal.code} - {terminal.name}
                </p>
              
            </div>
            <div className="col-md-3 d-flex justify-content-sm-between">
              <div className="profile_top_left_text1">
                Region:{" "}
                <text className="text_color_white">
                  {terminal.region ? terminal.region : "No Data"}
                </text>
              </div>
              <Tooltip title={terminal.isActive ? "Active" : "In-active"}>
              <div
                className={terminal.isActive ? "online_sign" : "offline_sign"}
              ></div>
            </Tooltip>
            </div>
          </div>
          

          <div className="row blue_header_twosidespace">
            <div className="col-md-9">
              <div className="title_for_trailer">
                <span>
                  Has a Shop:{" "}
                  <text className="text_color_white">
                    {terminal.hasShop ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Has Wash Facility:{" "}
                  <text className="text_color_white">
                    {terminal.iswash ? "Yes" : "No"}
                  </text>
                </span>
                <span>
                  Is a Railyard:{" "}
                  <text className="text_color_white">
                    {terminal.israilyard ? "Yes" : "No"}
                  </text>
                </span>
              </div>
            </div>
            <div className="col-md-3">
            <div className="title_for_trailer">        
                <span>
                  Address:
                  <text className="text_color_white">
                  {terminal?.new_address ? terminal?.new_address + ", " : ""}
                {terminal?.city ? terminal?.city + ", " : ""}
                <br />
                {terminal?.new_state_zip ? terminal?.new_state_zip : ""}
                  </text>
                </span>
                </div>
            
              <p className="text_color_white">
                {terminal.latitude ? terminal.latitude : "No Data"},&nbsp;
                {terminal.longitude ? terminal.longitude : "No Data"}
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
                  <div id="chart" style={{ height: "400px", width: "100%", }}></div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={(e) => setModalShow(false)}>Close</Button>
                </Modal.Footer>
              </Modal>
        </>
    )
}
export default TerminalHeaderInfo;