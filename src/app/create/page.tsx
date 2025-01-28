'use client'

import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/utils/uploadthings";
import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function CreateRanking() {
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);


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
      // toast(
      //   <div className="flex gap-2 items-center dark:text-white">
      //     <LoadingSpinnerSVG />
      //     <span>Uploading...</span>
      //   </div>,
      //   {
      //     duration: 100000,
      //     id: "upload-begin",
      //     className: "dark:bg-gray-800",
      //   }
      // );
    },
    onClientUploadComplete() {
      // toast.dismiss('upload-begin');
      // toast(
      //   <span className="dark:text-white">Upload Complete</span>,
      //   {
      //     id: "upload-complete",
      //     className: "dark:bg-gray-800"
      //   }
      // );
      // router.refresh();
    }
  });

  function onBeginUpload() {
    if (uploadedImage !== null) startUpload([uploadedImage])
  }

  return (
    <div>
      Create
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