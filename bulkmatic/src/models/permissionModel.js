class Permission {
    constructor(){


    }
    samplePermission=[
        {
            name:"Administrator",
            id:12
        },
        {
            name:"Planner Manager",
            id:123
        },
        {
            name:"Yard Manager",
            id:1234
        },
        {
            name:"Planner",
            id:12345
        }
    ]
    parseApiPermissionObject(perm){
        const permissionObject = {};
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        permissionObject.permName = perm.name;
        permissionObject.permCode = perm.id;
        permissionObject.permId = perm.id;
        permissionObject.allowEdit = perm.allowEdit;        
        permissionObject.description = perm.description === undefined? "" : perm.description;
        permissionObject.isActive = perm.isActive === undefined? false : perm.isActive;

        return permissionObject;
    }
}

export default Permission;