"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundValue = void 0;
const roundValue = (value, decimals) => {
    if (typeof value === "string") {
        value = parseFloat(value);
    }
    const result = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return result;
};
exports.roundValue = roundValue;
