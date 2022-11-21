import { BinanceGlobal } from "./connect";

const binance = new BinanceGlobal();

const test = async () => {
return await binance.getProfitOnLastSell('SFPUSDT');
}

test();
