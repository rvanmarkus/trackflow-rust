"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { dirname } from "@tauri-apps/api/path"
import { open } from "@tauri-apps/api/shell"
import { invoke } from "@tauri-apps/api/tauri"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ButtonLoading } from "@/components/examples/button/loading"

import { MusicEmptyPlaceholder } from "./music-empty-placeholder"

export type Track = {
  id: number
  title: String
  artist: string
  filepath: string
  bpm?: number
}
async function openTrackFilePathFolder(filepath: string): Promise<void> {
  await open(await dirname(filepath))
}
async function getTracks() {
  if (typeof window !== "undefined") {
    console.log("getTracks")
    return await invoke<Track[]>("get_tracks")
  }
}
async function removeTrackCommand(trackId: number): Promise<void> {
  console.log(`removing ${trackId}`)
  await invoke("remove_track", { trackId })
}
export const RecentMusic: React.FC = () => {
  const queryClient = useQueryClient()

  // Queries
  const {
    data: tracks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tracks"],
    queryFn: getTracks,
  })
  const { mutate: removeTrack } = useMutation({
    mutationFn: removeTrackCommand,
    onSuccess: () => refetch(),
  })

  console.log([tracks])
  if (isLoading) {
    return <ButtonLoading />
  }
  if (!tracks?.length || tracks?.length < 1) {
    return <MusicEmptyPlaceholder />
  }
  return (
    <Card>
      <CardContent>
        <div className="space-y-8">
          {tracks.map((track) => {
            return (
              <div key={track.id}>
                <ContextMenu key={track.id}>
                  <ContextMenuTrigger>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {track.title} - {track?.artist}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {track.filepath}
                        </p>
                      </div>
                      {track.bpm && (
                        <div className="ml-auto font-medium">
                          {track.bpm}
                          <span className="font-light text-xs">bpm</span>
                        </div>
                      )}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Play</ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => openTrackFilePathFolder(track.filepath)}
                    >
                      Open in file explorer
                    </ContextMenuItem>
                    <ContextMenuItem>Analyse BPM</ContextMenuItem>
                    <ContextMenuItem onClick={() => removeTrack(track.id)}>
                      Remove from library
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

//     <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
//       <AvatarImage src="/avatars/02.png" alt="Avatar" />
//       <AvatarFallback>JL</AvatarFallback>
//     </Avatar>
//     <div className="ml-4 space-y-1">
//       <p className="text-sm font-medium leading-none">Jackson Lee</p>
//       <p className="text-sm text-muted-foreground">
//         jackson.lee@email.com
//       </p>
//     </div>
//     <div className="ml-auto font-medium">+$39.00</div>
//   </div>
//   <div className="flex items-center">
//     <Avatar className="h-9 w-9">
//       <AvatarImage src="/avatars/03.png" alt="Avatar" />
//       <AvatarFallback>IN</AvatarFallback>
//     </Avatar>
//     <div className="ml-4 space-y-1">
//       <p className="text-sm font-medium leading-none">
//         Isabella Nguyen
//       </p>
//       <p className="text-sm text-muted-foreground">
//         isabella.nguyen@email.com
//       </p>
//     </div>
//     <div className="ml-auto font-medium">+$299.00</div>
//   </div>
//   <div className="flex items-center">
//     <Avatar className="h-9 w-9">
//       <AvatarImage src="/avatars/04.png" alt="Avatar" />
//       <AvatarFallback>WK</AvatarFallback>
//     </Avatar>
//     <div className="ml-4 space-y-1">
//       <p className="text-sm font-medium leading-none">William Kim</p>
//       <p className="text-sm text-muted-foreground">will@email.com</p>
//     </div>
//     <div className="ml-auto font-medium">+$99.00</div>
//   </div>
//   <div className="flex items-center">
//     <Avatar className="h-9 w-9">
//       <AvatarImage src="/avatars/05.png" alt="Avatar" />
//       <AvatarFallback>SD</AvatarFallback>
//     </Avatar>
//     <div className="ml-4 space-y-1">
//       <p className="text-sm font-medium leading-none">Sofia Davis</p>
//       <p className="text-sm text-muted-foreground">
//         sofia.davis@email.com
//       </p>
//     </div>
//     <div className="ml-auto font-medium">+$39.00</div>
//   </div>
