import React, { useEffect, useContext, useState, createContext } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../header";
import AppBar from "../appbar";
import UserService from '../../services/userService';
import AppFilterService from '../../services/appFilterService';
import { useMsal, useAccount, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

import { loginRequest } from "../../authConfig";
import { callMsGraph } from '../../appSession'

// Creating the context to have the role & access to be stored here.
const ContextData = createContext()
export { ContextData };

function AppSession(props) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [userAccountData, setuserAccountData] = useState({})
  const [isUserInfoReceived, setisUserInfoReceived] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const getUserInfoMSGraph = async function (emailAddress, setUserAccountInfoFunc) {
    const uniqueid = localStorage.getItem('uniqueid');
    const token = localStorage.getItem('accesstoken');

    if (emailAddress) {
      const userId = emailAddress.toString().split("@")[0];
      const userService = new UserService();

      //This Part gets the User
      try{
        const user = await userService.getUser(userId);
        if (!user.hasOwnProperty("AdId")) {
          const userData = await callMsGraph(token);
          localStorage.setItem("appsession", userData);
          await setUserAccountInfoFunc(userData);
          setisUserInfoReceived(false);
        }
        else {
          localStorage.setItem("appsession", user);
          await setUserAccountInfoFunc(user);
          setisUserInfoReceived(true);
        }
      }
      catch(error) {
        
      }

      //This Part Filters On the User After Initialize
      try {
        const appFilterService = new AppFilterService();
        await appFilterService.getUserFilterData(userId, true);
      }
      catch(error) {
        
      }
    }
  }

  const setUserAccountInfo = function (user) {
    setuserAccountData(user);
  }

  useEffect(() => {
    console.log(userAccountData);
  }, [userAccountData]);

  useEffect(async () => {
    if (isAuthenticated && account) {
      // 
      // 
    // This is to check if the token is valid or not.
    try{
      const authResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });
      
      
      if (authResponse.account) {
        // 
        localStorage.setItem("accesstoken", authResponse.accessToken);
        await getUserInfoMSGraph(authResponse.account.username, setUserAccountInfo);
      }
    }
    catch (error) {
      
      const authResponse = await instance.acquireTokenRedirect({
        ...loginRequest,
        account: account,
      });
  
      if (authResponse.account) {
        // 
        localStorage.setItem("accesstoken", authResponse.accessToken);
        await getUserInfoMSGraph(authResponse.account.username, setUserAccountInfo);
      }
    }
  }
  }, [isAuthenticated, account])

  return (
    <>
      {
        userAccountData !== undefined ? (
          <ContextData.Provider value={[userAccountData, setuserAccountData]}>
            {props.children}
          </ContextData.Provider>

        ) :
          (
            <div id="wrapper">
              <Header></Header>
              <AppBar></AppBar>
              <div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">Session Error</h5>
                  <h6 class="card-subtitle mb-2 text-muted">There is no user session!</h6>
                  <p class="card-text">Either your account is not valid or your account is yet to be created. Please try refreshing the page to initiate the session. If it does not work, please contact system administrator.</p>
                </div>
              </div>

            </div>
          )
      }
    </>
  );
}

export default AppSession;