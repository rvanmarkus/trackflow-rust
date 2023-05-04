"use client"

import { useCallback, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { open as openDialog } from "@tauri-apps/api/dialog"
import { invoke } from "@tauri-apps/api/tauri"
import { Plus } from "lucide-react"

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

export const AddMusicDialog: React.FC = () => {
  const query = useQueryClient()
  const [open, setOpen] = useState(false)
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
      const [filename] = selected
      filePathInputRef.current.value = filename
    })()
  }, [filePathInputRef, openDialog])

  const onAddMusic = useCallback(async () => {
    if (!filePathInputRef.current?.value) return
    const filePath = filePathInputRef.current.value
    const result = await invoke("add_track_by_file", { filePath })
    console.log({ result })
    await query.invalidateQueries({ queryKey: ["tracks"] })
    setOpen(false)
  }, [filePathInputRef])
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
          <DialogFooter>
            <Button onClick={() => onAddMusic()}>
              <span>Add music</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
