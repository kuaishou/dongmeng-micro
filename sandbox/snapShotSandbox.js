//快照沙箱
//比较消耗性能--支持比较老版本浏览器
export class SnapShotSandbox {
    constructor() {
        //1、代理对象
        this.proxy = window
        this.active()
    }
    //沙箱激活
    active() {
        //创建一个沙箱快照
        this.sanpshot = new Map()
        //变量全局环境
        for (key in window) {
            this.sanpshot[key] = window[key]
        }
    }
    //沙箱销毁
    inactive() {
        for (key in window) {
            if (window[key] !== this.sanpshot[key])
                window[key] = this.sanpshot[key]
        }
    }
}