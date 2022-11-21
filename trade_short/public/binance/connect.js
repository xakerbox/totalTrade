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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceGlobal = void 0;
const node_binance_api_1 = __importDefault(require("node-binance-api"));
const balance_1 = require("../interfaces/binance/balance");
const rounder_1 = require("../utils/rounder");
require("dotenv").config({ path: "/Users/vladimirkuzin/CryptoBot/.env" });
const binance = new node_binance_api_1.default().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET,
});
class BinanceGlobal {
    /**
     * Method request balances on Binance and filtering response by USDT symbol.
     * @returns - total balance on Wallet in USDT.
     */
    getUSDTBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield binance.futuresBalance();
            const [usdtBalance] = result.filter((coins) => coins.asset === "USDT");
            return usdtBalance;
        });
    }
    putLimitOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { coin, limitPrice, qty, orderType } = params;
                // console.log(params);
                let response;
                switch (orderType) {
                    case balance_1.OrderType.BUY:
                        response = yield binance.futuresBuy(coin, qty, limitPrice);
                        break;
                    case balance_1.OrderType.SELL:
                        response = yield binance.futuresSell(coin, qty, limitPrice);
                }
                return response;
            }
            catch (e) {
                console.error("putLimitOrder method error:", e);
            }
        });
    }
    /**
     *
     * @param coin - oprional parameter: the name of the coin with USDT prefix (like: TRXUSDT or KAWAUSDT)
     * @returns - an array of openned orders or single order in object if @param coin not provided.
     */
    getOpenedOrders(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (binance.futuresOpenOrders(coin));
            const cleanedResponse = response.map((el) => {
                return {
                    orderId: el.orderId,
                    symbol: el.symbol,
                    price: (0, rounder_1.roundValue)(el.price, 6),
                    origQty: +el.origQty,
                    side: el.side,
                };
            });
            return cleanedResponse;
        });
    }
    getSellOrder(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getOpenedOrders(coin);
            return response.filter((el) => el.side === "SELL");
        });
    }
    getBuyOrder(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getOpenedOrders(coin);
            return response.filter((el) => el.side === "BUY");
        });
    }
    /**
     * Method that close the orders based on coin name and orderId.
     * Mostly used for closing SELL Limit orders before putting new one
     * on every average or at zero buy.
     *
     * @param coin
     * @param orderId
     * @returns
     */
    cancelLimitOrderById(coin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield binance.futuresCancel(coin, {
                orderId: orderId.toString(),
            });
            return result;
        });
    }
    cancelAllLimitsByCoin(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield binance.futuresCancelAll(coin);
            return result;
        });
    }
    getMarketPrice(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const coinPriceRaw = [
                yield binance.futuresMarkPrice(coin),
            ];
            const [currency] = coinPriceRaw.map((coin) => {
                return {
                    symbol: coin.symbol,
                    markPrice: +coin.markPrice,
                };
            });
            return currency;
        });
    }
    getAllOpenedPositionsLong() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPositions = yield (binance.futuresPositionRisk());
            return allPositions.filter((el) => +el.positionAmt > 0);
        });
    }
    getAllOpenedPositionsShort() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPositions = yield (binance.futuresPositionRisk());
            return allPositions.filter((el) => +el.positionAmt < 0);
        });
    }
    getCoinInPositionLong(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllOpenedPositionsLong()).filter((el) => el.symbol === coin);
        });
    }
    getCoinInPositionShort(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllOpenedPositionsShort()).filter((el) => el.symbol === coin);
        });
    }
    batchOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield binance.futuresMultipleOrders();
            return resp;
        });
    }
    marketBuy(coin, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield binance.futuresMarketBuy(coin, qty);
            return result;
        });
    }
    marketSell(coin, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield binance.futuresMarketSell(coin, qty);
            return result;
        });
    }
    getProfitOnLastSell(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultRaw = yield binance.futuresIncome();
            const realizedPNLs = resultRaw.filter((el) => el.symbol === coin && el.incomeType === "REALIZED_PNL");
            if (!realizedPNLs.length) {
                return 0;
            }
            const filteredByTime = realizedPNLs.filter((el) => Date.now() - +el.time < 12000);
            const totalIncome = filteredByTime.reduce((prev, curr) => {
                return prev + +curr.income;
            }, 0);
            return (0, rounder_1.roundValue)(totalIncome, 2);
        });
    }
}
exports.BinanceGlobal = BinanceGlobal;
