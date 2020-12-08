namespace jacdac {
    /**
     * JacDac service running on sensor and streaming data out
     */
    export class SensorHost extends Host {
        public streamingInterval: number; // millis
        public streamingSamples: number;
        protected lowThreshold: number
        protected highThreshold: number

        constructor(name: string, deviceClass: number) {
            super(name, deviceClass);
            this.streamingInterval = 100;
            this.streamingSamples = 0;
        }

        public handlePacket(packet: JDPacket) {
            this.log(`hpkt ${packet.service_command}`);
            this.stateUpdated = false
            this.lowThreshold = this.handleRegInt(packet, SystemReg.LowThreshold, this.lowThreshold)
            this.highThreshold = this.handleRegInt(packet, SystemReg.HighThreshold, this.highThreshold)
            this.streamingInterval = this.handleRegInt(packet, SystemReg.StreamingInterval, this.streamingInterval)
            const samples = this.handleRegInt(packet, SystemReg.StreamingSamples, this.streamingSamples)
            this.setStreaming(samples)

            switch (packet.service_command) {
                case SystemCmd.Calibrate:
                    this.handleCalibrateCommand(packet);
                    break
                default:
                    // let the user deal with it
                    this.handleCustomCommand(packet);
                    break
            }
        }

        // override
        protected serializeState(): Buffer {
            return undefined;
        }

        // override
        protected handleCalibrateCommand(pkt: JDPacket) {
        }

        protected handleCustomCommand(pkt: JDPacket) {
        }

        protected raiseHostEvent(value: number) {
            this.sendReport(JDPacket.packed(SystemCmd.Event, "I", [value]))
        }

        public setStreaming(samples: number) {
            if (samples) this.startStreaming(samples);
            else this.stopStreaming();
        }

        private startStreaming(samples: number) {
            if (this.streamingSamples) {
                // already running
                this.streamingSamples = samples;
                return;
            }

            this.log(`start`);
            this.streamingSamples = samples;
            control.runInParallel(() => {
                while (this.streamingSamples !== undefined && this.streamingSamples > 0) {
                    // run callback                    
                    const state = this.serializeState();
                    if (!!state) {
                        // did the state change?
                        if (this.isConnected()) {
                            // send state and record time
                            this.sendReport(JDPacket.from(CMD_GET_REG | SystemReg.Reading, state))
                        }
                    }
                    // check streaming interval value or cancelled
                    if (this.streamingInterval < 0 || this.streamingSamples === undefined)
                        break;
                    // waiting for a bit
                    pause(this.streamingInterval);
                    // decrement counter
                    if (this.streamingSamples !== undefined)
                        this.streamingSamples--;
                }
                this.streamingSamples = 0;
                this.log(`stopped`);
            })
        }

        private stopStreaming() {
            if (this.streamingSamples > 0) {
                this.log(`stopping`)
                this.streamingSamples = undefined
                pauseUntil(() => this.streamingSamples === 0);
            }
        }
    }
}