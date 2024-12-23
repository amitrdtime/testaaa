import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const InitiateSession = () => {
    const { instance } = useMsal();

    useEffect(() => {
        instance.loginRedirect(loginRequest).catch(e => {
                    });
        return () => {
            
        }
    }, [])
    return (
        <div>Initiating Session ...</div>
    )
}