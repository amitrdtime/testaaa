import { DateTime } from 'luxon';
import React from 'react'
import Yard from "../../assets/images/users/Terminals_Icon.png";

const yardCheckListHeader = (props) => {
    const { terminalById } = props
    
    return (
        <div className="row df mt_30">
            <div className="tabs">
                <input type="radio" name="tabs" id="tabone"  checked={true}/>
                <label for="tabone">Yard Checks</label>
                <div className="tab yard_chk_extrapadding">


                    <div className="profile_top">
                        <div className="profile_top_left">
                        <div class="active_outer">
                        <img src={Yard} alt="contact-img" title="contact-img" className="rounded-circle avatar-sm" />
                        <div className= { terminalById.status?terminalById.status:terminalById.status != "open"?
                                "inactive_sign" : "active_sign"
                                }></div>
                        </div>
                            <div>
                                <p className="profile_top_left_text">{terminalById.terminal_name}</p>
                            </div>                           
                            
                        </div>

                        <div className="profile_top_right">
                        <p className="profile_bottom_left_text yard_right_space">Yard Check by: {terminalById.username}</p>
                        <p className="profile_bottom_left_text yard_right_space">Start Time: {DateTime.fromMillis(parseInt(terminalById.startTs)).toFormat("MM-dd-yyyy hh:mm").toString()}</p>
                        <p className="profile_bottom_left_text yard_right_space">End Time: 
                        {/* {terminalById?.status?.toUpperCase() === "OPEN"? "" : DateTime.fromMillis(parseInt(terminalById.endTs)).toFormat("MM-dd-yyyy hh:mm").toString()} */}
                        {terminalById?.status?.toUpperCase() === "OPEN"? "" :terminalById.endTs === null
                                ? "No data"
                                : DateTime.fromMillis(
                                    parseInt(terminalById.endTs)
                                  )
                                    .toFormat("MM-dd-yyyy hh:mm")
                                    .toString()}
                        </p>
                        </div>
                        
                    </div>
                  
                </div>
            </div>
        </div>
    )
}

export default yardCheckListHeader
