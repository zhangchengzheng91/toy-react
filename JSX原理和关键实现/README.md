# JSX 原理和关键实现

1. 初始化项目
```bash
npm init
```

1. 配置 webpack 环境
   
   目标:
   
       1. 正确解析 ES6 语法
       1. 正确解析 JSX 语法
   
   引出问题：JSX 语法最后会翻译成一个函数调用(React.createElement)
   
1. 实现 JSX 语法的转译(原生标签)
    
    即实现 React.createElement 方法
    
    JSX 语法的编译结果：
    ```js
    var a = (
       <div id='a' class='c'>
         <div></div>    
         <div></div>    
         <div></div>    
       </div>
    )
   
    // 编译之后
    a = React.createElement(
    // 自定义标签的参数是一个字符串
        'div',
        {
            id: 'a',
            class: 'c',
        },
        React.createElement('div', null),
        React.createElement('div', null),
        React.createElement('div', null),
   )
    ```
   
   引出问题：在转译原生标签之后，如何实现自定义标签的转译
   
1.  实现 JSX 语法的转译(自定义标签)
     ```js
        var a = (
           <MyComponent id='a' class='c'>
             <div></div>    
             <div></div>    
             <div></div>    
           </MyComponent>
        )
       
        // 编译之后
        a = React.createElement(
        // 与原生标签项目，自定义标签的参数不再是一个字符串
            MyComponent,
            {
                id: 'a',
                class: 'c',
            },
            React.createElement('div', null),
            React.createElement('div', null),
            React.createElement('div', null),
       )
    ```
    
    将自定义标签包转为原生标签，并且使其支持 dom 方法
1. 
1. 
