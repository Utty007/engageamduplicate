import { X } from 'lucide-react';
import React from 'react';

type DisclaimerProp = {
  underStdBtn: () => void;
  title: string;
  description: string;
  affirmation: string;
  onClose: () => void;
};

function Disclaimer({
  underStdBtn,
  title,
  description,
  affirmation,
  onClose
}: DisclaimerProp) {
  return (
    <div className="max-w-[400px] m-auto w-auto bg-white text-black p-3 flex flex-col gap-3">
      <div className="flex justify-between items-center mb-4 border-b border-grey-stroke">
        <h2 className="text-xl font-bold border-b border-grayStroke pb-1">
          {title}
        </h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      <p>
        {description}
        <br /> <br /> 
        {affirmation}
      </p>
      <button
        className="w-full p-2 rounded-md bg-primary text-white"
        onClick={() => {
          underStdBtn();
        }}
      >
        I Understand
      </button>
    </div>
  );
}

export default Disclaimer;
