import React, { useCallback, useMemo, useState } from 'react';
import { JobFilterProps } from '@/lib/gatherHub';

const JobFilter: React.FC<JobFilterProps> = ({ selectedJob, handleSelectJob, jobCategories }) => {
const [hoveredJob, setHoveredJob] = useState<string | null>(null);
const memoizedJobCategories = useMemo(() => jobCategories, [jobCategories]); // useMemo로 jobCategories 메모이제이션

// Mouse Enter와 Leave 핸들러 최적화
const handleMouseEnter = useCallback((value: string) => {
  setHoveredJob(value);
}, []);

const handleMouseLeave = useCallback(() => {
  setHoveredJob(null);
}, []);

  
return (
  <>
    {/* 큰 화면용 리스트 */}
    <ul
      className="hidden lg:block job-list flex-col gap-1 justify-start item-start rounded-[20px] bg-fillStrong p-5 space-y-2 shadow mt-6 mb-6 w-[120px] h-[445px]"
      style={{
        minHeight: '500px',
        paddingTop: '20px',
        paddingBottom: '20px',
        top: '20px',
        zIndex: 10, 
      }}
    >
      {memoizedJobCategories.map((job) => (
        <li
          key={job.value}
          className={`job-item flex items-center justify-start 
            ${selectedJob === job.value ? 'bg-background text-primary font-bold' : 'text-gray-300'} 
            ${job.value !== 'all' || hoveredJob === 'all' ? 'hover:bg-background hover:text-primary' : ''} 
            cursor-pointer rounded-lg p-4 transition-all duration-300`}
          onClick={() => handleSelectJob(job.value)}
          onMouseEnter={() => handleMouseEnter(job.value)}
          onMouseLeave={handleMouseLeave}
          style={{ userSelect: 'none', width: '100%' }}
        >
          {selectedJob === job.value && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary transform rotate-180 translate-x-[10px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {/* 직업 이름 */}
          <span
            className={`
              flex-grow text-center 
              ${selectedJob === job.value ? 'text-primary font-bold' : 'text-gray-300 hover:text-primary'}
            `}
          >
            {job.name}
          </span>
        </li>
      ))}
    </ul>

    {/* 작은 화면용 드롭다운 */}
    <div className="block lg:hidden relative left-0 w-full z-[20] bg-fillStrong p-2 shadow-md rounded-lg">
      <select
        className="p-2 text-xl bg-black text-white rounded-lg w-full border border-gray-500 
                   transition-all duration-300 ease-in-out focus:border-blue-500 focus:bg-gray-800 hover:bg-gray-900"
        value={selectedJob}
        onChange={(e) => handleSelectJob(e.target.value)}
        style={{ userSelect: 'none' }}
      >
        {memoizedJobCategories.map((job) => (
          <option key={job.value} value={job.value}>
            {job.name}
          </option>
        ))}
      </select>
    </div>
  </>
);
};

export default JobFilter;