import { StylesConfig, GroupBase } from 'react-select';
import { Option } from '../FormMultiSelect';

export const customSelectStyles: StylesConfig<Option, true, GroupBase<Option>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#3B3D3F',
    border: state.isFocused ? '1px solid #C3E88D' : '1px solid #3B3D3F',
    color: '#919191',
    padding: '2px 8px',
    borderRadius: '7px',
    boxShadow: 'none',
    minHeight: '45px',
    '&:hover': {
      borderColor: '#C3E88D',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#3B3D3F',
    borderColor: '#3B3D3F',
    color: '#ffffff',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#19191A',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#C4C4C4',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#5E5E5E',
    ':hover': {
      backgroundColor: '#19191A',
      color: '#919191',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#919191',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
  input: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#19191A' : '#3B3D3F',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#28282A',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: '#919191',
    padding: '5px',
    cursor: 'pointer',
    ':hover': {
      color: '#FF3F02',
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#919191',
    padding: '0px',
    cursor: 'pointer',
    ':hover': {
      color: '#5E5E5E',
    },
  }),
};