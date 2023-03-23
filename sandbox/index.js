import { lifeCycle } from "../leftCycle";
import { performScriptForEval } from "./performScript";
// import { snapShotSandbox } from "./snapShotSandbox";//兼容旧浏览器的快照沙箱
import { proxySandbox } from "./proxySandbox";//proxy代理沙箱

const idCheckLifeCycle = (lifeCycle) => {
    return lifeCycle.bootstrap && lifeCycle.mount && lifeCycle.unmount
}
//子应用生命周期处理，环境变量设置
export const sandbox = (app, script) => {
    const proxy = new proxySandbox()
    if (!app.proxy) {
        app.proxy = proxy
    }

    //1、设置环境变量
    window.__MICRO_WEB__ = true//子应用使用--判断是否在微前端框架里

    //2、加载脚本 运行js文件
    const lifeCycle = performScriptForEval(script, app.name, app.proxy.proxy)

    //生命周期挂载挂载到app上面；方便后期执行
    if (idCheckLifeCycle(lifeCycle)) {
        app.bootstrap = lifeCycle.bootstrap
        app.mount = lifeCycle.mount
        app.unmount = lifeCycle.unmount
    }
}