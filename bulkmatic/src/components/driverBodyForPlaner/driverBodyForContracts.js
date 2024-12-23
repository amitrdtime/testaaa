import React, { useEffect, useState } from 'react'
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg"
import ContactService from '../../services/contactService';

const DriverBodyForContracts = (props) => {
    const { terminal } = props;
    const [filterData, setFilterData] = useState('');
    const [isReloadAgain, setIsReloadAgain] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const terminalId = terminal.id;

    useEffect(async () => {
        const contactService = new ContactService();
        const apiContacts = await contactService.getContactsByTerminalId(terminalId, filterData);
        setAllContacts(apiContacts);
    }, []);

    useEffect(async () => {
        const contactService = new ContactService();
        const apiContacts = await contactService.getContactsByTerminalId(terminalId, filterData);
        setAllContacts(apiContacts);
    }, [isReloadAgain]);

    useEffect(async () => {
        const contactService = new ContactService();
        const apiContacts = await contactService.getContactsByTerminalId(terminalId, filterData);
        setAllContacts(apiContacts);
    }, [filterData]);

    const SearchContacts = (e) => {
        setFilterData(e.target.value);
    };

    const SearchContactsByButton = () => {
        setIsReloadAgain(!isReloadAgain); // Once State will flip, it will reload the control.
    };

    return (
        <div className="col-xl-6">

            <div className="col-xl-11">
                <div className="card card_shadow">
                    <div className="card-body special_card_padding">
                        <h2 className="header-title">Contacts</h2>
                        <div className="search_area">
                            <div className="search_left">
                                <img src={SearchFilter} className="search_filter_icon" />
                            </div>
                            <div className="search_middle">
                                <input type="text" placeholder="Search Contats"
                                    id="contactsByTerminalId"
                                    onChange={SearchContacts}
                                    className="special_searchbox" />
                            </div>
                            <div className="search_right">
                                <img src={Search}
                                    onClick={SearchContactsByButton}
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
                                    </tr>
                                </thead>
                                {
                                    allContacts !== null ?
                                        allContacts.length ?
                                            <tbody>
                                                {
                                                    allContacts.map((contact, index) => (
                                                        <tr id={index}>
                                                            <th scope="row" style={{ "width": "25%" }}>{contact.name}</th>
                                                            <td style={{ "width": "25%" }}>{contact.name}</td>
                                                            <td style={{ "width": "25%" }}>{contact.name}</td>
                                                            <td style={{ "width": "25%" }}>{contact.name}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody> : ""
                                        : ""
                                }

                            </table>
                        </div>

                        <div className="add_icon">
                            <img src={Addicon} className="add_icon_adjust" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DriverBodyForContracts
