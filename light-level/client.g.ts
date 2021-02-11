namespace modules {
    //% fixedInstances
    export class LightLevelClient extends jacdac.SensorClient<[number]> {
        constructor(role: string) {
            super(jacdac.SRV_LIGHTLEVEL, role, "u0.16");
        }
    
        /**
        * Detect light level
        */
        //% blockId=jacdaclightlevel101 block="%sensor light level"
        //% group="reading"
        reading(): number {
            // lightLevel
            const values = this.values();
            return values && values[0];
        }

            
    }

    //% fixedInstance whenUsed
    export const lightLevel = new LightLevelClient("light Level");
}