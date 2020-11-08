import { createElement, render, Component } from './toy-react'

class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>my Component</h1>
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
