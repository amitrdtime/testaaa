import React, { useEffect,useContext } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import UserService from '../../services/userService';
import { ContextData } from '../../components/appsession';

function Users() {

  const userData= useContext(ContextData)

  

  const getUser = function(){
    
    const userService = new UserService();
    userService.getUser("DemoUser").then(function(data){
    })
  }

  useEffect(() => {
    if(userData){
     
    }
    
    
}, [userData])

  

  return (
    <div id="wrapper">
      <Header></Header>
      <AppBar></AppBar>
      
    </div>
  );
}
  
  export default Users;