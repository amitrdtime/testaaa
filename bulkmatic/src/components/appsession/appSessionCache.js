import React, { useEffect, useContext } from 'react';
import { ContextData } from '../../components/appsession';
import AppFilterService from '../../services/appFilterService';
import { useMsal, useAccount } from "@azure/msal-react";

function AppSessionCache(props) {
    const [userData, setuserData] = useContext(ContextData);
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    useEffect(async () => {
        const appFilterService = new AppFilterService();

        const appFilterData = await appFilterService.getAppFilterData(true);
        const adId = account.username.toString().split("@")[0];
        const userFilterData = await appFilterService.getUserFilterData(adId, true);

        return () => {

        }
    }, [])

    return (
        <>
            {props.children}
        </>
    );
}

export default AppSessionCache;