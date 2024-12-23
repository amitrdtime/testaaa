// Use this object to bind with UI Controls
class UserAccess {
    // Have the parameter as per the need so that object creation shouldbe controlled from single place.
    // This will help us to avoid creating different structure across multiple pages.
    constructor(user) {
        const isEnabledRoleBasedSecurity = false;
        let permissions = [];
        for(let iLoop=0; iLoop< user.roles.length; iLoop++){
            permissions = permissions.concat(user.roles[0].permissionAccess);
        }
        // user.roles.map(it => permissions.push(...it.permissionAccess));
        // 
        // 
        this.hasYardCheckAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "YARD CHECK" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasYardCheckEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "YARD CHECK" 
                        && it.isEdit).length > 0));

        this.hasCGAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "COMMODITY GROUPS" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasCGEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "COMMODITY GROUPS" 
                        && it.isEdit).length > 0));
        
        this.hasTrailersAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TRAILERS" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasTrailersEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TRAILERS" 
                        && it.isEdit).length > 0));

        this.hasPlanningAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "PLANNING" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasPlanningEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "PLANNING" 
                        && it.isEdit).length > 0));

        this.hasTractorsAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TRACTORS" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasTractorsEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TRACTORS" 
                        && it.isEdit).length > 0));

        this.hasRolesAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "ROLES" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasRolesEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "ROLES" 
                        && it.isEdit).length > 0));
        
        this.hasTerminalsAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TERMINALS" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasTerminalsEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "TERMINALS" 
                        && it.isEdit).length > 0));

        this.hasUsersAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "USERS" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasUsersEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "USERS" 
                        && it.isEdit).length > 0));

        this.hasMessagingEnabled = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "MESSAGING" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasMessagingEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "MESSAGING" 
                        && it.isEdit).length > 0));

        this.hasDriversAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "DRIVERS" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasDriversEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "DRIVERS" 
                        && it.isEdit).length > 0));

        this.hasAlertsEnabled = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "ALERTS" 
                        && (it.isView || it.isEdit)).length > 0));

        this.hasAlertsEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "ALERTS" 
                        && it.isEdit).length > 0));

        this.hasLUTRuleAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "LOADING/UNLOADING DURATIONS" 
                        && (it.isView || it.isEdit)).length > 0));
    
        this.hasLUTRuleEditAccess = !isEnabledRoleBasedSecurity || (user.isActive && (user.isAdministrator || 
                    permissions.filter(it => it.permission.toUpperCase() === "LOADING/UNLOADING DURATIONS" 
                        && it.isEdit).length > 0));
    }   
       
}

export default UserAccess;
