'use client';

import { RankItem } from '@/server/db/schema'
import React, { useState } from 'react'
import { Input } from './ui/input';
import Image from 'next/image';
import { Button } from './ui/button';
import { createRankItems } from '@/server/queries';
import { useUploadThing } from '@/utils/uploadthings';

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

  console.log(currentRankItems)
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
    <div>
      {[...currentRankItems ?? [], ...newRankItems].map(rankItem => <div key={rankItem.name} className='flex'>
        <Image alt="rankItemImage" src={rankItem.image} width={50} height={50} />
        <div>{rankItem.name}</div>
        <div>{rankItem.upvotes}</div>
        <div>{rankItem.downvotes}</div>
      </div>)}
      <div className='flex'>
        <input
          id="upload-button"
          className=""
          type="file"
          onChange={onImageImport}
          // { ...inputProps }
        />
        {image !== null && <Image
          id="target"
          alt='uploadedImage'
          src={URL.createObjectURL(image)}
          width={50}
          height={50}
        />}
        <Input placeholder='name' onChange={(e) => setName(e.target.value)}/>
        <div className={`${(!image || !name) ? 'cursor-not-allowed' : ''}`}>
          <Button
            disabled={!image || !name}
            onClick={handleAddRankItem}
          >Add Rank Item</Button>
        </div>
      </div>
      {newRankItems.length !== 0 && <Button
        onClick={handleConfirmRankItems}
      >Confirm Rank Items</Button>}
    </div>
  )
}