/*
 TOSHIBA TA7291PA's driver.
 
 http://github.com/yas-nyan/
 ！！！コピペじゃないです！！！
 
 
 http://akizukidenshi.com/download/ta7291p.pdf#search='TA7291P'
 (ONLY JAPANESE...)
 
 @dependencies
 ・Wiring pi
 http://wiringpi.com/
 ☆how to install
 pi@raspberrypi ~ $ git clone git://git.drogon.net/wiringPi
 pi@raspberrypi ~ $ cd wiringPi
 pi@raspberrypi ~/wiringPi $ ./build
 pi@raspberrypi ~/ gpio -v
 gpio version: 2.31
 Copyright (c) 2012-2015 Gordon Henderson
 This is free software with ABSOLUTELY NO WARRANTY.
 For details type: gpio -warranty
 
 !!! .ports numbers depend on wiringPi gpio number.!!!
 ☆ how to get wiringPi gpio number
 use ↓ commands. you can get correct gpio number of your pi ver.
 pi@raspberrypi ~ % gpio allread
 +-----+-----+---------+------+---+---Pi 2---+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 |     |     |    3.3v |      |   |  1 || 2  |   |      | 5v      |     |     |
 |   2 |   8 |   SDA.1 | ALT0 | 1 |  3 || 4  |   |      | 5V      |     |     |
 |   3 |   9 |   SCL.1 | ALT0 | 1 |  5 || 6  |   |      | 0v      |     |     |
 |   4 |   7 | GPIO. 7 |  OUT | 0 |  7 || 8  | 0 | ALT0 | TxD     | 15  | 14  |
 |     |     |      0v |      |   |  9 || 10 | 1 | ALT0 | RxD     | 16  | 15  |
 |  17 |   0 | GPIO. 0 |  OUT | 0 | 11 || 12 | 0 | OUT  | GPIO. 1 | 1   | 18  |
 |  27 |   2 | GPIO. 2 |  OUT | 0 | 13 || 14 |   |      | 0v      |     |     |
 |  22 |   3 | GPIO. 3 |  OUT | 0 | 15 || 16 | 0 | OUT  | GPIO. 4 | 4   | 23  |
 |     |     |    3.3v |      |   | 17 || 18 | 0 | OUT  | GPIO. 5 | 5   | 24  |
 |  10 |  12 |    MOSI |   IN | 0 | 19 || 20 |   |      | 0v      |     |     |
 |   9 |  13 |    MISO |   IN | 0 | 21 || 22 | 0 | OUT  | GPIO. 6 | 6   | 25  |
 |  11 |  14 |    SCLK |   IN | 0 | 23 || 24 | 1 | IN   | CE0     | 10  | 8   |
 |     |     |      0v |      |   | 25 || 26 | 1 | IN   | CE1     | 11  | 7   |
 |   0 |  30 |   SDA.0 |   IN | 1 | 27 || 28 | 1 | IN   | SCL.0   | 31  | 1   |
 |   5 |  21 | GPIO.21 |   IN | 1 | 29 || 30 |   |      | 0v      |     |     |
 |   6 |  22 | GPIO.22 |   IN | 1 | 31 || 32 | 0 | IN   | GPIO.26 | 26  | 12  |
 |  13 |  23 | GPIO.23 |   IN | 0 | 33 || 34 |   |      | 0v      |     |     |
 |  19 |  24 | GPIO.24 |   IN | 0 | 35 || 36 | 0 | IN   | GPIO.27 | 27  | 16  |
 |  26 |  25 | GPIO.25 |   IN | 0 | 37 || 38 | 0 | IN   | GPIO.28 | 28  | 20  |
 |     |     |      0v |      |   | 39 || 40 | 0 | IN   | GPIO.29 | 29  | 21  |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+---Pi 2---+---+------+---------+-----+-----+
 
 
 @example
 
 const TA7291PA = require ("TA7291PA");
 var RIGHT_MOTOR = new TA7291PA (36,38,40),
 LEFT_MOTOR  = new TA7291PA (23,24,25);
 
 //RIGHT FOWARD
 RIGTH_MOTOR.foward();
 
 
 @module TA7291PA
 
 */

// load our dependencies into scope
const exec = require('child_process').exec;

// export the constructor
module.exports = TA7291PA;


// "new TA7291PA()",gpio ports open.
// IN1 and IN2 are TA7291P's input ports.(in other words,Raspberry pi's digital output ports...)
// REF is volume port of mortor rev.
function TA7291PA(IN1, IN2, REF) {
    if (!IN1 || !IN2 || !REF) {
        console.log("It has to  specify 3 GPIO number!  It does not work.");
    }
    this.ports = {
        _IN1: IN1,
        _IN2: IN2,
        _REF: REF
    };

    
    console.log(this.ports._IN1);
    //gpio ports open.
    exec("gpio mode " + this.ports._IN1 + " out");
    console.log("gpio mode " + this.ports._IN1 + " out");
    exec("gpio mode " + this.ports._IN2 + " out");
    console.log("gpio mode " + this.ports._IN2 + " out");
    exec("gpio mode " + this.ports._REF + " out");
    console.log("gpio mode " + this.ports._REF + " out");


}

const write = function (PORT, DATA) {
    // PORT : ports._IN1...
    // DATA : 1 or 0

    //send "gpio" command to pi
    this.PORT = PORT;
    this.DATA = DATA;
    exec("gpio write " + PORT + " " + DATA, function (error, stdout, stderr) {
        if (stdout) {
            console.log('stdout: ' + stdout);
            return;

        }
        if (stderr) {
            console.log('stderr: ' + stderr);
            return;
        }
        if (error !== null) {
            console.log('Exec error: ' + error);
        }
        console.log("GPIO" +PORT + ":" + DATA)
    });
};

TA7291PA.prototype.write = write();

TA7291PA.prototype.pwm = function (PORT, DATA) {
    //pwm is not working without GPIO 18 port, because wiringPi doesn't have support to software PWM puls.
    //TO DO FIX
};

TA7291PA.prototype.forward = function (rev) {
    //rev is not working without GPIO 18 port, because wiringPi doesn't have support to software PWM puls.
    write(this.ports._IN1, 0);
    write(this.ports._IN2, 1);

    //TO DO FIX. The line should be wroute this way ...TA7291PA.pwm(ports._REF,rev);
    write(this.ports._REF, 1);
};

TA7291PA.prototype.reverse = function (rev) {
    //rev is not working without GPIO 18 port, because wiringPi doesn't have support to software PWM puls.
    write(this.ports._IN1, 1);
    write(this.ports._IN2, 0);

    //TO DO FIX. The line should be wroute this way ...TA7291PA.pwm(ports._REF,rev);
    write(this.ports._REF, 1);
};

TA7291PA.prototype.stop = function (rev) {
    //rev is not working without GPIO 18 port, because wiringPi doesn't have support to software PWM puls.
    write(this.ports._IN1, 0);
    write(this.ports._IN2, 0);

    //TO DO FIX. The line should be wroute this way ...TA7291PA.pwm(ports._REF,rev);
    write(this.ports._REF, 0);
};


