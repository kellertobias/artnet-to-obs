import {registerSettingsChanged, settings} from './settings'

import {getObsServer} from './obs'
import {getDmxServer} from './dmx'
import { listeners , status } from '../api/status'

const mapping = [
    'dimmer',
    'fade',
    'scene'
]
const lastChannels : number[] = []

const obs = getObsServer(settings)
const dmx = getDmxServer(settings, mapping.length)

dmx.onUpdate((channels) => {
    channels.forEach((value, index) => {
        const oldValue = lastChannels[index]
        const channel = mapping[index]
        if (value != oldValue) {
            console.log(`[MAIN] ${channel} Canged ${oldValue} => ${value}`)
            lastChannels[index] = value
            switch(channel) {
                case 'dimmmer':
                    console.log("Dimmer not implemented");
                    break;
                case 'fade':
                    obs.setTransitionTime(value * 1000 / settings.fps)
                    break;
                case 'scene':
                    if(value == 0) {
                        break;
                    }

                    obs.setScene( value - 1 )
                    break;
            }
        }
    })
})

obs.onScenesChanged((scenes, activeIndex) => {
    status.scenes = scenes
    status.activeScene = activeIndex
    listeners.forEach(cb => cb(scenes))
})

registerSettingsChanged((newSettings) => {
    obs.reconnect(newSettings)
    dmx.reconnect(newSettings)
})
