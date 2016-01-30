var gyro = gyro || {
    x: 0,
    y: 0,
    z: 0
};

window.addEventListener("deviceorientation", deviceorientationHandler);



// ジャイロセンサーの値が変化
function deviceorientationHandler(event) {
    // X軸
    gyro.x = event.beta;
    // Y軸
    gyro.y = event.gamma;
    // Z軸
    gyro.z = event.alpha;

}

$("#gyroOn").on('click', function () {


});