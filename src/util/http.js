// tools/request.js
// 或者是 request.js
// 界面上的  请求 太多了 要挨个手动写 loading动画或者错误处理 
// token  session  redis 请求头的标识  大多数请求都要加 头 需要手动

import axios from 'axios';
// import qs from 'qs'
import store from '@/store/index'       //已经设置路径别名，否则相对路径引用
import { ElMessage, ElLoading } from "element-plus";
let loading = null
const service = axios.create({
    timeout: 5000,                     //超时时间
    baseURL: "http://152.136.185.210:7878/api/hy66/",             // 我们在请求接口的时候就不用写前面 会自动我们补全
    // transformRequest: data => qs.stringify(data)    //post请求参数处理,防止post请求跨域
})
// http request 请求 拦截器
// 使用 这个模块的请求 在 发起请求之前 都会先走 请求拦截
// 在这里 统一配置 请求头  等信息 比如 token auth  
service.interceptors.request.use(config => {
    loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    // 根据自己的业务/逻辑需求 来写 
    // console.log("config------------请求拦截-----------------:", config)
    //举例子  配置请求参数
    // config.params = {
    //     ...config.params,
    //     auth: "演示 auth----------------",
    //     token: store.state.token
    // }
    //如果存在jwt，则将jwt添加到每次请求之中..
    // if (store.state.jwt) {
    //     config.params = {
    //         ...config.params,
    //         jwt: store.state.jwt
    //     }
    // }
    return config
}, err => {
    return err
})
// http response  响应拦截器
//  使用 这个模块的请求  在接收响应数据之前 先走这个 响应拦截
service.interceptors.response.use(response => {
    loading.close()
    // console.log("response--------------------响应拦截", response)
    return response
    //接收返回数据..
    // const res = response.data
    //判断返回数据是否存在状态code和错误提示信息..
    // if (!res.code || !res.msg) {
    //     return showMessage('响应数据格式错误', "error")
    // }
    //判断状态code是否为指定数值(200)..
    // if (res.code != 200) {
    //     return showMessage(res.msg)
    // }
    // return res
}, err => {
    // console.log("33333333333333333")

    loading.close()
    return showMessage(err.message)
})

//封装错误提示信息..
function showMessage(message, type = "error", showClose = true) {
    ElMessage({
        showClose,          //是否显示X
        message,         //错误提示信息
        type,        //显示类型
        duration: 3 * 1000    //展示时间
    })
    return Promise.reject()
}
export default service;