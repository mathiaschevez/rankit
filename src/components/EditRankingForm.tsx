"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { ImagePlus, Plus, Trash2, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import useUploader from "@/hooks/useUploader"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { deleteRanking, Ranking, updateRanking } from "@/app/api/rankings"
import { insertRankItems, updateRankItem } from "@/app/api/rankItems"
import BackButton from "./BackButton"
import { insertPendingRankItems } from "@/app/api/pendingRankItems"

export type RankItemType = {
  _id: string
  userId: string
  userEmail: string
  fileName: string
  rankingId: string
  imageUrl: string
  name: string
  imageKey: string
  votes?: number
  image?: File | null // For new uploads
  upvotes: number,
  downvotes: number,
}

// Type for new items being added
type NewRankItem = {
  name: string
  image: File | null
  fileName: string
}

export default function EditRankingForm({ currentRankItems, ranking }: { currentRankItems: RankItemType[], ranking: Ranking, userId: string, userEmail: string }) {
  const { user } = useUser()
  const router = useRouter()
  const { startUpload } = useUploader()

  const isCreator = ranking.userId === user?.id;

  const [title, setTitle] = useState(ranking.title)
  const [description, setDescription] = useState(ranking.description ?? '')
  const [isCollaborative, setIsCollaborative] = useState(ranking.collaborative)
  const [isPrivate, setIsPrivate] = useState(ranking.privateMode)
  const [rankItems, setRankItems] = useState<RankItemType[]>(currentRankItems)

  const [newRankingImage, setNewRankingImage] = useState<File | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemImage, setNewItemImage] = useState<File | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RankItemType | null>(null)
  const [editingItemNewImage, setEditingItemNewImage] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemFileInputRef = useRef<HTMLInputElement>(null)
  const editItemFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(function WarnOnReload() {
    const handleBeforeUnload = (event: Event) => {
      event.preventDefault()
      return "Are you sure you want to reload?"
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])


  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setNewRankingImage(file)
    }
  }

  function handleItemImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setNewItemImage(file)
    }
  }

  function handleEditItemImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && editingItem) {
      setEditingItemNewImage(file)
    }
  }

  function addRankItem() {
    if (newItemName.trim() && ranking) {

      const newItem: NewRankItem = {
        name: newItemName,
        image: newItemImage,
        fileName: newItemImage?.name || "",
      }

      // Add to UI immediately with a temporary ID
      const tempItem: RankItemType = {
        _id: `temp_${Date.now()}`,
        userId: user?.id || "",
        userEmail: user?.emailAddresses?.[0]?.emailAddress || "",
        fileName: newItem.fileName,
        rankingId: ranking._id,
        imageUrl: newItemImage ? URL.createObjectURL(newItemImage) : "",
        name: newItemName,
        imageKey: "",
        image: newItemImage,
        upvotes: 0,
        downvotes: 0,
      }

      setRankItems([...rankItems, tempItem])
      setNewItemName("")
      setNewItemImage(null)

      if (itemFileInputRef.current) {
        itemFileInputRef.current.value = ""
      }
    }
  }

  function removeRankItem(id: string) {
    setRankItems(rankItems.filter((item) => item._id !== id))
    // Note: actual deletion from database happens on form submit
  }

  function updateEditingItem(field: string, value: string) {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [field]: value,
      })
    }
  }

  function saveEditingItem() {
    if (editingItem) {
      // If there's a new image, update the URL for preview
      if (editingItemNewImage) {
        editingItem.imageUrl = URL.createObjectURL(editingItemNewImage)
        editingItem.fileName = editingItemNewImage.name
        editingItem.image = editingItemNewImage
      }

      setRankItems(rankItems.map((item) => (item._id === editingItem._id ? editingItem : item)))

      setEditingItem(null)
      setEditingItemNewImage(null)
    }
  }

  async function handleDeleteRanking() {
    if (!ranking) return

    try {
      await deleteRanking(ranking._id)
      router.replace("/") // Redirect to home page
    } catch (error) {
      console.error("Error deleting ranking:", error)
    }

    setDeleteDialogOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress || !ranking) {
      console.error("Missing required data (user or ranking).");
      return;
    }
  
    const userId = user.id;
    const userEmail = user.emailAddresses[0].emailAddress;
  
    try {
      let coverImageUrl = ranking.coverImageUrl;
      let imageKey = ranking.imageKey;
  
      // 1. Handle ranking cover image if changed
      if (newRankingImage) {
        const rankingImageUploadResult = await startUpload([newRankingImage]);
        if (
          rankingImageUploadResult?.[0]?.url &&
          rankingImageUploadResult?.[0]?.key
        ) {
          coverImageUrl = rankingImageUploadResult[0].url;
          imageKey = rankingImageUploadResult[0].key;
        }
      }
  
      // 2. Update the ranking
      if (
        newRankingImage ||
        title !== ranking.title ||
        (ranking.description && description !== ranking.description) ||
        isCollaborative !== ranking.collaborative ||
        isPrivate !== ranking.privateMode
      ) {
        await updateRanking(ranking._id, {
          title,
          description,
          collaborative: isCollaborative,
          privateMode: isPrivate,
          coverImageUrl,
          imageKey,
        });
      }
  
      // 3. Process existing items with changes (Parallelize updates)
      const existingItemsToUpdate = rankItems.filter(
        (item) =>
          !item._id.startsWith("temp_") &&
          (item.image || item.name !== item.name)
      );
  
      // Use Promise.all to update items concurrently
      await Promise.all(
        existingItemsToUpdate.map(async (item) => {
          let updatedImageUrl = item.imageUrl;
          let updatedImageKey = item.imageKey;
  
          if (item.image) {
            const itemImageUploadResult = await startUpload([item.image]);
            if (
              itemImageUploadResult?.[0]?.url &&
              itemImageUploadResult?.[0]?.key
            ) {
              updatedImageUrl = itemImageUploadResult[0].url;
              updatedImageKey = itemImageUploadResult[0].key;
            }
          }
  
          await updateRankItem(item._id, {
            name: item.name,
            imageUrl: updatedImageUrl,
            imageKey: updatedImageKey,
            fileName: item.fileName,
          });
        })
      );
  
      // 4. Process new items
      const newItems = rankItems.filter((item) => item._id.startsWith("temp_"));
  
      if (newItems.length > 0) {
        const newItemsWithImages = newItems.filter((item) => item.image);
        const imagesToUpload = newItemsWithImages
          .map((item) => item.image)
          .filter((img): img is File => img !== null);
  
        let uploadResults: { name: string, url: string, key: string }[] = [];
        if (imagesToUpload.length > 0) {
          uploadResults = (await startUpload(imagesToUpload)) || [];
        }
  
        const itemsToInsert = newItems.map((item) => {
          const uploadedFile = item.image
            ? uploadResults.find((file) => file.name === item.fileName)
            : null;
  
          return {
            name: item.name,
            fileName: item.fileName,
            rankingId: ranking._id,
            userId,
            userEmail,
            imageUrl: uploadedFile?.url || "",
            imageKey: uploadedFile?.key || "",
            upvotes: 0,
            downvotes: 0,
          };
        });

        await insertRankItems(itemsToInsert);
      }
  
      // 5. Handle deleted items (items in database but not in current rankItems)
  
      // 6. Redirect back to the ranking page
      router.replace(`/ranking/${ranking._id}`);
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  }

  async function handleCollaboratorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress || !ranking) {
      console.error("Missing required data (user or ranking).");
      return;
    }

    const userId = user.id;
    const userEmail = user.emailAddresses[0].emailAddress;

    try {
      const newItems = rankItems.filter((item) => item._id.startsWith("temp_"));

      if (newItems.length > 0) {
        const newItemsWithImages = newItems.filter((item) => item.image);
        const imagesToUpload = newItemsWithImages
          .map((item) => item.image)
          .filter((img): img is File => img !== null);
  
        let uploadResults: { name: string, url: string, key: string }[] = [];
        if (imagesToUpload.length > 0) {
          uploadResults = (await startUpload(imagesToUpload)) || [];
        }
  
        const itemsToInsert = newItems.map((item) => {
          const uploadedFile = item.image
            ? uploadResults.find((file) => file.name === item.fileName)
            : null;
  
          return {
            name: item.name,
            fileName: item.fileName,
            rankingId: ranking._id,
            userId,
            userEmail,
            imageUrl: uploadedFile?.url || "",
            imageKey: uploadedFile?.key || "",
            upvotes: 0,
            downvotes: 0,
          };
        });

        await insertPendingRankItems(itemsToInsert);
      }

      router.replace(`/ranking/${ranking._id}`);
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  }

    const rankItemsSortedByScore = useMemo(() => {
      return rankItems
        .map(ri => ({ ...ri, score: ri.upvotes - ri.downvotes }))
        .sort((a, b) => b.score - a.score)
    }, [rankItems]);

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
      {/* Back button */}
      <div className="mx-auto max-w-3xl px-4 py-4">
        <BackButton text='Back to Ranking' />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Ranking</h1>
          {isCreator && <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Ranking</Button>
            </DialogTrigger>
            <DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Delete Ranking
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to delete this ranking? This action cannot be undone and all votes and data will
                  be permanently lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteRanking}>
                  Delete Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>}
        </div>

        <form onSubmit={isCreator ? handleSubmit : handleCollaboratorSubmit} className="space-y-8">
          {/* Ranking Image */}
          <div className="space-y-2">
            <Label htmlFor="ranking-image">Ranking Cover Image</Label>
            <div className="flex flex-col items-center justify-center">
              {ranking.coverImageUrl || newRankingImage ? (
                <div className="relative mb-4 w-full">
                  <div className="aspect-[3/1] w-full overflow-hidden rounded-lg bg-gray-800">
                    {newRankingImage ? (
                      <Image
                        src={URL.createObjectURL(newRankingImage) || "/placeholder.svg"}
                        alt="Ranking cover"
                        className="h-full w-full object-cover"
                        fill
                      />
                    ) : (
                      <Image
                        src={ranking.coverImageUrl}
                        alt="Ranking cover"
                        className="h-full w-full object-cover"
                        fill
                      />
                    )}
                  </div>
                  {isCreator && <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full border-gray-700 bg-gray-800/80 text-white hover:bg-gray-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>}
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

          {/* Ranking Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Ranking Title</Label>
            {isCreator ? <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your ranking"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
              required
            /> : <div className="text-white text-lg">{title}</div>}
          </div>
          {/* Ranking Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isCreator ? <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this ranking is about"
              className="min-h-[100px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
            /> : <div className="text-white">{description || 'No Description'}</div>}
          </div>
          {isCreator && <>
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
              <Label htmlFor="private">Set this ranking to private</Label>
            </div>
          </>}
          {/* Current Rank Items */}
          <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h2 className="text-lg font-medium">Current Rank Items</h2>

            {rankItemsSortedByScore.length > 0 ? (
              <div className="space-y-3">
                {rankItemsSortedByScore.map((item, index) => (
                  <div
                    key={item._id}
                    className={cn(
                      "rounded-md border border-gray-800 bg-gray-800/50 p-3",
                      editingItem?._id === item._id && "border-[#005CA3]/50",
                    )}
                  >
                    {editingItem?._id === item._id ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#005CA3]/10 text-lg font-bold text-[#4a9ede]">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Input
                              value={editingItem.name}
                              onChange={(e) => updateEditingItem("name", e.target.value)}
                              className="border-gray-700 bg-gray-800 text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {editingItemNewImage ? (
                            <div className="relative h-16 w-24">
                              <Image
                                src={URL.createObjectURL(editingItemNewImage) || "/placeholder.svg"}
                                alt={editingItem.name}
                                className="h-full w-full rounded-md object-cover"
                                width={96}
                                height={64}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-gray-700 bg-gray-800/80 text-white hover:bg-gray-700"
                                onClick={() => editItemFileInputRef.current?.click()}
                              >
                                <ImagePlus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : editingItem.imageUrl ? (
                            <div className="relative h-16 w-24">
                              <Image
                                src={editingItem.imageUrl || "/placeholder.svg"}
                                alt={editingItem.name}
                                className="h-full w-full rounded-md object-cover"
                                width={96}
                                height={64}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-gray-700 bg-gray-800/80 text-white hover:bg-gray-700"
                                onClick={() => editItemFileInputRef.current?.click()}
                              >
                                <ImagePlus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-16 w-24 border-gray-700 bg-gray-800"
                              onClick={() => editItemFileInputRef.current?.click()}
                            >
                              <ImagePlus className="h-5 w-5 text-gray-400" />
                            </Button>
                          )}
                          <input
                            ref={editItemFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditItemImageUpload}
                          />

                          <div className="flex flex-1 justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                              onClick={() => {
                                setEditingItem(null)
                                setEditingItemNewImage(null)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="bg-[#005CA3] hover:bg-[#004a82]"
                              onClick={saveEditingItem}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#005CA3]/10 text-lg font-bold text-[#4a9ede]">
                          {index + 1}
                        </div>

                        {item.imageUrl && (
                          <div className="h-12 w-16 overflow-hidden rounded-md relative">
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              className="object-cover"
                              fill
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.votes || 0} votes</p>
                        </div>
                        {isCreator && <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white"
                            onClick={() => setEditingItem(item)}
                            title="Edit item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:bg-red-900/20 hover:text-red-500"
                            onClick={() => removeRankItem(item._id)}
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-gray-800 bg-gray-800/30 p-6 text-center">
                <p className="text-gray-400">No items in this ranking yet. Add some below.</p>
              </div>
            )}
          </div>

          {/* Add New Rank Items */}
          <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h2 className="text-lg font-medium">Add New Item</h2>

            <div className="space-y-4">
              {/* New Item Image */}
              <div className="space-y-2">
                <Label htmlFor="item-image">Item Image (Optional)</Label>
                <div className="flex items-center space-x-4">
                  {newItemImage ? (
                    <div className="relative h-16 w-24">
                      <Image
                        src={URL.createObjectURL(newItemImage) || "/placeholder.svg"}
                        alt="Item preview"
                        className="h-full w-full rounded-md object-cover"
                        width={96}
                        height={64}
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

              {/* New Item Title */}
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
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#005CA3] hover:bg-[#004a82]"
              disabled={!title.trim() || rankItems.length === 0 || rankItems.length === currentRankItems.length}
            >
              {isCreator ? 'Save Changes' : 'Request Updates'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

