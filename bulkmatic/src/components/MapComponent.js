import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

export const MapComponent = (props) => {
  const onMarkerClick = () => {};

  const style = {
    width: "90%",
    height: "100%",
  };
  return (
    <Map
      google={props.google}
      zoom={14}
      initialCenter={{ lat: 88.4316, lng: 22.5687 }}
      style={style}
    >
      <Marker
        name={"Current location"}
        position={{ lat: 88.4316, lng: 22.5687 }}
        onClick={onMarkerClick}
      />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyC4wR2uDbHEwb9H6XtftELtcVmXzdXj3yE",
})(MapComponent);
