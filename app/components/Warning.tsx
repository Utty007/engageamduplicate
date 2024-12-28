import React from 'react';
import Overlay from './Overlay';
import { XIcon } from 'lucide-react';

type WarningProp = {
  confirm: () => void;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  affirmation: string;
};

function Warning({ confirm, isOpen, onClose, title, description, affirmation }: WarningProp) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
        <div className="max-w-[400px] bg-white text-black p-3 flex flex-col gap-3">
            <div className='flex items-center justify-between border-b border-grey-stroke'>
                <h2 className="text-xl font-bold pb-1">
                    {title}
                </h2>
                <XIcon onClick={onClose} />
            </div>
            <p>
                {description}
            </p>
            <p>{affirmation}</p>
            <button
                className="w-full p-2 rounded-md bg-primary text-white"
                onClick={confirm}
            >
                I Understand
            </button>
        </div>
    </Overlay>
  );
}

export default Warning;
