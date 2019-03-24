import { Message } from 'element-ui';
import MQTT from './paho-mqtt';

function Public() {
    this.handlers = {};
}
Public.prototype = {
    // 订阅事件
    on: function (eventType, handler) {
        var self = this;
        if (!(eventType in self.handlers)) {
            self.handlers[eventType] = [];
        }
        self.handlers[eventType].push(handler);
        return this;
    },
    // 触发事件(发布事件)
    emit: function (eventType) {
        var self = this;
        var handlerArgs = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < self.handlers[eventType].length; i++) {
            self.handlers[eventType][i].apply(self, handlerArgs);
        }
        return self;
    },
    // 删除订阅事件
    off: function (eventType, handler) {
        var currentEvent = this.handlers[eventType];
        var len = 0;
        if (currentEvent) {
            len = currentEvent.length;
            for (var i = len - 1; i >= 0; i--) {
                if (currentEvent[i] === handler) {
                    currentEvent.splice(i, 1);
                }
            }
        }
        return this;
    }
};

var Publisher = new Public();


let isConnected = false;
var username = "mqtt_client_123";
var client = new MQTT.Client("128.1.132.27", Number(8083), "ClientID-Phone" + username);//建立客户端实例  
client.connect({ onSuccess: onConnect });//连接服务器并注册连接成功处理事件  
function onConnect() {
    isConnected = true;
    console.log("onConnected  Client");
    client.subscribe("/topi'=c/zmw/test/" + username);//订阅主题  
}
client.onConnectionLost = onConnectionLost;//注册连接断开处理事件  
client.onMessageArrived = onMessageArrived;//注册消息接收处理事件  
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        isConnected = false;
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("与服务器断开连接");
    }
}
function onMessageArrived(message) {
    const data = JSON.parse(message.payloadString);
    const { messageId } = data;
    console.log("收到服务器消息:", data);
    Publisher.emit(messageId, data)


}

export function send(number) {
    if (!isConnected) {
        return Promise.reject('服务连接中...');
    }
    const messageId = Date.now();
    // //发送消息给服务器 
    var jsonstr = {
        url: "https://s.chncot.com/app/index.php?i=6&t=0&v=9.4&from=wxapp&m=zh_dianc&sign=8fe61a41cf15856e716943ef239ca1f2&c=entry&a=wxapp&do=",
        do: "QCDataAdd",
        carry: { userID: 123, time: 12312312 },
        number: number,
        client_id: username,
        messageId
    }
    var message = new MQTT.Message(JSON.stringify(jsonstr));
    message.destinationName = "/topic/zmw/ccqsc/test/";
    client.send(message);
    return new Promise((resolve, reject) => {
        let isCall = false
        Publisher.on(messageId, (data) => {
            isCall = true
            const { code, msg } = data;
            Publisher.off(messageId);
            if (code == 200) {
                console.log(data, 'data');
                resolve(data.data)
            }
            else {
                Message.error(msg)
                reject(msg);
            }

        });

        setTimeout(() => {
            if (!isCall) {
                Message.error('批号验证超时,请重试')
                reject('批号验证超时,请重试');
            }
        }, 5000);
    })
}
