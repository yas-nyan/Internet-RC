var express = require('express');
var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み

var key = require('./key0122.js');


// 3000番ポートでHTTPサーバーを立てる
var app = express();
var server = http.createServer(app);
server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

 /*http.createServer( function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./socketRC.html', 'utf-8') );  // index.htmlの内容を出力
}).listen(3000);
*/



// サーバーをソケットに紐付ける
var io = socketio.listen( server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {
	console.log
    // クライアントからサーバーへ メッセージ送信ハンドラ（自分を含む全員宛に送る）
    socket.on( 'steer', function( data ) {
    	key.servo(1,data);
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'steer', data );
    });

 	// クライアントからサーバーへ メッセージ送信ハンドラ（自分を含む全員宛に送る）
    socket.on( 'axel', function( data ) {
    	key.servo(2,data);
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'axel', data);
    });
});
