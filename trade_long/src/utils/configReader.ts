import { readFileSync } from "fs";
import { Config } from "../interfaces/internal/config";

export const getConfig = (coin: string): Config => {
  try {
    // Server side:
    const coinConfig = readFileSync(`./public/configs/${coin}.json`, "utf-8");
    return JSON.parse(coinConfig);
  } catch(e) {
    // const error = new Error('Не забыл добавить правильный конфиг для монеты?');
    throw `\n====> Где конфиг для ${coin}? А он правильный?\n`;
  }
};