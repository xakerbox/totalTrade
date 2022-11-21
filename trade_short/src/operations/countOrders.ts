import { LimitOrder, OrderType } from '../interfaces/binance/balance';
import { roundValue } from '../utils/rounder';

export const generateMiddleOrders = (prices: number[], qty: number[], coin: string, tickerSize: number, orderType: OrderType): LimitOrder[] => {
  const arrayOfOrders: LimitOrder[] = [];
  for (let i = 1; i < prices.length; i++) {
    arrayOfOrders.push({
      coin: `${coin}USDT`,
      limitPrice: roundValue(prices[i], tickerSize),
      roundDecimals: tickerSize,
      qty: qty[i],
      orderType: orderType,
    })
  }

  return arrayOfOrders;
}