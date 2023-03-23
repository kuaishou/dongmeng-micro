import { fetchResource } from "../utils/fetchResource";
import { sandbox } from "../sandbox/index";
//加载HTML的方法
export const loadHtml = async (app) => {
    //第一个子应用需要显示在哪里
    let container = app.container //#id 内容

    //子应用的入口
    let entry = app.entry

    const [dom, allScript] = await parseHtml(entry, app.name)

    const ct = document.querySelector(container)
    if (!ct) {
        throw new Error('容器不存在，请查看')
    }

    ct.innerHTML = dom
    allScript.forEach(item => {
        sandbox(app, item)
    });
    return app

}

//缓存应用
const cache = {}//根据子应用name来做缓存


export const parseHtml = async (entry, name) => {
    if (cache[name]) {
        return cache[name]
    }
    const html = await fetchResource(entry)
    const div = document.createElement('div')
    let allScript = []
    div.innerHTML = html
    const [dom, scriptUrl, script] = await getResources(div, entry)
    const fetchScripts = await Promise.all(scriptUrl.map(async (item) => fetchResource(item)))
    allScript = script.concat(fetchScripts)
    cache[name] = [dom, allScript]
    return [dom, allScript]
}

export const getResources = async (root, entry) => {
    const dom = root.outerHTML
    const scriptUrl = []
    const script = []

    function deepParse(element) {
        const children = element.children
        const parent = element.parent
        //第一步处于位于script里面的js
        if (element.nodeName.toLowerCase() === 'script') {
            const src = element.getAttribute('src')
            if (!src) {
                script.push(element.outerHTML)
            } else {
                if (src) {
                    scriptUrl.push(src)
                } else {
                    scriptUrl.push(`http:${entry}/${src}`)
                }
            }
            if (parent) {
                parent.replaceChild(document.createComment('此文件已经被微前端替换', element))
            }
        }
        //第二步处于位于link里面的js
        if (element.nodeName.toLowerCase() === 'link') {
            const href = element.getAttribute('href')
            if (href.endsWith('.js')) {
                if (href.startsWith('http')) {
                    scriptUrl.push(href)
                } else {
                    scriptUrl.push(`http:${entry}/${href}`)
                }
            }
            if (parent) {
                parent.replaceChild(document.createComment('此文件已经被微前端替换', element))
            }
        }

        for (let index = 0; index < children.length; index++) {
            deepParse(children[index])

        }
    }
    deepParse(root)

    return [dom, scriptUrl, script]
}