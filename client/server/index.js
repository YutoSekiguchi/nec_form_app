// const WebSocket = require('ws');
// const server = new WebSocket.Server({ port: 8080 });

// // 複数のフォームデータを管理するオブジェクト
// let forms = {
//   form1: {},
//   hypoForm: {} // ここに更にフォームデータを追加できます
// };

// server.on('connection', ws => {
//   ws.on('message', message => {
//     const { formId, data } = JSON.parse(message);

//     // 指定されたformIdに基づいてデータを更新
//     if (forms[formId]) {
//       forms[formId] = data;
//       // 全クライアントに最新のフォームデータを送信
//       server.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify({ formId, data }));
//         }
//       });
//     }
//   });

//   // 新規接続時に全てのフォームデータを送信
//   ws.send(JSON.stringify(forms));
// });

// console.log('WebSocket server is running on port 8080');


const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8000 });

let forms = {};

server.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'initialData', data: forms }));
  ws.on('message', message => {
    const { id, formId, data } = JSON.parse(message);

    // IDがformsオブジェクトに存在しない場合、新しく作成する
    if (!forms[id]) {
      forms[id] = {
        hypoForm: {},
        observationForm: {observationTextAreaField1: "", observationTextAreaField2: "", observationTextAreaField3: ""},
        observationResultForm: {observationResultTextAreaField1: "", observationResultTextAreaField2: "", observationResultTextAreaField3: ""},
        ask: {askTextAreaField1: "", askTextAreaField2: "", askTextAreaField3: ""},
        askResult: {askTextResultAreaField1: "", askTextResultAreaField2: "", askTextResultAreaField3: ""}
      };
    }
    // 新規接続またはリロード時に現在のフォーム状態を送信

    // 特定のIDに対するフォームデータを更新
    if (forms[id][formId]) {
      forms[id][formId] = data;
      // 更新されたデータを全クライアントに送信
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ id, formId, data }));
        }
      });
    }
  });
});


console.log('WebSocket server is running on port 8000');
