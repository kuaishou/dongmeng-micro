//执行js脚本

export const performScriptForFunction = (script, appName, global) => {
    // const scriptText = `
    //     ${script}
    //     return window['${appName}']
    //     `
    // new Function(scriptText).call(global, global)

    window.proxy = global;
    const scriptText = `
       return ((window)=>{
        ${script}
        return window['${appName}']
       })(window.proxy)
        `
    new Function(scriptText)()
}
export const performScriptForEval = (script, appName, global) => {
    //library  window.appName设置
    // const scriptText = `()=>{${script}
    //     return window['${appName}']
    // }`
    // return eval(scriptText).call(global, global)
    window.proxy = global;

    const scriptText = `
        ((window)=>{
            ${script}
            return window['${appName}']
       })(window.proxy)`
    return eval(scriptText)
}