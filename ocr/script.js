const video = document.getElementById('videoElement');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvasElement');

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log('카메라 접근에 실패했습니다:', error);
    });
} else {
  console.log('브라우저가 카메라 접근을 지원하지 않습니다.');
}