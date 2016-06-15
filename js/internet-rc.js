/*
 * ブラウザに紐付けられたメインのjs
 */

/*使用する際はこちらを埋めてコメントアウトを解除
 var host = {
 name:"example.com",
 port:"3000"//初期値は3000 お好きな値をrc-socket.jsで決めてどうぞ。
 };
 */


var gyro = {
    status: false,
    x: 0,
    y: 0,
    z: 0
};
var host ={
    name:"",
    port:""
};

$(function () {
    //host.jsonからサーバーの情報を取得。
    $.getJSON("js/host.json",function(data){
        host.name = data.name;
        host.port = data.port;
    });
    
    var address = "http://" + host.name + ":" + host.port;
    var socket = io.connect(address);
    
    socket.on('connect', function () {
        alert("接続されました。");
    });
    socket.on('disconnect', function () {
        alert("切断されました");
    });
    //アクセルの情報を送信
    $("#axel").bind("change", function () {
        message = $(this).val();
        socket.emit("axel", message);
    });
    //ステアの情報を送信
    $("#steer").bind("change", function () {
        message = $(this).val();
        socket.emit("steer", message);
    });
    //帰ってきたデータをステータスにレンダリング
    socket.on("axel", function (data) {
        $('#axel-status').html("axel:" + data);
    });
    socket.on("steer", function (data) {
        $('#steer-status').html("steer:" + data);
    });
    //リセット
    $("#reset").bind("click", reset);
    var axelstatus = 'stop';
    //アクセルボタン
    $("#axel_button").click(
            function () {
                socket.emit("axel", 146);
                axelstatus = "forward";
            }
    );
    //バックボタン
    $("#back_button").click(
            function () {
                if (axelstatus == "forward") {
                    brake();
                }
                socket.emit("axel", 150);
                socket.emit("axel", 159);
                socket.emit("axel", 159);
                socket.emit("axel", 160);
                socket.emit("axel", 162);
                axelstatus = "back";
            }
    );
    //ブレーキボタン
    $("#brake_button").click(brake);
    function brake() {
        if (axelstatus == "forward") {
            socket.emit("axel", 180);
        } else {
            socket.emit("axel", 150);
        }
        axelstatus = "stop";
    }
    //ライトボタン
    $("#right_button").click(
            function () {
                socket.emit("axel", "right");
                axelstatus = "forward";
            }
    );

    //レフトボタン

    $("#left_button").click(
            function () {
                socket.emit("axel", "left");
                axelstatus = "forward";
            }
    );


    //ジャイロモード切り替え
    $("#gyroOn").on("click", function () {
        if (gyro.status === false) {
            gyro.status = true;
            alert("ジャイロモードになりました");
            $("#gyroOn").val("ジャイロ操作オフ");
            $("#gyroStatus").html("X:" + gyro.x + "Y:" + gyro.y + "Z:" + gyro.z);
        }
        else {
            gyro.status = false;
            $('gyroStatus').html("ジャイロモードはオフです。");
            alert("ジャイロモードやめました");
            $("#gyroOn").val("ジャイロ操作オン");
        }
    });
    function reset() {
        $("#steer").val(150);

        $("#axel").val(150);

    }
    var gn = new GyroNorm();
    var args = {
        frequency: 50, // ( How often the object sends the values - milliseconds )
        gravityNormalized: true, // ( If the garvity related values to be normalized )
        orientationBase: GyroNorm.GAME, // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
        decimalCount: 2, // ( How many digits after the decimal point will there be in the return values )
        logger: null, // ( Function to be called to log messages from gyronorm.js )
        screenAdjusted: false            // ( If set to true it will return screen adjusted values. )
    };
    gn.init(args).then(function () {
        gn.start(function (data) {
            // Process:
            if (gyro.status == true) {
                $("#gyroStatus").html("ジャイロモード X:" + data.do.alpha + "Y:" + data.do.beta + "Z:" + data.do.gamma
                        );
            } else {
                $("gyroStatus").html("ジャイロモードはオフです。");
            }
            //$("#rotateStatus").html("X:" + data.dm.alpha + "Y:" + data.dm.beta + "Z:" + data.dm.gamma
            //);
            var messageY = Math.round(data.do.beta + 150);
            //アクセルがくっそムズカシイので１回やめます
            /*var messageZ =   Math.round(-60 - data.do.gamma + 150);
             if(120 <messageZ && messageZ <180){
             socket.emit("axel", messageZ);
             }
             */
            //正常な範囲の値のみを投げる。
            if (gyro.status == true && 100 < messageY && messageY < 200) {
                socket.emit("steer", messageY);
            }

            //if( -30 > data.do.gamma && -90 < data.do.gamma ){
            //            //}
            // data.do.beta     ( deviceorientation event beta value )
            // data.do.gamma    ( deviceorientation event gamma value )
            // data.do.absolute ( deviceorientation event absolute value )
            // data.dm.x        ( devicemotion event acceleration x value )
            // data.dm.y        ( devicemotion event acceleration y value )
            // data.dm.z        ( devicemotion event acceleration z value )

            // data.dm.gx       ( devicemotion event accelerationIncludingGravity x value )
            // data.dm.gy       ( devicemotion event accelerationIncludingGravity y value )
            // data.dm.gz       ( devicemotion event accelerationIncludingGravity z value )
            // data.dm.alpha    ( devicemotion event rotationRate alpha value )
            // data.dm.beta     ( devicemotion event rotationRate beta value )
            // data.dm.gamma    ( devicemotion event rotationRate gamma value )
        });
    }).catch(function (e) {
        // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
    });
});