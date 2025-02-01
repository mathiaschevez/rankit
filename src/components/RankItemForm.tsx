'use client';

import { RankItem } from '@/server/db/schema'
import React, { useState } from 'react'
import { Input } from './ui/input';
import Image from 'next/image';
import { Button } from './ui/button';
import { createRankItems } from '@/server/queries';
import { useUploadThing } from '@/utils/uploadthings';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

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

export default function RankItemForm({ currentRankItems, rankingId }: { currentRankItems: RankItem[] | null, rankingId: string }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<null | File>(null);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [newRankItems, setNewRankItems] = useState<RankItem[]>([]);

  const { startUpload } = useUploadThingInputProps('imageUploader', {});

  const onImageImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImage(e.target.files[0]);
  };

  function handleAddRankItem() {
    if (image === null) return;
    
    setImagesToUpload([...imagesToUpload, image]);
    setNewRankItems([...newRankItems, {
      name,
      fileName: image.name,
      image: URL.createObjectURL(image),
      upvotes: 0,
      downvotes: 0
    }]);
    setName('');
    setImage(null);
  }

  function handleConfirmRankItems() {
    startUpload(imagesToUpload).then((res) => {

      createRankItems(rankingId, [
        ...currentRankItems ?? [],
        ...newRankItems.map(rankItem => ({
          ...rankItem,
          image: res?.find(file => file.name === rankItem.fileName)?.url ?? ''
        }))
      ]);
    });
  }

  return (
    <div className='px-4'>
      <div className='text-2xl font-bold'>Adding Rank Items</div>
      {[...currentRankItems ?? [], ...newRankItems].map((rankItem, i) => (
        <div key={rankItem.name} className='flex w-full h-20 items-center gap-4'>
          <div>{i + 1}</div>
          <Image alt="rankItemImage" src={rankItem.image} width={50} height={50} />
          <div className='text-xl'>{rankItem.name}</div>
          <div className='flex gap-2 ml-auto'>
            <div className='font-bold text-green-500 text-xl flex items-center gap-2'><FaArrowUp /> {rankItem.upvotes}</div>
            <div className='font-bold text-xl text-orange-500 flex items-center gap-2'><FaArrowDown /> {rankItem.downvotes}</div>
          </div>
        </div>
      ))}
      <div className='flex'>
        <input
          id="upload-button"
          className=""
          type="file"
          onChange={onImageImport}
        />
        {image !== null && <Image
          id="target"
          alt='uploadedImage'
          src={URL.createObjectURL(image)}
          width={50}
          height={50}
        />}
      <div className='flex gap-2 w-full'>
        <Input
          className='flex-1'
          placeholder='name'
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
          <div className={`${(!image || !name) ? 'cursor-not-allowed' : ''}`}>
            <Button
              disabled={!image || !name}
              onClick={handleAddRankItem}
            >Add Rank Item</Button>
          </div>
        </div>
      </div>
      {newRankItems.length !== 0 && <Button
        onClick={handleConfirmRankItems}
      >Confirm Rank Items</Button>}
    </div>
  )
}