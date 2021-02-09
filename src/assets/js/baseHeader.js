import util from './utils';


let deviceId = localStorage.getItem('deviceId');
if (!deviceId || deviceId.length !== 8) {
  deviceId = util.randomString(8);
  localStorage.setItem('deviceId', deviceId);
}


const baseHeader = {
  // deviceType: 3,
  deviceId,
  // msgType: 0,
  sendingTime: util.now(),
};

export default baseHeader;
