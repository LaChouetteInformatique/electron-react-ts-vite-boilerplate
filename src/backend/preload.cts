// src/backend/preload.cts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// Voici la ligne corrigée :
import type { NotificationPayload } from '../types.js' with { "resolution-mode": "import" };

contextBridge.exposeInMainWorld('api', {
  ping: () => ipcRenderer.invoke('ping'),

  onShowNotification: (callback: (payload: NotificationPayload) => void) => {
    const handler = (_event: IpcRendererEvent, payload: NotificationPayload) => callback(payload);
    
    ipcRenderer.on('show-notification', handler);

    return () => {
      ipcRenderer.removeListener('show-notification', handler);
    };
  },
});