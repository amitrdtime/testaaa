import React, { useState, useEffect, useContext } from 'react';
import { ContextData } from '../../components/appsession';


const RolesAndPermissionHeader = (props) => {
    const [searchData, setsearchData] = useState("")
    
    const userData= useContext(ContextData);

    const permissionSearchHandler=(e)=>{       
        setsearchData(e.target.value);
    }
    const searchHandler=(e)=>{
        
        props.parentCallBackForPermissionFilter(searchData)
     } 
     const handleKeyPress = (e) => {
        if(e.key === 'Enter'){     
           searchHandler()
        }
      }
      
    return (
        <div class="row df mt_30">
            <div class="col-xl-12">
                <div class="card special_bg card_shadow">
                    <div class="card-body">
                        <div class="row top_adjust">
                            <div class="col-md-12">
                            <h2 class="text-light">Roles and Permissions</h2>
                                <p class="user_sec_text">Total: {props.roleCount}</p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default RolesAndPermissionHeader
