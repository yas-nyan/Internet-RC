/*
 * 
 * １番中心になるjs。
 * 起動する際はnode rc-socket.jsでどうぞ。
 * 
 */

var express = require('express');
var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み
var exec = require('child_process').exec;

var key = require('./keyContorol.js');
var Servo = require('./Servo.js');
var servo = new Servo();


// 3000番ポートでHTTPサーバーを立てる
var app = express();
var server = http.createServer(app);
server.listen(3000);

//再帰的に必要なファイルを読みこませる。
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

// サーバーをソケットに紐付ける
var io = socketio.listen( server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {
    
    // クライアントからサーバーへ メッセージ送信ハンドラ
    socket.on( 'steer', function( data ) {
    	servo.send(1,data);
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'steer', data );
    });

 	// クライアントからサーバーへ メッセージ送信ハンドラ
    socket.on( 'axel', function( data ) {
    	servo.send(2,data);
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'axel', data);
    });
});
