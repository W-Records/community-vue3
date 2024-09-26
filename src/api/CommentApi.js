// 导入，我们提前定制好的 请求实例，里面配置好了 拦截器
import request from '../util/request.js'


// 封装的请求，后续业务中 .vue组件内直接调用

//   获取指定文章的评论数据
export function getCommentTreeStructuredDataService(articleId){
    return request.get("/comment/getCommentTreeStructuredData?articleId="+articleId);
}
// 发布评论
export function publishCommentService(comment){
    return request.post("/comment/publishComment",comment);
}
//    返回评论回复数据
export function getReplyCommentService(userId){
    return request.get("/comment/getReplyComment?userId="+userId);
}
//    返回未读评论数
export function getNotReadCommentCountService(userId){
    return request.get("/comment/getNotReadCommentCount?userId="+userId);
}
//    将未读评论改为已读
export function changeCommentReadOrNotService(userId){
    return request.get("/comment/changeCommentReadOrNot?userId="+userId);
}

