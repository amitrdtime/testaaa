import React from 'react'
import searchButton from "../../assets/images/Search-Button.svg";

const TractorBodyForSpecification = (props) => {
    const {tractor}=props

    console.log("tractor------>>>",tractor)
    return (
        <div className="row special_row_flex">
            <div className="col-xl-12">
                <div className="card card_shadow">
                    <div className="card-body">
                 
                        <h2 className="header-title">Detailed Specifications</h2>
                        <div className="container special_container_padding">
                        { <div className="details_wrapper">
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Wheelbase:
                                        </div>
                                        <div className="right_drescrition">{tractor.wheelbase?tractor.wheelbase:"No Data"}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Gross Weight:
                                        </div>
                                        <div className="right_drescrition">{tractor.gross_weight?tractor.gross_weight:"No Data"}</div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Tare Weight:
                                        </div>
                                        <div className="right_drescrition">{tractor.tare_weight?tractor.tare_weight:"No Data"}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Trannsmission Description: 
                                        </div>
                                        <div className="right_drescrition">{tractor.tran_description?tractor.tran_description:"No Data"}</div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                         Sleeper/DayCab:
                                        </div>
                                        <div className="right_drescrition">{tractor.sleeper_daycab?tractor.sleeper_daycab:"No Data"}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Has WetKit:
                                        </div>
                                        <div className="right_drescrition">{tractor.wetkit?"Yes":"No"}</div>
                                    </div>

                                </div>
                                <hr/>
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Has Blower:
                                        </div>
                                        <div className="right_drescrition">{tractor.blower?"Yes":"No"}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Transmission Auto/Manual:
                                        </div>
                                        <div className="right_drescrition">{tractor.transmission_auto_manual?tractor.transmission_auto_manual:"No Data"}</div>
                                    </div>

                                </div>
                                <hr/>
                                <div className="main_details_sec">
                                    {/* <div className="Details_sec">
                                            <div className="left_main" style={{ width : '55%' }}>
                                            Governing speed limit:
                                            </div>
                                            <div className="right_drescrition">{tractor.governing_speed_limit?tractor.governing_speed_limit:"No Data"}</div>
                                    </div> */}
                                  
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '57%' }}>
                                        Double Certification:
                                        </div>
                                        <div className="right_drescrition">{tractor.double_certification?double_certification : "No Data"}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Overweight Permit:
                                        </div>
                                        <div className="right_drescrition">{tractor.overweight_permit?tractor.overweight_permit:"No Data"}</div>
                                    </div>

                                    {/* <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Miles:
                                        </div>
                                        <div className="right_drescrition">{tractor.first_meter_accumulated_usage?tractor.first_meter_accumulated_usage:"No Data"}</div>
                                    </div> */}
                                </div>
                                {/* <hr/> */}
                                <div className="main_details_sec">
                                    
                                    {/* <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Mileage:
                                        </div>
                                        <div className="right_drescrition">{tractor.first_meter_accumulated_usage + '/' +(tractor.second_meter_accumulated_usage)}</div>
                                    </div> */}
                                </div>
                                {/* <hr/>
                                <div className="main_details_sec">
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Engine Hrs : {}{" "} 
                                        </div>
                                        <div className="right_drescrition">{}{" "}</div>
                                    </div>
                                    <div className="Details_sec">
                                        <div className="left_main" style={{ width : '55%' }}>
                                        Year : 
                                        </div>
                                        <div className="right_drescrition">{tractor.model_year ?? "No Data"}</div>
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

export default TractorBodyForSpecification
