import "./config";
import { BinanceGlobal } from "./binance/connect";
import {
  LimitOrder,
  OrderType,
  BinanceBalance,
} from "./interfaces/binance/balance";
import { Calculator } from "./utils/calculator";
import { generateMiddleOrders } from "./operations/countOrders";
import { getConfig } from "./utils/configReader";
import { roundValue } from "./utils/rounder";
import { TelegaBot } from "./telegram/telegram";

const { coin, tickerSize, profitPercent } = getConfig("1INCH");
const binance = new BinanceGlobal();
const calc = new Calculator(coin.slice(0, -4));
const telegram = new TelegaBot();

let recountedMiddlePrices: number[];
let recountedQty: number[];
let tierArray = [1, 0, 0, 0, 0, 0];

const zeroBuy = async () => {
  try {
    const { markPrice } = await binance.getMarketPrice(coin);
    const middlePrices = await calc.getAllMiddlePrices(markPrice);
    const qty = await calc.buyQtyCoins(middlePrices);

    await binance.marketBuy(coin, qty[0]);
    const getPositionInfo = await binance.getCoinInPositionLong(coin);
    console.log(
      "Zero buy:",
      getPositionInfo[0].positionAmt,
      getPositionInfo[0].symbol
    );

    if (getPositionInfo.length) {
      await telegram.sendBuyMessage(getPositionInfo[0]);

      const limitPrice = roundValue(
        middlePrices[0] * profitPercent[0],
        tickerSize
      );
      const qty = +getPositionInfo[0].positionAmt;

      await binance.putLimitOrder({
        coin,
        limitPrice,
        qty,
        orderType: OrderType.SELL,
        roundDecimals: 4,
      });
      await telegram.sendPutSellOrder(coin, qty, limitPrice);
    }

    recountedMiddlePrices = await calc.getAllMiddlePrices(
      +getPositionInfo[0].entryPrice
    );
    recountedQty = await calc.buyQtyCoins(recountedMiddlePrices);

    const allMiddleOrders = generateMiddleOrders(
      recountedMiddlePrices,
      recountedQty,
      calc.coin,
      tickerSize,
      OrderType.BUY
    );

    for (let middleOrder of allMiddleOrders) {
      await binance.putLimitOrder(middleOrder);
      await telegram.sendPutBuyOrder(middleOrder);
    }
  } catch (e) {
    console.log("Error in zero buy", e);
  }
};

// let tier = 6;

const run = async () => {
  try {
    const getPositionInfo = await binance.getCoinInPositionLong(coin);
    if (!getPositionInfo.length) {
      const profit = await binance.getProfitOnLastSell(coin);
      await binance.cancelAllLimitsByCoin(coin);
      if (profit) {
        await telegram.sendSellOrderFinished(coin, profit);
      }
      tierArray = [1, 0, 0, 0, 0, 0];
      await zeroBuy();
      return;
    }
    console.log("Position info: ", {
      entryPrice: getPositionInfo[0].entryPrice,
      qty: getPositionInfo[0].positionAmt,
      pnl: getPositionInfo[0].unRealizedProfit,
    });
  } catch (e) {
    console.log("Eror in run block on get position", e);
  }

  try {
    const allExistingOrders = await binance.getOpenedOrders(coin);
    console.log("Orders qnt: ", allExistingOrders.length);
    switch (allExistingOrders.length) {
      // 5 BUY + 1 SELL (ZERO SELL);
      case 6:
        break;
      // 4 BUY + 1 SELL (ZERO SELL);
      case 5:
        if (tierArray[1] === 0) {
          try {
            const sellOrdersResponse = await binance.getSellOrder(coin);

            if (sellOrdersResponse) {
              const [{ orderId: zeroSellOrderId }] = sellOrdersResponse;
              await binance.cancelLimitOrderById(coin, zeroSellOrderId);
            }

            const [{ positionAmt, entryPrice }] =
              await binance.getCoinInPositionLong(coin);
            const limitPrice = roundValue(
              +entryPrice * profitPercent[1],
              tickerSize
            );
            await binance.putLimitOrder({
              coin,
              limitPrice,
              qty: +positionAmt,
              orderType: OrderType.SELL,
              roundDecimals: 4,
            });
            await telegram.sendMiddlePutBuy(coin, 1, +positionAmt, limitPrice);
            tierArray[1] = 1;
          } catch (e) {
            console.log("Error on case 5:", e);
          }
        }
        break;

      // 3 BUY + 1 SELL (1 MIDLLE);
      case 4:
        if (tierArray[2] === 0) {
          try {
            const sellOrdersResponse = await binance.getSellOrder(coin);

            if (sellOrdersResponse) {
              const [{ orderId: zeroSellOrderId }] = sellOrdersResponse;
              await binance.cancelLimitOrderById(coin, zeroSellOrderId);
            }
            const [{ positionAmt, entryPrice }] =
              await binance.getCoinInPositionLong(coin);
            const limitPrice = roundValue(
              +entryPrice * profitPercent[2],
              tickerSize
            );
            await binance.putLimitOrder({
              coin,
              limitPrice,
              qty: +positionAmt,
              orderType: OrderType.SELL,
              roundDecimals: 4,
            });
            await telegram.sendMiddlePutBuy(coin, 2, +positionAmt, limitPrice);
            tierArray[2] = 1;
          } catch (e) {
            console.log("Error on case 4:", e);
          }
        }
        break;

      // 2 BUY + 1 SELL (2 MIDDLE);
      case 3:
        if (tierArray[3] === 0) {
          try {
            const sellOrdersResponse = await binance.getSellOrder(coin);

            if (sellOrdersResponse) {
              const [{ orderId: zeroSellOrderId }] = sellOrdersResponse;
              await binance.cancelLimitOrderById(coin, zeroSellOrderId);
            }
            const [{ positionAmt, entryPrice }] =
              await binance.getCoinInPositionLong(coin);
            const limitPrice = roundValue(
              +entryPrice * profitPercent[3],
              tickerSize
            );
            await binance.putLimitOrder({
              coin,
              limitPrice,
              qty: +positionAmt,
              orderType: OrderType.SELL,
              roundDecimals: 4,
            });
            await telegram.sendMiddlePutBuy(coin, 3, +positionAmt, limitPrice);
            tierArray[3] = 1;
          } catch (e) {
            console.log("Error on case 3:", e);
          }
        }
        break;

      // 1 BUY + 1 SELL (3 MIDDLE);
      case 2:
        if (tierArray[4] === 0) {
          try {
            const sellOrdersResponse = await binance.getSellOrder(coin);

            if (sellOrdersResponse) {
              const [{ orderId: zeroSellOrderId }] = sellOrdersResponse;
              await binance.cancelLimitOrderById(coin, zeroSellOrderId);
            }
            const [{ positionAmt, entryPrice }] =
              await binance.getCoinInPositionLong(coin);
            const limitPrice = roundValue(
              +entryPrice * profitPercent[4],
              tickerSize
            );
            await binance.putLimitOrder({
              coin,
              limitPrice,
              qty: +positionAmt,
              orderType: OrderType.SELL,
              roundDecimals: 4,
            });
            await telegram.sendMiddlePutBuy(coin, 4, +positionAmt, limitPrice);
            tierArray[4] = 1;
          } catch (e) {
            console.log("Error on case 2:", e);
          }
        }
        break;

      //0 BUY + 1 SELL (4 MIDDLE);
      case 1:
        if (tierArray[5] === 0) {
          try {
            const sellOrdersResponse = await binance.getSellOrder(coin);

            if (sellOrdersResponse) {
              const [{ orderId: zeroSellOrderId }] = sellOrdersResponse;
              await binance.cancelLimitOrderById(coin, zeroSellOrderId);
            }
            const [{ positionAmt, entryPrice }] =
              await binance.getCoinInPositionLong(coin);
            const limitPrice = roundValue(
              +entryPrice * profitPercent[5],
              tickerSize
            );
            await binance.putLimitOrder({
              coin,
              limitPrice,
              qty: +positionAmt,
              orderType: OrderType.SELL,
              roundDecimals: 4,
            });
            await telegram.sendMiddlePutBuy(coin, 5, +positionAmt, limitPrice);
            tierArray[5] = 1;
          } catch (e) {
            console.log("Error on case 1:", e);
          }
        }
        break;
    }
  } catch (e) {
    console.log("Error inside catch blocks or on getting openned orders:", e);
  }

  //
  // const getPositionInfo = await binance.getCoinInPosition(`${calc.coin}USDT`);

  // const result = await <Promise<BinanceBalance>>binance.getUSDTBalance();
  // console.log(result);

  // console.log('Counts for DOGEUSDT:\n');
  // const { markPrice } = await binance.getMarketPrice(order.coin);
  // console.log(markPrice);
  // const prices = await calc.getAllMiddlePrices(markPrice);
  // console.log(prices);
  // const qty = await calc.buyQtyCoins(prices);
  // console.log(qty);

  // const responseOnPutOrder = await binance.putLimitOrder(order)
  // console.log('Response after placing order', responseOnPutOrder);

  // const resultOnCloseOrder = await binance.cancelLimitOrderById(order.coin, 19482102343);
  // console.log('Result on closing order', resultOnCloseOrder);

  // const resultOnCancelOrder = await binance.cancelAllLimitsByCoin('TRXUSDT');
  // console.log(resultOnCancelOrder);

  // const allExistingOrders = await binance.getOpenedOrders();
  // console.log("Get all orders:", allExistingOrders);

  // const limitOnSell = await binance.getSellOrder(order.coin);
  // console.log(limitOnSell);

  // const ResultOnOpenedPositions = await binance.getAllOpenedPositions();
  // console.log(ResultOnOpenedPositions);

  // const ExisstPositionOrNot = await binance.getCoinInPosition('KAVAUSDT');
  // console.log(ExisstPositionOrNot);
};

const timer = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 8000);
  });
};

const startBot = async () => {
  console.time("Time one cycle");
  try {
    run();
  } catch (e) {
    console.log(e);
  }

  await timer();
  console.timeEnd("Time one cycle");
  console.log(coin);

  startBot();
};

startBot();
