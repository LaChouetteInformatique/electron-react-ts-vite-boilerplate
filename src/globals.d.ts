// src/globals.d.ts
import type { NotificationPayload } from "./types.js"

// On ne garde que les communications qui existent réellement dans le boilerplate
export type EventPayloadMapping = {
  // Un exemple de fonction asynchrone qui retourne une chaîne
  ping: () => Promise<string>

  // Le listener pour les notifications, qui est très utile
  onShowNotification: (callback: (payload: NotificationPayload) => void) => () => void
}

// Ce fichier étend les types globaux, notamment l'objet `window` pour le preload.
declare global {
  interface Window {
    api: EventPayloadMapping
  }
}
