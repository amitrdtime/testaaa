import React, { useState, useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const CommoditygroupHeader = (props) => {
  const {
    commodityDropdown,
    allCommodityGroup,
    parentCallBackForCommodityGroupFilter,
  } = props;

  const [searchData, setsearchData] = useState("");
  // @ 2 state for creating new commodity group dropdown
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  // @ 2 state for creating new code dropdown
  const [selectedCodeOptions, setSelectedCodeOptions] = useState([]);
  const [codeOptions, setCodeOptions] = useState([]);

  useEffect(() => {
    let arrayofdescription = [];
    let arrayofcode = [];

    for (let i = 0; i < commodityDropdown.length; i++) {
      let obj = {
        label: commodityDropdown[i].description,
        value: commodityDropdown[i].name,
      };
      arrayofdescription.push(obj);
    }
    setOptions(arrayofdescription);

    for (let i = 0; i < commodityDropdown.length; i++) {
      let obj = {
        label: commodityDropdown[i].code,
        value: commodityDropdown[i].code,
      };
      arrayofcode.push(obj);
    }
    setCodeOptions(arrayofcode);
  }, [commodityDropdown.length]);

  const filterData = {
    code: selectedCodeOptions.map((o) => o.value),
    description: selectedOptions.map((itme) => itme.value),
    search: searchData,
  };

  useEffect(() => {
    parentCallBackForCommodityGroupFilter(filterData);
  }, [selectedCodeOptions, selectedOptions]);

  const searchHandler = (e) => {
    parentCallBackForCommodityGroupFilter(filterData);
  };

  return (
    <React.StrictMode>
      <div className="row df mt_30">
        <div className="col-xl-12">
          <div className="card special_bg">
            <div className="card-body">
              <div className="row top_adjust">
                <div className="col-md-12">
                  <h2 className="text-light">Commodity Groups</h2>
                  <p className="user_sec_text">
                    Total: {allCommodityGroup?.length}
                  </p>
                </div>
                <div className="col-md-4"></div>
              </div>
              <div className="row df top_adjust"></div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default CommoditygroupHeader;
