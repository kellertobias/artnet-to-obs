import OBSWebSocket from 'obs-websocket-js'
import { ApplicationSettings } from './settings';
const obs = new OBSWebSocket();

export const getObsServer = (settings: Partial<ApplicationSettings>) => {
    let scenes : OBSWebSocket.Scene[] = []
    let connected = false
    let activeIndex = 0
    const callbacks : ((scenes: string[], activeIndex: number) => void)[] = []

    const getScenes = async () => {
        console.log('[OBS] Get Scenes')
        if(!connected) {
            console.log("Not Connected")
            return
        }

        return new Promise((resolve, reject) => {
            obs.sendCallback('GetSceneList', (err, data) => {
                if (err) {
                    console.log("[OBS]", err)
                    return reject(err)
                }
                console.log(data)
                scenes = data.scenes

                callbacks.forEach(cb => cb(scenes.map(x => x.name), activeIndex))

                return resolve(data)
            })
        })
    }

    const reconnect = (settings: Partial<ApplicationSettings>) => {
        console.log('[OBS] Reconnect')
        if(connected) {
            obs.disconnect()
        }
        obs.connect({
            address: settings.obsAddress,
            password: settings.obsPassword ? settings.obsPassword : undefined
        }).catch(e => {
            console.log("[OBS]", e, settings)
        })
    }

    obs.on('ConnectionOpened', () => {
        console.log('[OBS] Connected')
        connected = true
        getScenes()
    })

    obs.on('SwitchScenes', (data: any) => {
        console.log("[OBS] SwitchScenes")
        activeIndex = scenes.findIndex((sc) => sc.name == data['scene-name'])
        callbacks.forEach(cb => cb(scenes.map(x => x.name), activeIndex))
    })

    obs.on('ConnectionClosed', () => {
        console.log('[OBS] Disconnected')
        connected = false
    })

    reconnect(settings)

    return {
        reconnect: reconnect,
        getScenes: getScenes,
        setScene: (index: number) => {
            console.log('[OBS] Set Scene')
            if(!connected) {
                console.log("Not Connected")
                return
            }

            const sceneName = scenes[index]?.name
            if(!sceneName) {
                console.log("Scene does not exist", {index})
                return
            }
            activeIndex = index
            console.log(`Setting Scene ${sceneName}`)
            obs.send('SetCurrentScene', {
                'scene-name': sceneName
            })
        },
        onScenesChanged: (callback: (scenes: string[], activeIndex: number) => void) => {
            callbacks.push(callback)
        },
        setTransitionTime: (duration: number) => {
            console.log('[OBS] Set Fade')
            if(!connected) {
                console.log("Not Connected")
                return
            }
            return obs.send('SetTransitionDuration', {duration})
        }
    }

}