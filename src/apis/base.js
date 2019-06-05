import Axios from "axios";
import qs from "qs";
import { Message } from 'element-ui';

const host = 'https://s.chncot.com/app/index.php';

/**
 * 请求拦截器
 * */
// 拦截响应response，并做一些错误处理
Axios.interceptors.response.use(
    response => response,
    err => {
        //console.log(err.message);
        // 这里是返回状态码不为200时候的错误处理
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = "请求错误";
                    break;

                case 401:
                    err.message = "未授权，请登录";
                    break;

                case 403:
                    err.message = "拒绝访问";
                    break;

                case 404:
                    err.message = `未找到资源`;
                    break;

                case 408:
                    err.message = "请求超时";
                    break;

                case 500:
                    err.message = "服务器内部错误";
                    break;

                case 501:
                    err.message = "服务未实现";
                    break;

                case 502:
                    err.message = "网关错误";
                    break;

                case 503:
                    err.message = "服务不可用";
                    break;

                case 504:
                    err.message = "网关超时";
                    break;

                case 505:
                    err.message = "HTTP版本不受支持";
                    break;

                default:
            }
        }
        err.message = err.message.replace("Network Error", "网络错误");
        err.message = err.message.replace(
            /timeout of ([\d]+)ms exceeded/,
            "请求超时"
        );
        return Promise.reject(err);
    }
);


/**
 * 打印错误信息
 * */
const logError = ({ url, params, res, error }) => {
    console.log(`
    --     start    --
    url:${url} 
    params:${JSON.stringify(params)}
    res:${JSON.stringify(res)}
    error:${JSON.stringify(error)}
    --      end     --
    `);
};

const commonParmas = {
    c: 'entry',
    a: 'wxapp',
    i: 6,
    t: 0,
    //from:'wxapp',
    m: 'zh_dianc',
    sign: '0a382e9b7fa70f12a3301fa1ceb39ea0',
    openid: 'oc7pZ5K0I9Ild3lh6Zjj1Zu4TFec',
    device: '6',
    appname: 'zmw'
};
/**
 * 请求
 * */
const requestWrapper = (method, url, param = {}) => {
    let u = ''
    const params =
        method === "post" ? { data: qs.stringify(param) } : { params: Object.assign({ do: url }, commonParmas, param) };
    if (method === 'post') {
        u += '?'+qs.stringify(Object.assign({ do: url }, commonParmas));
        console.log(u, 'u');
    }

    return Axios.request({
        baseURL: url.includes('http') ? '' : host,
        url: u,
        method,
        timeout: 600000,
        ...params
    });
};

const base = (type, url, params, config) => {
    const { handleCatch, loading } = config;
    return new Promise((resolve, reject) => {
        requestWrapper(type, url, params)
            .then(res => {
                const { code, data, msg } = res.data;
                if (code === 200) {
                    resolve(data);
                } else {
                    Message.error({
                        showClose: true,
                        message: msg,
                        type: 'error'
                    });
                    reject(msg);
                }
            })
            .catch(e => {
                console.log(e, 'url' + url)
                const err = e.message || e;
                if (handleCatch) {
                    Message.error({
                        showClose: true,
                        message: err,
                        type: 'error'
                    });
                    return reject(err);
                }
                return reject(err);
            });
    });
};
const post = (
    url,
    params = {},
    { loading = true, handleCatch = true } = {}
) => {
    return base("post", url, params, { loading, handleCatch });
};

const get = (url, params = {}, { loading = true, handleCatch = true } = {}) => {
    return base("get", url, params, { loading, handleCatch });
};


export { post, get, host, commonParmas };
