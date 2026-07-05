import { WebContainer } from '@webcontainer/api';

let webContainerPromise = null;
export let webContainerInstance = null;

export const getWebContainer = async () => {
    if (webContainerPromise === null) {
        webContainerPromise = WebContainer.boot().then(instance => {
            webContainerInstance = instance;
            return instance;
        }).catch(err => {
            webContainerPromise = null;
            webContainerInstance = null;
            throw err;
        });
    }
    return webContainerPromise;
};