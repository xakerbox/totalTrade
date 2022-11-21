"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculator = void 0;
const rounder_1 = require("./rounder");
const configReader_1 = require("../utils/configReader");
class Calculator {
    constructor(coin) {
        this.coin = coin;
    }
    readConfig() {
        const coinConfig = (0, configReader_1.getConfig)(this.coin);
        return coinConfig;
    }
    countWorkingStack() {
        const { stackValue, workingPercent, shoulder } = this.readConfig();
        return stackValue * shoulder * (workingPercent / 100);
    }
    ;
    getAllMiddlePrices(startBuyPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            let pricesToBuy = [startBuyPrice];
            const { middleSplitter } = this.readConfig();
            let newPrice = startBuyPrice;
            for (let i = 1; i <= 5; i++) {
                newPrice =
                    startBuyPrice - (startBuyPrice * (middleSplitter[i - 1] / 100));
                pricesToBuy.push((0, rounder_1.roundValue)(newPrice, 6));
            }
            return pricesToBuy;
        });
    }
    ;
    /**
     *
     * @param pricesToBuy - precounted priced on buy coins;
     * @returns - array with qnty of coins to buy on zero buy and 5 middlers.
     */
    buyQtyCoins(pricesToBuy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { middleBuyIncreaser } = this.readConfig();
            const workingMoney = this.countWorkingStack();
            const coins = workingMoney /
                pricesToBuy.reduce((pre, cur, index) => {
                    return pre + cur * middleBuyIncreaser[index];
                }, 0);
            let totalCoins = workingMoney / coins;
            let coinsQuantity = [];
            for (let i of middleBuyIncreaser) {
                coinsQuantity.push(Math.floor(coins * i));
                totalCoins = totalCoins + coins * i;
            }
            console.log('Coin qnt: ', coinsQuantity);
            return coinsQuantity;
        });
    }
    ;
}
exports.Calculator = Calculator;
