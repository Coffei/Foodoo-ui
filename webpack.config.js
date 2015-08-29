var webpack = require('webpack');

module.exports = {
  output: {
    filename: "main.js",
    publicPath: "/assets/"
  },

  cache: true,
  debug: true,
  devtool: "eval",
  entry: [
    'webpack/hot/only-dev-server',
    './src/components/main.js'
  ],
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extension: ['', '.js', '.jsx'],
    alias: {}
  },
  externals: {
    "$": "jQuery"
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader?blacklist=useStrict'
    },{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: "url-loader?limit=10000"
    }, {
      test: /(\.woff((\?v=[0-9]\.[0-9]\.[0-9])|(\?[a-zA-Z0-9-]*))?)|\.woff2$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)((\?v=[0-9]\.[0-9]\.[0-9])|(\?[a-zA-Z0-9-]*))?$/,
      loader: "file-loader"
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
