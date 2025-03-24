'use client';

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import useUploader from '@/hooks/useUploader';
import UploadSVG from './svgs/UploadSVG';
import { deleteRankItem, insertRankItems, RankItemType } from '@/app/api/rankItems';
import { deleteRanking, Ranking, updateRanking } from '@/app/api/rankings';

type NewRankItem = { name: string, rankingId: string, fileName: string, imageUrl: string };

export default function EditRankingForm({ currentRankItems, ranking, userId, userEmail }: { currentRankItems: RankItemType[], ranking: Ranking, userId: string, userEmail: string }) {
  const router = useRouter();
  const { startUpload } = useUploader();

  const isCollaborator = userId !== ranking.userId;

  const [title, setTitle] = useState(ranking.title);
  const [name, setName] = useState('');
  const [image, setImage] = useState<undefined | File>(undefined);
  const [collaborativeMode, setCollaborativeMode] = useState(ranking.collaborative);
  const [privateMode, setPrivateMode] = useState(ranking.privateMode);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [newRankItems, setNewRankItems] = useState<NewRankItem[]>([]);

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

    if (
      imagesToUpload.find(f => f.name === e.target.files?.[0].name) ||
      currentRankItems.find(f => f.fileName === e.target.files?.[0].name)
    ) {
      alert('This image is already in use.');
    } else {
      setImage(e.target.files[0]);
    }

    e.target.value = ''
  };

  function handleAddRankItem() {
    if (image === undefined) return;
    else {
      setImagesToUpload([...imagesToUpload, image]);
      setNewRankItems([...newRankItems, {
        name,
        rankingId: ranking._id,
        fileName: image.name,
        imageUrl: URL.createObjectURL(image),
      }]);
    }

    setName('');
    setImage(undefined);
  }

  async function handleConfirmUpdates() {
    try {
      const shouldUpdateRankItems = newRankItems.length > 0;
      const shouldUpdateRanking = ranking.collaborative !== collaborativeMode || ranking.privateMode !== privateMode || ranking.title !== title;
  
      if (shouldUpdateRankItems) {
        const uploadResults = await startUpload(imagesToUpload);
  
        const updatedRankItems = newRankItems.map((rankItem) => {
          const uploadedFile = uploadResults?.find(
            (file) => file.name === rankItem.fileName
          );
  
          return {
            ...rankItem,
            userId,
            userEmail,
            imageUrl: uploadedFile?.url || "",
            imageKey: uploadedFile?.key || "",
          };
        });
  
        await insertRankItems(updatedRankItems);
        setNewRankItems([]);
      }
  
      if (shouldUpdateRanking) {
        await updateRanking(ranking._id, {
          collaborative: collaborativeMode,
          privateMode,
          title,
        });
      }
  
      if (shouldUpdateRankItems || shouldUpdateRanking) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update ranking:", error);
    }
  }

  function handleDeleteRankItem(rankItemId: string) {
    deleteRankItem(rankItemId).then(() => router.refresh());
  }

  return (
    <div className='p-4'>
      <div className='text-2xl font-bold mb-4'>Editing Ranking</div>
      <div className='flex flex-col gap-4'>
        {userId === ranking.userId ?
          <Input placeholder='New title' value={title} onChange={(e) => setTitle(e.target.value)} /> :
          <div className='font-bold text-2xl'>{ranking.title}</div>}
        {currentRankItems.map((rankItem, i) => (
          <div key={rankItem.name} className='flex w-full h-28 items-center gap-4'>
            <div>{i + 1}</div>
            <div className='flex min-h-28 max-h-28 min-w-28 max-w-28 overflow-hidden'>
              <Image alt="rankItemImage" src={rankItem.imageUrl} width={600} height={300} />
            </div>
            <div className='text-xl'>{rankItem.name}</div>
            {userId === ranking.userId && <Button
              className='ml-auto'
              onClick={() => handleDeleteRankItem(rankItem._id)}
            >Delete</Button>}
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        {newRankItems.map((rankItem, i) => (
          <div key={rankItem.name} className='flex w-full h-28 items-center gap-4'>
            <div>{currentRankItems.length + i + 1}</div>
            <div className='flex min-h-28 max-h-28 min-w-28 max-w-28 overflow-hidden'>
              <Image alt="rankItemImage" src={rankItem.imageUrl} width={600} height={300} />
            </div>
            <div className='text-xl'>{rankItem.name}</div>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-4 mt-4 mb-4'>
        <div>{[...currentRankItems ?? [], ...newRankItems].length + 1}</div>
        <label
          className="flex cursor-pointer relative min-h-28 min-w-28 max-h-28 max-w-28 border border-white overflow-hidden"
          htmlFor="upload-button"
        >
          {image !== undefined && <Image
            id="target"
            alt='uploadedImage'
            src={URL.createObjectURL(image)}
            width={600}
            height={300}
          />}
          <div className="absolute top-[40%] left-[40%]">
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
        <div className='flex flex-col md:flex-row gap-2 w-full'>
          <Input
            className='flex-1'
            placeholder='name'
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            value={name}
          />
          <div className={`${(!image || !name) ? 'cursor-not-allowed' : ''}`}>
            <Button
              disabled={!image || !name}
              onClick={handleAddRankItem}
            >Add Rank Item</Button>
          </div>
        </div>
      </div>
      <div className='flex'>
        {userId === ranking.userId && <div className='flex flex-col gap-4'>
          <div className='flex gap-2 items-center'>
            <Label htmlFor="collaborative-mode">Collaborative Mode</Label>
            <Switch
              id="collaboartive-mode"
              onCheckedChange={setCollaborativeMode}
              checked={collaborativeMode}
            />
          </div>
          <div className='flex gap-2 items-center'>
            <Label htmlFor="private-mode">Private Mode</Label>
            <Switch
              id="private-mode"
              onCheckedChange={setPrivateMode}
              checked={privateMode}
            />
          </div>
        </div>}
        <div className='flex gap-2 ml-auto'>
          {<Button
            className=''
            disabled={(collaborativeMode === ranking.collaborative && privateMode === ranking.privateMode && newRankItems.length === 0 && title === ranking.title) || title === ''}
            onClick={handleConfirmUpdates}
          >Confirm {isCollaborator ? 'Update Request' : 'Updates'}</Button>}
          {userId === ranking.userId && <Button
            onClick={() => {
              deleteRanking(ranking._id)
                .then(() => router.replace('/'));
            }}
          >Delete</Button>}
        </div>
      </div>
    </div>
  )
}