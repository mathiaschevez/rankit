'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRanking } from "@/server/queries";
import { useUploadThing } from "@/utils/uploadthings";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Input = Parameters<typeof useUploadThing>;

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


function LoadingSpinnerSVG() {
  return <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" className="spinner_ajPY"/>
  </svg>
}

export default function CreateRanking() {
  const user = useUser();
  const [title, setTitle] = useState('');
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);
  const router = useRouter();

  useEffect(() => {
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
        <div className="flex gap-2 items-center dark:text-white">
          <LoadingSpinnerSVG />
          <span>Uploading...</span>
        </div>,
        {
          duration: 100000,
          id: "upload-begin",
          className: "dark:bg-gray-800",
        }
      )
    },
    onClientUploadComplete() {
      if (!user.user) return;

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
    if (uploadedImage !== null && user.user) {
      startUpload([uploadedImage]).then((res) => {
        createRanking({
          userId: user.user.id,
          title: title,
          coverImageUrl: res?.[0].url
        });
      })
    }
  }

  return (
    <div className="p-4">
      Create
      <Input
        className=''
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        id="upload-button"
        className=""
        type="file"
        onChange={onImageImport}
        { ...inputProps }
      />
      {uploadedImage !== null && <Image
        id="target"
        alt='uploadedImage'
        src={URL.createObjectURL(uploadedImage)}
        width={50}
        height={50}
      />}
      <Button onClick={onBeginUpload}>Upload</Button>
    </div>
  )
};