import { ArtNetController } from 'artnet-protocol/dist';
import { ArtDmx } from 'artnet-protocol/dist/protocol';

import { ApplicationSettings } from './settings'

// const artnet = new DMX.dmxnet({
//     oem: 0,
//     sName: 'Artnet to OBS',
//     lName: 'Tobisk Media Artnet to OBS translator',
// })

const artnet = new ArtNetController();
artnet.bind('0.0.0.0')


// let receiver : DMX.receiver | null = null
export const getDmxServer = (settings: Partial<ApplicationSettings>, numChannels: number) => {
    const callbacks : ((channels: number[]) => void)[] = []
    let _settings = settings
    artnet.on('dmx', (dmx) => {
        // dmx contains an ArtDmx object
        console.log(dmx.universe, dmx.data);
        if(_settings.artnetUniverse == dmx.universe) {
            const channels = dmx.data.slice(Math.max(1, _settings.startChannel) - 1, numChannels)
            callbacks.forEach(cb => cb(channels))
        }
    });
    console.log("[DMX] Listening")
    const reconnect = (settings: Partial<ApplicationSettings>) => {
        _settings = settings
        // receiver = artnet.newReceiver(settings.artnet)
        // receiver.on('data', function(data) {
        //     console.log('DMX data:', data);
        //     callbacks.forEach(cb => cb(data))
        //   });
    }

    return {
        reconnect,
        onUpdate: (callback: (channels: number[]) => void) => {
            callbacks.push(callback)
        } 
    }
}