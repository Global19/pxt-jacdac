namespace modules {
    //% fixedInstances
    export class RoleManagerClient extends jacdac.Client {
        constructor(role: string) {
            super(jacdac.SRV_ROLEMANAGER, role);
        }
    
            
    }

    //% fixedInstance whenUsed
    export const roleManager = new RoleManagerClient("role Manager");
}