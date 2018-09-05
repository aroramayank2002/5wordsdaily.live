//subl3 webpack.config.js
const path = require('path');
module.exports = {
    entry: [
        './source/app.js'
    ],
    mode: "development",
    output: {
        path: path.resolve(__dirname, "./static"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015'],
                plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }          
        ]
    },
    devServer: {
        inline:true,
        port: 3000,
        // host : '192.168.1.31', //Google key is generated for localhost, so this won't work unless a new key is generated
        host : 'localhost', 
        proxy: {
            '/api': 'http://localhost:8081'
          }
    },
    
    node: {
        fs: 'empty',
        // console: 'empty',
        net: 'empty',
        tls: 'empty',
        // console: true,
      }
    // target: 'node'
};