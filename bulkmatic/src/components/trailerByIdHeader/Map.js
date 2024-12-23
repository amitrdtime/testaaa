import React from "react";

const Map = ({ text }) => (
  <div
    style={{
      color: "#da2128",
      fontSize:"40px",
      marginTop:"-5px",
      marginLeft:"-4px",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
  </div>
);

export default Map;