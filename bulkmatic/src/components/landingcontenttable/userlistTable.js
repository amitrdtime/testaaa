import React, { useState, useEffect, useContext } from "react";
import AppFilterService from "../../services/appFilterService";
import { ContextData } from "../appsession/index";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const Table = (props) => {
  const { allUser } = props;
  const [alluserstate, setalluserstate] = useState([]);
  const [loadTable, setLoadTable] = useState(false);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [
        {
          field: "isActive",
          operator: "eq",
          value: true
        }
      ],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const filterOperators = {
    text: [
      {
        text: 'grid.filterContainsOperator',
        operator: 'contains',
      },
    ],
    numeric: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
    date: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
    boolean: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
  };
  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      fontWeight: "bold",
      textAlign:"center !important",
      fontSize: 15,
    },
  }));
  
  const classes = useStyles();
  const [dataResult, setDataResult] = useState(
    process(alluserstate, dataState)
  );
  const [terminals, setTerminals] = useState([]);
  
  const dataStateChange = (event) => {
    setDataResult(process(allUser, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(alluserstate, dataState));
  }, [alluserstate]);


  useEffect(() => {
    if(dataResult.data.length > 0){
      setTimeout(() => {
        setLoadTable(true);
      }, 3000);
    }
  }, [dataResult]);

  useEffect(async () => {
    const userFilterData = new AppFilterService().getUserFilter();
    setTerminals(userFilterData.terminals);
  }, []);

  useEffect(() => {
    let arr = [];
    if (allUser.length > 0) {
      for (let index = 0; index < allUser.length; index++) {
        
        let userRoleMap = allUser[index].roles.map((e) => e.roleName).join();
        let userTerminalMap = allUser[index].terminalnames.map((name) => name).join(", ");
        
        arr.push(Object.assign(allUser[index], { allTerminal: userTerminalMap , allRoles: userRoleMap }));
      }
      setalluserstate(arr);
    }
  }, [allUser.length]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {loadTable ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    pageSizes: [20, 30],
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
                    field="isActive"
                    sortable={false}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isActive ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.isActive ? "True" : "False"}
                        </td>
                      );
                    }}
                    title="Is Active"
                    width="150px"
                    filterable={true}

                    filter={"boolean"}
                  />
                  <GridColumn field="userName" title="User" filterable={true} />

                  <GridColumn
                    field="allRoles"
                    title="Roles"
                    filterable={true}
                  />
                  <GridColumn
                    field="allTerminal"
                    title="Terminal"
                    filterable={true}
                  />
                  <GridColumn field="Email" title="Email" filterable={true} />
                  <GridColumn
                    field="Phone"
                    title="Phone No"
                    filterable={true}
                  />
                </Grid>
              ) : (
                <div>
                <ProgressBar animated now={100} 
                />
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
