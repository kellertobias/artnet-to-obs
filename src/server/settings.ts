import fs from 'fs'
import path from 'path'
import electron from 'electron';

const dataPath = electron.app.getPath('userData');
const settingsFilePath = path.join(dataPath, 'config.json');


export interface ApplicationSettings extends Record<string, unknown> {
    artnetUniverse: number,
    startChannel: number,
    fps: number,
    obsAddress: string,
    obsPassword?: string,
}

export const settings : ApplicationSettings = {
    artnetUniverse: 0,
    startChannel: 0,
    fps: 50,
    obsAddress: '127.0.0.1:4449',
}

const callbacks : ((settings: ApplicationSettings) => void)[] = []

export const registerSettingsChanged = (callback: (settings: ApplicationSettings) => void) => {
    callbacks.push(callback)
}

export const setSettings = (parts : Partial<ApplicationSettings>) : void => {
    for (const key in parts) {
        const element = parts[key];
        settings[key] = element
    }

    const settingsRaw = JSON.stringify(settings, null, 2)
    console.log(`Saving Settings file ${settingsFilePath}`, settingsRaw)
    fs.writeFileSync(settingsFilePath, settingsRaw, 'utf8')

    callbacks.forEach(cb => cb(settings))
}

if(fs.existsSync(settingsFilePath)) {
    const settingsRaw = fs.readFileSync(settingsFilePath, 'utf8')
    // const settingsNew = JSON.parse(settingsRaw)
    setSettings({})
}