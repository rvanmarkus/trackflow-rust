"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ButtonLoading } from "@/components/examples/button/loading"

import { getTracks } from "../commands"
import { MusicEmptyPlaceholder } from "./music-empty-placeholder"
import { TrackRowCard } from "./track-row-card"

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

  if (isLoading) {
    return <ButtonLoading />
  }
  if (!tracks?.length || tracks?.length < 1) {
    return <MusicEmptyPlaceholder />
  }
  return (
    <Card>
      <CardHeader>
        <p>{tracks.length} tracks</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {tracks.map((track) => (
            <TrackRowCard track={track} key={track.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}