"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ImagePlus, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import useUploader from "@/hooks/useUploader"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { createRanking } from "../api/rankings"
import { insertRankItems } from "../api/rankItems"

type RankItem = {
  name: string
  image: File | null
  fileName: string,
}

export default function CreateRanking() {
  const { user } = useUser();
  const router = useRouter();
  const { startUpload } = useUploader();

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [rankingImage, setRankingImage] = useState<File | null>(null)
  const [rankItems, setRankItems] = useState<RankItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemImage, setNewItemImage] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(function WarnOnReload() {
    const handleBeforeUnload = (event: Event) => {
      event.preventDefault();
      return 'Are you sure you want to reload?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0]
    if (image) setRankingImage(image);
  }

  function handleItemImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0]
    if (image) setNewItemImage(image);
  }

  function addRankItem() {
    if (newItemName.trim()) {
      const newItem: RankItem = {
        name: newItemName,
        image: newItemImage,
        fileName: newItemImage?.name ?? '',
      }
      setRankItems([...rankItems, newItem])
      setNewItemName("")
      setNewItemImage(null)
      if (itemFileInputRef.current) {
        itemFileInputRef.current.value = ""
      }
    }
  }

  function removeRankItem (index: number) {
    setRankItems(rankItems.filter((_, i) => i !== index));
  }

  function handleSubmit (e: React.FormEvent) {
    e.preventDefault();
  
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress || !rankingImage) {
      console.error("Missing required data (user or ranking image).");
      return;
    }
  
    const userId = user.id;
    const userEmail = user.emailAddresses[0].emailAddress;
  
    let rankingId: string | null = null;
  
    startUpload([rankingImage])
      .then((rankingImageUploadResult) => {
        if (!rankingImageUploadResult?.[0]?.url || !rankingImageUploadResult?.[0]?.key) {
          throw new Error("Failed to upload ranking image.");
        }
  
        const coverImageUrl = rankingImageUploadResult[0].url;
        const imageKey = rankingImageUploadResult[0].key;
  
        return createRanking({
          title,
          collaborative: isCollaborative,
          privateMode: isPrivate,
          description,
          coverImageUrl,
          imageKey,
          userEmail,
          userId,
        });
      })
      .then((rankingResult) => {
        console.log(rankingResult.insertedId, 'INSERTED ID')
        rankingId = rankingResult?.insertedId;
  
        if (!rankingId) {
          throw new Error("Failed to create ranking.");
        }
  
        const rankItemImagesToUpload = rankItems
          .map((r) => r.image)
          .filter((r): r is File => r !== null);
  
        return startUpload(rankItemImagesToUpload);
      })
      .then((rankItemImageResults) => {
        const updatedRankItems = rankItems.map((rankItem) => {
          const uploadedFile = rankItemImageResults?.find(
            (file) => file.name === rankItem.fileName
          );
  
          return {
            name: rankItem.name,
            fileName: rankItem.fileName,
            rankingId: rankingId ?? '',
            userId,
            userEmail,
            imageUrl: uploadedFile?.url || "",
            imageKey: uploadedFile?.key || "",
          };
        });
  
        return insertRankItems(updatedRankItems);
      })
      .then(() => {
        if (rankingId) {
          router.replace(`/ranking/${rankingId}`);
        } else {
          console.error("Ranking ID is unexpectedly null.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <Button variant="ghost" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rankings
        </Button>
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="mb-6 text-2xl font-bold">Create New Ranking</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="ranking-image">Ranking Cover Image</Label>
            <div className="flex flex-col items-center justify-center">
              {rankingImage ? (
                <div className="relative mb-4 w-full">
                  <div className="aspect-[3/1] w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src={URL.createObjectURL(rankingImage)}
                      alt="Ranking cover"
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full"
                    onClick={() => setRankingImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4 flex aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-[#005CA3] hover:bg-gray-800"
                >
                  <ImagePlus className="mb-2 h-10 w-10 text-gray-500" />
                  <p className="text-center text-sm text-gray-400">
                    Click to upload a cover image
                    <br />
                    <span className="text-xs">16:9 ratio recommended</span>
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="ranking-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Ranking Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your ranking"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this ranking is about"
              className="min-h-[100px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="collaborative"
              checked={isCollaborative}
              onCheckedChange={setIsCollaborative}
              className="data-[state=checked]:bg-[#005CA3]"
            />
            <Label htmlFor="collaborative">Allow collaboration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              className="data-[state=checked]:bg-[#005CA3]"
            />
            <Label htmlFor="collaborative">Set this ranking to private</Label>
          </div>
          <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h2 className="text-lg font-medium">Add Rank Items</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-image">Item Image (Optional)</Label>
                <div className="flex items-center space-x-4">
                  {newItemImage ? (
                    <div className="relative h-16 w-24">
                      <Image
                        src={URL.createObjectURL(newItemImage)}
                        alt="Item preview"
                        className="h-full w-full rounded-md object-cover"
                        fill
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                        onClick={() => setNewItemImage(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-16 w-24 border-gray-700 bg-gray-800"
                      onClick={() => itemFileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-5 w-5 text-gray-400" />
                    </Button>
                  )}
                  <input
                    ref={itemFileInputRef}
                    id="item-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleItemImageUpload}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item title"
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                />
                <Button
                  type="button"
                  onClick={addRankItem}
                  className="bg-[#005CA3] hover:bg-[#004a82]"
                  disabled={!newItemName.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            {rankItems.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-400">Added Items</h3>
                <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border border-gray-800 bg-gray-800/50 p-2">
                  {rankItems.map((item, index) => (
                    <div key={`${item.fileName}` + `- ${index}`} className="flex items-center justify-between rounded-md bg-gray-800 p-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#005CA3]/20 text-sm font-medium text-[#4a9ede]">
                          {index + 1}
                        </div>
                        {item.image && (
                          <div className="h-10 w-16 overflow-hidden rounded">
                            <Image
                              src={URL.createObjectURL(item.image)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              height={100} width={100}
                            />
                          </div>
                        )}
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white"
                        onClick={() => removeRankItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#005CA3] hover:bg-[#004a82]"
              disabled={!rankingImage || !title.trim() || rankItems.length === 0}
            >
              Create Ranking
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

