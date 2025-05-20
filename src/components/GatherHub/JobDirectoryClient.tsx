"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserStore } from "@/stores/useUserStore";
import JobFilter from "./JobFilter";
import HubRegister from "./HubRegister";
import LoginModal from "./LoginModal";
import { jobCategories } from "@/lib/gatherHub";

interface JobDirectoryClientProps {
    initialJob?: string;
}

const JobDirectoryClient = ({ initialJob = "all" }: JobDirectoryClientProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { isAuthenticated } = useAuth();
    const { userData } = useUserStore();
    const isHubRegistered = useMemo(() => userData?.hubCard ?? false, [userData]);

    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <HubRegister
                isAuthenticated={isAuthenticated}
                isHubRegistered={isHubRegistered}
                openLoginModal={() => setIsModalOpen(true)}
            />
            <LoginModal
                isModalOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
            />
        </aside>
    );
};

export default JobDirectoryClient;