/*
 * 
 * １番中心になるjs。
 * 起動する際はnode rc-socket_ipv6.jsでどうぞ。
 * socket.ioのV対応はまだやってません。
 */

var express = require('express');
var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み
var ip = require( 'ip'); //IPアドレス取得用のモジュール

var Servo = require('./Servo');
var servo = new Servo();

//サーバーの情報
var host ={
    name:ip.address('public','ipv6'),
    port:"80"
};

// HTTPサーバーを立てる
var app = express();
var server = http.createServer(app);
server.listen(host.port,host.name);

// host.jsonを作成・書き換えをする。
fs.writeFile("js/host.json",JSON.stringify(host));

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
