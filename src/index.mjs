import Godomall from './classes/crawler/Godomall.class.mjs';
import { WebSocketServer } from 'ws';

const wsServer = new WebSocketServer({ port: 8080 }, () => {
  console.log('WebSocket server is listening on port 8080');
});

wsServer.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('error', console.error);
});

const godomallInstances = [
  new Godomall({ host: "https://m.laonvape.co.kr/", cateCd: "004" }).attachWebSockerServer(wsServer),
  new Godomall({ host: "https://m.epicvape.co.kr/", cateCd: "002" }).attachWebSockerServer(wsServer),
];

Promise.all(godomallInstances.map(instance => instance.executeRunUntilEndPage()))
  .then(() => console.log('All instances have finished executing.'))
  .catch(error => console.error('An error occurred:', error));