'use client';

import React from 'react';
import { PostFormState, Option } from './postFormTypes';
import FormDropdown from '@/components/MainDetail/components/form/FormDropdown';
import FormMultiSelect from '@/components/MainDetail/components/form/FormMultiSelect';
import FormInput from '@/components/MainDetail/components/form/FormInput';
import { techStackOptions, recruitmentCountOptions, targetPositionOptions } from '@/lib/postFormOptions';

interface PostFormRecruitProps {
  state: PostFormState;
  handleInputChange: (key: keyof PostFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleMultiSelectChange: (key: 'targetPosition' | 'techStack') => (selected: Option[]) => void;
}


const PostFormRecruit = ({
  state,
  handleInputChange,
  handleMultiSelectChange,
}: PostFormRecruitProps) => {
  return (
    <div className="space-y-4 bg-fillStrong p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-labelNeutral mb-2">모집 정보</h2>
      <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
        <div className="space-y-2">
          <FormMultiSelect
            label="모집 대상"
            options={targetPositionOptions}
            value={state.targetPosition}
            onChange={handleMultiSelectChange('targetPosition')}
            placeholder="모집 대상을 선택해주세요"
          />
          <p className="text-sm text-labelNeutral mb-1">다중 선택이 가능해요.</p>
        </div>

        <FormDropdown
          label="모집 인원"
          options={recruitmentCountOptions}
          value={state.recruitmentCount}
          onChange={handleInputChange('recruitmentCount')}
          placeholder="모집 인원을 선택해주세요"
        />

        <div className="space-y-2">
          <FormMultiSelect
            label="기술 스택"
            options={techStackOptions}
            value={state.techStack}
            onChange={handleMultiSelectChange('techStack')}
            placeholder="기술 스택을 선택해주세요"
          />
          <p className="text-sm text-labelNeutral">다중 선택이 가능해요.</p>
        </div>

        <FormInput
          label="마감일"
          type="date"
          value={state.deadline}
          onChange={handleInputChange('deadline')}
        />
      </div>
    </div>
  );
};

export default PostFormRecruit;