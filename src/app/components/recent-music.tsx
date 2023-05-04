"use client"

import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

import { MusicEmptyPlaceholder } from "./music-empty-placeholder"

export type Track = {
  title: String
  artist: string
  filepath: string
}
async function getTracks() {
  console.log("getTracks")
  if (typeof window !== "undefined") {
    console.log("has window")
    const res: Track[] = await invoke("get_tracks")
    console.log("respopnse")
    console.log(res)
    return res
  }
}
export const RecentMusic: React.FC = () => {
  const [tracks, setTracks] = useState<Track[] | undefined>()
  useEffect(() => {
    getTracks().then((res) => {
      setTracks(res)
    })
  }, [setTracks])

  console.log([tracks])

  if (!tracks || tracks?.length < 1) {
    return <MusicEmptyPlaceholder />
  }
  return (
    <Card>
      <CardContent>
        <div className="space-y-8">
          {tracks.map((track) => {
            return (
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
                <div className="ml-auto font-medium">128<span className="font-light text-xs">bpm</span></div>
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
