const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8001 });

const clients = new Map(); // クライアントを管理するためにMapを使用

wss.on('connection', function connection(ws) {
    const clientId = Symbol('clientId'); // 新しい接続ごとに一意のキーを割り当て

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);

        console.log(message)
        console.log(data)

        if (data.type === 'join') {
            // クライアントが特定のviewIDに参加
            clients.set(clientId, { ws, viewID: data.viewID });
        } else if (data.type === 'update') {
            // 適切なviewIDを持つクライアントにのみメッセージを送信
            clients.forEach((client, id) => {
                if (client.viewID === data.viewID && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(message);
                }
            });
        }
    });
});
