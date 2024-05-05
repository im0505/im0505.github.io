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

navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => {
    const cameras = devices.filter((device) => device.kind === 'videoinput');
  })
  .catch((error) => console.error('Device enumeration failed:', error));
function getCameraStream(deviceId) {
  const constraints = {
    video: { deviceId: deviceId ? { exact: deviceId } : undefined },
  };

  return navigator.mediaDevices.getUserMedia(constraints);
}
let currentDeviceId;

function switchCamera() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const currentIndex = cameras.findIndex(
        (camera) => camera.deviceId === currentDeviceId
      );
      const nextIndex = (currentIndex + 1) % cameras.length;
      currentDeviceId = cameras[nextIndex].deviceId;

      return getCameraStream(currentDeviceId);
    })
    .then((stream) => {
      const videoElement = document.querySelector('video');
      videoElement.srcObject = stream;
    })
    .catch((error) => console.error('Failed to switch camera:', error));
}

document.body.querySelector('#switch').addEventListener('click', switchCamera);