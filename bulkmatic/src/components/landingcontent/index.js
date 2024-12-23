import React, { useState, useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
const LandingContent = (props) => {
  const {
    allUser,
    rolesOptions,
    newTerminalsOptions,
  } = props;
  const [searchData, setsearchData] = useState("");

  // creating roles dropdown
  const [selectedroleOptions, setSelectedroleOptions] = useState([]);
  const [roleOptions, setroleOptions] = useState([]);

  const [regionList, setRegionList] = useState([]);
  const [selectedRegionList, setSelectedRegionList] = useState([]);
  const [terminalList, setTerminalList] = useState([]);
  const [selectedTerminalList, setSelectedTerminalList] = useState([]);

  const [terminalListData, setTerminalListData] = useState([])

  useEffect(() => {
    let rolesdropdown = [];

    for (let i = 0; i < rolesOptions.length; i++) {
      let obj = {
        label: rolesOptions[i].roleName,
        value: rolesOptions[i].roleId,
      };

      rolesdropdown.push(obj);
    }
    setroleOptions(rolesdropdown);
  }, [rolesOptions.length]);

  useEffect(() => {
    let regions = [];
    let terminals = [];

    let unique = [...new Set(newTerminalsOptions.map((t) => t.region))];

    unique = Object.values(unique);
    unique.map((el, index) => {
      let regionObj = {};
      regionObj.label = el;
      regionObj.value = index;
      regions.push(regionObj);
    });

    for (let i = 0; i < newTerminalsOptions.length; i++) {
      let terminalObj = {
        label: `${newTerminalsOptions[i].code}-${newTerminalsOptions[i].city}`,
        value: newTerminalsOptions[i].code,
      };
      terminals.push(terminalObj);
    }
    setRegionList(regions);
    setSelectedRegionList(regions)
    setTerminalList(terminals);
    setTerminalListData(terminals);
  }, [newTerminalsOptions.length]);

  useEffect(() => {
    let terminals = [];

    let filterTerminal = newTerminalsOptions.filter((terminal) =>
      selectedRegionList.map((o) => o.label).includes(terminal.region)
    );
    for (let i = 0; i < filterTerminal.length; i++) {
      let terminalObj = {
        label: `${filterTerminal[i].code}-${filterTerminal[i].city}`,
        value: filterTerminal[i].code,
      };
      terminals.push(terminalObj);
    }

    setTerminalList(terminals);
    setSelectedTerminalList(terminals);

    if (selectedRegionList.length == 0) {
      setTerminalList(terminalListData);
       setSelectedTerminalList([]);
    }
  }, [selectedRegionList]);
 
  function getroleDropdownButtonLabel({ placeholderButtonLabel }) {
    let label = "";
    for (let i = 0; i < selectedroleOptions.length; i++) {
      label = label + selectedroleOptions[i].label + ", ";
      if (label.length > 6) {
        label = label.substring(0, 6) + "...";
        break;
      }
    }
    return `${placeholderButtonLabel}: ${label}`;
  }

  function onChangeforrole(option) {
    setSelectedroleOptions(option);
  }

  function onChangeforRegion(option) {
    setSelectedRegionList(option);
  }

  function onChangeforTerminal(option) {
    setSelectedTerminalList(option);
  }

  const filterData = {
    search: searchData,
    terminals: selectedTerminalList.map((o) => o.value),
    roles: selectedroleOptions.map((o) => o.value),
  };

  useEffect(() => {
    props.parentCallBackForUserFilter(selectedTerminalList.map((o) => o.value));
  }, [selectedTerminalList]);

  return (
		<div className="row df mt_30">
			<div className="col-md-6 col-xl-12">
				<div className="card special_bg">
					<div className="card-body">
						<div className="row top_adjust">
							<div className="col-md-12">
								<h2 class="text-light">Users</h2>
								<p className="user_sec_text">Total: {allUser?.length}</p>
							</div>
							<div className="col-md-12">
								<p className="user_sec_text">
									Inactive: {allUser?.filter((user) => !user.isActive).length}
								</p>
							</div>
						</div>
						<div className="row df top_adjust">
							<div className="multiselect  pr w-25 terminal_drop_fixed">

								<div className="dropdownadjust">
								
									<Picky
										options={roleOptions}
										labelKey="label"
										valueKey="value"
										placeholder="Roles"
										multiple={true}
										includeFilter
										includeSelectAll
										value={selectedroleOptions}
										numberDisplayed={1}
										manySelectedPlaceholder="Roles : %s "
										allSelectedPlaceholder="Roles : All"
										onChange={setSelectedroleOptions}
										renderSelectAll={({
											filtered,
											tabIndex,
											allSelected,
											toggleSelectAll,
											multiple,
										}) => {
											// Don't show if single select or items have been filtered.
											if (multiple && !filtered) {
												return (
													<div className="select_multiple_container">
														<div
															tabIndex={tabIndex}
															role="option"
															// className={
															// 	allSelected ? "option selected" : "option"
															// }
															className="option"
															onClick={toggleSelectAll}
															onKeyPress={toggleSelectAll}
														>
															<button className="selectall_btn">
																Select all
															</button>
														</div>
														<div
															tabIndex={tabIndex}
															role="option"
															// className={
															// 	allSelected ? "option selected" : "option"
															// }
															className="option"
															onClick={() => {
																setSelectedroleOptions([]);
															}}
															onKeyPress={toggleSelectAll}
														>
														<button className="selectall_btn">Clear All</button>
														</div>
													</div>
												);
											}
										}}
									/>
								</div>
							</div>
							<div className="multiselect ml_30 pr w-25 terminal_drop_fixed">
								{" "}
								<div className="dropdownadjust">
									
									<Picky
										options={regionList}
										labelKey="label"
										valueKey="value"
										placeholder="Regions"
										multiple={true}
										includeFilter
										includeSelectAll
										value={selectedRegionList}
										numberDisplayed={1}
										manySelectedPlaceholder="Regions : %s "
										allSelectedPlaceholder="Regions : All"
										onChange={setSelectedRegionList}
										renderSelectAll={({
											filtered,
											tabIndex,
											allSelected,
											toggleSelectAll,
											multiple,
										}) => {
											// Don't show if single select or items have been filtered.
											if (multiple && !filtered) {
												return (
													<div className="select_multiple_container">
														<div
															tabIndex={tabIndex}
															role="option"
															// className={
															// 	allSelected ? "option selected" : "option"
															// }
															className="option"
															onClick={toggleSelectAll}
															onKeyPress={toggleSelectAll}
														>
															<button className="selectall_btn">
																Select all
															</button>
														</div>
														<div
															tabIndex={tabIndex}
															role="option"
															// className={
															// 	allSelected ? "option selected" : "option"
															// }
															className="option"
															onClick={() => {
																setSelectedRegionList([]);
															}}
															onKeyPress={toggleSelectAll}
														>
															<button className="selectall_btn">
																Clear All
															</button>
														</div>
													</div>
												);
											}
										}}
									/>
								</div>
							</div>

							<div className="multiselect ml_30 pr w-25 terminal_drop_fixed">
								<>
									<div className="dropdownadjust">
									
										<Picky
											options={terminalList}
											labelKey="label"
											valueKey="value"
											placeholder="Terminals"
											multiple={true}
											includeFilter
											includeSelectAll
											value={selectedTerminalList}
											numberDisplayed={1}
											manySelectedPlaceholder="Terminals : %s "
											allSelectedPlaceholder="Terminals : All"
											onChange={setSelectedTerminalList}
											renderSelectAll={({
												filtered,
												tabIndex,
												allSelected,
												toggleSelectAll,
												multiple,
											}) => {
												// Don't show if single select or items have been filtered.
												if (multiple && !filtered) {
													return (
														<div className="select_multiple_container">
															<div
																tabIndex={tabIndex}
																role="option"
																// className={
																// 	allSelected ? "option selected" : "option"
																// }
																className="option"
																onClick={toggleSelectAll}
																onKeyPress={toggleSelectAll}
															>
																<button className="selectall_btn">
																	Select all
																</button>
															</div>
															<div
																tabIndex={tabIndex}
																role="option"
																// className={
																// 	allSelected ? "option selected" : "option"
																// }
																className="option"
																onClick={() => {
																	setSelectedTerminalList([]);
																}}
																onKeyPress={toggleSelectAll}
															>
																<button className="selectall_btn">
																	Clear All
																</button>
															</div>
														</div>
													);
												}
											}}
										/>
									</div>
								</>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LandingContent;
