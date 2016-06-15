/*
 * 
 * mortorドライバーバージョンで１番中心になるjs。
 * 起動する際はsudo node mortor_module.jsでどうぞ。
 * 
 */

var express = require('express');
var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み
var ip = require( 'ip'); //IPアドレス取得用のモジュール

var TA7291PA = require('./TA7291PA');

var RIGHT_MOTOR = new TA7291PA (27,28,29),
    LEFT_MOTOR  = new TA7291PA (21,22,23);
/*今回は使用しません。
var Servo = require('./Servo');
var servo = new Servo();
*/

//サーバーの情報
var host ={
    name:ip.address(),
    port:"80"
};

// HTTPサーバーを立てる
var app = express();
var server = http.createServer(app);
server.listen(host.port);

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

//モーター用ステアステータス変数。
var stair_status ="";

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {
    
    // クライアントからサーバーへ メッセージ送信ハンドラ
    socket.on( 'steer', function( data ) {

        //閾値を設定。

        //左にガッツリ旋回
    	if(data < 120){
            stair_status = "LEFT_BIG";
        }else
        //左にちょっと旋回
        if(data < 140){
            stair_status = "LEFT_SMALL";
        }else
        //右にちょっと旋回
        if(data > 160){
            stair_status = "RIGHT_SMALL";
        }else
        //右にガッツリ旋回
        if(data < 180){
            stair_status = "RIGHT_BIG";
        }

        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'steer', stair_status );
    });

 	// クライアントからサーバーへ メッセージ送信ハンドラ
    socket.on( 'axel', function( data ) {
        var status = "";

        //ラジコン用を使いまわす！！ので、PWM信号用の名残が...
        //スピードは実装できなかった。
        if(data < 150){
            RIGHT_MOTOR.forward();
            LEFT_MOTOR.forward();
            status = "forward";
        }else
        if(data > 150 ){
            RIGHT_MOTOR.reverse();
            LEFT_MOTOR.reverse();
            status = "back";
        }

        //brakeは150か180しか送ってこないので使ってやる。
        if (data == 180 || data == 150) {
            RIGHT_MOTOR.stop();
            LEFT_MOTOR.stop();
            status = "stop";
        };

        //right とかleftをもろに送ってくる

        if(data == "right"){
            RIGHT_MOTOR.reverse();
            LEFT_MOTOR.forward();
            status = "right";
        }
        if(data == "left"){
            RIGHT_MOTOR.forward();
            LEFT_MOTOR.reverse();
            status = "left";

        }

        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 'axel', status);
    });
});
