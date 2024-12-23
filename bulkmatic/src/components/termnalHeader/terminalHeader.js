import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import {
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TerminalService from "../../services/terminalService";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Picky } from "react-picky";
import "react-picky/dist/picky.css";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    maxWidth: 140,
    color: "#fff",
  },
  placeholderStyle: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "0.875rem",
  },
  selectFont: {
    fontFamily: "IBM Plex Sans",
    fontWeight: "400",
    color: "#fff !important",
    "&:before": {
      borderColor: "#fff",
    },
    "&:after": {
      borderColor: "#fff",
    },
  },
  icon: {
    fill: "#fff",
  },

  chips: {
    // display: "flex",
    // flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TerminalHeader = (props) => {

  const classes = useStyles();

  const { totalCount, allTerminal,  handelcallbackFromTrailer,  terminalsOptions } = props;
  const [searchData, setsearchData] = useState("");
  const [regionList, setRegionList] = useState([]);
  const [selectedRegionList, setSelectedRegionList] = useState([]);

  const [terminalList, setTerminalList] = useState([]);
  const [selectedTerminalList, setSelectedTerminalList] = useState([]);

  const [terminalListData, setTerminalListData] = useState([]);
  const [hide, setHide] = useState(false)

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
    // setSelectedRegionList(regions)
    setTerminalList(terminals);
    setTerminalListData(terminals);
  }, [terminalsOptions.length]);

  function getterminalDropdownButtonLabel({ placeholderButtonLabel }) {
    let label = "";
    for (let i = 0; i < selectedTerminalList.length; i++) {
      label = label + selectedTerminalList[i].label + ", ";
      if (label.length > 6) {
        label = label.substring(0, 6) + "...";
        break;
      }
    }
    return `${placeholderButtonLabel}: ${label}`;
  }

  useEffect(() => {
    let terminals = [];
    let filterTerminal = terminalsOptions.filter((terminal) =>
      selectedRegionList.map((o) => o.label).includes(terminal.region)

    );
    console.log("filterTerminal", filterTerminal)
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
    }
  }, [selectedRegionList]);


  useEffect(() => {
    handelcallbackFromTrailer(selectedTerminalList?.map((o) => o.value));
  }, [selectedTerminalList]);

  function onChangeforRegion(option) {
    setSelectedRegionList(option);
  }
  function onChangeforTerminal(option) {
    setSelectedTerminalList(option);
  }

  


  const searchInputHandler = (e) => {
    setsearchData(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };
  const searchHandler = (e) => {

    props.parentCallBackForRegionFilter(filterData);
  };
  return (
		<div className="row df mt_30">
			<div className="col-xl-12">
				<div className="card special_bg card_shadow">
					<div className="card-body">
						<div className="row top_adjust"></div>
						<div className="col-md-12">
							<h2 className="text-light">Terminals</h2>
							<p className="user_sec_text">Total: {allTerminal?.length}</p>
						</div>

						<div className="row df top_adjust">
							<div className="multiselect pr w-25 terminal_drop_fixed">
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

									{hide ? (
										<div className="multiselect ml_30 pr terminal_drop_fixed">
											<>
												<div className="dropdownadjust">
													<ReactMultiSelectCheckboxes
														options={[...terminalList]}
														placeholderButtonLabel="Terminals"
														getDropdownButtonLabel={
															getterminalDropdownButtonLabel
														}
														value={selectedTerminalList}
														onChange={onChangeforTerminal}
														setState={setSelectedTerminalList}
													/>
												</div>
											</>
										</div>
									) : (
										""
									)}
								
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TerminalHeader;
