import { createElement, render, Component } from './toy-react'

class MyComponent extends Component {
  constructor() {
    super()
    this.state = {
      a: 1,
      b: 2
    }
  }
  render() {
    return (
      <div>
        <h1>my Component</h1>
        <button onClick={() => {
          this.state.a++
          this.rerender()
        }}>add a</button>
        <span>{this.state.a.toString()}</span>
        {/*
          这里有一个问题：
          调用 setState 方法时，b++ 不生效，b+1, ++b 生效
        */}
        <button onClick={() => this.setState({ b: ++this.state.b })}>add b</button>
        <span>{this.state.b.toString()}</span>
        {this.children}
      </div>
    )
  }
}

render(<MyComponent>
  <h2>abc</h2>
  <h3></h3>
  <h4></h4>
</MyComponent>, document.body)
