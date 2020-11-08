
class ElementWrapper {
  // 确定标签类型
  constructor(type) {
    // 将实体 dom 放到一个属性上
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(value, name)
  }

  appendChild(component) {
    // 这里有一个问题需要注意
    // 因为传入的是一个 component，即一个实例
    // 所以应该 append component.root
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children =[]
    this._root = null
  }

  setAttribute(name, value) {
    // 将元素属性保存到 props 当中
    this.props[name] = value
  }

  appendChild(component) {
    this.children.push(component)
  }

  // 真实渲染过程
  get root() {
    if (!this._root) {
      this._root = this.render().root
    }
    return this._root
  }
}

export function createElement(type, attributes, ...children) {
  console.log('type=', type)
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
  parentElement.appendChild(component.root)
}
