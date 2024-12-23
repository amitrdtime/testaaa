import React, { useState, useEffect } from 'react'
import searchButton from "../../assets/images/Search-Button.svg";
import SearchFilter from "../../assets/images/search_filter.svg";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Search from "../../assets/images/Search-Button.svg";
import { Typeahead } from 'react-bootstrap-typeahead';
import LUTRuleService from '../../services/loadunloadruleService';
import CommoditygroupService from '../../services/commoditygroupService';
import Spinner from 'react-bootstrap/Spinner'


import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";

const LoadUnloadruleBodyForDetails = (props) => {
    const { cg } = props;
    const [commodities, setCommodities] = useState([]);
    const [commoditiesCount, setCommoditiesCount] = useState([]);
    const [searchData, setsearchData] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [lutDetails, setlutDetails] = useState({});
    const [allCGs, setallCG] = useState([]);
    const [isDataLoaded, setisDataLoaded] = useState(false);
    const [allDataAfterSearch, setallDataAfterSearch] = useState([])
    const [dataForAction, setdataForAction] = useState(
        [{
            "status": "PU",
        },
        {
            "status": "DP"
        }]
    )
    const [dataForFlag, setdataForFlag] = useState(
        [{
            "status": "Y",
        },
        {
            "status": "N"
        },
        {
            "status": "NP"
        }
        ]
    )

    useEffect(async () => {
        setCommodities(cg.commodities)
        setisDataLoaded(true)
    }, [])

    useEffect(async () => {
        const lutService = new LUTRuleService();
        
        const rule = await lutService.getLUTRule(cg.commoditygroupid);
        
        setCommodities(rule.commodities)
    }, [])


    const searchInputHandler = (value) => {
        
        setsearchData(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchHandler()
        }
    }

    const searchHandler = () => {
        let allCommodities = commodities
        if (searchData) {
            setallDataAfterSearch(allCommodities.filter(item =>
                item.commodityname.toUpperCase().indexOf(searchData.toUpperCase()) > -1
                || item.commoditydesc.toUpperCase().indexOf(searchData.toUpperCase()) > -1

            ))
        }
        else {
            setallDataAfterSearch([])
        }
    }


    const handleCommodityChange = (value) => {
        if (value[0]) {
            setlutDetails(item => ({
                ...item,
                cgid: cg.commoditygroupcode,
                commodityid: value[0].commodityid
            }));
        }

    }

    const handleActionTypeChange = (value) => {
        if (value.length > 0) {
            setlutDetails(prev => ({
                ...prev,
                actiontype: value[0].status,
            }))

        }
    }

    const handleLoadFlagChange = (value) => {
        if (value.length > 0) {
            setlutDetails(prev => ({
                ...prev,
                loadflag: value[0].status,
            }))

        }
    }



    const captureLoadtTime = function (value) {
        setlutDetails(item => ({
            ...item,
            loadtime: value
        }));
        
    }
    const captureUnloadtTime = function (value) {
        setlutDetails(item => ({
            ...item,
            unloadtime: value
        }))

        
    }

    const createlut = async () => {
        const lutService = new LUTRuleService();
        try {
            const lutRules = await lutService.createLUTRule(lutDetails)
            if (lutRules.length > 0) {
                setCommodities(lutRules)
                setModalShow(false)
                props.parentCallBackForShipperLoadTimes(lutRules)
            }
            NotificationManager.success("Commodity  Added successfully", "Success")
        }
        catch (error) {
            NotificationManager.error("Commodity  not Added successfully", "Error")
        }

    }
    
    return (
        <div className="row special_row_flex">
            <div className="col-xl-12">
                <div className="card card_shadow">

                    <div className="card-body">

                        <div className="table_header_section w-96">
                            <div>
                                <h2 className="header-title">Commodity Override Durations</h2>
                            </div>
                            <div className="df">
                                <button type="button" className="btn_blue btn-blue mr_10" onClick={() => setModalShow(true, cg)}>ADD</button>
                                <div className="search_area">
                                    <div className="search_left">
                                        {/* <img src={SearchFilter} className="search_filter_icon" /> */}
                                    </div>
                                    <div className="search_middle">
                                        <input type="text" placeholder="Search Commodity" className="special_searchbox" onChange={(e) => searchInputHandler(e.target.value)} onKeyPress={handleKeyPress} />
                                    </div>
                                    <div className="search_right">
                                        <img src={Search} className="search_button_icon" onClick={searchHandler} />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-borderless table-hover  table-centered m-0 special_fonts ">
                                <thead className="table-light">
                                    <tr>
                                        <th >Id</th>
                                        <th>Name</th>
                                        <th >Description</th>
                                        <th>Action Type</th>
                                        <th>Loading Flag</th>
                                        <th>Load Time</th>
                                        <th>Unload Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isDataLoaded ?


                                        <>
                                            {
                                                allDataAfterSearch.length > 0 ?
                                                    allDataAfterSearch.map((commodity, index) => (

                                                        <tr>
                                                            <td>{commodity.commodityid}</td>
                                                            <td>{commodity.commodityname}</td>
                                                            <td>{commodity.commoditydesc}</td>
                                                            <td>{commodity.action_type}</td>
                                                            <td>{commodity.driver_load_flag}</td>
                                                            <td>{commodity.loadtime}</td>
                                                            <td>{commodity.unloadtime}</td>

                                                        </tr>
                                                    ))
                                                    :
                                                    commodities?.map((commodity, index) => (
                                                        <tr>
                                                            <td>{commodity.commodityid}</td>
                                                            <td>{commodity.commodityname}</td>
                                                            <td>{commodity.commoditydesc}</td>
                                                            <td>{commodity.action_type}</td>
                                                            <td>{commodity.driver_load_flag}</td>
                                                            <td>{commodity.loadtime}</td>
                                                            <td>{commodity.unloadtime}</td>
                                                            <td className="buttoninline">
                                                                <button type="button" class="btn_blue_sm btn-blue ml_10" ><i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>EDIT</button>
                                                                <button type="button" class="btn_blue_sm btn-blue ml_10" ><i class="fa fa fa-trash mr_5 del_icon" aria-hidden="true"></i>DELETE</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }
                                        </>
                                        : <div className="loader_wrapper_table"><Spinner animation="border" variant="primary" /></div>

                                    }
                                </tbody>
                            </table>
                            <NotificationContainer />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {cg.commoditygroup}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">Commodity</label>
                        <Typeahead
                            id="typeHeadCommodity"
                            onChange={handleCommodityChange}
                            labelKey={(option) => `${option.commodityid} ${option.commodityname}`}
                            options={commodities}
                            placeholder="Choose a commodity..."
                        />

                    </div>
                    <div class="form-group">

                        <label for="actionType">Action Type</label>
                        <Typeahead
                            id="actionType"
                            onChange={handleActionTypeChange}
                            labelKey="status"
                            options={dataForAction}
                            placeholder="Choose a Action Type"
                        />
                    </div>
                    <div class="form-group">
                        <label for="actionType">Loading Flag</label>
                        <Typeahead
                            id="actionType"
                            onChange={handleLoadFlagChange}
                            labelKey="status"
                            options={dataForFlag}
                            placeholder="Choose a Loading Flag"
                        />
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlInput2">Load Time</label>
                        <input type="number" className="form-control" id="exampleFormControlInput2" onInput=
                            {(event) => captureLoadtTime(event.target.value)} placeholder="e.g. 30" />
                    </div>

                    <div class="form-group">
                        <label for="exampleFormControlInput3">Unload Time</label>
                        <input type="number" className="form-control" id="exampleFormControlInput3" onInput=
                            {(event) => captureUnloadtTime(event.target.value)} placeholder="e.g. 30" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => setModalShow(false)}>Cancel</Button>
                    <Button onClick={(e) => createlut(e)}>save</Button>


                </Modal.Footer>

            </Modal>
        </div>

    )
}

export default LoadUnloadruleBodyForDetails
