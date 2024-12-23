import React from 'react'
import searchButton from "../../assets/images/Search-Button.svg";
import { DateTime } from "luxon";

const TractorBodyForDetails = (props) => {
    const { tractor } = props
    
    return (
        <div className="row special_row_flex">
            <div className="col-xl-12">
                <div className="card card_shadow">
                    <div className="card-body">
                        <h2 className="header-title">Additional Details</h2>
                        <div className="container special_container_padding">
                            {<div className="details_wrapper">
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Make:
                                        </div>
                                        <div className="right_drescrition">{tractor.make}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Model:
                                        </div>
                                        <div className="right_drescrition">{tractor.model}</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Year:
                                        </div>
                                        <div className="right_drescrition">{tractor.model_year}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            VIN:
                                        </div>
                                        <div className="right_drescrition">{tractor.vin}</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Description:
                                        </div>
                                        <div className="right_drescrition">{tractor.description}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main">
                                        Mileage:
                                        </div>
                                        <div className="right_drescrition">{tractor.first_meter_accumulated_usage}</div>
                                    </div>
                                </div>
                                <hr />

                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            License Renewal Date:
                                        </div>
                                        <div className="right_drescrition">{tractor.license_renewal_date 
                                            ? DateTime.fromISO(tractor.license_renewal_date)
                                            .toFormat("MM-dd-yyyy")
                                            .toString()
                                            : ""}
                                        </div>
                                        
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Engine Hrs:
                                        </div>
                                        <div className="right_drescrition">{tractor.second_meter_accumulated_usage ?? ""}</div>
                                    </div>
                                    
                                </div>
                                {/* <hr/> */}
                                {/* <div className="main_details_sec">
                                    
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Year: 
                                        </div>
                                        <div className="right_drescrition">{tractor.model_year ?? ""}</div>
                                    </div> 
                                </div> */}
                                {/* <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main">
                                            Terminal:
                                        </div>
                                        <div className="right_drescrition">{tractor.terminal?.name}
                                        </div>
                                    </div>
                                </div> */}
                            </div>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TractorBodyForDetails
