"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobFilter from "./JobFilter";
import { jobCategories } from "@/lib/gatherHub";

interface JobDirectoryClientProps {
    initialJob?: string;
}

const JobDirectoryClient = ({ initialJob = "all" }: JobDirectoryClientProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedJob, setSelectedJob] = useState(initialJob);

    useEffect(() => {
        setSelectedJob(initialJob);
    }, [initialJob]);

    const handleSelectJob = (value: string) => {
        const newParams = new URLSearchParams(Array.from(searchParams.entries()));
        newParams.set("job", value);
        newParams.set("page", "1"); // 필터 변경 시 페이지도 초기화
        router.push(`?${newParams.toString()}`);
    };

    return (
        <aside className="p-1 rounded-lg relative user-select-none">
            <JobFilter
                selectedJob={selectedJob}
                handleSelectJob={handleSelectJob}
                jobCategories={jobCategories}
            />
        </aside>
    );
};

export default JobDirectoryClient;