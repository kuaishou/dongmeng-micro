import { findAppByRoute } from "../utils/index";
import { getMainLifeCycle } from "../const/mainLifeCycle";
import { loadHtml } from "../loader/index";
export const lifeCycle = async () => {
    //获取上一个子应用--销毁上一个子应用生命周期
    const prevApp = findAppByRoute(window.__ORIGIN_APP__)

    //获取到要跳转的子应用--初始化下一个子应用生命周期
    const nextApp = findAppByRoute(window.__CURRENT_SUB_APP__)
    if (!nextApp) {
        return
    }
    if (prevApp && prevApp.unmount) {//销毁上一个子应用
        if (prevApp.proxy) {
            prevApp.proxy.inctive()//将沙箱销毁
        }
        await destoryed(prevApp)
    }
    const app = await beforeLoad(nextApp)

    await mounted(app)

}

//东萌微前端框架生命周期
export const beforeLoad = async (app) => {
    await runMainLifeCycle('beforeLoad')
    app && app.beforeLoad && app.beforeLoad()
    const subApp = await loadHtml(app)//子应用
    subApp && subApp.beforeLoad && subApp.beforeLoad()
    return subApp

}
export const mounted = async (app) => {
    app && app.mount && app.mount({
        appInfo: app.appInfo,//props父子通讯方法
        entry: app.entry
    })
    await runMainLifeCycle('mounted')

}
export const destoryed = async (app) => {//销毁
    app && app.unmount && app.unmount()
    //对应的执行以下主应用的生命周期
    await runMainLifeCycle('destoryed')
}

export const runMainLifeCycle = async (type) => {//主应用生命周期
    const mainLife = getMainLifeCycle()
    await Promise.all(mainLife[type].map(async item => await item()))
}