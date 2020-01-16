'use strict'
const fs = require('fs');

const pieceJSONFolder = './YourCode/JSON/';
var fileext_regexp = /.+\.json$/;    // find ".json" file extention
const pieceCoreFolder = './YourCode/ProxyCore/'
var file_counter = 0;
var temp_file_strage_for_json = [];
fs.readdirSync(pieceJSONFolder).forEach(
    file => {
        //console.log(file);
        if( fileext_regexp.test(file) ) {
            // this file should be JSON file
            file_counter = temp_file_strage_for_json.push(file);
        }else{
            // this is not JSON file..
        }
    }
);

if(file_counter == 0) {
    console.log(`ERROR: There are no valid JSON file in ${pieceJSONFolder}.`);
}else if( file_counter > 1 ) {
    // There are too many JSON files in this folder.
    console.log(`ERROR: There are too many JSON files in ${pieceJSONFolder}.`);
}else{
    // This file must be the target JSON file!
    var tempInputPieceJSON = `${pieceJSONFolder}${temp_file_strage_for_json[0]}`;
    var inputPieceJSON = require(tempInputPieceJSON);   // Read JSON file here.
    // Check whether service (logic) file is exsist or not.
    if(fs.existsSync(`${pieceCoreFolder}${inputPieceJSON.serviceProxy.service}.js`)) {
        const lambda = require(`${pieceCoreFolder}${inputPieceJSON.serviceProxy.service}.js`)   // みなさんが作ったソースを指定。
        let event = require('./YourCode/event.json')           // このピースに渡る情報を「event.json」でエミュレート。
        let context = null
        let callback = (err) => {
            console.log(err)
        }
        // lambdaのエントリーポイントを呼び出し
        if(typeof lambda.handler === "function") {
            let output = lambda.handler(event, context, callback);
            // 結果を表示
            console.log( output );
        }else{
            console.log(`Error: There are no valied handler in ${pieceCoreFolder}${inputPieceJSON.serviceProxy.service}.js`);
        }
    }else{
        console.log(`Error: There are no valied .js file ".${pieceCoreFolder}${inputPieceJSON.serviceProxy.service}.js"\n\t(The target javascript file is set in piece JSON file.)`);
    }
}