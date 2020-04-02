/*
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-11-28 14:16:05
 * @LastEditors: Do not edit
 * @Description: ddd
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

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
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true, roles: ['首页'] }
      },
      {
        path: 'welcome',
        component: () => import('@/views/welcome/index'),
        name: 'Welcome',
        hidden: true,
        meta: { title: '欢迎页', icon: 'dashboard', affix: true, roles: ['欢迎页'] }
      }
    ]
  },
  {
    path: '/system_set',
    component: Layout,
    redirect: '/system_set/common_set',
    alwaysShow: true,
    name: 'systemSet',
    meta: {
      title: '系统设置',
      icon: 'set',
      roles: ['系统设置'] // you can set roles in root nav
    },
    children: [
      {
        path: 'common_set',
        component: () => import('@/views/system_set/common_set'),
        name: 'commonSet',
        meta: { title: '通用设置', roles: ['系统设置/通用设置'] }
      },
      {
        path: 'ad_set',
        component: () => import('@/views/system_set/ad_set'),
        name: 'adSet',
        meta: { title: '广告位设置', roles: ['系统设置/广告位设置'] }
      },
      {
        path: 'school_set',
        component: () => import('@/views/system_set/school_set'),
        name: 'schoolSet',
        meta: { title: '校区设置', roles: ['系统设置/校区设置'] }
      },
      {
        path: 'teacher_set',
        component: () => import('@/views/system_set/teacher_set'),
        name: 'teacherSet',
        meta: { title: '教师设置', roles: ['系统设置/教师设置'] }
      },
      {
        path: 'grade_set',
        component: () => import('@/views/system_set/grade_set'),
        name: 'gradeSet',
        meta: { title: '年级设置', roles: ['系统设置/年级设置'] }
      },
      {
        path: 'subject_set',
        component: () => import('@/views/system_set/subject_set'),
        name: 'subjectSet',
        meta: { title: '科目设置', roles: ['系统设置/科目设置'] }
      },
      {
        path: 'course_set',
        component: () => import('@/views/system_set/course_set'),
        name: 'courseSet',
        meta: { title: '课程类别设置', roles: ['系统设置/课程类别设置'] }
      },
      {
        path: 'video_set',
        component: () => import('@/views/system_set/video_set'),
        name: 'courseSet',
        meta: { title: '视频设置', roles: ['系统设置/视频设置'] }
      },
      {
        path: 'et_set',
        component: () => import('@/views/system_set/et_set'),
        name: 'etSet',
        meta: { title: '精英课程设置', roles: ['系统设置/精英课程设置'] }
      },
      {
        path: 'news_set',
        component: () => import('@/views/system_set/news_set'),
        name: 'etSet',
        meta: { title: '新闻设置', roles: ['系统设置/新闻设置'] }
      },
      {
        path: 'ip_set',
        component: () => import('@/views/system_set/ip_set'),
        name: 'etSet',
        meta: { title: '签到ip设置', roles: ['系统设置/签到ip设置'] }
      }
    ]
  },
  {
    path: '/course_setting',
    component: Layout,
    redirect: '/course_setting/teacher_team',
    alwaysShow: true,
    name: 'courseSetting',
    meta: {
      title: '课程管理',
      icon: 'kechengguanli',
      roles: ['课程管理'] // you can set roles in root nav
    },
    children: [
      {
        path: 'teacher_team',
        component: () => import('@/views/course_setting/teacher_team'),
        name: 'teacherTeam',
        meta: { title: '教学组设置', roles: ['课程管理/教学组设置'] }
      },
      {
        path: 'term_set',
        component: () => import('@/views/course_setting/term_set'),
        name: 'termSet',
        meta: { title: '学期设置', roles: ['课程管理/学期设置'] }
      },
      {
        path: 'activity_set',
        component: () => import('@/views/course_setting/activity_set'),
        name: 'activitySet',
        meta: { title: '优惠设置', roles: ['课程管理/优惠设置'] }
      },
      {
        path: 'off_shelves',
        component: () => import('@/views/course_setting/off_shelves'),
        name: 'offShelves',
        meta: { title: '未上架课程', roles: ['课程管理/未上架课程'] }
      },
      {
        path: 'on_shelves',
        component: () => import('@/views/course_setting/on_shelves'),
        name: 'onShelves',
        meta: { title: '已上架课程', roles: ['课程管理/已上架课程'] }
      },
      {
        path: 'not_on_shelf',
        component: () => import('@/views/course_setting/not_on_shelf'),
        name: 'notOnShelf',
        meta: { title: '已下架课程', roles: ['课程管理/已下架课程'] }
      },
      {
        path: 'all_course',
        component: () => import('@/views/course_setting/all_course'),
        name: 'allCourse',
        meta: { title: '总课程表', roles: ['课程管理/已下架课程'] }
      }
    ]
  },
  {
    path: '/teacher_calendar',
    component: Layout,
    redirect: '/teacher_calendar/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/teacher_calendar/index'),
        name: 'teacherCalendar',
        meta: { title: '教师课表', icon: 'kebiao', roles: ['教师课表'] }
      }
    ]
  },
  {
    path: '/educational',
    component: Layout,
    redirect: '/educational/formal_courses',
    alwaysShow: true,
    name: 'educational',
    meta: {
      title: '教务管理',
      icon: 'jiaowu',
      roles: ['教务管理'] // you can set roles in root nav
    },
    children: [
      {
        path: 'not_attending',
        component: () => import('@/views/educational/not_attending'),
        name: 'notAttending',
        meta: { title: '未上课程', roles: ['教务管理/未上课程'] }
      },
      {
        path: 'attending',
        component: () => import('@/views/educational/attending'),
        name: 'attending',
        meta: { title: '已上课程', roles: ['教务管理/已上课程'] }
      },
      {
        path: 'ended',
        component: () => import('@/views/educational/ended'),
        name: 'ended',
        meta: { title: '已结束课程', roles: ['教务管理/已结束课程'] }
      },
      {
        path: 'canceled',
        component: () => import('@/views/educational/canceled'),
        name: 'canceled',
        meta: { title: '已取消课程', roles: ['教务管理/已取消课程'] }
      },
      {
        path: 'student_attendance',
        component: () => import('@/views/educational/student_attendance'),
        name: 'studentAttendance',
        meta: { title: '学生签到', roles: ['教务管理/学生签到'] }
      },
      {
        path: 'stu_att_statistics',
        component: () => import('@/views/educational/stu_att_statistics'),
        name: 'stuAttStatistics',
        meta: { title: '学生签到统计', roles: ['教务管理/学生签到统计'] }
      },
      {
        path: 'teacher_attendance',
        component: () => import('@/views/educational/teacher_attendance'),
        name: 'teacherAttendance',
        meta: { title: '老师签到', roles: ['教务管理/教师签到'] }
      },
      {
        path: 'tea_att_statistics',
        component: () => import('@/views/educational/tea_att_statistics'),
        name: 'teaAttStatistics',
        meta: { title: '老师签到统计', roles: ['教务管理/教师签到统计'] }
      },
      {
        path: 'authority',
        component: () => import('@/views/educational/authority'),
        name: 'authority',
        meta: { title: '权限分配', roles: ['教务管理/权限分配'] }
      }
    ]
  },
  {
    path: '/financial_mgr',
    component: Layout,
    redirect: '/financial_mgr/order_mgr',
    alwaysShow: true,
    name: 'financialMgr',
    meta: {
      title: '财务管理',
      icon: 'caiwu',
      roles: ['财务管理'] // you can set roles in root nav
    },
    children: [
      {
        path: 'order_mgr',
        component: () => import('@/views/financial_mgr/order_mgr'),
        name: 'orderMgr',
        meta: { title: '订单管理', roles: ['财务管理/订单管理'] }
      },
      {
        path: 'data_statistics',
        component: () => import('@/views/financial_mgr/data_statistics'),
        name: 'dataStatistics',
        meta: { title: '数据统计', roles: ['财务管理/数据统计'] }
      }
    ]
  },
  {
    path: '/usr_mgr',
    component: Layout,
    redirect: '/usr_mgr/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/usr_manager/index'),
        name: 'usrManager',
        meta: { title: '用户管理', icon: 'yonghu', roles: ['用户管理'] }
      }
    ]
  },
  {
    path: '/att_mgr',
    component: Layout,
    redirect: '/att_mgr/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/att_mgr/index'),
        name: 'attMgr',
        meta: { title: '签到管理', icon: 'qiandao', roles: ['签到管理'] }
      }
    ]
  },
  {
    path: '/account_mgr',
    component: Layout,
    redirect: '/account_mgr/role_set',
    alwaysShow: true,
    name: 'accountMgr',
    meta: {
      title: '账号管理',
      icon: 'zhanghao',
      roles: ['账号管理'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role_set',
        component: () => import('@/views/account_mgr/role_set'),
        name: 'roleSet',
        meta: { title: '角色设置', roles: ['账号管理/角色设置'] }
      },
      {
        path: 'account_set',
        component: () => import('@/views/account_mgr/account_set'),
        name: 'accountSet',
        meta: { title: '账号设置', roles: ['账号管理/账号设置'] }
      },
      {
        path: 'journal',
        component: () => import('@/views/account_mgr/journal'),
        name: 'journal',
        meta: { title: '日志', roles: ['账号管理/日志'] }
      }
    ]
  },
  {
    path: '*',
    redirect: '/welcome',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
