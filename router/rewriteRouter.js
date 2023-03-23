import { patchRouter } from "../utils/index";
import { turnApp } from "./routerHandle";
//重写路由--实现路由拦截

export const rewriteRouter = () => {
    window.history.pushState = patchRouter(window.history.pushState, 'micro_push')
    window.history.replaceState = patchRouter(window.history.replaceState, 'micro_replace')

    window.addEventListener('micro_push', turnApp)
    window.addEventListener('micro_replace', turnApp)

    //监听返回按钮
    window.onpopstate = function () {
        turnApp()
    }

}


