'use client'

import { BouncingLoader } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRanking } from "@/server/queries";
import { useUploadThing } from "@/utils/uploadthings";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";

type Input = Parameters<typeof useUploadThing>;

function UploadSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}

const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);

  return {
    inputProps: {
      multiple: false,
      accept: "image/*",
    },
    startUpload: $ut.startUpload,
    isUploading: $ut.isUploading,
  };
};

export default function CreateRanking() {
  const user = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);
  const [collaborative, setCollaborative] = useState(false);

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
    if (!e.target.files) return;
    setUploadedImage(e.target.files[0]);
  };

  const { inputProps, startUpload } = useUploadThingInputProps("imageUploader", {
    onUploadBegin() {
      toast(
        <div className="flex gap-4 items-center dark:text-white w-full">
          <div className="w-[33px]"><BouncingLoader /></div>
          <span className=" w-full">Uploading...</span>
        </div>,
        {
          duration: 100000,
          id: "upload-begin",
          className: "dark:bg-gray-800",
        }
      )
    },
    onClientUploadComplete() {
      toast.dismiss('upload-begin');
      toast(
        <span className="dark:text-white">Upload Complete</span>,
        {
          id: "upload-complete",
          className: "dark:bg-gray-800"
        }
      );

      router.refresh();
    }
  });

  async function onBeginUpload() {
    const externalId = user.user?.externalId;
    if (uploadedImage !== null && externalId) {
      startUpload([uploadedImage])
        .then((res) => {
          createRanking({
            title,
            collaborative,
            userId: externalId,
            coverImageUrl: res?.[0].url ?? '',
            coverImageFileKey: res?.[0].key ?? '',
          }).then((res) => {
            const insertedId = res[0].insertedId;
            router.replace(`/ranking/${insertedId}`);
          });
        })
    }
  }

  return (
    <div className="p-4">
      <div className="font-bold text-3xl mb-4">Create</div>
      <div className="flex flex-col md:flex-row gap-4">
        <label
          className="flex cursor-pointer relative min-h-80 min-w-80 max-h-80 max-w-80 border border-white overflow-hidden"
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
          className="sr-only"
          onChange={onImageImport}
          { ...inputProps }
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
              id="collaboartive-mode"
              onCheckedChange={setCollaborative}
              checked={collaborative}
            />
            <Label htmlFor="collaborative-mode">Collaborative Mode</Label>
          </div>
        </div>
      </div>
      <Button
        disabled={!uploadedImage}
        onClick={onBeginUpload}
        className="py-3 px-5 md:py-6 md:px-8 md:text-lg mt-4"
      >Create</Button>
    </div>
  )
};