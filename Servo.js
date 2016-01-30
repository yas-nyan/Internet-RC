/*
 * サーボを動かすためのモジュール化するかも
 * 
 * gpioはServoblasterで色々設定できる。
 * 
 */

//子プロセスを動かすためのモジュールを入れておく。
var exec = require('child_process').exec;

var Servo = function (){
};
Servo.prototype.send = function (gpio, angle){
    this.gpio = gpio;
    this.angle = angle;
    var data = "";
        data = gpio + "=" + angle;
        exec('echo ' + data + ' > /dev/servoblaster', function (error, stdout, stderr) {
            if (stdout) {
                console.log('stdout: ' + stdout);

            }
            if (stderr) {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('Exec error: ' + error);
            }
            console.log(data);
        });
};

module.exports = Servo;