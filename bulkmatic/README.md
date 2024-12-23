# Bulkmatic Planning App built with Reach, MSAL React and Microsoft identity platform

This application features a planning app for Bulkmatic LLC. It consists of user management, driver management, scheduling and planning features.It usages the MSAL Authentication to authentiate the users and conditionally render components based on the user access.

## Features

This application implements the end to end planning for shipment of the consignments:

* User Management
* Driver Management
* Tractor & Trailers Management
* Planning for the shipment for the orders and consignments.
* Add-on Alerting Users, Order Management, History of the usages of trailes, tractors, drivers etc.

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `src`             | Contains source files               |
| `styles`          | Contains styling for the sample            |
| `components`      | Contains ui components for the applications |
| `public`          | Contains static content such as images and the base html   |
| `authConfig.js`   | Contains configuration parameters for the authentication using MSAL Library.|
| `App.js`          | Contains implementation for Authentication and corresponding routing |
| `appSession.js`   | Provides a helper function for calling MS Graph API.   |                      |
| `index.js`        | Contains the root component and MsalProvider |
| `.gitignore`      | Define what to ignore at commit time.      |
| `package.json`    | Package manifest for npm.                  |
| `README.md`       | This README file.                          |

## Getting Started

### Prerequisites

[Node.js](https://nodejs.org/en/) must be installed to run this sample.

### Setup

1. [Register a new application](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-app-registration) in the [Azure Portal](https://portal.azure.com). Ensure that the application is enabled for the [authorization code flow with PKCE](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow). This will require that you redirect URI configured in the portal is of type `SPA`.
1. Clone this repository `git clone https://github.com/Azure-Samples/ms-identity-javascript-react-spa.git`
1. Open the [/src/authConfig.js](./src/authConfig.js) file and provide the required configuration values.
1. On the command line, navigate to the root of the repository, and run `npm install` to install the project dependencies via npm.

## Running the sample

1. Configure authentication and authorization parameters:
   1. Open `src/authConfig.js`
   2. Replace the string `"Enter_the_Application_Id_Here"` with your app/client ID on AAD Portal.
   3. Replace the string `"Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here"` with `"https://login.microsoftonline.com/common/"` (*note*: This is for multi-tenant applications located on the global Azure cloud. For more information, see the [documentation](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v2-javascript-auth-code)).
   4. Replace the string `"Enter_the_Redirect_Uri_Here"` with the redirect uri you setup on AAD Portal.
2. Configure the parameters for calling MS Graph API:
   2. Replace the string `"Enter_the_Graph_Endpoint_Herev1.0/me"` with `"https://graph.microsoft.com/v1.0/me"` (*note*: This is for MS Graph instance located on the global Azure cloud. For more information, see the [documentation](https://docs.microsoft.com/en-us/graph/deployments))
3. To start the sample application, run `npm start`.
4. Finally, open a browser and navigate to [http://localhost:3000](http://localhost:3000).
