import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色（您可以设置多个角色）
    title: 'title'               名称显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'             侧边栏图标的显示
    breadcrumb: false            如果设置为false，则该项将隐藏在面包屑中（默认为true）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 可以访问所有角色
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    },{
      path: 'articleShow',
      name: '文章展示',
      component: () => import('@/views/dashboard/articleShow'),
      meta: {
        title: '文章展示'
      },
      hidden:true
    }]
  },

  {
    path: '/browseAssn',
    component: Layout,
    redirect: '/browseAssn/browseAssn',
    name: '社团',
    meta: {
      title: '浏览社团',
      icon: 'example'
    },
    children: [{
      path: 'browseAssn',
      name: '浏览社团',
      component: () => import('@/views/browseAssn/browseAssn'),
      meta: {
        title: '浏览社团',
        icon: 'example'
      }
    }, {
      path: 'assnDetails',
      name: '社团详情',
      component: () => import('@/views/browseAssn/assnDetails'),
      meta: {
        title: '社团详情',
        icon: 'example'
      },
      hidden: true
    }]
  },

  {
    path: '/personalCenter',
    component: Layout,
    children: [{
      path: '/personalCenter',
      name: '个人中心',
      component: () => import('@/views/personalCenter/personalCenter'),
      meta: {
        title: '个人中心',
        icon: 'form'
      }
    }]
  },

  {
    path: '/test',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'test',
      component: () => import('@/views/test/index'),
      meta: {
        title: '测试',
        icon: 'form'
      }
    }]
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [{
    path: '/assnManage',
    component: Layout,
    redirect: '/assnManage/menu2',
    name: '社团管理',
    meta: {
      roles: ['admin', 'editor'],
      title: '社团管理',
      icon: 'nested'
    },
    children: [{
        path: 'assnList',
        component: () => import('@/views/assnManage/assnList/assnList.vue'),
        meta: {
          title: '社团列表'
        }
      },
      {
        path: 'assnMember',
        component: () => import('@/views/assnManage/assnMember/assnMember.vue'),
        meta: {
          title: '社团成员'
        }
      },
      {
        path: 'assnRecord',
        component: () => import('@/views/assnManage/assnRecord/assnRecord.vue'),
        meta: {
          title: '社团记录'
        }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/articleList',
    name: '文章管理',
    meta: {
      roles: ['admin', 'editor'],
      title: '文章管理',
      icon: 'link'
    },
    children: [{
      path: 'articleList',
      component: () => import('@/views/assnArticle/articleList/articleList'),
      meta: {
        title: '文章列表',
        roles: ['admin', 'editor']
      }
    }, {
      path: 'issueArticle',
      component: () => import('@/views/assnArticle/issueArticle'),
      meta: {
        title: '撰写文章',
        roles: ['admin', 'editor']
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
