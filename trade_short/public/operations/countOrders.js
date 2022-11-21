"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMiddleOrders = void 0;
const rounder_1 = require("../utils/rounder");
const generateMiddleOrders = (prices, qty, coin, tickerSize, orderType) => {
    const arrayOfOrders = [];
    for (let i = 1; i < prices.length; i++) {
        arrayOfOrders.push({
            coin: `${coin}USDT`,
            limitPrice: (0, rounder_1.roundValue)(prices[i], tickerSize),
            roundDecimals: tickerSize,
            qty: qty[i],
            orderType: orderType,
        });
    }
    return arrayOfOrders;
};
exports.generateMiddleOrders = generateMiddleOrders;
