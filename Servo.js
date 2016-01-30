/*
 * サーボを動かすためのコード。気が向いたらモジュール化するかも。
 * 
 * gpioはServoblasterで色々設定できる。
 * 
 */
function Servo() {};

Servo.prototype.send = function (gpio, angle) {
    
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
