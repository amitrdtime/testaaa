/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";

import { useIsAuthenticated } from "@azure/msal-react";
import { InitiateSession } from "./InitiateSession";

export const AppLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            { isAuthenticated ? "" : <InitiateSession /> }
            {props.children}
        </>
    );
};
