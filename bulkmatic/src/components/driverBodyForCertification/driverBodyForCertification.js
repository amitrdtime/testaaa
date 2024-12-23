import React from 'react'
import { DateTime } from "luxon";

const DriverBodyForCertification = (props) => {
   const { driver } = props
   return (
      <div className="row special_row_flex">
         <div className="col-xl-12">
            <div className="card card_shadow">

               <div className="card-body">

                  <h2 className="header-title">Additional Certification</h2>
                  <div className="container special_container_padding">
                     <div className="details_wrapper">
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Ace Id:
                              </div>
                              <div className="right_drescrition">{driver.ace_id}</div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Doubles Certified:
                              </div>
                              <div className="right_drescrition">{driver.doubles_certified}</div>
                           </div>
                        </div>
                        <hr />
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Hazmat Certified:
                              </div>
                              <div className="right_drescrition">{driver.hazmat_certified}</div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Respirator Due:
                              </div>
                              <div className="right_drescrition">{driver.respirator_due}</div>
                           </div>
                        </div>
                        <hr />
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Medical Cert Exempt:
                              </div>
                              <div className="right_drescrition">{driver.medical_cert_exempt}</div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Medical Cert Expire:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.medical_cert_expire ?
                                    DateTime.fromISO(driver.medical_cert_expire)
                                    .toFormat("MM-dd-yyyy")
                                    .toString() : "No Data"
                                 }
                              </div>
                           </div>


                        </div>
                        <hr />
                        <div className="main_details_sec">

                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Ft Effective Date:
                              </div>
                              <div className="right_drescrition">{driver.ft_effective_date}</div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Hazmat Endoresement:
                              </div>
                              <div className="right_drescrition">{driver.HazmatEndoresement}</div>
                           </div>

                        </div>
                        <hr />
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 Hazmat Certified Exp Date:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.HazmatCertifiedExpDate ?
                                       DateTime.fromISO(driver.HazmatCertifiedExpDate)
                                       .toFormat("MM-dd-yyyy")
                                       .toString()
                                       : "No Data"
                                 }
                              </div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 HM 126:
                              </div>
                              <div className="right_drescrition">{driver.HM126}</div>
                           </div>

                        </div>
                        <hr />
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 HM 126 Exp Date:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.HM126ExpDate ? 
                                    DateTime.fromISO(driver.HM126ExpDate)
                                    .toFormat("MM-dd-yyyy")
                                    .toString() : "No Data"
                                 }
                              </div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 TWIC No:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.TWIC_No? 
                                       DateTime.fromISO(driver.HM126ExpDate)
                                       .toFormat("MM-dd-yyyy")
                                       .toString() : "No Data"
                                 }
                              </div>
                           </div>

                        </div>
                        <hr />
                        <div className="main_details_sec">
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 TWIC Date:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.TWIC_Date ?
                                    DateTime.fromISO(driver.TWIC_Date)
                                    .toFormat("MM-dd-yyyy")
                                    .toString() : "No Data"
                                 }
                              </div>
                           </div>
                           <div className="Details_sec">
                              <div className="left_main_driver">
                                 TWIC Expiry Date:
                              </div>
                              <div className="right_drescrition">
                                 {
                                    driver.TWIC_Expiry_Date ?
                                    DateTime.fromISO(driver.TWIC_Expiry_Date)
                                    .toFormat("MM-dd-yyyy")
                                    .toString() : "No Data"
                                 }
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>

               </div>

            </div>
         </div>
      </div>
   )
}

export default DriverBodyForCertification
