import React, { useState, useEffect, useContext } from "react";
import { ContextData } from "../../components/appsession";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import YardcheackHeader from "../../components/yardcheckHeader/yardcheackHeader";
import YardCheckTable from "../../components/yardCheckTable/yardCheckTable";
import YardService from "../../services/yardService";
import YardCheckList from "../../components/yardCheckList/yardCheckList";
import YardCheckListHeader from "../../components/yardCheckListHeader/yardCheckListHeader";
import TerminalService from "../../services/terminalService";

const yardCheck = () => {
	const [userData, setuserData] = useContext(ContextData);
	const [allTerminal, setallTerminal] = useState([]);
	const [terminalById, setterminalById] = useState({});
	const [isyardClicked, setisyardClicked] = useState(false);
	const [is_reload, setisReload] = useState(false);
	const [allUserTerminals, setallUserTerminals] = useState([]);
	const [isUserTerminalsLoaded, setIsUserTerminalsLoaded] = useState(true);
	const [currentTerminalCount, setcurrentTerminalCount] = useState(0);
	const [isDisabled, setIsDisabled] = useState(false);
	const [filteredTerminal, setFilteredTerminal] = useState([]);
	const [yardCheckLength, setYardCheckLength] = useState(0);
	const [hamburgerMenuClicked, sethamburgerMenuClicked] = useState(false);
	const [terminalsOptions, setTerminalsOptions] = useState([]);
	// const [selectedDateForFilter, setSelectedDateForFilter] = useState(null)

	const handelcallback = (childdata, terminal) => {
		setterminalById(terminal);
		setisyardClicked(childdata);
	};
	const handelcallbackFromHeader = async (childdata) => {
		setisyardClicked(childdata);
		// await getYards()
	};

	const handleYardLength = (length) => {
		setYardCheckLength(length);
	};
	// const parentCallBackForYardFilter = (searchData, startDate, endDate) => {

	//     setfilterData(searchData);
	//     setStartts(startDate);
	//     setEndts(endDate);
	// }

	const updateFromChild = async (updatedList) => {
		setisReload(!is_reload);
		try {
			let closedTerminalState = terminalById;
			closedTerminalState.endTs = Date.now();
			closedTerminalState.status = "close";
			setterminalById(closedTerminalState);
		} catch (error) {
			window.location.reload();
		}
	};

	const updatecountfromChild = async (count) => {
		setcurrentTerminalCount(count);
	};
	const isAccess = () => {
		const permission = userData?.roles[0]?.permissionAccess.map((permit) => {
			if (permit?.permission == "Yard Check" && permit?.isEdit == false) {
				setIsDisabled(true);
			}
		});
	};
	useEffect(() => {
		const fetchData = async () => {
			const userterminalid = await userData.terminals;
			if (userterminalid?.length > 0) {
				const terminalService = new TerminalService();

				const terminalRes=await terminalService.getTerminalByIds(userterminalid);
           console.log("🚀 ~ file: yardCheck.js ~ line 76 ~ fetchData ~ terminalRes", terminalRes)
           
                setTerminalsOptions((prevTerminal)=>[...prevTerminal,...terminalRes])
				const yardService = new YardService();
				const terminals = await yardService
					.getbyyards(userterminalid)
					.then((res) => {
						setallTerminal(res);
					});
				isAccess();
			}
		};
        fetchData();
	}, [userData.terminals, is_reload]);

	const handelcallbackForYard = (childData, date) => {
		// setSelectedDateForFilter(date)

		let terminalId = childData.map((el) => el.substring(0, 3));

		setFilteredTerminal(terminalId);
	};
	const sethamburgerMenuToggle = (data) => {
		sethamburgerMenuClicked(data);
	};

	return (
		<div>
			<div id="wrapper">
				<Header
					userclicked={isyardClicked}
					parentcallback={handelcallbackFromHeader}
					sethamburgerMenuToggle={sethamburgerMenuToggle}
				></Header>
				<AppBar hamburgerMenuClicked={hamburgerMenuClicked}></AppBar>
				<div className="content-page_yardcheck">
					<div className="content">
						<div className="container-fluid">
							{!isyardClicked ? (
								<>
									<YardcheackHeader
										key={currentTerminalCount}
										currentTerminalCount={currentTerminalCount}
										// parentCallBackForYardFilter={parentCallBackForYardFilter}
										parentCallback={handelcallbackForYard}
										terminalsOptions={terminalsOptions}
										yardCheckLength={yardCheckLength}
										/>
										{console.log("🚀 ~ file: yardCheck.js ~ line 123 ~ yardCheck ~ terminalsOptions", terminalsOptions)}
									<YardCheckTable
										allUserTerminals={allUserTerminals}
										notifyParentCount={updatecountfromChild}
										allTerminal={allTerminal}
										isUserTerminalsLoaded={isUserTerminalsLoaded}
										parentcallback={handelcallback}
										setallTerminal={setallTerminal}
										accessDisabled={isDisabled}
										filteredTerminal={filteredTerminal}
										// selectedDateForFilter={selectedDateForFilter}
										parentYardLength={handleYardLength}
										currentTerminalCount={currentTerminalCount}
										yardCheckLength={yardCheckLength}
									/>
								</>
							) : (
								<>
									<YardCheckListHeader terminalById={terminalById} />
									<YardCheckList
										key={terminalById.id}
										terminalById={terminalById}
										notifyParent={updateFromChild}
										accessDisabled={isDisabled}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default yardCheck;
