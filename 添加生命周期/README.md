# 为 React 添加生命周期

问题1：为什么在增加 state 之后，要将 root 替换为 range

问题2：引入 react tutorial 代码之后，由于未处理 null，所以会保存

在 toy-react.js createElement 的 insertChildren 方法中，单独处理 null 节点的情况

问题3：build 成功之后，打开页面，样式没有生效

在 toy-react.js ElementWrapper setAttribute 中处理 className

问题4：range 引入的 bug：从左到右点击，右侧 square 会消失

需要在 rerender 的时候，保证 range 不空；将新 range 查到老 _range 之前，老 range 将不会空

问题5：每次 state 更新，整个 UI 都重新渲染；而 React 的更新范围非常小

引入虚拟 DOM
