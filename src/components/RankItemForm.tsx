'use client';

import { RankItem } from '@/server/db/schema'
import React, { useState } from 'react'
import { Input } from './ui/input';
import Image from 'next/image';
import { Button } from './ui/button';

export default function RankItemForm({ currentRankItems }: { currentRankItems: RankItem[] | null }) {
  const [newRankItems, setNewRankItems] = useState<RankItem[]>([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState<null | File>(null);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);

  const onImageImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImage(e.target.files[0]);
  };

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
        {image !== null && <Button
          onClick={() => {
            setImagesToUpload([...imagesToUpload, image]);
            setNewRankItems([...newRankItems, { name, image: URL.createObjectURL(image), upvotes: 0, downvotes: 0 }]);
          }}
        >Add Rank Item</Button>}
      </div>
      <Button>Confirm Rank Items</Button>
    </div>
  )
}