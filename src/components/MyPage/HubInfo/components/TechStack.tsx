"use client";

import Image from "next/image";
import { techStacks } from "@/lib/generalOptionStacks";

interface TechStackProps {
  selectedStacks: string[]; 
  setSelectedStacks: (value: string[]) => void;
}

// TechStack 컴포넌트
const TechStack: React.FC<TechStackProps> = ({ selectedStacks, setSelectedStacks }) => {
  // 기술 스택 선택/해제 핸들러
  const handleSelectStack = (stackId: string) => {
    if (selectedStacks.includes(stackId)) {
      // 이미 선택된 경우 제거
      setSelectedStacks(selectedStacks.filter((id) => id !== stackId));
    } else if (selectedStacks.length < 10) {
      // 최대 10개까지 선택 허용
      setSelectedStacks([...selectedStacks, stackId]);
    } else {
      alert("최대 10개의 기술 스택만 선택할 수 있습니다.");
    }
  };

  return (
    <div className="ml-5 mb-5">
      <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">기술 스택 선택</h1>

      {/* 스택 선택 UI */}
      <div className="flex flex-wrap gap-4">
        {techStacks.map((stack) => (
          <button
            key={stack.id}
            onClick={() => handleSelectStack(stack.id)}
            className={`tech-stack-button flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer gap-2
              ${selectedStacks.includes(stack.id)
                ? "border-primary border-2 bg-fillLight text-primary"
                : "bg-fillLight text-labelNormal"}`}
          >
            <Image
              src={stack.image}
              alt={stack.name}
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className="tech-stack-text">{stack.name}</span>
          </button>
        ))}
      </div>

      {/* 텍스트 숨김 처리 */}
      <style jsx>{`
        .tech-stack-button {
          white-space: nowrap;
          min-height: 50px;
          padding: 8px 16px;
        }

        @media (max-width: 734px) {
          .tech-stack-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TechStack;