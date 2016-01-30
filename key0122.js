var fs = require('fs');
var exec = require('child_process').exec;
var keypress = require('keypress');
//以下サーボを動かすメッセージを所定の場所に送る関数
exports.servo = function (gpio,angle){
	var data ="";
	data = gpio + "=" + angle;
	exec('echo ' + data + ' > /dev/servoblaster', function (error, stdout, stderr) {
    if(stdout){
        console.log('stdout: ' + stdout);

    }
    if(stderr){
        console.log('stderr: ' + stderr);
    }
    if (error !== null) {
      console.log('Exec error: ' + error);
    }
    console.log(data);
});

}

//キーバインド系関数
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);

//前進
if (key && key.name == 'up') {
    servo(2,148);
  }
//ニュートラル化
if (key && key.name == 'down') {
    servo(2,150);
  }
//右
if(key && key.name == 'right'){
    servo(1,200);
}
//左
if(key && key.name == 'left'){
    servo(1,100);
}
//真ん中
if(key && key.name == 'space'){
    servo(1,150);
}
//プロセス終了用
  if (key && key.ctrl && key.name == 'c') {
    	servo(1,150);
	servo(2,150);
	process.stdin.pause();
  }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
