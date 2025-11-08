// src/types.ts
import { z } from "zod"

// Exemple de schéma pour démarrer
export const AppConfigSchema = z.object({
  version: z.string(),
  theme: z.enum(["light", "dark"]).default("light")
})

export type AppConfig = z.infer<typeof AppConfigSchema>

// Types pour la communication IPC
export type NotificationPayload = {
  message: string
  type?: "success" | "info" | "warning" | "error"
}
