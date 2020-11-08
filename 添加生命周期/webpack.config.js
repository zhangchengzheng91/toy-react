module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [[
              '@babel/plugin-transform-react-jsx',
              {
                pragma: 'createElement' // 将构建之后的 React.createElement 修改为 createElement
              }
            ]]
          }
        }
      }
    ],
  },
  // 移除代码压缩
  mode: 'development',
  optimization: {
    minimize: false,
  }
}
