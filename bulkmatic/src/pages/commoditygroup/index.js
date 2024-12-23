import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import CommoditygroupHeader from "../../components/commoditygroupHeader/commoditygroupHeader";
import CommoditygroupTable from "../../components/commoditygroupTable/commoditygroupTable";
import React, { useState, useEffect } from "react";
import CommoditygroupByIdHeader from "../../components/commoditygroupByIdHeader/commoditygroupByIdHeader";
import CgByIdHeader from "../../components/commoditygroupByIdHeader/CgByIdHeader";
import CommoditygroupBodyForDetails from "../../components/commoditygroupBodyForDetails/commoditygroupBodyForDetails";
import CommoditygroupBodyForTrailers from "../../components/commoditygroupBodyForTrailers/commoditygroupBodyForTrailers";
import CommoditygroupBodyForTrailersInDetails from "../../components/CommoditygroupBodyForTrailersInDetails/CommoditygroupBodyForTrailersInDetails";
import CommoditygroupService from "../../services/commoditygroupService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { DateTime } from "luxon";

function CommodityGroup() {
  const [allCommodityGroup, setallCommodityGroup] = useState([]);
  const [commodityGrouprClicked, setcommodityGrouprClicked] = useState(false);
  const [commoditygroupById, setcommoditygroupById] = useState({});
  const [allTrailersDetails, setallTrailersDetails] = useState([]);
  const [headerTabName, setheaderTabName] = useState("details");
  const [commodityDropdown, setCommodityDropdown] = useState([]);
  const [commoditygroupid, setcommoditygroupid] = useState("");

  const handelcallbackFromHeader = (childdata) => {
    setcommodityGrouprClicked(childdata);
    setheaderTabName("details");
  };

  const parentCallBackForCommodityGroupFilter = async (filterData) => {
    const commoditygroupService = new CommoditygroupService();
    commoditygroupService
      .filterCommoditygroup(filterData)
      .then(function (commodityGroup) {
        setallCommodityGroup(commodityGroup);
        let a = commodityGroup.filter((it) => it.id === commoditygroupid);

        console.log("samanta1", a[0]);
        if (a[0]) {
          setcommoditygroupById(a[0]);
        }
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  };

  const handelcallback = (childdata, commoditygroup) => {
    console.log("commoditygroup", commoditygroup);
    setcommoditygroupid(commoditygroup.id);
    setcommoditygroupById(commoditygroup);
    setcommodityGrouprClicked(childdata);
  };

  const handelcallbackFromLocationHeader = (childdata) => {
    setheaderTabName(childdata);
  };

  useEffect(async () => {
    const commoditygroupService = new CommoditygroupService();
    commoditygroupService
      .getAllCommodityGroups()
      .then(function (commodityGroup) {
        console.log("commodityGroup", commodityGroup);
        setallCommodityGroup(commodityGroup);
        setCommodityDropdown(commodityGroup);
        setallCommodityGroupCount(commodityGroup.length);
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  }, []);

  const parentCallBackFromTrailerGroup = (trailerdata) => {
    setallTrailersDetails(trailerdata);
  };
  useEffect(() => {}, []);

  const callbackAftersave = () => {
    const commoditygroupService = new CommoditygroupService();
    commoditygroupService
      .getAllCommodityGroups()
      .then(function (commodityGroup) {
        console.log("samanta", commodityGroup);
        setallCommodityGroup(commodityGroup);
        // setCommodityDropdown(commodityGroup);
        // setallCommodityGroupCount(commodityGroup.length);
        console.log("samanta2", commoditygroupid);
        let a = commodityGroup.filter((it) => it.id === commoditygroupid);

        console.log("samanta1", a[0]);
        if (a[0]) {
          setcommoditygroupById(a[0]);
        }
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  };

  const callbackAfterrefresh = () => {
    const commoditygroupService = new CommoditygroupService();
    commoditygroupService
      .getAllCommodityGroups()
      .then(function (commodityGroup) {
        console.log("sa", commodityGroup);
        setallCommodityGroup(commodityGroup);
        // setCommodityDropdown(commodityGroup);
        // setallCommodityGroupCount(commodityGroup.length);
        console.log("sa1", commoditygroupid);
        let a = commodityGroup.filter((it) => it.id === commoditygroupid);

        console.log("sa3", a[0]);
        if (a[0]) {
          setcommoditygroupById(a[0]);
        }
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  };

  const convertDateTime = (epoch_date) => {
    return (
      <td>
        {DateTime.fromMillis(parseInt(epoch_date * 1000))
          .toFormat("MM-dd-yyyy, hh:mm")
          .toString()}
      </td>
    );
  };

  return (
    <div id="wrapper">
      <Header
        userclicked={commodityGrouprClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!commodityGrouprClicked ? (
              <>
                <CommoditygroupHeader
                  commodityDropdown={commodityDropdown}
                  allCommodityGroup={allCommodityGroup}
                  parentCallBackForCommodityGroupFilter={
                    parentCallBackForCommodityGroupFilter
                  }
                />
                <CommoditygroupTable
                  allCommodityGroup={allCommodityGroup}
                  parentcallback={handelcallback}
                />
              </>
            ) : (
              <>
                {/* <CommoditygroupByIdHeader
                  commoditygroupById={commoditygroupById}
                  parentcallback={handelcallbackFromLocationHeader}
                  allTrailersDetails={allTrailersDetails}
                /> */}
                <CgByIdHeader
                  commoditygroupById={commoditygroupById}
                  setcommoditygroupById={setcommoditygroupById}
                  parentcallback={handelcallbackFromLocationHeader}
                  allTrailersDetails={allTrailersDetails}
                  callbackAftersave={callbackAftersave}
                  callbackAfterrefresh={callbackAfterrefresh}
                  setallCommodityGroup={setallCommodityGroup}
                />
                {headerTabName === "details" ? (
                  <div className="row special_row_flex">
                    <CommoditygroupBodyForDetails
                      commoditygroup={commoditygroupById}
                      allCommodityGroup={allCommodityGroup}
                      setcommoditygroupById={setcommoditygroupById}
                      callbackAftersave={callbackAftersave}
                      convertDateTime={convertDateTime}
                    />
                    <CommoditygroupBodyForTrailersInDetails
                      commoditygroup={commoditygroupById}
                      parentCallBackFromTrailerGroup={
                        parentCallBackFromTrailerGroup
                      }
                      convertDateTime={convertDateTime}
                    />
                  </div>
                ) : headerTabName === "Trailers" ? (
                  <CommoditygroupBodyForTrailers
                    commoditygroup={commoditygroupById}
                    parentCallBackFromTrailerGroup={
                      parentCallBackFromTrailerGroup
                    }
                  />
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommodityGroup;
