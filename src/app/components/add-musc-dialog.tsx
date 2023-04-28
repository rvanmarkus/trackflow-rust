"use client"

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
import { useCallback, useState } from "react"
import { open } from "@tauri-apps/api/dialog";

export const AddMusicDialog: React.FC = () => {
  const [filePath, setFilePath] = useState(undefined);
  const [folderPath, setFolderPath] = useState(undefined);
  const openMusicFile = async () => {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: "Music",
          extensions: ["mp3", "m4a"],
        },
      ],
    });
    if (!selected || selected.length < 1) {
      return;
    }
    const [filename] = selected;
    setFilePath(filename);
  }
  const onMusicFileSelect = useCallback(() => {
    openMusicFile()
  }, [openMusicFile]);
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="relative">
          <Plus className="mr-2 h-4 w-4" />
          Add Music
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Music</DialogTitle>
          <DialogDescription>
            Choose how you want to add your music
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Single music file</Label>
            <div className="flex">
              <Input id="filename" placeholder="/music-folder/file.mp3" value={filePath} />
              <Button onClick={onMusicFileSelect}>Browse</Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="folder">Music folder</Label>
            <div className="flex">
              <Input id="folder" placeholder="/music-folder" value={folderPath} />
              <Button>Browse</Button>
            </div>
            {/* <Input id="url" placeholder="https://example.com/feed.xml" /> */}
          </div>
        </div>
        <DialogFooter>
          <Button>Add music</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
