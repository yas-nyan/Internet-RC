/*
 * コンソール上のキー操作でラジコンを動かすためのテスト用コード
 * テスト用にどうぞ。 node コマンドで起動。
 */

var fs = require('fs');
var exec = require('child_process').exec;
var keypress = require('keypress');
var Servo = require('./Servo.js');
var servo = new Servo();

//キーバインド系関数
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);

//前進
    if (key && key.name == 'up') {
        servo.send(2, 148);
    }
//ニュートラル化
    if (key && key.name == 'down') {
        servo.send(2, 150);
    }
//右
    if (key && key.name == 'right') {
        servo.send(1, 200);
    }
//左
    if (key && key.name == 'left') {
        servo.send(1, 100);
    }
//真ん中
    if (key && key.name == 'space') {
        servo.send(1, 150);
    }
//プロセス終了用
    if (key && key.ctrl && key.name == 'c') {
        servo.send(1, 150);
        servo.send(2, 150);
        process.stdin.pause();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();
