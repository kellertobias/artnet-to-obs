module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ['windows'],
            config: {
                name: '@electron-forge/maker-squirrel'
            }
        }
    ]
}