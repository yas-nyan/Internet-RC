//ベンダーIDとプロダクトIDを直接指定するサンプル


var GamePad = require('node-gamepad');
var controller = new GamePad('ps3/dualshock3',{
	vendorID:3853,
	productID:77
});

//クライアントソケット
var io = require('socket.io-client');
var host = process.argv[2];
var socket = io('http://' + process.argv[2]);

//詳細設定用。
var setting = {
    steer:150,
    axel:146
}

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
    var data = Math.floor(x.x * 100 / 255 + (setting.steer - 50));
    socket.emit("steer", data);
    console.log("R/ X:" + x.x + "Y:" + x.y);
});

controller.on('square:press', brake);

controller.on('x:press', axel);

controller.on('circle:press', back);

//トリム・アクセル開度調整

controller.on("dpadUp:press",axelUp);
controller.on("dpadDown:press",axelDown);
controller.on("dpadRight:press",steerRight);
controller.on("dpadLeft:press",steerLeft);

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
    socket.emit("axel", setting.axel);
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

//アクセル開度を変更します。
function axelDown () {
    //1だけ上げます。(バックより)
    setting.axel++;
    console.log("NEUTRAL_AXEL:" + setting.axel);
}

//アクセル開度を変更します。
function axelUp () {
    //1だけ上げます。(前進より)
    setting.axel--;
    console.log("NEUTRAL_AXEL:" + setting.axel);
}

//トリムを変更します。
function steerLeft () {
    //1だけ下げます(左より)
    setting.steer--;
    console.log("NEUTRAL_STEER:" + setting.steer);
}

//トリムを変更します。
function steerRight () {
    //1だけ上げます。(右より)
    setting.steer++;
    console.log("NEUTRAL_STEER:" +setting.steer);
}

