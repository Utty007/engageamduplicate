"use client"

import React, { ReactElement, useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import EvidenceModal from './EvidenceModal';
import TwitterIcon from "@/app/assets/svgs/X.svg";
import InstagramIcon from "@/app/assets/svgs/instagram.svg";
import TikTokIcon from "@/app/assets/svgs/tiktok.svg";
import { BottomPopup } from './BottomPopUp';
import Overlay from './Overlay';
import Disclaimer from './Disclaimer';

type DisputeData = {
  username: string;
  type: string;
  viewpost: string;
  status: string;
  role: "poster" | "engager";
  Profile: ReactElement;
};

function Disputes() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const headers = [
    { key: "username", label: "Username" }, 
    { key: "type", label: "Type" },
    {key: 'Profile', label: 'Profile'},
    { key: 'viewpost', label: 'View Post' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ];

  
    const [data, setData] = useState<DisputeData[]>([
        {
            username: "Skylar_20", 
            type: "Like & Comment", 
            viewpost: "100 tips to healthier lifestyle", 
            status: "pending evidence from you",
            role: "engager",
            Profile: <TikTokIcon />,
        },
        {
            username: "Alex_Fitness", 
            type: "Like", 
            viewpost: "Summer workout routine", 
            status: "fixed: awaiting admin review",
            role: "poster",
            Profile: <TwitterIcon />,
        },
        {
            username: "Emma_Tech", 
            type: "Comment", 
            viewpost: "AI innovation trends", 
            status: "pending evidence from you",
            role: "engager",
            Profile: <TikTokIcon />,
        },
        {
            username: "Jake_Travel", 
            type: "Like", 
            viewpost: "Backpacking Europe guide", 
            status: "resolved in favour of engager",
            role: "engager",
            Profile: <TwitterIcon />,
        },
        {
            username: "Sophia_Art", 
            type: "follow", 
            viewpost: "Modern art collection", 
            status: "pending evidence from you",
            role: "engager",
            Profile: <InstagramIcon />,
            
        },
        {
            username: "Max_Gaming", 
            type: "Comment", 
            viewpost: "Esports strategy guide", 
            status: "pending evidence from engager",
            role: "poster",
            Profile: <TwitterIcon />,
        },
        {
            username: "Luna_Music", 
            type: "Like", 
            viewpost: "Indie band showcase", 
            status: "pending evidence from you",
            role: "engager",
            Profile: <TikTokIcon />,
        },
        {
            username: "Ethan_Tech", 
            type: "follow", 
            viewpost: "Blockchain explained", 
            status: "resolved in favour of poster",
            role: "engager",
            Profile: <InstagramIcon />,
        },
        {
            username: "Noah_Sports", 
            type: "Like", 
            viewpost: "Olympic training secrets", 
            status: "resolved in favour of engager",
            role: "engager",
            Profile: <InstagramIcon />,
        }
    ]
  )
  
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isVddOpen, setIsVddOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPopupType, setSelectedPopupType] = useState<'poster' | 'engager' | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<DisputeData | null>(null);

  const confirmRefund = () => {
    if (selectedDispute) {
      // Update the disputes array to change the status of the selected dispute
      const updatedDisputes = data.map(dispute => 
        dispute.username === selectedDispute.username && 
        dispute.viewpost === selectedDispute.viewpost
          ? { ...dispute, status: "Resolved: Refunded" }
          : dispute
      );

      // Update the state with the new disputes array
      setData(updatedDisputes);

      // Close the disclaimer modal
      setIsDisclaimerOpen(false);

      // Clear the selected dispute
      setSelectedDispute(null);

      console.log('Refund confirmed for dispute:', selectedDispute);
    }
  };
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const handleUploadEvidence = useCallback((file: File | null, description: string) => {
    if (selectedDispute) {
      // Start loading
      setIsLoading(true);

      // Simulate backend upload with a 5-second delay
      const uploadTimer = setTimeout(() => {
        // Update the disputes array
        const updatedDisputes = data.map(dispute => 
          dispute.username === selectedDispute.username && 
          dispute.viewpost === selectedDispute.viewpost
            ? { ...dispute, status: "fixed: awaiting admin review" }
            : dispute
        );

        // Update the state with the new disputes array
        setData(updatedDisputes);

        // Stop loading
        setIsLoading(false);

        // Close modal and clear selected dispute
        setIsEvidenceModalOpen(false);
        setSelectedDispute(null);

        // Logging for demonstration
        console.log('Uploading evidence for dispute:', selectedDispute);
        console.log('File:', file);
        console.log('Description:', description);
      }, 5000);

      // Clear the timeout if the component unmounts
      return () => clearTimeout(uploadTimer);
    }
  }, [data, selectedDispute]);

  const openEvidenceModal = (dispute: DisputeData) => {
  setSelectedDispute(dispute);
  setIsEvidenceModalOpen(true);
};

  // Render status based on status type
  const renderStatus = (status: string, role: "poster" | "engager") => {
    let statusClasses = "text-xs font-bold w-fit p-1 rounded-md ";
    let displayStatus = status;

    if (status === "resolved in favour of poster" && role === "poster") {
      displayStatus = "resolved in your favor";
    } else if (status === "resolved in favour of engager" && role === "engager") {
      displayStatus = "resolved in your favor";
    }
    
    switch(displayStatus) {
      case "pending evidence from you":
      case "pending evidence from engager":
        statusClasses += "bg-red-secondary text-red-500";
        break;
      case "fixed: awaiting admin review":
      case "resolved in your favor":
      case "resolved in favour of poster":
      case "resolved in favour of engager":
        statusClasses += "bg-grey-100 text-grey-base";
        break;
      case "Resolved: Refunded":
        statusClasses += "bg-green-500 text-white";
        break
      default:
        statusClasses += "bg-grey-100 text-grey-base";
    }
    
    return <h4 className={statusClasses}>{displayStatus}</h4>;
  };

  // Render action button based on status
   const renderActionButton = (dispute: DisputeData) => {
    // If loading is active, return a disabled button with a spinner
    if (isLoading && 
        dispute.username === selectedDispute?.username && 
        dispute.viewpost === selectedDispute?.viewpost) {
      return (
        <button 
          className='text-sm bg-primary p-2 text-white rounded-md flex items-center justify-center'
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading Evidence
        </button>
      );
    }

    switch(dispute.status) {
      case "pending evidence from you":
        return (
          <div className='flex gap-2'>
            <button 
            onClick={() => {
                setSelectedDispute(dispute);
                setIsDisclaimerOpen(true);
              }}
            className='text-sm border border-primary p-2 text-primary rounded-md'
          >
            Refund
          </button>
          <button 
                className='text-sm bg-primary p-2 text-white rounded-md'
                onClick={() => openEvidenceModal(dispute)}
              >
                Upload Evidence
              </button>
          </div>
        );
      case "fixed: awaiting admin review":
        return (
          <button 
            className='text-sm bg-grey-100 text-white p-2 rounded-md' 
            disabled
          >
            View Dispute Details
          </button>
        );
      case "pending evidence from engager":
        return (
          <button 
            onClick={() => {
              setSelectedPopupType('engager');
              setIsVddOpen(true);
            }}
            className='text-sm bg-primary text-white p-2 rounded-md' 
          >
            View Dispute Details
          </button>
        );
      case "resolved in favour of poster":
        return (
          <button 
            className='text-sm bg-primary p-2 text-white rounded-md'
            onClick={() => {
              setSelectedPopupType('poster');
              setIsPopupOpen(true);
            }}
          >
            View Resolution
          </button>
        );
      case "resolved in favour of engager":
        return (
          <button 
            className='text-sm bg-primary p-2 text-white rounded-md'
            onClick={() => {
              setSelectedPopupType('engager');
              setIsPopupOpen(true);
            }}
          >
            View Resolution
          </button>
        );
      case "Resolved: Refunded":
        return (
          <button 
            className='text-sm bg-green-500 text-white p-2 rounded-md' 
            disabled
          >
            Refunded
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-dark-100 font-semibold text-xl mb-2">Disputes</h1>
          <p className="text-gray-400 text-sm">Ongoing disputes cases that need resolution</p>
        </div>

        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No dispute data available
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[1000px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((header) => (
                    <th 
                      key={header.key} 
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-sm text-grey-base whitespace-nowrap">{item.username}</td>
                    <td className="p-3 border-b text-sm text-grey-base whitespace-nowrap">{item.type}</td>
                    <td className='p-3 border-b whitespace-nowrap'>{item.Profile}</td>
                    <td className="p-3 border-b text-sm text-grey-base underline">{item.viewpost}</td>
                    <td className="p-3 border-b text-sm text-grey-base capitalize">
                      {renderStatus(item.status, item.role)}
                    </td>
                    <td className="p-3 border-b text-sm text-grey-base">
                      {renderActionButton(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2 block">Previous</span>
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === index + 1 
                      ? 'bg-primary/80 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <span className="mr-2 block">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <EvidenceModal
        describe='When you upload an evidence, the admin reviews the evidence from both parties and determine where the fault of the dispute is.'
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmit={handleUploadEvidence}
      />

      <Overlay isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)}>
        <Disclaimer
          onClose={() => setIsDisclaimerOpen(false)}
          title='Please Note'
          description='Refunding will lead to points deduction from your points balance which will be credited to the Poster.'
          affirmation='If you are certain about this, click on I understand.'
          underStdBtn={confirmRefund}
        />
      </Overlay>

      <BottomPopup 
        isOpen={isVddOpen} 
        onClose={() => setIsVddOpen(false)}
      >
        <h3 className='text-xl capitalize text-center font-medium'>
          {selectedPopupType === 'engager'
            ? 'This dispute is pending evidence from the engager'
            : 'Dispute Details'}
        </h3>
      </BottomPopup>

      <BottomPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
      >
        <h3 className='text-xl capitalize text-center font-medium'>
          {selectedPopupType === 'poster'
            ? 'This dispute was resolved in favor of poster'
            : 'This dispute was resolved in favor of engager'}
        </h3>
      </BottomPopup>

    </div>
  );
}

export default Disputes;