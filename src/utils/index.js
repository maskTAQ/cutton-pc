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

const createdClientId = function () {
    var timestamp = Date.parse(new Date());
    //获取n位随机数,随机来源chars
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    var client_id = generateMixed(6) + timestamp;
    return client_id;
}
const Publisher = new Public();
const clientId = createdClientId();
export {
    Publisher, clientId
}