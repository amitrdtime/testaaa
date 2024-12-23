import React from "react";
import searchButton from "../../assets/images/Search-Button.svg";
import { DateTime } from "luxon";

const TrailerBodyForDetails = (props) => {
  const { trailer } = props;

  console.log("tailer", trailer);
  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <h2 className="header-title">Additional Details </h2>
            <div className="container special_container_padding">
              {
                <div className="details_wrapper">
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">License State:</div>
                      <div className="right_drescrition">
                        {trailer?.eqlicensestate
                          ? trailer?.eqlicensestate
                          : "Not Data"}
                      </div>
                    </div>

                    {/* <div className="Details_sec">
                      <div className="left_main">Trailer Type:</div>
                      <div className="right_drescrition">
                        {trailer?.eqtype ? trailer?.eqtype : "Not Available"}
                        </div>
                    </div> */}
                    <div className="Details_sec">
                      <div className="left_main">PM Days:</div>
                      <div className="right_drescrition">
                        {trailer?.pmdays ? trailer?.pmdays : "No Data"}
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">License Plate:</div>
                      <div className="right_drescrition">
                        {trailer.eqlicenseplate
                          ? trailer?.eqlicenseplate
                          : "Not Data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">License Country:</div>
                      <div className="right_drescrition">
                        {trailer.eqlicensecountry
                          ? trailer?.eqlicensecountry
                          : "Not Data"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">License Renewal Date:</div>
                      <div className="right_drescrition">
                        {trailer.eqlicenserenewaldate
                          ? DateTime.fromISO(trailer.eqlicenserenewaldate)
                              .toFormat("MM-dd-yyyy")
                              .toString()
                          : "Not Data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Description:</div>
                      <div className="right_drescrition">
                        {trailer.eqdescription
                          ? trailer.eqdescription
                          : "Not Data"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Fleet Code:</div>
                      <div className="right_drescrition">
                        {trailer.eqfleetcode
                          ? trailer?.eqfleetcode
                          : "Not Data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Make:</div>
                      <div className="right_drescrition">
                        {trailer?.eqmake ? trailer?.eqmake : "No Data"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Type Group:</div>
                      <div className="right_drescrition">
                        {trailer?.eqtypegroup
                          ? trailer?.eqtypegroup
                          : "Not Data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Model:</div>
                      <div className="right_drescrition">
                        {trailer?.eqmodel ? trailer?.eqmodel : "Not Data"}{" "}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Year:</div>
                      <div className="right_drescrition">
                        {trailer.eqyear ? trailer.eqyear : "No data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Vin:</div>
                      <div className="right_drescrition">
                        {trailer.eqvin ? trailer.eqvin : "No Data"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Customer Code:</div>
                      <div className="right_drescrition">
                        {trailer?.eqcustomercode
                          ? trailer?.eqcustomercode
                          : "Not Data"}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Messages*:</div>
                      <div className="right_drescrition">
                        {trailer?.messages ? trailer?.messages : "Not Data"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Last Service Date:</div>
                      <div className="right_drescrition">
                        {trailer?.lastserviceDate
                          ? DateTime.fromISO(trailer.lastserviceDate)
                              .toFormat("MM-dd-yyyy")
                              .toString()
                          : "Not Data"}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerBodyForDetails;
