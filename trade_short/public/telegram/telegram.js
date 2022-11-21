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
exports.TelegaBot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
require('dotenv').config();
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_TOKEN, { polling: false });
class TelegaBot {
    constructor() {
        this.chatIds = [165564370, 535043367];
    }
    sendBuyMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${message.symbol}(S): 🟢 Покупка (MARKET|BUY) ${message.positionAmt} монет`);
            });
        });
    }
    sendSellMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${message.symbol}(S): 🟢 Покупка (MARKET|SELL) ${message.positionAmt} монет`);
            });
        });
    }
    sendPutSellOrder(coin, qty, limitPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${coin}(S): 🟡 Ордер (LIMIT|SELL) ${qty} монет по $${limitPrice}`);
            });
        });
    }
    sendPutBuyOrder(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${message.coin}(S): 🟡 Ордер (LIMIT|BUY) ${message.qty} монет по $${message.limitPrice}`);
            });
        });
    }
    sendPutSellMiddleOrder(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${message.coin}(S): 🟡 Ордер (LIMIT|SELL) ${message.qty} монет по $${message.limitPrice}`);
            });
        });
    }
    sendSellOrderFinished(coin, profit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${coin}(S): 🔴 Продажа (LIMIT|SELL).\nОбшая прибыль со сделки $${profit}`);
            });
        });
    }
    sendMiddlePutBuy(coin, tierNumber, qty, limitPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${coin}(S): ${tierNumber} усреднение (LONG).\nПереставлен (LIMIT|SELL) ордер на ${qty} монет по $${limitPrice}`);
            });
        });
    }
    sendMiddlePutSell(coin, tierNumber, qty, limitPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, `${coin}(S): ${tierNumber} усреднение (SHORT).\nПереставлен (LIMIT|BUY) ордер на ${qty} монет по $${limitPrice}`);
            });
        });
    }
}
exports.TelegaBot = TelegaBot;
