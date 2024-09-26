// 导入，我们提前定制好的 请求实例，里面配置好了 拦截器
import request from '../util/request.js'


// 封装的请求，后续业务中 .vue组件内直接调用

//登录请求
export function loginService(Name,Password){
    const User = {
        userName: Name,
        userPassword: Password
    }
    return request.post("/user/login",User);
}
// 注册请求
export function registerService(Name,Password){
    const User = {
        userName: Name,
        userPassword: Password
    }
    return request.post("/user/register",User);
}

// 测试请求：是否携带JWT
export function TestWhetherGetTokenService(){
    return request.get("/user/TestWhetherGetToken");
}

//    测试是否是登录状态
export function judgeLogInStateService(){
    return request.get("/user/judgeLogInState");
}