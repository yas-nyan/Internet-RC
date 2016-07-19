//ベンダーIDとプロダクトIDを直接指定するサンプル

var GamePad = require('node-gamepad');
var controller = new GamePad('ps3/dualshock3',{
	vendorID:1356,
	productID:616
});

//クライアントソケット
var io = require('socket.io-client');
var host = process.argv[2];
var socket = io('http://' + process.argv[2]);

//アクセルステータス
var axelstatus = "stop";
socket.on('connect', function () {
    console.log("接続されました。");
});


controller.connect();

controller.on('right:move', function (x, y) {
    //x.yの0~255のデータを100~200のデータに変換して、切り捨て。
    var data = Math.floor(x.y * 100 / 255 + 100);

    if (data < 150) {
        axelstatus = "forward";
        console.log(axelstatus);
    } else if (data > 159) {
        axelstatus = "back";
        console.log(axelstatus);
    } else {
        axelstatus = "stop";
        console.log(axelstatus);
    }

    socket.emit("axel", data);
    console.log("R/ X:" + x.x + "Y:" + x.y);
});
controller.on('left:move', function (x, y) {
    //x.yの0~255のデータを100~200のデータに変換して、切り捨て。
    var data = Math.floor(x.x * 100 / 255 + 100);
    socket.emit("steer", data);
    console.log("R/ X:" + x.x + "Y:" + x.y);
});

controller.on('square:press', brake);

controller.on('x:press', axel);

controller.on('circle:press', back);

function brake() {
    if (axelstatus == "forward") {
        socket.emit("axel", 200);
    } else {
        socket.emit("axel", 150);
    }
    axelstatus = "stop";
    console.log(axelstatus);
}


function axel() {
    socket.emit("axel", 146);
    axelstatus = 'forward';
    console.log(axelstatus);
}

function back() {
    if (axelstatus == "forward") {
        brake();
    }
    socket.emit("axel", 150);
    socket.emit("axel", 159);
    socket.emit("axel", 159);
    socket.emit("axel", 160);
    socket.emit("axel", 162);
    axelstatus = "back";
    console.log(axelstatus);

}
