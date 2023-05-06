import { dirname } from "@tauri-apps/api/path"
import { open } from "@tauri-apps/api/shell"
import { invoke } from "@tauri-apps/api/tauri"

import { Track } from "./data/track"

export async function openTrackFilePathFolder(filepath: string): Promise<void> {
  await open(await dirname(filepath))
}
export async function analyseBpmForTrackCommand(
  trackId: number
): Promise<number> {
  return await invoke<number>("analyse_bpm_track", { trackId })
}

export async function getTracks() {
  if (typeof window !== "undefined") {
    console.log("getTracks")
    return await invoke<Track[]>("get_tracks")
  }
}
export async function removeTrackCommand(trackId: number): Promise<void> {
  console.log(`removing ${trackId}`)
  await invoke("remove_track", { trackId })
}
