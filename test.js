var { ArtNetController }  = require('artnet-protocol/dist')
var { ArtDmx } = require('artnet-protocol/dist/protocol')

const controller = new ArtNetController();
controller.bind('0.0.0.0');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const send = (channels) => {
    console.log("Sending", channels)
    controller.sendBroadcastPacket(new ArtDmx(0, 0, 0, channels));

}
const run = async () => {
    while(true) {
        send([0,100,1])
        await delay(2000)
        send([0,100,2])
        await delay(2000)
        send([0,255,3])
        await delay(2000)
    }
}


run()