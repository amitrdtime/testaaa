import React, { useState, useEffect } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { InteractionType, InteractionRequiredAuthError } from '@azure/msal-browser';

import { AppLayout } from "./components/applayout";
import 'react-notifications/lib/notifications.css';
import "./styles/App.css";
import AppRoute from './AppRoute.js';
import AppSession from "./components/appsession";
import AppSessionCache from "./components/appsession/appSessionCache";

/**
 * If a user is authenticated the Bulkmatic Main Page is rendered. 
 * Otherwise a message indicating it is starting the user session.
 */
const MainContent = () => {    
    return (
        <>
            <AuthenticatedTemplate>
                <AppSession>
                    <AppSessionCache>
                        <AppRoute />
                    </AppSessionCache>
                </AppSession>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <div>Logged Out</div>
            </UnauthenticatedTemplate>
        </>
    );
};

    export default function App() {
    return (
        <AppLayout>
            <MainContent />
        </AppLayout>
    );
}
