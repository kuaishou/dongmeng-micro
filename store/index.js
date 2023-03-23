//全局状态管理
export const createStore = (initData = {}) => (() => {//闭包保持store
    let store = initData

    const observers = []//管理所有的订阅者，依赖

    const getStore = () => store
    //更新store
    const update = (value) => {
        if (value !== store) {
            //执行store的操作
            const oldStore = store
            store = value//更新store
            //通知所有订阅者，监听store的变化
            observers.forEach(async (item) => await item(store, oldStore))
        }
    }
    //添加订阅者
    const subscribe = (fn) => {
        observers.push(fn)
    }

    return {
        getStore,
        update,
        subscribe
    }

})()