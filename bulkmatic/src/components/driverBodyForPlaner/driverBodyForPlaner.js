import React, { useState, useEffect } from 'react';
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg"
import PlannerService from '../../services/plannerService.';
import TerminalTrailerList from '../terminalTrailerList';


const DriverBodyForPlaner = (props) => {
    const { terminal } = props;
    const [filterData, setFilterData] = useState('');
    const [isReloadAgain, setIsReloadAgain] = useState(false);
    const [allPlanners, setAllPlanners] = useState(null);
    const terminalId = terminal.id;

    useEffect(async () => {
        const plannerService = new PlannerService();
        const apiContacts = await plannerService.getPlannersByTerminalId(terminalId, filterData);
        setAllPlanners(apiContacts);
    }, []);

    useEffect(async () => {
        const plannerService = new PlannerService();
        const apiContacts = await plannerService.getPlannersByTerminalId(terminalId, filterData);
        setAllPlanners(apiContacts);
    }, [isReloadAgain]);

    useEffect(async () => {
        const plannerService = new PlannerService();
        const apiContacts = await plannerService.getPlannersByTerminalId(terminalId, filterData);
        setAllPlanners(apiContacts);
    }, [filterData]);

    const SearchPlanners = (e) => {
        setFilterData(e.target.value);
    };

    const SearchPlannersByButton = () => {
        setIsReloadAgain(!isReloadAgain); // Once State will flip, it will reload the control.
    };

    return (
        <div className="col-xl-6">
            <div className="card card_shadow">
                <div className="card-body special_card_padding">
                    <h2 className="header-title">Planners</h2>
                    <div className="search_area">
                        <div className="search_left">
                            <img src={SearchFilter} className="search_filter_icon" />
                        </div>
                        <div className="search_middle">
                            <input type="text" placeholder="Search Planners"
                                id="plannersByTerminalId"
                                onChange={SearchPlanners}
                                className="special_searchbox" />
                        </div>
                        <div className="search_right">
                            <img src={Search}
                                onClick={SearchPlannersByButton}
                                className="search_button_icon" />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0 table_scroll">
                            <thead className="other_table_header">
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Phone</th>
                                    <th>E-mail</th>
                                    <th>Default Planner</th>
                                </tr>
                            </thead>
                            {
                                allPlanners !== null ?
                                    allPlanners.length ?
                                        <tbody>
                                            {
                                                allPlanners.map((planner, index) => {
                                                    <tr id={index}>
                                                        <th>{planner.name}</th>
                                                        <td>{planner.name}</td>
                                                        <td>{planner.name}</td>
                                                        <td>{planner.name}</td>
                                                        <td className="table_checkbox_allignment">
                                                            <div className="round">
                                                                <input type="checkbox" id={"chkBox_" + index}
                                                                />
                                                                <label for={"chkBox_" + index}></label>
                                                            </div></td>
                                                    </tr>
                                                })
                                            }
                                        </tbody> : ""
                                    : ""
                            }
                        </table>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default DriverBodyForPlaner
