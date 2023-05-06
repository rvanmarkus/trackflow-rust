"use client"

import { useCallback, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { open as openDialog } from "@tauri-apps/api/dialog"
import { invoke } from "@tauri-apps/api/tauri"
import { Plus } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ButtonLoading } from "@/components/examples/button/loading"

import { addMusicByFilePath } from "../commands"

export const AddMusicDialog: React.FC = () => {
  const query = useQueryClient()
  const {
    mutateAsync: addTrackByFilePath,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationKey: ["track"],
    mutationFn: addMusicByFilePath,
  })
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const filePathInputRef = useRef<HTMLInputElement>()
  const onMusicFileSelect = useCallback(() => {
    ;(async () => {
      const selected = await openDialog({
        multiple: true,
        filters: [
          {
            name: "Music",
            extensions: ["mp3", "m4a"],
          },
        ],
      })
      if (!selected || selected.length < 1) {
        return
      }
      console.log({ selected })
      filePathInputRef.current.value = selected.join(", ")
      setSelectedFiles(selected)
    })()
  }, [filePathInputRef, openDialog, setSelectedFiles])

  const onAddMusic = useCallback(async () => {
    if (!filePathInputRef.current?.value) return
    for (const file of selectedFiles) {
      const result = await addTrackByFilePath(file)
      console.log({ result })
    }
    await query.invalidateQueries({ queryKey: ["tracks"] })
    setOpen(false)
  }, [selectedFiles, query, addTrackByFilePath])
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Music
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Music</DialogTitle>
            <DialogDescription>Add tracks to your collection</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="files" className="h-full space-y-6">
            <div className="space-between flex items-center">
              <TabsList>
                <TabsTrigger value="files" className="relative">
                  File(s)
                </TabsTrigger>
                <TabsTrigger value="folder" className="relative">
                  Folder
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="files" className="border-none p-0 outline-none">
              <div className="grid gap-2">
                <Label htmlFor="url">Select music file(s)</Label>
                <div className="flex">
                  <Input
                    id="filename"
                    placeholder="/music-folder/file.mp3"
                    ref={filePathInputRef}
                    disabled
                  />
                  <Button onClick={onMusicFileSelect}>Browse</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="folder"
              className="border-none p-0 outline-none"
            >
              <div className="grid gap-2">
                <Label htmlFor="folder">Music folder</Label>
                <div className="flex">
                  <Input id="folder" placeholder="/music-folder" />
                  <Button>Browse</Button>
                </div>
                {/* <Input id="url" placeholder="https://example.com/feed.xml" /> */}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 py-4"></div>
          {isError && typeof error === "string" && (
            <Alert variant="destructive">
              Something went wrong
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button onClick={() => onAddMusic()}>
                <span>Add music</span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
