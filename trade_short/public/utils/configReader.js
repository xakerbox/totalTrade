"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = require("fs");
const getConfig = (coin) => {
    try {
        // Server side:
        const coinConfig = (0, fs_1.readFileSync)(`./public/configs/${coin}.json`, "utf-8");
        return JSON.parse(coinConfig);
    }
    catch (e) {
        // const error = new Error('Не забыл добавить правильный конфиг для монеты?');
        throw `\n====> Где конфиг для ${coin}? А он правильный?\n`;
    }
};
exports.getConfig = getConfig;
