"use client"

import { InvokeArgs } from "@tauri-apps/api/tauri"

import { Track } from "./data/track"

export async function invoke<T>(
  cmd: string,
  args?: InvokeArgs & { empty?: T }
): Promise<T> {
  if (typeof window === "undefined") {
    if (!args?.empty)
      throw Error(
        "Command is called without window (SSR maybe?); provide a empty default value or mark the component with 'use client' to only render in the client"
      )
    delete args.empty
    return args.empty
  }
  const { invoke } = await import("@tauri-apps/api/tauri")
  return await invoke<T>(cmd, args)
}
export async function openTrackFilePathFolder(filepath: string): Promise<void> {
  const { open } = await import("@tauri-apps/api/shell")
  const { dirname } = await import("@tauri-apps/api/path")

  if (typeof window !== "undefined") {
    await open(await dirname(filepath))
  }
}
export async function analyseBpmForTrackCommand(
  trackId: number
): Promise<number> {
  if (typeof window !== "undefined") {
    return await invoke<number>("analyse_bpm_track", { trackId })
  }
}

export async function getTracks() {
  if (typeof window !== "undefined") {
    console.log("getTracks")
    return await invoke<Track[]>("get_tracks", { empty: [] })
  }
}
export async function removeTrackCommand(trackId: number): Promise<void> {
  console.log(`removing ${trackId}`)
  if (typeof window !== "undefined") {
    await invoke("remove_track", { trackId })
  }
}
export async function addMusicByFilePath(filePath: string) {
  if (typeof window !== "undefined") {
    const affectedRows: number = await invoke("add_track_by_file", { filePath })
    if (!affectedRows) throw Error("Error adding track")
    return affectedRows
  }
}
