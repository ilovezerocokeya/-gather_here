import React from 'react';

interface JobSelectionButtonProps {
  job: string;                         
  isSelected: boolean;                 
  onSelect: (job: string) => void;     
  className: string;                 
}

const JobSelectionButton: React.FC<JobSelectionButtonProps> = ({ job, isSelected, onSelect, className }) => {
  const selectedClass = isSelected ? 'bg-[#343434] text-[#c4c4c4] font-medium shadow-lg' : '';
  
  // 버튼 클릭 시 전달받은 직무를 onSelect에 넘김
  const handleClick = () => {
    onSelect(job);
  };


  return (
    <button onClick={handleClick} className={`${className} ${selectedClass}`}>
      {job}
    </button>
  );
};

export default JobSelectionButton;