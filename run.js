var prompt = require("prompt");
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var schema = {
  properties: {
    coinName: {
      message: 'Введи имя одной монеты без пары USDT (ex: KAVA, COTI)',
      required: true
    },
    tick: {
      message: 'Введи размер tick (ex: 3, 4)',
      required: true
    },
    stackSize: {
      message: 'Введи размер стека (ex: 125, 200)',
      required: true
    },
    direction: {
      message: 'Выбери сторону (ex: SHORT, LONG)',
      required: true,
    }
  }
};

const setConfig = async () => {

    prompt.start();

    prompt.get(schema, async (err, result) => {
    
      const {coinName, tick, stackSize, direction} = result;
      let codeShort;
      let codeLong;
    
      const parcedConfig = JSON.parse(fs.readFileSync('./configAbstract.json', 'utf-8'));
      parcedConfig.coin = `${coinName}USDT`;
      parcedConfig.stackValue = parseInt(stackSize);
      parcedConfig.tickerSize = parseInt(tick);
      const packageFile = JSON.parse(fs.readFileSync(`./package.json`, 'utf-8'));

    
      switch(direction) {
        case "SHORT":
          parcedConfig.middleSplitter = [ -0.5, -1.1, -2.3, -5, -8 ];
          codeShort = fs.readFileSync(`./trade_short/code_short.txt`, 'utf-8');
          const updatedCodeShort = codeShort.replace('SYMBOL_TO_RUN', coinName);
          fs.writeFileSync(`./trade_short/src/${coinName.toUpperCase()}_short.ts`, updatedCodeShort);
          fs.writeFileSync(`./trade_short/src/configs/${coinName.toUpperCase()}.json`, JSON.stringify(parcedConfig));
          packageFile.scripts[`${coinName}_short`] = `tsc -p ./trade_short/tsconfig.json && node ./trade_short/public/${coinName.toUpperCase()}_short`
          fs.writeFileSync('./package.json', JSON.stringify(packageFile))
        case "LONG":
          parcedConfig.middleSplitter = [ 1.0, 2.5, 4.0, 8.0, 12.0 ];
          codeLong = fs.readFileSync(`./trade_long/code_long.txt`, 'utf-8');
          const updatedCodeLong = codeLong.replace('SYMBOL_TO_RUN', coinName);
          fs.writeFileSync(`./trade_long/src/${coinName.toUpperCase()}_long.ts`, updatedCodeLong);
          fs.writeFileSync(`./trade_long/src/configs/${coinName.toUpperCase()}.json`, JSON.stringify(parcedConfig));
          packageFile.scripts[`${coinName}_long`] = `tsc -p ./trade_long/tsconfig.json && node ./trade_long/public/${coinName.toUpperCase()}_long`
          fs.writeFileSync('./package.json', JSON.stringify(packageFile))
      }
    })

}

setConfig();

