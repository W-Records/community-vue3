// 导入，我们提前定制好的 请求实例，里面配置好了 拦截器
import request from '../util/request.js'


// 封装的请求，后续业务中 .vue组件内直接调用

//图片删除请求
export function deleteImageService(deletedImagesArray){
    return request.post("/article/deleteImage",deletedImagesArray);
}

// 保存文章
export function saveArticleService(article){
    return request.post("/article/saveArticle",article);
}
// 根据文章id修改文章内容
export function updateArticleService(article){
    return request.post("/article/updateArticle",article);
}
// 返回主页列表文章数据展示
export function getArticleListService(CurrentPage){
    return request.get("/article/getArticleList?CurrentPage="+CurrentPage);
}

// 返回文章总数
export function getArticleCountService(){
    return request.get("/article/getArticleCount");
}

//    文章详情页面，返回文章详情数据
export function getArticleDetailService(articleId){
    return request.get("/article/getArticleDetail?articleId="+articleId);
}
// 根据文章id获取文章表的数据,更改文章页面 回显用的
export function getArticleTableService(articleId){
    return request.get("/article/getArticleTable?articleId="+articleId);
}

//    获取自动补全建议
export function getAutocompleteSuggestions(searchText){
    return request.get("/article/getAutocompleteSuggestions?searchText="+searchText);
}

//    获取当前用户发布的文章
export function getUserArticleService(authorId){
    return request.get("/article/getUserArticle?authorId="+authorId);
}

// 根据文章id删除当前文章
export function deleteArticleService(articleId){
    return request.get("/article/deleteArticle?articleId="+articleId);
}
