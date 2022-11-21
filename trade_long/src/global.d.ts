declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BINANCE_API_KEY: string;
      BINANCE_API_SECRET: string;
      TELEGRAM_TOKEN: string;
    }
  }
}

export {};