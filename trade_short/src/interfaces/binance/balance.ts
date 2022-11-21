export interface BinanceBalance {
    accountAlias: string;
    asset: string;
    balance: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
    marginAvailable: boolean;
    updateTime: number;
}

export interface LimitOrderResponse {
    orderId: number;
    symbol: string;
    status: string;
    clientOrderId: string;
    price: string;
    avgPrice: string;
    origQty: string;
    executedQty: string;
    cumQty: string;
    cumQuote: string;
    timeInForce: string;
    type: string;
    reduceOnly: boolean;
    closePosition: boolean;
    side: string;
    positionSide: string;
    stopPrice: string;
    workingType: string;
    priceProtect: boolean;
    origType: string;
    updateTime: number;
}

export enum OrderType {
  SELL = "Sell",
  BUY = "Buy",
}

export interface LimitOrder {
  coin: string, 
  limitPrice: number, 
  qty: number, 
  orderType: OrderType,
  roundDecimals: number,
}

export interface MarketPrice {
    symbol: string,
    markPrice: string,
    indexPrice: string,
    estimatedSettlePrice: string,
    lastFundingRate: string,
    interestRate: string,
    nextFundingTime: number,
    time: number
}

export interface Positions {
    symbol: string,
    positionAmt: string,
    entryPrice: string,
    markPrice: string,
    unRealizedProfit: string,
    liquidationPrice: string,
    leverage: string,
    maxNotionalValue: string,
    marginType: string,
    isolatedMargin: string,
    isAutoAddMargin: string,
    positionSide: string,
    notional: string,
    isolatedWallet: string,
    updateTime: number,
}

export interface Income {
    symbol: string,
    incomeType: string,
    income: string,
    asset: string,
    time: number,
    info: string,
    tranId: number,
    tradeId: string,
}