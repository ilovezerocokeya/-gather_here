'use client';

import React from 'react';
import Select from 'react-select';
import { useId } from 'react';
import { customSelectStyles } from './style/customSelectStyle';

export interface Option {
  value: string;
  label: string;
}

interface FormMultiSelectProps {
  label: string;
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  className?: string;
  placeholder?: string;
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  className,
  placeholder,
}) => {
  const instanceId = useId();

  return (
    <div className="mb-4">
      <label className="block text-labelNormal text-sm font-bold mb-2">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <Select<Option, true>
        isMulti
        value={value}
        onChange={(selected) => onChange([...selected ?? []])}
        options={options}
        styles={customSelectStyles}
        className={className}
        classNamePrefix="select"
        instanceId={instanceId}
        placeholder={placeholder}
        components={{ IndicatorSeparator: () => null }}
      />
    </div>
  );
};

export default FormMultiSelect;