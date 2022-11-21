import TelegramBot from 'node-telegram-bot-api';
import { LimitOrder, Positions } from '../interfaces/binance/balance';
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

export class TelegaBot {
  private chatIds: number[] = [165564370, 535043367];

  async sendBuyMessage(message: Positions) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${message.symbol}(S): 🟢 Покупка (MARKET|BUY) ${message.positionAmt} монет`);
    });
  }

  async sendSellMessage(message: Positions) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${message.symbol}(S): 🟢 Покупка (MARKET|SELL) ${message.positionAmt} монет`);
    });
  }

  async sendPutSellOrder(coin: string, qty: number, limitPrice: number ) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${coin}(S): 🟡 Ордер (LIMIT|SELL) ${qty} монет по $${limitPrice}`);
    });
  }

  async sendPutBuyOrder(message: LimitOrder) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${message.coin}(S): 🟡 Ордер (LIMIT|BUY) ${message.qty} монет по $${message.limitPrice}`);
    });
  }

  async sendPutSellMiddleOrder(message: LimitOrder) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${message.coin}(S): 🟡 Ордер (LIMIT|SELL) ${message.qty} монет по $${message.limitPrice}`);
    });
  }

  async sendSellOrderFinished(coin: string, profit: number) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${coin}(S): 🔴 Продажа (LIMIT|SELL).\nОбшая прибыль со сделки $${profit}`);
    });
  }

  async sendMiddlePutBuy(coin: string, tierNumber: number, qty: number, limitPrice: number) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${coin}(S): ${tierNumber} усреднение (LONG).\nПереставлен (LIMIT|SELL) ордер на ${qty} монет по $${limitPrice}`);
    });
  }

  async sendMiddlePutSell(coin: string, tierNumber: number, qty: number, limitPrice: number) {
    this.chatIds.forEach((chatId) => {
      bot.sendMessage(chatId, `${coin}(S): ${tierNumber} усреднение (SHORT).\nПереставлен (LIMIT|BUY) ордер на ${qty} монет по $${limitPrice}`);
    });
  }
}
