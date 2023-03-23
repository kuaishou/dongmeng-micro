import { isTurnChild } from "../utils/index";
import { lifeCycle } from "../leftCycle/index";
//路由变化监听方法
export const turnApp = async () => {
    if (isTurnChild()) {//判断子应用是否切换
        await lifeCycle()//路由切换子应用变化执行微前端生命周期方法
        console.log('路由变化了')
    }
}