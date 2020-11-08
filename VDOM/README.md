# 虚拟 DOM 的原理和关键实现

移除 root 代理，在 ElementWrapper 和 TextWrapper 中实现真实的 VDOM

增加 get vdom 方法之后，需要移除 ElementWrapper 中 setAttribute 和 appendChild
不然，返回的 vdom 中 children 和 props 为 {}


实现过程：
1. 获取 vdom
1. 完成 vdom 到 实体 dom 的更新
1. vdom 比对
