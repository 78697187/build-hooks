import { Message, MessageBox, Notification } from 'element-ui';
import axios from 'axios';
const BASE_URL = '';
const errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误,请反馈给管理员'
}

const request = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: BASE_URL,
  // 超时
  timeout: 2000
});

function getToken() {
  return '';
}
// 设置请求拦截器
/*
在发送请求之前我们总得做一些事情：
  -是否需要token（如需要的话将每个请求携带token）
  -如果是get需要传递参数的话需要将特殊字符过滤掉
*/
request.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if(getToken() && !isToken) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer' + getToken();
    }

    // get请求映射params参数
    // encodeURIComponent方法是js提供的一个方法，把字符串作为 URI 组件进行编码，
    // 该方法不会对 ASCII 字母和数字进行编码，主要作用是过滤掉特殊字符
    if(config.method === 'get' && config.params) {
      let url = config.url + '?';
      for(const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        let part = encodeURIComponent(propName) + '=';
        if(value !== null && typeof value !== 'undefined' && value !== '') {
          if(typeof value === 'object') {
            for(let key of Object.keys(value)) {
              let params = propName;
              let subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[key]) + '&';
            }
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
      url = url.slice(0, -1); // 不要最后一个'&'
      config.params = {};
      config.url = url;
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

request.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = Number(res.data.code) || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    if(code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '取消',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 跳转到登录页面
      });
    } else if(code === 500) {
      Message({
        message: msg,
        type: 'error'
      });
      return Promise.reject(new Error(msg));
    } else if(code !== 200) {
      Notification.error({
        title: msg
      });
      return Promise.reject(msg);
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error);
    let { message } = error;
    if(message === 'Network Error') {
      message = '后端接口连接异常';
    } else if(message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if(message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    };
    Message({
      message: message,
      type: 'error',
      duration: 5*1000
    });
    return Promise.reject(error);
  }
)