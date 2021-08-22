import {ipcMain} from 'electron'


export let status : {
    dimmer: number,
    scenes: string[],
    activeScene: number,
} = {
    dimmer: 0,
    scenes: [],
    activeScene: 0
}

export type Status = typeof status

export type UpdateClientCallback = (scenes: string[]) => void

export const listeners : UpdateClientCallback[] = []

ipcMain.handle('scenes', async (event) => {
    return status
})
