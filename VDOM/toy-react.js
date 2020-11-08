const RENDER_TO_DOM = Symbol('render to dom')

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children =[]
    this._root = null
    this._range = null // 保存每次渲染的 range，二次渲染时使用
  }

  setAttribute(name, value) {
    // 将元素属性保存到 props 当中
    this.props[name] = value
  }

  appendChild(component) {
    this.children.push(component)
  }

  get vdom() {
    return this.render().vdom
  }

  //get vchildren() {
  //  return this.children.map(child => child.vdom)
  //}

  // render 之后要重新确定插入的位置
  // 因为不确定插入的是头还是中间
  // 废弃 root 思路
  // 思路变化：从取一个元素，修改为把它渲染进一个 range 里面
  [RENDER_TO_DOM](range) {
    this._range = range
    this._vdom = this.vdom
    this._vdom[RENDER_TO_DOM](range)
  }

  // 这里只实现一个简单的 diff 算法
  // 判断一个节点是否是为统一类型
  update() {
    let isSameNode = (oldNode, newNode) => {
      if (oldNode.type !== newNode.type) {
        return false
      }
      for (let key in newNode.props) {
        if (newNode.props[key] !== oldNode.props[key]) {
          return false
        }
      }
      if (Object.keys(newNode.props).length < Object.keys(oldNode.props).length) {
        return false
      }

      if (newNode.type === '#text' && newNode.content !== oldNode.content) {
        return false
      }
      return true
    }

    // 更新节点
    let update = (oldNode, newNode) => {
      // 首先对比根节点
      // 对比内容: type | props | children
      // 如果 type === '#text'，需要判断 content
      if (!isSameNode(oldNode, newNode)) {
        newNode[RENDER_TO_DOM](oldNode._range)
        return
      }

      newNode._range = oldNode._range

      let newChildren = newNode.vchildren
      let oldChildren = oldNode.vchildren

      if (!newChildren || !newChildren.length) {
        return
      }

      let tailRange = oldChildren[oldChildren.length - 1]._range

      for (let i = 0; i < newChildren.length; i++) {
        let newChild = newChildren[i]
        let oldChild = oldChildren[i]
        if (i < oldChildren.length) {
          update(oldChild, newChild)
        } else {
          let range = document.createRange()
          range.setStart(tailRange.endContainer, tailRange.endOffset)
          range.setEnd(tailRange.endContainer, tailRange.endOffset)
          newChild[RENDER_TO_DOM](range)
          tailRange = range
        }
      }
    }

    let vdom = this.vdom
    update(this._vdom, vdom)
    this._vdom = vdom
  }
  /*
  rerender() {
    const oldRange = this._range

    let range = document.createRange()
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    // rerender 方法会修改 this._range，所以要将它先保存下来
    this[RENDER_TO_DOM](range)

    // 新 range 也在 oldRange 当中
    // 修改 oldRange 的起点
    oldRange.setStart(range.endContainer, range.endOffset)
    oldRange.deleteContents()
  }
  */

  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()
      return
    }
    // 实现 state 合并
    // 将 newState 的属性都合并的 oldState 上
    let merge = (oldState, newState) => {
      for (let p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        } else {
          merge(oldState[p], newState[p])
        }
      }
    }
    merge(this.state, newState)
    this.update()
  }
}

class ElementWrapper extends Component {
  // 确定标签类型
  constructor(type) {
    super(type)
    this.type = type
    // 基于 vdom 实现 dom，移除 this.root
    // this.root = document.createElement(type)
  }

  get vdom() {
    this.vchildren = this.children.map(child => child.vdom)
    return this
    // vdom 只返回了一个对象，不能实现重绘。考虑返回 this
    /*{
      type: this.type,
      props: this.props,
      children: this.children.map(child => child.vdom)
    }*/
  }

  /*
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    } else if (name === 'className') {
      this.root.setAttribute('class', value)
    } else {
      this.root.setAttribute(name, value)
    }
  }

  appendChild(component) {
    let range = document.createRange()
    // 这里一定要注意子节点 range 的 offset，要不然容易翻车
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
  }
  */

  [RENDER_TO_DOM](range) {
    this._range = range

    // 先清空 range 当中的内容
    //range.deleteContents()

    let root = document.createElement(this.type)

    for (let name in this.props) {
      let value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) {
        root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
      } else if (name === 'className') {
        root.setAttribute('class', value)
      } else {
        root.setAttribute(name, value)
      }
    }

    if (!this.vchildren) {
      this.vchildren = this.children.map(child => child.vdom)
    }

    for (let child of this.vchildren) {
      let chidlRange = document.createRange()
      // 这里一定要注意子节点 range 的 offset，要不然容易翻车
      chidlRange.setStart(root, root.childNodes.length)
      chidlRange.setEnd(root, root.childNodes.length)
      chidlRange.deleteContents()
      child[RENDER_TO_DOM](chidlRange)
    }

    replaceContent(range, root)
    //range.insertNode(root)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content)
    this.content = content
    this.type = '#text'
    //this.root = document.createTextNode(content)
  }

  get vdom() {
    return this
    /*{
      type: '#text',
      content: this.content
    }*/
  }

  [RENDER_TO_DOM](range) {
    this._range = range

    // 先清空 range 当中的内容
    //range.deleteContents()
    //range.insertNode(this.root)
    let root = document.createTextNode(this.content)
    replaceContent(range, root)
  }
}

function replaceContent(range, node) {
  range.insertNode(node)
  range.setStartAfter(node)
  range.deleteContents()

  range.setStartBefore(node)
  range.setEndAfter(node)

}

export function createElement(type, attributes, ...children) {
  // 创建元素标签
  // 除原生标签、自定义标签之外，此处还需考虑 React 支持的其他元素类型
  // number | string | null | undefined | boolean | array
  let e
  if (typeof type === 'string') {
    e = new ElementWrapper(type)
  } else {
    e = new type
  }


  // 为元素标签添加属性
  for (let attr in attributes) {
    e.setAttribute(attr, attributes[attr])
  }

  let insertChildren = children => {
    for (let child of children) {
      // 单独处理文本节点
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
      // 单独处理 null 节点
      if (child === null) {
        continue
      }
      if (Array.isArray(child)) {
        insertChildren(child)
      } else {
        e.appendChild(child)
      }
    }
  }

  // 为元素添加 children
  insertChildren(children)

  // 返回元素标签
  return e
}

export function render(component, parentElement) {
  // 在 parentElement 的尾部增加 range
  // 如果要将 parentElement 当中的内容都替换掉
  // 需要将 parentElement 当中的内容清空
  let range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RENDER_TO_DOM](range)
}
