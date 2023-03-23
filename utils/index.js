import { getList } from "./const/subApps";

//给当前路由跳转打补丁
export const patchRouter = (globalEvent, eventName) => {
    return function () {
        const e = new Event(eventName)
        globalEvent.apply(this, arguments)
        window.dispatchEvent(e)
    }
}
export const currentApp = () => {
    const currentUrl = window.location.pathname;
    filterApp('activeRule', currentUrl)//查找当前子应用

}
export const findAppByRoute = (router) => {//查找应用
    filterApp('activeRule', router)
}
const filterApp = (key, value) => {//过滤应用
    const currentApp = getList().filter(item => item[key] === value)
    return currentApp && currentApp.length ? currentApp[0] : {}

}

//判断子应用是否切换
export const isTurnChild = () => {
    window.__ORIGIN_APP__ = window.__CURRENT_SUB_APP__;//记录上一个子应用
    if (window.__CURRENT_SUB_APP__ === window.location.pathname) {
        return false;//防止重复监听
    }
    const currentApp = window.location.pathname.match(/(\/\w+)/)
    if (!currentApp) {
        return
    }
    window.__CURRENT_SUB_APP__ = currentApp[0]//记录下一个子应用
    return true
}
