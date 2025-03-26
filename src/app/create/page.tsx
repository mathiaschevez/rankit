'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import useUploader from "@/hooks/useUploader";
import UploadSVG from "@/components/svgs/UploadSVG";
import { createRanking } from "../api/rankings";

export default function CreateRanking() {
  const { user } = useUser();
  const router = useRouter();
  const { startUpload } = useUploader();

  const [title, setTitle] = useState('');
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);
  const [collaborative, setCollaborative] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);

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

  const onImageImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const coverImage = e.target.files?.[0];
    if (coverImage) setUploadedImage(coverImage);
  };

  async function onBeginUpload() {
    const userId = user?.externalId;
    const userEmail = user?.emailAddresses[0].emailAddress;
    if (uploadedImage !== null && userId && userEmail) {
      startUpload([uploadedImage])
        .then((res) => {
          createRanking({
            title,
            collaborative,
            privateMode,
            userId,
            userEmail,
            coverImageUrl: res?.[0].url ?? '',
            imageKey: res?.[0].key ?? '',
          })
          .then((res) => {
            router.replace(`/ranking/${res.insertedId}`);
          });
        })
    }
  }

  return (
    <div className="p-4 md:px-20">
      <div className="font-bold text-3xl mb-4">Create</div>
      <div className="flex flex-col md:flex-row gap-4">
        <label
          className={`${uploadedImage === null && 'border border-white'} flex cursor-pointer relative min-h-80 max-h-80 w-full overflow-hidden justify-center`}
          htmlFor="upload-button"
        >
          {uploadedImage !== null && <Image
            id="target"
            alt='uploadedImage'
            src={URL.createObjectURL(uploadedImage)}
            width={600}
            height={300}
          />}
          <div className="absolute top-[45%] left-[45%]">
            <UploadSVG />
          </div>
        </label>
        <input
          id="upload-button"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onImageImport}
        />
        <div className="w-full flex flex-col gap-4">
          <Input
            className=''
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <div className="flex space-x-2 items-center">
            <Switch
              id="collaboartive-switch"
              onCheckedChange={setCollaborative}
              checked={collaborative}
            />
            <Label htmlFor="collaborative-switch">Collaborative Mode</Label>
          </div>
          <div className="flex space-x-2 items-center">
            <Switch
              id="private-switch"
              onCheckedChange={setPrivateMode}
              checked={privateMode}
            />
            <Label htmlFor="private-switch">Private</Label>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => router.back()}
          className="py-3 px-5 md:py-6 md:px-8 md:text-lg mt-4 hover:bg-slate-200"
        >Cancel</Button>
        <Button
          disabled={!uploadedImage || !title}
          onClick={onBeginUpload}
          className="py-3 px-5 md:py-6 md:px-8 md:text-lg mt-4 bg-blue-800 hover:bg-blue-700 text-white"
        >Create</Button>
      </div>
    </div>
  )
};