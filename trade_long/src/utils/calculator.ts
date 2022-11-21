import { roundValue } from "./rounder";
import { getConfig } from "../utils/configReader";

export class Calculator {
  coin: string;

  constructor(coin: string) {
    this.coin = coin;
  }

  readConfig() {
    const coinConfig = getConfig(this.coin);
    return coinConfig;
  }

  countWorkingStack(): number {
    const { stackValue, workingPercent, shoulder } = this.readConfig();
    return stackValue * shoulder * (workingPercent / 100);
  };

  async getAllMiddlePrices (startBuyPrice: number) {
    let pricesToBuy: number[] = [startBuyPrice];

    const { middleSplitter } = this.readConfig();
    let newPrice = startBuyPrice;
    for (let i = 1; i <= 5; i++) {
      newPrice =
        startBuyPrice - (startBuyPrice * (middleSplitter[i - 1] / 100));
      pricesToBuy.push(roundValue(newPrice, 6));
    }

    return pricesToBuy;
  };

  /**
   * 
   * @param pricesToBuy - precounted priced on buy coins;
   * @returns - array with qnty of coins to buy on zero buy and 5 middlers.
   */
  async buyQtyCoins (pricesToBuy: number[]) {
    const { middleBuyIncreaser } = this.readConfig();

    const workingMoney = this.countWorkingStack();

    const coins =
      workingMoney /
      pricesToBuy.reduce((pre, cur, index) => {
        return pre + cur * middleBuyIncreaser[index];
      }, 0);

    let totalCoins = workingMoney / coins;
    let coinsQuantity = [];

    for (let i of middleBuyIncreaser) {
      coinsQuantity.push(Math.floor(coins * i));
      totalCoins = totalCoins + coins * i;
    }
    console.log('Coin qnt: ', coinsQuantity)
    return coinsQuantity;
  };
}

const calc = new Calculator('SUSHI');
console.log(calc.countWorkingStack());
console.log(calc.getAllMiddlePrices(1.488));
