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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    // minWidth: 140,
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
    display: "flex",
    flexWrap: "wrap",
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

const LoadUnloadruleHeader = (props) => {
  const classes = useStyles();

  const { allLoadUnloadTimes, parentCallBackForLUTFilter, commodityDropdown } = props;
  const [searchData, setsearchData] = useState("");
  const [codeDropdown, setCodeDropdown] = useState([]);
  const [descriptionDropdown, setDescriptioDropdown] = useState([]);

  const filterData = {
    code: codeDropdown,
    description: descriptionDropdown,
    search: searchData,
  };

  useEffect(() => {
    parentCallBackForLUTFilter(filterData);
  }, [codeDropdown, descriptionDropdown]);


  const searchInputHandler = (e) => {
    setsearchData(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };
  const searchHandler = (e) => {
    parentCallBackForLUTFilter(filterData);
  };

 

  return (
    <React.StrictMode>
      <div className="row df mt_30">
        <div className="col-md-6 col-xl-12">
          <div className="card special_bg">
            <div className="card-body">
              <div className="row top_adjust">
                <div className="col-md-4">
                  <p className="user_sec_text">
                    Total List of Load/ Unload durations: {allLoadUnloadTimes?.length}
                  </p>
                </div>
                <div className="col-md-4">
                  
                </div>
              </div>
              <div className="row df top_adjust">
                <div className="input-group w-30">
                  <input
                    type="search"
                    className="form-control place_back"
                    placeholder="Search..."
                    id="top-search"
                    style={{ zIndex: "1" }}
                    onChange={(e) => searchInputHandler(e)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn input-group-text search_btn"
                    type="submit"
                    onClick={(e) => searchHandler(e)}
                  >
                    <i
                      className="fa fa-search f_color_white"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div className="vl mobile_hide mt_6"></div>
                <div className="multiselect ml_30 terminal_drop_fixed pr">
                  <>
                    <FormControl className={classes.formControl}>
                      <Select
                        className={classes.selectFont}
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        displayEmpty
                        value={descriptionDropdown}
                        onChange={(e) => setDescriptioDropdown(e.target.value)}
                        input={<Input />}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <em className={classes.placeholderStyle}>Name</em>
                            );
                          }
                          return selected.join(", ");
                        }}
                        inputProps={{
                          classes: {
                            icon: classes.icon,
                          },
                        }}
                        MenuProps={MenuProps}
                      >
                        {commodityDropdown.length > 0 &&
                          commodityDropdown.map((item) => (
                            <MenuItem key={item.id} value={item.description}>
                              <Checkbox
                                checked={descriptionDropdown.indexOf(item.description) > -1}
                              />
                              <ListItemText primary={item.description} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </>
                </div>
                <div className="vl mobile_hide mt_6"></div>
                <div className="multiselect ml_30 terminal_drop_fixed pr">
                  <>
                    <FormControl className={classes.formControl}>
                      <Select
                        className={classes.selectFont}
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        displayEmpty
                        value={codeDropdown}
                        onChange={(e) => setCodeDropdown(e.target.value)}
                        input={<Input />}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <em className={classes.placeholderStyle}>Code</em>
                            );
                          }
                          return selected.join(", ");
                        }}
                        inputProps={{
                          classes: {
                            icon: classes.icon,
                          },
                        }}
                        MenuProps={MenuProps}
                      >
                        {commodityDropdown.length > 0 &&
                          commodityDropdown.map((item) => (
                            <MenuItem key={item.id} value={item.code}>
                              <Checkbox
                                checked={codeDropdown.indexOf(item.code) > -1}
                              />
                              <ListItemText primary={item.code} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default LoadUnloadruleHeader;
