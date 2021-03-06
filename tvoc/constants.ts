namespace jacdac {
    // Service: Total Volatile organic compound
    export const SRV_TVOC = 0x12a5b597
    export const enum TVOCReg {
        /**
         * Read-only ppb u22.10 (uint32_t). Total volatile organic compound readings in parts per billion.
         *
         * ```
         * const [tVOC] = jdunpack<[number]>(buf, "u22.10")
         * ```
         */
        TVOC = 0x101,

        /**
         * Read-only ppb u22.10 (uint32_t). Error on the reading data
         *
         * ```
         * const [tVOCError] = jdunpack<[number]>(buf, "u22.10")
         * ```
         */
        TVOCError = 0x106,

        /**
         * Constant ppb u22.10 (uint32_t). Minimum measurable value
         *
         * ```
         * const [min_TVOC] = jdunpack<[number]>(buf, "u22.10")
         * ```
         */
        Min_TVOC = 0x104,

        /**
         * Constant ppb u22.10 (uint32_t). Minimum measurable value
         *
         * ```
         * const [max_TVOC] = jdunpack<[number]>(buf, "u22.10")
         * ```
         */
        Max_TVOC = 0x105,

        /**
         * Constant s uint32_t. Time required to achieve good sensor stability before measuring after long idle period.
         *
         * ```
         * const [conditioningPeriod] = jdunpack<[number]>(buf, "u32")
         * ```
         */
        ConditioningPeriod = 0x180,
    }

}
