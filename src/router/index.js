import { createRouter, createWebHistory } from 'vue-router'

// 导入组件，用于与url绑定
import HomePageVue from '../views/HomePage.vue'
import WriteArticleVue from '../views/WriteArticle.vue'
import ArticleDetailsPageVue from '../views/ArticleDetailsPage.vue'
import ModifyArticlePageVue from '../views/ModifyArticlePage.vue'
// 测试无限滚动，可以删
import TestScrollCanDeleteVue from '../views/TestScrollCanDelete.vue'

// 绑定路由关系
const routers = [
    {
        path: '/',
        component: HomePageVue
    },
    {
        path: '/writeArticle',
        component: WriteArticleVue
    },
    {
        path: '/ArticleDetailsPage/:articleId',
        component: ArticleDetailsPageVue
    },
    {
        path: '/ModifyArticlePage/:articleId',
        component: ModifyArticlePageVue
    },
    // 测试无限滚动，可以删
    {
        path: '/test',
        component: TestScrollCanDeleteVue
    }
]

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routers,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0, left: 0, behavior: 'instant' };
    },
});

// 将配置好的路由器导出
export default router;