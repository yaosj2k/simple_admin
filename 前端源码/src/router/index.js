import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import Admin from "~/layouts/admin.vue";
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
import UserList from '~/pages/user/list.vue'
import OrderList from '~/pages/order/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import SettingBase from '~/pages/setting/base.vue'
import CouponList from '~/pages/coupon/list.vue'


// 默认路由，所有用户共享
const routes = [
    {
        path: "/",
        name:"admin",
        component: Admin,
    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "登录页"
        }
    }, {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }]


// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [{
    path:"/",
    name:"/",
    component:Index,
    meta:{
        title:"后台首页"
    }
},{
    path:"/goods/list",
    name:"/goods/list",
    component:GoodList,
    meta:{
        title:"商品管理"
    }
},{
    path:"/category/list",
    name:"/category/list",
    component:CategoryList,
    meta:{
        title:"分类列表"
    }
},{
    path:"/user/list",
    name:"/user/list",
    component:UserList,
    meta:{
        title:"用户列表"
    }
},{
    path:"/order/list",
    name:"/order/list",
    component:OrderList,
    meta:{
        title:"订单列表"
    }
},{
    path:"/comment/list",
    name:"/comment/list",
    component:CommentList,
    meta:{
        title:"评价列表"
    }
},{
    path:"/image/list",
    name:"/image/list",
    component:ImageList,
    meta:{
        title:"图库列表"
    }
},{
    path:"/notice/list",
    name:"/notice/list",
    component:NoticeList,
    meta:{
        title:"公告列表"
    }
},{
    path:"/setting/base",
    name:"/setting/base",
    component:SettingBase,
    meta:{
        title:"配置"
    }
},{
    path:"/coupon/list",
    name:"/coupon/list",
    component:CouponList,
    meta:{
        title:"优惠券列表"
    }
}]


// 定义静态路由
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})



// 定义动态路由
// 动态添加路由的方法
// 这个代码的作用是根据后端返回的用户菜单权限动态添加路由。具体来说，它遍历后端返回的菜单权限数组，找到与前端定义的动态路由匹配的项，并将这些路由动态添加到 Vue Router 中。
// 动态添加路由的函数
//这个会把所有的后端传过来的路由变成admin的子路由
// 这个只是返回是否有新的路由被添加了，不会改变路由结构，也不会改变菜单结构
export function addRoutes(menus) {
    // 是否有新的路由被添加的标志，这个标志用于判断是否需要重新加载页面
    // 如果有新的路由被添加，则返回 true，否则返回 false。
    // 如果有新的路由被添加，则需要重新加载页面，否则不需要重新加载页面。
    let hasNewRoutes = false;

    // 定义一个递归函数来查找并添加路由
    const findAndAddRoutesByMenus = (arr) => {
        // 遍历传入的菜单数组，arr.forEach 是 JavaScript 数组的一个内置方法，用于遍历数组中的每个元素，并对每个元素执行指定的回调函数。
        arr.forEach((menuItem) => {
            // 在 asyncRoutes 中查找与当前菜单项 frontpath 匹配的路由，route.path是动态路由定义好的属性和menuItem.frontpath是后端返回的菜单项的frontpath属性的。
            // 如果找到匹配的路由，则将其添加到名为 "admin" 的路由中。
            let matchedRoute = asyncRoutes.find((route) => route.path === menuItem.frontpath);

            // 如果找到匹配的路由且该路由尚未添加到 router 中
            if (matchedRoute && !router.hasRoute(matchedRoute.path)) {
                // 将该路由添加到名为 "admin" 的路由中
                router.addRoute("admin", matchedRoute);
                // 标记有新的路由被添加
                hasNewRoutes = true;
            }

            // 如果当前菜单项有子菜单，递归处理子菜单，这个里面的当前菜单项是后端返回的菜单项，不是前端定义的动态路由。
            if (menuItem.child && menuItem.child.length > 0) {
                findAndAddRoutesByMenus(menuItem.child);
            }
        });
    };

    // 从 menus 开始递归查找并添加路由
    findAndAddRoutesByMenus(menus);

    // 返回是否有新的路由被添加
    return hasNewRoutes;
}