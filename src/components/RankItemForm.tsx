'use client';

import { SelectRankItem, SelectVote } from '@/server/db/schema'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import Image from 'next/image';
import { Button } from './ui/button';
import { insertRankItems } from '@/server/queries';
import { useUploadThing } from '@/utils/uploadthings';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BouncingLoader } from './Loaders';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

function UploadSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}

type NewRankItem = { name: string, rankingId: string, fileName: string, imageUrl: string };

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

export default function RankItemForm({ currentRankItems, rankingId, votes }: { currentRankItems: SelectRankItem[], rankingId: string, votes: SelectVote[] }) {
  const router = useRouter()
  const [name, setName] = useState('');
  const [image, setImage] = useState<undefined | File>(undefined);

  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [newRankItems, setNewRankItems] = useState<NewRankItem[]>([]);

  const { startUpload } = useUploadThingInputProps('imageUploader', {
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
    setImage(e.target.files[0]);
  };

  function handleAddRankItem() {
    if (image === undefined) return;
    
    setImagesToUpload([...imagesToUpload, image]);
    setNewRankItems([...newRankItems, {
      name,
      rankingId: rankingId,
      fileName: image.name,
      imageUrl: URL.createObjectURL(image),
    }]);

    setName('');
    setImage(undefined);
  }

  function handleConfirmRankItems() {
    startUpload(imagesToUpload).then((res) => {
      insertRankItems(newRankItems.map(rankItem => ({
        ...rankItem,
        imageUrl: res?.find(file => file.name === rankItem.fileName)?.url ?? ''
      })));
    });
  }

  return (
    <div className='p-4'>
      <div className='text-2xl font-bold mb-4'>Adding Rank Items</div>
      <div className='flex flex-col gap-4'>
        {currentRankItems.map((rankItem, i) => (
          <div key={rankItem.name} className='flex w-full h-28 items-center gap-4'>
            <div>{i + 1}</div>
            <div className='flex min-h-28 max-h-28 min-w-28 max-w-28 overflow-hidden'>
              <Image alt="rankItemImage" src={rankItem.imageUrl} width={600} height={300} />
            </div>
            <div className='text-xl'>{rankItem.name}</div>
            <div className='flex gap-2 ml-auto'>
              <div className='font-bold text-green-500 text-xl flex items-center gap-2'>
                <FaArrowUp /> {votes.filter(v => v.rankItemId === `${rankItem.id}` && v.type === 'upvote').length}
              </div>
              <div className='font-bold text-xl text-orange-500 flex items-center gap-2'>
                <FaArrowDown /> {votes.filter(v => v.rankItemId === `${rankItem.id}` && v.type === 'downvote').length}
              </div>
            </div>
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
          className="sr-only"
          onChange={onImageImport}
        />
        <div className='flex gap-2 w-full'>
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
      {newRankItems.length !== 0 && <Button
        onClick={handleConfirmRankItems}
      >Confirm Rank Items</Button>}
    </div>
  )
}