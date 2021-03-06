import {registerSettingsChanged, settings} from './settings'

import {getObsServer} from './obs'
import {getDmxServer} from './dmx'
import { listeners , status } from '../api/status'

const mapping = <const> [
    'dimmer',
    'scene',
    'fade',
]

type ChannelType = typeof mapping[number]
const lastChannels : number[] = []

const obs = getObsServer(settings)
const dmx = getDmxServer(settings, mapping.length)

const updateChannel = (channel: ChannelType, value: number) => {
    switch(channel) {
        case 'dimmer':
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

dmx.onUpdate((channels) => {
    channels.forEach((value, index) => {
        const oldValue = lastChannels[index]
        const channel = mapping[index]

        if (value != oldValue) {
            console.log(`[MAIN] ${channel} Canged ${oldValue} => ${value}`)
            lastChannels[index] = value
            updateChannel(channel, value)
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
