'use strict';
exports.handler = async event => {
  // 受け取った情報をログで出力しておく
  console.log('start: event = ' + JSON.stringify(event));

  const apiHost = "https://api.openweathermap.org";
  const apiPath = "/data/2.5/weather";
  const apikey = "98d2xxxxxxxxxxxxxxxxxxxxxxxxxc";    // ←ここに皆さんのAPI Keyを入れる
  let response = {
      status: 200,
      body: {
          celsiusTemperature: -1.0
      }
  };

  const cityName = event.properties.preferences.cityName;     // 自分のpieceのプリファレンスの値
  const urlString = `${apiHost}${apiPath}?q=${cityName},jp&APPID=${apikey}`;  //URLの文字列を完成させる。
  console.log(urlString);

  // 天気情報を取得
  let weatherData = await getWeatherInfo(urlString);

  //　天気情報から今日の情報を取得
  if (weatherData) {
      const tempK = weatherData.main.temp;           // REST APIから得られたJSON内の温度を保存。単位はケルビン。
      response.body.celsiusTemperature = tempK - 273.15;  // 次のブロックに返す値は摂氏で数値(Number)
  }

  // output情報をログで出力しておく
  console.log(JSON.stringify(response));

  // 結果を返却
  return response;
};

function getWeatherInfo(urlString) {
  return new Promise(function(resolve){
    console.log('getWeatherInfo: start');
    let request = require('request');
    let options = {
      url: urlString,
      method: 'GET',
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('getWeatherInfo: response = ' +  JSON.stringify(response));
        // レスポンスのBodyを返却
        resolve(JSON.parse(response.body));
      } else {
        console.error('getWeatherInfo: responce = ' + JSON.stringify(response));
        resolve(null);
      }
    });
  });
}