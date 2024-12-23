class Role {
    constructor(){


    }
    sampleRole=[
        {
            roleName:"Administrator",
            roleId:"1"
        },
        {
            roleName:"Planner Manager",
            roleId:"2"
        },
        {
            roleName:"Yard Manager",
            roleId:"3"
        },
        {
            roleName:"Planner",
            roleId:"3",
            "permissionAccess": [
                {
                    "permId": 12,
                    "permission": "Administrator",
                    "isEdit": true,
                    "isView": true,
                    "allowEdit": false
                }
            ]
        }
    ]
    parseApiRoleObject(role){
        const roleObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        roleObject.roleName = role.roleName;
        roleObject.roleId = role.roleId;
        roleObject.isActive = role.isActive;
        if (role.permissionAccess === undefined){
            roleObject.permissionAccess = [{permission: "demo", isView: true, isEdit: false, allowEdit: false}];
        }        
        else {
            roleObject.permissionAccess = role.permissionAccess;
        }
        return roleObject;
    }
}

export default Role;