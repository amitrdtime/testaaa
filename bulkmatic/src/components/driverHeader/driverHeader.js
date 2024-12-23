import React, { useState, useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
import './driverHeader.css';
const DriverHeader = (props) => {
  const { allDrivers,terminalsOptions } = props;
  const [regionList, setRegionList] = useState([])
	const [selectedRegionList, setSelectedRegionList] = useState([]);

    const [terminalList, setTerminalList] = useState([])
	const [selectedTerminalList, setSelectedTerminalList] = useState([]);
	const [prevTerminalList, setprevTerminalList] = useState([]);
	const [terminalListData, setTerminalListData] = useState([]);
	


	useEffect(() => {
		let regions = [];
		let terminals = [];

		let unique = [...new Set(terminalsOptions.map((t) => t.region))];

		unique = Object.values(unique);
		unique.map((el, index) => {
			let regionObj = {};
			regionObj.label = el;
			regionObj.value = index;
			regions.push(regionObj);
		});

		for (let i = 0; i < terminalsOptions.length; i++) {
			let terminalObj = {
				label: `${terminalsOptions[i].code}-${terminalsOptions[i].city}`,
				value: terminalsOptions[i].code,
			};
			terminals.push(terminalObj);
		}
		setRegionList(regions);
		setSelectedRegionList(regions);
		setTerminalList(terminals);
		setTerminalListData(terminals);
	}, [terminalsOptions.length]);

	// function getterminalDropdownButtonLabel({ placeholderButtonLabel }) {
	// 	let label = "";
	// 	for (let i = 0; i < selectedTerminalList.length; i++) {
	// 		label = label + selectedTerminalList[i].label + ", ";
	// 		if (label.length > 6) {
	// 			label = label.substring(0, 6) + "...";
	// 			break;
	// 		}
	// 	}
	// 	return `${placeholderButtonLabel}: ${label}`;
	// }

	useEffect(() => {
		let terminals = [];
		let filterTerminal = terminalsOptions.filter((terminal) =>
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

	useEffect(() => {
		props.parentCallBackForTerminalFilterDriver(
			selectedTerminalList.map((o) => o.value)
		);
	}, [selectedTerminalList]);

	// const filterData = {
	//   terminalId: selectedTerminalList.map((o) => o.value),
	// };

	// useEffect(async () => {
	//  if(selectedTerminalList.length > 0 || prevTerminalList.length > 0){
	//     props.parentCallBackForTerminalFilterDriver(filterData);
	//   }
	//   setprevTerminalList(selectedTerminalList);
	// }, [selectedTerminalList]);

	function onChangeforRegion(value, event) {
		// setSelectedRegionList(option);
		if (event.action === "select-option" && event.option.value === "*") {
			this.setState(this.options);
		} else if (
			event.action === "deselect-option" &&
			event.option.value === "*"
		) {
			this.setState([]);
		} else if (event.action === "deselect-option") {
			this.setState(value.filter((o) => o.value !== "*"));
		} else if (value.length === this.options.length - 1) {
			this.setState(this.options);
		} else {
			this.setState(value);
		}
	}
	function getRegionDropdownButtonLabel({ placeholderButtonLabel, value }) {
		if (value && value.some((o) => o.value === "*")) {
			return `${placeholderButtonLabel}: All`;
		} else {
			return `${placeholderButtonLabel}: ${value.length} selected`;
		}
	}
	function getTerminalDropdownButtonLabel({ placeholderButtonLabel, value }) {
		if (value && value.some((o) => o.value === "*")) {
			return `${placeholderButtonLabel}: All`;
		} else {
			return `${placeholderButtonLabel}: ${value.length} selected`;
		}
	}

	// function onChangeforTerminal(value, event) {
	// 	// setSelectedTerminalList(option);

	// 	if (event.action === "select-option" && event.option.value === "*") {
	// 		this.setState(this.options);
	// 	} else if (
	// 		event.action === "deselect-option" &&
	// 		event.option.value === "*"
	// 	) {
	// 		this.setState([]);
	// 	} else if (event.action === "deselect-option") {
	// 		this.setState(value.filter((o) => o.value !== "*"));
	// 	} else if (value.length === this.options.length - 1) {
	// 		this.setState(this.options);
	// 	} else {
	// 		this.setState(value);
	// 	}
	// }

	
	return (
		<div className="row df mt_30">
			<div className="col-xl-12">
				<div className="card special_bg card_shadow">
					<div className="card-body">
						<div className="row top_adjust">
							<div className="col-md-12">
								<h2 className="text-light">Drivers</h2>
								<p className="user_sec_text">Total: {allDrivers?.length}</p>
								<div className="col-md-8">
									<p className="user_sec_text">
										Active:{" "}
										{allDrivers?.filter((driver) => driver.is_active).length}
										&nbsp;&nbsp;
										{/* Inactive:
                  {allDrivers?.filter((driver) => !driver.is_active).length} */}
									</p>
								</div>
							</div>
						</div>
						<div className="row df top_adjust">
							<div className="w-25">
								{/* <ReactMultiSelectCheckboxes
                  options={[{label:'Select All',value:'*'},...regionList]}
                  placeholderButtonLabel="Region"
                  getDropdownButtonLabel={getRegionDropdownButtonLabel}
                  value={selectedRegionList}
                  onChange={onChangeforRegion}
                  setState={setSelectedRegionList}
                /> */}

								{/* {dropdown for regionslist} */}
								{/* react-picky is used for dropdown multi select	 */}
								{/* {dropdown for terminallist} */}
								{/* {learn more about react-picky https://www.npmjs.com/package/react-picky} */}
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
														<button className="selectall_btn">Clear All</button>
													</div>
												</div>
											);
										}
									}}
								/>
							</div>

							<div className="multiselect ml_30 pr w-25 terminal_drop_fixed">
								<>
									<div className="dropdownadjust">
										{/* <ReactMultiSelectCheckboxes
											options={[
												{ label: "Select All", value: "*" },
												...terminalList,
											]}
											placeholderButtonLabel="Terminals"
											getDropdownButtonLabel={getTerminalDropdownButtonLabel}
											value={selectedTerminalList}
											onChange={onChangeforTerminal}
											setState={setSelectedTerminalList}
										/> */}

										{/* react-picky is used for dropdown multi select	 */}
										{/* {dropdown for terminallist} */}
										{/* {learn more about react-picky https://www.npmjs.com/package/react-picky} */}
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

export default DriverHeader;
