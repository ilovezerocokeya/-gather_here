import React from 'react';
import { JobFilterProps } from '@/lib/gatherHub';

const JobFilter: React.FC<JobFilterProps> = ({ selectedJob, handleSelectJob, jobCategories }) => {
  
  return (
    <>
      {/* 큰 화면용 리스트 */}
      <ul className="hidden lg:block job-list flex-col pt-4 shadow mb-6 w-[120px] h-[470px] rounded-[30px] bg-fillStrong">
        {jobCategories.map((job) => (
          <li
            key={job.value}
            className={`job-item flex items-center gap-2 justify-center cursor-pointer rounded-lg p-2 transition-all duration-300 
            ${selectedJob === job.value ? 'bg-background text-primary font-bold' : 'text-gray-400'} 
            hover:bg-background hover:text-primary first:mt-2 last:mb-2`}
            onClick={() => handleSelectJob(job.value)}
          >
            {selectedJob === job.value && <span className="text-primary">▶</span>}
            {job.name}
          </li>
        ))}
      </ul>

      {/* 작은 화면용 드롭다운 */}
      <div className="block lg:hidden">
        <select
          className="p-2 text-xl bg-black text-white rounded-lg w-full border border-gray-500 transition-all duration-300 focus:border-blue-500 focus:bg-gray-800 hover:bg-gray-900"
          value={selectedJob}
          onChange={(e) => handleSelectJob(e.target.value)}
        >
          {jobCategories.map((job) => (
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