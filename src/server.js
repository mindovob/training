//1. expressモジュールをロード、インスタンス化
var express = require("express");
var app = express();

//2. listens() ⇒ 3000番ポートで待ち受け
var server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
})

//3. アプリ固有の処理
app.post("/api/photoup/", function(rq, res, next){

  res.json();
})
