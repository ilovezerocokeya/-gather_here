'use client';

import React from 'react';
import FormInput from '@/components/MainDetail/components/form/FormInput';
import FormDropdown from '@/components/MainDetail/components/form/FormDropdown';
import { PostFormState } from './postFormTypes';
import { categoryOptions, placeOptions, locationOptions, durationOptions, totalMembersOptions,} from '@/lib/postFormOptions';

interface PostFormInputsProps {
  state: PostFormState;
  handleInputChange: (key: keyof PostFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PostFormInputs = ({ state, handleInputChange }: PostFormInputsProps) => {
  return (
    <div className="space-y-4 bg-fillStrong p-4 rounded-lg">
      <div>
        <h2 className="text-lg text-labelNormal font-semibold mb-2">
          제목 <span className="text-red-500">*</span>
        </h2>
        <FormInput
          label=""
          value={state.title}
          onChange={handleInputChange('title')}
          maxLength={50}
          placeholder="제목을 입력해주세요"
        />
        <p className="text-sm text-labelNeutral">
          제목은 50자 내로 작성해주세요. ({state.title.length}/50)
        </p>
      </div>

      <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
        <FormDropdown
          label="분류"
          options={categoryOptions}
          value={state.category}
          onChange={handleInputChange('category')}
          placeholder="분류를 선택해주세요"
        />
        <FormDropdown
          label="방식"
          options={placeOptions}
          value={state.place}
          onChange={handleInputChange('place')}
          placeholder="진행 방식을 선택해주세요"
        />
        <FormDropdown
          label="지역"
          options={locationOptions}
          value={state.location}
          onChange={handleInputChange('location')}
          placeholder="지역을 선택해주세요"
        />
        <FormDropdown
          label="기간"
          options={durationOptions}
          value={state.duration}
          onChange={handleInputChange('duration')}
          placeholder="기간을 선택해주세요"
        />
        <FormDropdown
          label="총 인원"
          options={totalMembersOptions}
          value={state.totalMembers}
          onChange={handleInputChange('totalMembers')}
          placeholder="총 인원을 선택해주세요"
        />
        <FormInput
          label="연락 방법"
          value={state.personalLink}
          onChange={handleInputChange('personalLink')}
          placeholder="이메일이나 연락처를 입력해주세요"
        />
      </div>
    </div>
  );
};

export default PostFormInputs;