import React from 'react';
import { JobFilterProps } from '@/lib/gatherHub';

const JobFilter: React.FC<JobFilterProps> = ({ selectedJob, handleSelectJob, jobCategories }) => {
  return (
    <>
      {/* 큰 화면용 리스트 */}
      <ul className="hidden lg:block job-list flex-col gap-1 p-5 space-y-2 shadow mt-6 mb-6 w-[120px] h-[445px]">
        {jobCategories.map((job) => (
          <li
            key={job.value}
            className={`job-item ${selectedJob === job.value ? 'bg-background text-primary font-bold' : 'text-gray-400'}`}
            onClick={() => handleSelectJob(job.value)}
          >
            {selectedJob === job.value && <span>▶</span>}
            {job.name}
          </li>
        ))}
      </ul>

      {/* 작은 화면용 드롭다운 */}
      <div className="block lg:hidden">
        <select
          className="p-2 text-xl bg-black text-white rounded-lg w-full border border-gray-500"
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