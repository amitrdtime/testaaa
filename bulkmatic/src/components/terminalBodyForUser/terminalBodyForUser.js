import React, { useState, useEffect } from "react";
import UserService from "../../services/userService";

import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

import ProgressBar from "react-bootstrap/ProgressBar";

const terminalBodyForUser = (props) => {
  const { terminal } = props;

  const [allUser, setallUser] = useState([]);
  const [isPlanner, setIsPlanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 15,
    filter: {
      logic: "and",
      filters: [
        {
          field: "isActive",
          operator: "eq",
          value: true,
        },
      ],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [dataResult, setDataResult] = useState(process(allUser, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allUser, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allUser, dataState));
  }, [allUser]);

  useEffect(async () => {
    const userService = new UserService();
    setLoading(true);
    userService
      .getUsersByTerminal(terminal.id.toString())
      .then(function (users) {
        let newData = [];
        for (let i = 0; i < users.length; i++) {
          let temp = users[i];
          let roleName = temp.roles[0]?.roleName;
          temp.roleName = roleName;

          // const userService1 = new UserService();
          // userService1
          //   .getAllUsers()
          //   .then(function (users1) {
          //     const result = users1.filter((obj) =>
          //       obj.defaultPlanners.includes(terminal.id.toString())
          //     );
          //     if (result.length > 0) {
          //       // temp.userNameWithdefaultPlanners =
          //       //   result[0].userName + " (" + "Default Planner" + ")";
          //       console.log("result", result);
          //       setIsPlanner(result);
          //     }
          //   })
          //   .catch(function (error) {
          //     console.log(error);
          //   });

          newData.push(temp);
        }
        setallUser(newData);
        setLoading(false);
        props.parentCallBackFromTerminalBodyForUser(newData);
      });
  }, []);

  useEffect(async()=>{
    const userService1 = new UserService();
    const accessProfileData1 = await userService1.getAllUsers();
    const result=accessProfileData1.filter(obj=> obj.defaultPlanners.includes(terminal.id.toString()));
    setIsPlanner(result)
  },[])

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table_header_section w-96">
              <h2 className="header-title">Users</h2>
            </div>
            {allUser?.length > 0 ? (
              <Grid
                filter={dataState.filter}
                filterable={true}
                sort={dataState.sort}
                sortable={true}
                pageable={{
                  buttonCount: 10,
                  info: true,
                  previousNext: true,
                  pageSizes: true,
                }}
                resizable={true}
                skip={dataState.skip}
                take={dataState.take}
                data={dataResult}
                onDataStateChange={dataStateChange}
              >
                <GridColumn
                  field="userName"
                  title="Name"
                  width="300px"
                  filterable={true}
                  cell={(e) => {
                    return (
                      <td>
                        {e.dataItem?.userName === isPlanner[0]?.userName
                          ? e.dataItem?.userName + " (Default Planner)"
                          : e.dataItem?.userName}
                      </td>
                      // <td>
                      //   {e.dataItem.userName
                      //     ? e.dataItem.userName
                      //     : e.dataItem.userName}
                      // </td>
                    );
                  }}
                />
                <GridColumn
                  field="Email"
                  title="Email"
                  width="400px"
                  filterable={true}
                  cell={(e) => {
                    return (
                      <td>{e.dataItem.Email ? e.dataItem.Email : ""}</td>
                    );
                  }}
                />
                <GridColumn
                  field="Phone"
                  title="Phone"
                  width="300px"
                  filterable={true}
                  cell={(e) => {
                    return (
                      <td>{e.dataItem.Phone ? e.dataItem.Phone : ""}</td>
                    );
                  }}
                />
                <GridColumn
                  field="roleName"
                  title="Role"
                  width="300px"
                  filterable={true}
                  cell={(e) => {
                    return (
                      <td>
                        {e.dataItem.roleName ? e.dataItem.roleName : ""}
                      </td>
                    );
                  }}
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

export default terminalBodyForUser;
