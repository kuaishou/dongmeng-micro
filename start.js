import { setList, getList } from "./const/subApps"//设置子应用
import { setMainLifeCycle } from "./const/mainLifeCycle"//设置子应用
import { rewriteRouter } from "./router/rewriteRouter"//设置子应用
import { currentApp } from "./utils/index";

// import { Custom } from "./customevent/index";
//custom父子通讯--不常用
// const custom=new Custom()
// custom.on('test',(data)=>{
//     console.log('子应用调用了该方法',data)
// })
// window.custom=custom

//实现路由拦截
rewriteRouter()

export const registerMicroApps = (appList, lifeCycle) => {//注册微前端
    setList(appList)//设置子应用
    //保存生命周期
    // lifeCycle.beforeLoad[0]()
    // setTimeout(() => {
    //     lifeCycle.mounted[0]()
    // }, 3000)
    setMainLifeCycle(lifeCycle)
}

export const start = () => {//开启微前端框架
    //先执行完registerMicroApps 然后启动微前端框架

    // 1、首先验证当前子应用列表是否为空
    const apps = getList()
    if (!apps.length) {
        //子应用为空
        console.log('子应用为空，请正确注册子应用列表')
        throw Error('子应用为空，请正确注册子应用列表')
    }

    //有子应用的内容， 查找符合当前路由都是子应用
    const app = currentApp()
    console.log('当前页面子应用', app)
    if (app) {
        const { pathname, hash } = window.location
        const url = pathname + hash
        window.__CURRENT_SUB_APP__ = app.activeRule//防止多次触发
        window.history.pushState('', '', url)
    }


}