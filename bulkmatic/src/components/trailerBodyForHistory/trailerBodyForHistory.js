import React, { useState, useEffect, useContext, useRef } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import ProgressBar from "react-bootstrap/ProgressBar";
import TrailerService from "../../services/trailerService";
import { DateTime } from "luxon";

const TrailerBodyForHistory = (props) => {
  const { trailerById } = props;
  const [trailerHistory, setTrailerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [dataResult, setDataResult] = useState(
    process(trailerHistory, dataState)
  );
  
  const gridWidth = 1800;

  const setPercentage = (percentage) => {
    return Math.round(gridWidth / 100) * percentage;
  };

  useEffect(async () => {
    if (trailerById.trailer_id) {
      setLoading(true);
      const trailerService = new TrailerService();
      let trailerHistoryResult =
        await trailerService.getTrailerHistorybyTrailerid(
          trailerById.trailer_id
        );
      let newData = [];
      for (let i = 0; i < trailerHistoryResult.length; i++) {
        let temp = trailerHistoryResult[i];
        temp.planned_arrive_utc = DateTime.fromISO(
          temp.planned_arrive_utc
        ).toFormat("MM-dd-yyyy , hh:mm");

        temp.planned_depart_utc = DateTime.fromISO(
          temp.planned_depart_utc
        ).toFormat("MM-dd-yyyy , hh:mm");

        temp.actual_arrival_utc = DateTime.fromISO(
          temp.actual_arrival_utc
        ).toFormat("MM-dd-yyyy , hh:mm");

        temp.actual_departure_utc = DateTime.fromISO(
          temp.actual_departure_utc
        ).toFormat("MM-dd-yyyy , hh:mm");
        newData.push(temp);
      }
      setDataResult(process(newData, dataState));
      setTrailerHistory(newData);
      setLoading(false);
    }
  }, []);

  const dataStateChange = (event) => {
    setDataResult(process(trailerHistory, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(trailerHistory, dataState));
  }, [trailerHistory]);


  const plannedarriveValue = (props)=>
  {  let date = Date.parse(props.dataItem.planned_arrive_utc) 
    
    if(isNaN(date))
    {
      return (    
        <td>      {}    
        </td>  )
    }
    else
    {
     return (    
     <td>      {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy, hh:mm").toString()}    
     </td>  )
    }
     
    }

const planneddeparttime = (props)=>
{  let date = Date.parse(props.dataItem.planned_depart_utc) 

   
  if(isNaN(date))
  {
    return (    
      <td>      {}    
      </td>  )
  }
  else
  {
   return (    
   <td>      {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy, hh:mm").toString()}    
   </td>  )
   }
  }

const actualarrivetime = (props)=>
{  let date = Date.parse(props.dataItem.actual_arrival_utc) 

   
  if(isNaN(date))
  {
    return (    
      <td>      {}    
      </td>  )
  }
  else
  {
   return (    
   <td>      {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy, hh:mm").toString()}    
   </td>  )
   }
  }

const actualdeparttime = (props)=>
{  let date = Date.parse(props.dataItem.actual_departure_utc) 
   
  if(isNaN(date))
  {
    return (    
      <td>      {}    
      </td>  )
  }
  else
  {
   return (    
   <td>      {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy, hh:mm").toString()}    
   </td>  )
   }
  }

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <h2 className="header-title">Detailed History</h2>
            <div className="container special_container_padding"></div>
            {trailerHistory?.length > 0 ? (
              <Grid
                filter={dataState.filter}
                filterable={true}
                sort={dataState.sort}
                sortable={true}
                pageable={{
                  pageSizes: [5, 10, 20, 25, 50, 100],
                  info: true,
                  previousNext: true,
                  buttonCount : 10
                }}
                resizable={true}
                skip={dataState.skip}
                take={dataState.take}
                data={dataResult}
                onDataStateChange={dataStateChange}
                onRowClick={(e) => props.parentcallback(true, e.dataItem)}
              >
                <GridColumn
                  field="trailer_id"
                  title="Trailer Id"
                  width="200px"
                />
                <GridColumn field="stop_type" title="Stop Type" width="200px" />
                <GridColumn
                  field="loaded"
                  title="Loaded"
                  width="200px"
                  filter={"boolean"}
                />
                <GridColumn
                  field="driver_load"
                  title="Driver Load Unload Flag"
                  width="200px"
                />
                <GridColumn field="commodity" title="Commodity" width="200px" />
                <GridColumn field="distance" title="Distance" width="200px" />
                <GridColumn field="order_id" title="Order Id" width="200px" />
                <GridColumn field="order_status" title="Order Status" width="200px" />
                <GridColumn field="movement_id" title="Movment ID" width="200px" />
                <GridColumn field="movement_status" title="Movment Status" width="200px" />
                <GridColumn
                  field="location_code"
                  title="Location Code"
                  width="200px"
                />
                <GridColumn
                  field="location_name"
                  title="Location Name"
                  width="200px"
                />
                <GridColumn
                  field="location_address"
                  title="Address"
                  width="200px"
                />
                <GridColumn field="location_city" title="City" width="200px" />
                <GridColumn
                  field="location_state"
                  title="State"
                  width="200px"
                />
                <GridColumn
                  field="responsible_terminal_name"
                  title="Responsible Terminal Name"
                  width="200px"
                />
                <GridColumn
                  field="planned_arrive_utc"
                  title="Planned Arrive"
                  filter={"date"}
                        format="{0:d},{0:t}"
                        width={setPercentage(15)}
                        cell={plannedarriveValue}
                />
                <GridColumn
                  field="planned_depart_utc"
                  title="Planned Depart"
                  filter={"date"}
                        format="{0:d},{0:t}"
                        width={setPercentage(15)}
                        cell={planneddeparttime}
                 
                />
                <GridColumn
                  field="actual_arrival_utc"
                  title="Actual Arrive"
                  filter={"date"}
                        format="{0:d},{0:t}"
                        width={setPercentage(15)}
                        cell={actualarrivetime}
                  
                />
                <GridColumn
                  field="actual_departure_utc"
                  title="Actual Depart"
                  filter={"date"}
                  format="{0:d},{0:t}"
                  width={setPercentage(15)}
                  cell={actualdeparttime}
            
                />
                <GridColumn field="driver_id" title="Driver Id" width="200px" />
                <GridColumn
                  field="driver_first_name"
                  title="Driver First Name Id"
                  width="200px"
                />
                <GridColumn
                  field="driver_last_name"
                  title="Driver Last Name"
                  width="200px"
                />
                <GridColumn
                  field="tractor_id"
                  title="Tractor Id"
                  width="200px"
                />
              </Grid>
            ) : loading ? (
              <div>
                <ProgressBar animated now={100} />
                <div className="middle loader--text1"> </div>
              </div>
            ) : (
              <div>No data found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerBodyForHistory;
