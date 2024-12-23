import axios from "axios";
import { graphConfig } from "./authConfig";
import UserService from "./services/userService";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const graphData = await axios.get(graphConfig.graphMeEndpoint, options);

        if(graphData){
            const mailAddress = graphData.data.userPrincipalName;
            const AdId = mailAddress.split("@")[0];
            const name = graphData.data.displayName;
            const mobilePhone = graphData.data.mobilePhone;
            const userService = new UserService();
            const userData = await userService.getUser(AdId);

            if (Object.keys(userData).length > 0)
                return userData;

            if (Object.keys(userData).length === 0){
                const user = {
                    "ad_id": AdId,
                    "name" : name,
                    "email" : mailAddress,
                    "phone" : mobilePhone
                }

                await userService.createUser(user);

                const userData = await userService.getUser(AdId);

                return userData;
            }
        }
    } catch (err){
        console.error(err);
    }
}
