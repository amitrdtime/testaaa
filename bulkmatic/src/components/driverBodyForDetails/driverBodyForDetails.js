import React from "react";
import { DateTime } from "luxon";

const DriverBodyForDetails = ({ driver }) => {
  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <h2 className="header-title">Driver Details</h2>
            <div className="container special_container_padding">
              <div className="details_wrapper">
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Sex:</div>
                    <div className="right_drescrition">
                      {driver.sex ? driver.sex : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">State:</div>
                    <div className="right_drescrition">
                      {driver.state ? driver.state : "No Data"}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Driver Type:</div>
                    <div className="right_drescrition">
                      {driver.driver_type_class
                        ? driver.driver_type_class
                        : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Hire Date:</div>
                    <div className="right_drescrition">
                      {driver.hire_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.hire_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Last Home Date:</div>
                    <div className="right_drescrition">
                      {driver.last_home_date
                        ? DateTime.fromISO(driver.last_home_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()
                        : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Last Review Date:</div>
                    <div className="right_drescrition">
                      {driver.last_review_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.last_review_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">License Exp Date:</div>
                    <div className="right_drescrition">
                      {driver.license_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.license_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">License No:</div>
                    <div className="right_drescrition">
                      {driver.license_no ? driver.license_no : "No Data"}
                    </div>
                  </div>
                </div>

                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">License State:</div>
                    <div className="right_drescrition">
                      {driver.license_state ? driver.license_state : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Physical Due Date:</div>
                    <div className="right_drescrition">
                      {driver.physical_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.physical_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                </div>

                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Termination Date:</div>
                    <div className="right_drescrition">
                      {driver.termination_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.termination_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Enhanced License:</div>
                    <div className="right_drescrition">
                      {driver.enhanced_license
                        ? driver.enhanced_license
                        : "No Data"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <h2 className="header-title">Additional Certification</h2>
            <div className="container special_container_padding">
              <div className="details_wrapper">
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Ace Id:</div>
                    <div className="right_drescrition">
                      {driver.ace_id ? driver.ace_id : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Doubles Certified:</div>
                    <div className="right_drescrition">
                      {driver.doubles_certified
                        ? driver.doubles_certified
                        : "No Data"}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Hazmat Certified:</div>
                    <div className="right_drescrition">
                      {driver.hazmat_certified
                        ? driver.hazmat_certified
                        : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Respirator Due:</div>
                    <div className="right_drescrition">
                      {driver.respirator_due
                        ? DateTime.fromISO(driver.respirator_due)
                            .toFormat("MM-dd-yyyy")
                            .toString()
                        : "No Data"}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">Medical Cert Exempt:</div>
                    <div className="right_drescrition">
                      {driver.medical_cert_exempt
                        ? driver.medical_cert_exempt
                        : "No Data"}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Medical Cert Expire:</div>
                    <div className="right_drescrition">
                      {
                        driver.medical_cert_expire === null
                          ? "No Data"
                          : DateTime.fromISO(driver.medical_cert_expire)
                              .toFormat("MM-dd-yyyy")
                              .toString()
                      }
                    </div>
                  </div>
                </div>
                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">F/T Effective Date:</div>
                    <div className="right_drescrition">
                      {driver.ft_effective_date === null
                        ? "No Data"
                        : DateTime.fromISO(driver.ft_effective_date)
                            .toFormat("MM-dd-yyyy")
                            .toString()}
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">Hazmat Endoresement:</div>
                    <div className="right_drescrition">
                      {driver.HazmatEndoresement === "false" ? "No" : "Yes"}
                    </div>
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
                        driver.HazmatCertifiedExpDate
                        ? DateTime.fromISO(driver.HazmatCertifiedExpDate)
                        .toFormat("MM-dd-yyyy")
                        .toString()
                        : "No Data"
                      }
                    </div>
                  </div>
                  <div className="Details_sec">
                    <div className="left_main_driver">HM 126:</div>
                    <div className="right_drescrition">
                      {driver.HM126 ? driver.HM126 : "No Data"}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="main_details_sec">
                  <div className="Details_sec">
                    <div className="left_main_driver">HM 126 Review Date:</div>
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
                    <div className="left_main_driver">TWIC No:</div>
                    <div className="right_drescrition">
                      {
                        driver.TWIC_No ? 
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
                    <div className="left_main_driver">TWIC Exp Date:</div>
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
  );
};

export default DriverBodyForDetails;
