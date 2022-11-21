import Binance from "node-binance-api";
import {
  BinanceBalance,
  LimitOrder,
  OrderType,
  LimitOrderResponse,
  MarketPrice,
  Positions,
  Income,
} from "../interfaces/binance/balance";
import { MappedOrder } from "../interfaces/binance/binanceCustom";
import { roundValue } from "../utils/rounder";

require("dotenv").config({ path: "/Users/vladimirkuzin/CryptoBot/.env" });

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

export class BinanceGlobal {
  /**
   * Method request balances on Binance and filtering response by USDT symbol.
   * @returns - total balance on Wallet in USDT.
   */
  async getUSDTBalance(): Promise<BinanceBalance> {
    const result = await (<Promise<BinanceBalance[]>>binance.futuresBalance());
    const [usdtBalance] = result.filter((coins) => coins.asset === "USDT");
    return usdtBalance;
  }

  async putLimitOrder(params: LimitOrder) {
    try {
      const { coin, limitPrice, qty, orderType } = params;
      // console.log(params);
      let response: Promise<LimitOrderResponse>;
      switch (orderType) {
        case OrderType.BUY:
          response = await binance.futuresBuy(coin, qty, limitPrice);
          break;
        case OrderType.SELL:
          response = await binance.futuresSell(coin, qty, limitPrice);
      }
      return response;
    } catch (e) {
      console.error("putLimitOrder method error:", e);
    }
  }

  /**
   *
   * @param coin - oprional parameter: the name of the coin with USDT prefix (like: TRXUSDT or KAWAUSDT)
   * @returns - an array of openned orders or single order in object if @param coin not provided.
   */
  async getOpenedOrders(coin?: string): Promise<MappedOrder[]> {
    const response = await (<Promise<LimitOrderResponse[]>>(
      binance.futuresOpenOrders(coin)
    ));
    const cleanedResponse = response.map((el) => {
      return {
        orderId: el.orderId,
        symbol: el.symbol,
        price: roundValue(el.price, 6),
        origQty: +el.origQty,
        side: el.side,
      };
    });

    return cleanedResponse;
  }

  async getSellOrder(coin: string) {
    const response = await this.getOpenedOrders(coin);
    return response.filter((el) => el.side === "SELL");
  }

  async getBuyOrder(coin: string) {
    const response = await this.getOpenedOrders(coin);
    return response.filter((el) => el.side === "BUY");
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
  async cancelLimitOrderById(coin: string, orderId: number) {
    const result = await binance.futuresCancel(coin, {
      orderId: orderId.toString(),
    });
    return result;
  }

  async cancelAllLimitsByCoin(coin: string) {
    const result = await binance.futuresCancelAll(coin);
    return result;
  }

  async getMarketPrice(coin: string) {
    const coinPriceRaw = [
      await (<Promise<MarketPrice>>binance.futuresMarkPrice(coin)),
    ];
    const [currency] = coinPriceRaw.map((coin) => {
      return {
        symbol: coin.symbol,
        markPrice: +coin.markPrice,
      };
    });
    return currency;
  }

  async getAllOpenedPositionsLong(): Promise<Positions[]> {
    const allPositions = await (<Promise<Positions[]>>(
      binance.futuresPositionRisk()
    ));
    return allPositions.filter((el) => +el.positionAmt > 0);
  }

  async getAllOpenedPositionsShort(): Promise<Positions[]> {
    const allPositions = await (<Promise<Positions[]>>(
      binance.futuresPositionRisk()
    ));
    return allPositions.filter((el) => +el.positionAmt < 0);
  }

  async getCoinInPositionLong(coin: string): Promise<Positions[]> {
    return (await this.getAllOpenedPositionsLong()).filter(
      (el) => el.symbol === coin
    );
  }

  async getCoinInPositionShort(coin: string): Promise<Positions[]> {
    return (await this.getAllOpenedPositionsShort()).filter(
      (el) => el.symbol === coin
    );
  }


  async batchOrders() {
    const resp = await binance.futuresMultipleOrders();
    return resp;
  }

  async marketBuy(coin: string, qty: number) {
    const result = await binance.futuresMarketBuy(coin, qty);
    return result;
  }

  async marketSell(coin: string, qty: number) {
    const result = await binance.futuresMarketSell(coin, qty);
    return result;
  }

  async getProfitOnLastSell(coin: string): Promise<number> {
    const resultRaw = await <Promise<Income[]>>binance.futuresIncome();
    const realizedPNLs = resultRaw.filter(
      (el) => el.symbol === coin && el.incomeType === "REALIZED_PNL"
    );
    if (!realizedPNLs.length) {
      return 0;
    }

    const filteredByTime = realizedPNLs.filter(
      (el: any) => Date.now() - +el.time < 12000
    );
    const totalIncome = filteredByTime.reduce((prev: number, curr) => {
      return prev + +curr.income;
    }, 0);

    return roundValue(totalIncome, 2);
  }
}
