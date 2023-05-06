import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import {
  analyseBpmForTrackCommand,
  openTrackFilePathFolder,
  removeTrackCommand,
} from "../commands"
import { Track } from "../data/track"
import { Icons } from "@/components/icons"

export const TrackRowCard: React.FC<{ track: Track }> = ({ track }) => {
  const queryClient = useQueryClient()
  const invalidateAllTracks = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tracks"] })
  }
  const { mutate: removeTrack } = useMutation({
    mutationFn: removeTrackCommand,
    onSuccess: invalidateAllTracks,
  })
  const { mutate: analyseBpm, isLoading: isAnalyzing } = useMutation({
    mutationFn: analyseBpmForTrackCommand,
    onSuccess: invalidateAllTracks,
  })
  return (
    <div>
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
              <p className="text-sm text-muted-foreground">{track.filepath}</p>
            </div>
            {track.bpm && (
              <div className="ml-auto font-medium">
                {track.bpm}
                <span className="font-light text-xs">bpm</span>
              </div>
            )}
            {isAnalyzing && (
              <Icons.spinner className="ml-4 font-medium h-4 w-4 animate-spin" />
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
          <ContextMenuItem
            disabled={isAnalyzing}
            onClick={() => analyseBpm(track.id)}
          >
            Analyse BPM
          </ContextMenuItem>
          <ContextMenuItem onClick={() => removeTrack(track.id)}>
            Remove from library
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
