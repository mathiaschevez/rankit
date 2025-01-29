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
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle fill="#fff" stroke="#fff" strokeWidth="15" r="15" cx="40" cy="65">
      <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
    </circle>
    <circle fill="#fff" stroke="#fff" strokeWidth="15" r="15" cx="100" cy="65">
      <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
    </circle>
    <circle fill="#fff" stroke="#fff" strokeWidth="15" r="15" cx="160" cy="65">
      <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
    </circle>
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
        <div className="flex gap-4 items-center dark:text-white w-full">
          <div className="w-[33px]"><LoadingSpinnerSVG /></div>
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