import React, { useState, useEffect, useContext } from "react";
import TerminalService from "../../services/terminalService";
import { ContextData } from "../../components/appsession";

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

import { Calendar } from "@progress/kendo-react-dateinputs";

import "react-datepicker/dist/react-datepicker.css";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";
const YardcheackHeader = (props) => {
	const { currentTerminalCount, yardCheckLength, terminalsOptions } = props;
	const [userData, setuserData] = useContext(ContextData);
	const [regionList, setRegionList] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState([]);
	const [terminalList, setTerminalList] = useState([]);
	const [terminalListData, setTerminalListData] = useState([]);
	const [selectedTerminal, setSelectedTerminal] = useState([]);
	const [userTerminals, setUserTerminals] = useState([]);

	// const [calenderDrpdownClicked, setcalenderDrpdownClicked] = useState(false);
	// const [selectedDate, setselectedDate] = useState(() => {
	//   return new Date();
	// });

	// const [terminaldropdown, setterminaldropdown] = useState([]);
	// const [yardCheckList, setyardCheckList] = useState([]);

	//   const yardSearchHandler = (e) => {
	//     setsearchData(e.target.value);
	//   };
	//   const searchHandler = (e) => {
	//     props.parentCallBackForYardFilter(searchData, startDate, endDate);
	//   };
	//   const handleKeyPress = (e) => {
	//     if (e.key === "Enter") {
	//       searchHandler();
	//     }
	//   };

	useEffect(() => {
		// const userTerminalIds = await userData.terminals;
		// if (userTerminalIds?.length > 0) {
		//   const terminalService = new TerminalService();
		//   let terminalInformation = await terminalService.getTerminalByIds(
		//     userTerminalIds
		//   );
		//   setUserTerminals(terminalInformation);
		let regions = [];
		let terminals = [];
		let uniqueRegion = [...new Set(terminalsOptions.map((r) => r.region))];
		uniqueRegion = Object.values(uniqueRegion);
		uniqueRegion.map((el, index) => {
			let regionObj = {
				label: el,
				value: index,
			};
			regions.push(regionObj);
		});
		for (let i = 0; i < terminalsOptions.length; i++) {
			let terminalObj = {
				label: `${terminalsOptions[i].code}-${terminalsOptions[i].city}`,
				value: terminalsOptions[i].code,
			};
			terminals.push(terminalObj);
		}
		console.log(regions);
		setRegionList(regions);
		setSelectedRegion(regions);
		setTerminalList(terminals);
		setTerminalListData(terminals);
		// if (terminalInformation.length > 0) {
		//   let terminalDetails = [];
		//   let AccessTerminals = [];
		//   terminalInformation.forEach((element) => {
		//     let obj = {
		//       terminalName: element.code.trim() + " - " + element.city.trim(),
		//       terminalId: element.code,
		//     };
		//     terminalDetails.push(obj);
		//     AccessTerminals.push(element.code);
		//   });
		//   setterminaldropdown(terminalDetails);
		// }}
	}, [terminalsOptions.length]);

	// useEffect(async () => {
	//   if (terminaldropdown.length > 0) {
	//     const yardService = new YardService();
	//     let AccessTerminals = [];
	//     terminaldropdown.forEach((element) => {
	//       AccessTerminals.push(element.terminalId);
	//     });
	//     let yardCheckList = await yardService.getbyyards(AccessTerminals);
	//     setyardCheckList(yardCheckList);
	//   }
	// }, [terminaldropdown]);

	useEffect(() => {
		let terminal = [];
		let filterTerminal = userTerminals.filter((terminal) =>
			selectedRegion.map((o) => o.label).includes(terminal.region)
		);
		filterTerminal.map((el, index) => {
			let terminalObj = {
				label: `${el.code}-${el.city}`,
				value: index,
			};
			terminal.push(terminalObj);
		});
		setTerminalList(terminal);
		setSelectedTerminal(terminal);
		if (selectedRegion.length == 0) {
			setTerminalList(terminalListData);
		}
	}, [selectedRegion.length]);

	useEffect(() => {
		let terminals = [];
		let filterTerminal = terminalsOptions.filter((terminal) =>
			selectedRegion.map((o) => o.label).includes(terminal.region)
		);
		for (let i = 0; i < filterTerminal.length; i++) {
			let terminalObj = {
				label: `${filterTerminal[i].code}-${filterTerminal[i].city}`,
				value: filterTerminal[i].code,
			};
			terminals.push(terminalObj);
		}
		setTerminalList(terminals);
		setSelectedTerminal(terminals);
		if (selectedRegion.length == 0) {
			setTerminalList(terminalListData);
			setSelectedTerminal([]);
		}
	}, [selectedRegion]);

	useEffect(() => {
		props.parentCallback(selectedTerminal.map((terminal) => terminal.value));
	}, [selectedTerminal]);

	const onChangeRegion = (option) => {
		setSelectedRegion(option);
	};

	const onChangeTerminal = (option) => {
		setSelectedTerminal(option);
	};

	// const calenderDropdownSelectHandler = (event) => {
	//   setselectedDate(event.value);
	//   setcalenderDrpdownClicked(false);
	// };

	return (
		<div className="row df mt_30">
			<div className="tabs">
				<input type="radio" name="tabs" id="tabone" checked={true} />
				<label for="tabone">Yard Checks</label>
				<div className="tab">
					<div class="card-body">
						{/* <div class="row top_adjust">
              <div class="col-md-2">
                <p className="user_sec_text">
                  Total:{" "}
                  {currentTerminalCount == 0
                    ? yardCheckLength
                    : currentTerminalCount}
                </p>
              </div>
            </div> */}
						 
						<div className="row df top_adjust">
							<div className="w-25">
								<Picky
									options={regionList}
									labelKey="label"
									valueKey="value"
									placeholder="Regions"
									multiple={true}
									includeFilter
									includeSelectAll
									value={selectedRegion}
									numberDisplayed={1}
									manySelectedPlaceholder="Regions : %s "
									allSelectedPlaceholder="Regions : All"
									onChange={setSelectedRegion}
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
															setSelectedRegion([]);
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
								<div className="dropdownadjust">
									<Picky
										options={terminalList}
										labelKey="label"
										valueKey="value"
										placeholder="Terminals"
										multiple={true}
										includeFilter
										includeSelectAll
										value={selectedTerminal}
										numberDisplayed={1}
										manySelectedPlaceholder="Terminals : %s "
										allSelectedPlaceholder="Terminals : All"
										onChange={setSelectedTerminal}
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
																setSelectedTerminal([]);
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
							{/* <div className="multiselect ml_30 mt_32 pr date_width_adjust">
                <div
                  className="selectBox"
                  onClick={() =>
                    setcalenderDrpdownClicked(!calenderDrpdownClicked)
                  }
                >
                  <select>
                    <option>Calendar</option>
                  </select>
                  <div className="overSelect"></div>
                </div>
                {calenderDrpdownClicked ? (
                  <div className="multiselect_select">
                    <Calendar
                      onChange={calenderDropdownSelectHandler}
                      value={selectedDate}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default YardcheackHeader;
