module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            enableRemoteModule: true,
            builderOptions: {
                win: {
                    icon: './public/icon.png'
                }
            }
        }
    }
}