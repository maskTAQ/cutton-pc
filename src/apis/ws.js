import { Message } from 'element-ui';
import MQTT from './paho-mqtt';
import { clientId, Publisher } from '@/utils';
const pcClientId = clientId;
console.log(pcClientId,'pcClientId');
let serverStatus = {
    connected: false,
    msg: '初始化'
};
var client = new MQTT.Client("s.chncot.com", 443, pcClientId);//建立客户端实例  

function connect() {
    serverStatus = {
        connected: false,
        msg: '连接中'
    };
    client.connect({ onSuccess: onConnect,useSSL:true });//连接服务器并注册连接成功处理事件  
}
connect();
function onConnect() {
    serverStatus = {
        connected: true,
        msg: '连接成功'
    };
    console.log(`pc：连接成功，订阅${pcClientId}`);
    client.subscribe(pcClientId);//订阅主题  
}

client.onConnectionLost = onConnectionLost;//注册连接断开处理事件  
client.onMessageArrived = onMessageArrived;//注册消息接收处理事件  
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        serverStatus = {
            connected: false,
            msg: '连接断开'
        };
        connect();
    }
}

function send({ action, mpClientId, messageId, data }) {
    if (!serverStatus.connected) {
        return Promise.reject(serverStatus.msg);
    }
    let id = messageId || Date.now();
    let message;
    if (action === 'sendLoginResponse') {
        var jsonstr = {
            action: "loginResponse",
            code: 200,
            msg: "PC端已登陆成功!",
            data: { device: 6 },
            messageId: id,
            client_id: pcClientId,
        }
        message = new MQTT.Message(JSON.stringify(jsonstr));
        message.destinationName = mpClientId;
    }
    if (action === 'verifyBatchNumber') {
        const { number, userId, url ,carry} = data;
        const jsonstr = {
            msg: "请求验证批号",
            action,
            messageId: id,
            clientId: pcClientId,
            data: {
                url,
                do: "QCDataAdd",
                number: number,
                device: 6,
                carry,
            },
        }
        console.log(jsonstr, '验证批号')
        message = new MQTT.Message(JSON.stringify(jsonstr));
        message.destinationName = "/topic/zmw/ccqsc/test/";
    }
    client.send(message);
    return new Promise((resolve, reject) => {
        let isCall = false
        Publisher.on(id, (data) => {
            isCall = true
            const { code, msg } = data;
            Publisher.off(id);
            if (code == 200) {
                resolve(data.data)
            }
            else {
                reject(msg);
            }

        });

        setTimeout(() => {
            if (!isCall && action === 'verifyBatchNumber') {
                let err = '验证超时';
                reject(err);
            }
        }, 5000);
    })
}
function onMessageArrived(message) {
    const data = JSON.parse(message.payloadString);
    console.log(data,'服务器消息');
    const { action, messageId, pcClientId, mpClientId } = data;
    if (action === "login") {
        send({
            action: 'sendLoginResponse',
            code: '200',
            messageId,
            pcClientId, mpClientId,
            msg: 'pc登录成功',
            data: {
                device: '6'
            }
        })
        Publisher.emit('login', data.data)
    }
    if (action === "verifyBatchNumber") {
        Publisher.emit(messageId, data)
    }
}

export { send }