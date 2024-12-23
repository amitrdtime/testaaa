import baselinesave from "../../assets/images/baseline_save.png";
import React, { useState, useEffect, useContext } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import ProgressBar from "react-bootstrap/ProgressBar";
import parse from 'html-react-parser';
import JsxParser from 'react-jsx-parser'

const UnavailableBlock = (props) => {
  const block = props.block; 

  const getClassName = function(width, reachedOnTime){            
      return reachedOnTime? 
        "dragable_bottom_section_box-" + width + " dragable-planner-blue" 
        : "dragable_bottom_section_box-" + width + " dragable-planner-yellow";
  }

  const getTooltips = function(it){
      let toolText = "";

      if (!it.loaded) {
        toolText = view === "driver"? "T-" + it.trailerid : "D-" + it.driverId;
      } else {
        toolText = "O-" + it.orderid  + "   " + (view === "driver"? "T-" + it.trailerid : "D-" + it.driverId);
      }

      return toolText;
  }

  const getTopClassName = function(width, it){  
        if (it.loaded)          
            return "dragable_top_section_box-" + width;
        else 
            return "dragable_top_section_box-" + width; // + " dragable-planner-gray";
  }

  const view = props.view;
   
  return (
    <>      
        {
            block.map(it => (            
                <div className="dragable_wrapper">   
                    <div className= { "dragable_section dragable_left_" + (it.startHour) } >   
                    {
                        
                        <>
                        {   
                           (it.MV + it.PU + it.MV) > 0 ? 
                            (      
                                                       
                                <div className="dragable_top_section">
                                    {
                                        it.PU === 0? "" : 
                                        (
                                            <>
                                                {
                                                    !it.loaded? (
                                                        it.PU === 1? (
                                                            <div className={ getTopClassName ("1", it) } title = {"O-" + it.orderid }>
                                                                <div className="dragable_top_section_box-1_text">---</div>
                                                            </div>) : 
                                                            (<div className={ getTopClassName (it.PU, it) }>
                                                                <div className="dragable_top_section_box-1_text">{"O-" + it.orderid }</div>
                                                            </div>)
                                                    ) : ""
                                                    // (
                                                    //     it.PU === 1? (
                                                    //         <div className={ getTopClassName ("1") } title = {"O-" + it.orderid }>
                                                    //             <div className="dragable_top_section_box-1_text">---</div>
                                                    //         </div>) : 
                                                    //         (<div className={ getTopClassName (it.PU) }>
                                                    //             <div className="dragable_top_section_box-1_text">---</div>
                                                    //         </div>)
                                                    //         )                                                    
                                                }
                                            </>
                                        )                                            
                                    }
                                    {
                                    it.MV === 0? "" : 
                                        (
                                            <>
                                                {
                                                    !it.loaded? (
                                                        it.MV === 1? (
                                                            <div title = { getTooltips(it)} className={ getTopClassName ((it.MV), it) + " dragable-planner-gray" }>                                                                
                                                                {
                                                                    view === "driver"? 
                                                                    (<div title= {"T-" + it.trailerid} className="dragable_top_section_box-2_text">
                                                                        ---
                                                                    </div>) 
                                                                    : 
                                                                    (<div title= {"D-" + it.driverId} className="dragable_top_section_box-2_text">
                                                                        ---
                                                                    </div>)
                                                                }                                                                
                                                            </div>) : 
                                                            (
                                                            <div className={ getTopClassName ((it.MV), it) }>                                                                
                                                                {
                                                                    view === "driver"? 
                                                                    (<div className="dragable_top_section_box-2_text">
                                                                        T-{it.trailerid}
                                                                    </div>) 
                                                                    : 
                                                                    (<div className="dragable_top_section_box-2_text">
                                                                        D-{it.driverId}
                                                                    </div>)
                                                                }                                                                
                                                            </div>)
                                                    ) : (
                                                        it.MV + it.PU + it.DEL === 1? (
                                                            <div title = { getTooltips(it)} className={ getTopClassName ((it.MV + it.PU + it.DEL), it) }>    
                                                                <div className="dragable_top_section_box-2_text">
                                                                    ---
                                                                </div>                                                            
                                                                {
                                                                    view === "driver"? 
                                                                        (<div title= {"T-" + it.trailerid} className="dragable_top_section_box-2_text">
                                                                            ---
                                                                        </div>) 
                                                                        : 
                                                                        (<div title= {"D-" + it.driverId} className="dragable_top_section_box-2_text">
                                                                            ---
                                                                        </div>)
                                                                }                                                                
                                                            </div>) : 
                                                            (
                                                            <div className={ getTopClassName ((it.MV + it.PU + it.DEL), it) }>   
                                                                <div className="dragable_top_section_box-2_text">
                                                                    O -{it.orderid}
                                                                </div>
                                                             
                                                                {
                                                                    view === "driver"? 
                                                                    (<div className="dragable_top_section_box-2_text">
                                                                        T-{it.trailerid}
                                                                    </div>) 
                                                                    : 
                                                                    (<div className="dragable_top_section_box-2_text">
                                                                        D-{it.driverId}
                                                                    </div>)
                                                                }                                                                
                                                            </div>)
                                                            )                                                    
                                                }
                                            </>
                                        )                                            
                                    }
                                       
                                    {
                                    it.DEL === 0? "" : 
                                        (
                                            <>
                                                {
                                                    !it.loaded? (
                                                        it.DEL === 1? (
                                                            <div className={ getTopClassName ("1", it) } title = {"O-" + it.orderid }>
                                                                <div className="dragable_top_section_box-1_text">---</div>
                                                            </div>) : 
                                                            (<div className={ getTopClassName (it.DEL, it) }>
                                                                <div className="dragable_top_section_box-1_text">{"O-" + it.orderid }</div>
                                                            </div>)
                                                    ) : ""
                                                    // (
                                                    //     it.DEL === 1? (
                                                    //         <div className={ getTopClassName ("1") }>
                                                    //             <div className="dragable_top_section_box-1_text">---</div>
                                                    //         </div>) : 
                                                    //         (<div className={ getTopClassName (it.DEL) }>
                                                    //             <div className="dragable_top_section_box-1_text">---</div>
                                                    //         </div>)
                                                    //         )                                                    
                                                }
                                            </>
                                        )                                            
                                    }                     
                                </div> 
                            
                            ) : ""         
                            // (it.MV + it.PU + it.MV) > 0? 
                            // (                                
                            //     <div className="dragable_top_section">
                            //         <div className={ getTopClassName ((it.DEL + it.PU + it.MV)) }>
                            //             <div className="dragable_top_section_box-2_text">
                            //                 O -{it.orderid}
                            //             </div>
                            //             {
                            //                 view === "driver"? 
                            //                 (<div className="dragable_top_section_box-2_text">
                            //                     T-{it.trailerid}
                            //                 </div>) 
                            //                 : 
                            //                 (<div className="dragable_top_section_box-2_text">
                            //                     D-{it.driverId}
                            //                 </div>)
                            //             }
                                        
                            //         </div>                        
                            //     </div> 
                            // ) : ""
                            // : (
                            //     <div className="dragable_top_section">
                            //         {
                            //             it.PU === 0? "" : (
                            //                 <div className={ getTopClassName (it.PU) }>
                            //                     <div className="dragable_top_section_box-1_text">---</div>
                            //                 </div>)
                            //         }
                            //         {
                            //             it.PU === 0? "" : (
                            //                 <div className={ getTopClassName (it.MV) }>
                            //                     <div className="dragable_top_section_box-2_text">
                            //                         O-{it.orderid}
                            //                     </div>
                            //                     {
                            //                         view === "driver"? 
                            //                         (<div className="dragable_top_section_box-2_text">
                            //                             T-{it.trailerid}
                            //                         </div>) 
                            //                         : 
                            //                         (<div className="dragable_top_section_box-2_text">
                            //                             D-{it.driverId}
                            //                         </div>)
                            //                     }
                            //                     {/* <div className="dragable_top_section_box-2_text">
                            //                         Trailer ID-{block.trailerid}
                            //                     </div> */}
                            //                 </div>)
                            //         }                           
                            //         {
                            //             it.DEL === 0? "" : (<div className={ getTopClassName (it.DEL) }>
                            //                     <div className="dragable_top_section_box-1_text">---</div>
                            //                 </div>)
                            //         }
                                    
                            //     </div> 
                            // ) 
                        }

                        <div className="dragable_bottom_section">
                            {
                                it.PU === 0? "" : (
                                    <Draggable axis="x">
                                        <div className= { getClassName(it.PU, it.has_pickup_on_time) }>
                                            <div className="dragable_bottom_section_text"> { it.pickup_type } </div>
                                        </div>
                                    </Draggable>)
                            }           
                            {+
                                it.MV === 0? "" : (<Draggable axis="x">
                                    <div className= { getClassName(it.MV, it.hasReachedOnTime) }>
                                        <div className="dragable_bottom_section_text">{it.loaded ? ("L"):("E")}</div>
                                    </div>
                                </Draggable>)
                            }
                            {
                                it.DEL === 0? "" : (<Draggable axis="x">
                                    <div className= { getClassName(it.DEL, it.has_delivery_on_time) }>
                                        <div className="dragable_bottom_section_text">{ it.delivery_type } </div>
                                    </div>
                                </Draggable> )
                            }
                                            
                        </div>
                        </>
                        
                    }   

                    </div>
                </div>
            ))
        }
    </>
  );
};

export default UnavailableBlock;
