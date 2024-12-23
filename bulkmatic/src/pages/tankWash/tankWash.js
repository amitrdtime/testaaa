import { useState } from "react"
import AppBar from "../../components/appbar"
import Header from "../../components/header"

const tankWash = () => {
	const [isTankWashClicked, setIsTankWashClicked] = useState(false)
	const [hamburgerMenuClicked, sethamburgerMenuClicked] = useState(false)
	const handelcallbackFromHeader = async (childdata) => {
		setIsTankWashClicked(childdata)
		
	}
    const sethamburgerMenuToggle = (data) => {
			sethamburgerMenuClicked(data)
		}

	return (
		<>
			<div id="wrapper">
				<Header
					userclicked={isTankWashClicked}
					parentcallback={handelcallbackFromHeader}></Header>
				sethamburgerMenuToggle={sethamburgerMenuToggle}
				<AppBar hamburgerMenuClicked={hamburgerMenuClicked}></AppBar>
				<div className="content-page">
					<h1>This Page is Under construction</h1>
				</div>
			</div>
		</>
	)
}
export default tankWash
