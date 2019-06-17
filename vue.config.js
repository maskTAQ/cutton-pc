module.exports = {
    chainWebpack: config => {
        config.module
            .rule('iview')
            .test(/iview.src.*?js$/)
            .use('babel')
            .loader('babel-loader')
            .end()
    }
}