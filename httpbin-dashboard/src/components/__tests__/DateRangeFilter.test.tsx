import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateRangeFilter } from '../DateRangeFilter';

describe('DateRangeFilter', () => {
  it('renders start and end date inputs correctly', () => {
    const { getByLabelText } = render(
      <DateRangeFilter 
        startDate="" 
        setStartDate={() => {}} 
        endDate="" 
        setEndDate={() => {}} 
        handleFilter={() => {}} 
        clearFilter={() => {}} 
      />
    );
    expect(getByLabelText('Start Date')).toBeInTheDocument();
    expect(getByLabelText('End Date')).toBeInTheDocument();
  });

  it('calls setStartDate and setEndDate with correct values when dates are changed', () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();
    const { getByLabelText } = render(
      <DateRangeFilter 
        startDate="" 
        setStartDate={setStartDate} 
        endDate="" 
        setEndDate={setEndDate} 
        handleFilter={() => {}} 
        clearFilter={() => {}} 
      />
    );
    
    const startDateInput = getByLabelText('Start Date');
    const endDateInput = getByLabelText('End Date');
    
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-01-31' } });
    
    expect(setStartDate).toHaveBeenCalledWith('2023-01-01');
    expect(setEndDate).toHaveBeenCalledWith('2023-01-31');
  });

  it('renders the correct initial values for start and end dates', () => {
    const { getByLabelText } = render(
      <DateRangeFilter 
        startDate="2023-01-01" 
        setStartDate={() => {}} 
        endDate="2023-01-31" 
        setEndDate={() => {}} 
        handleFilter={() => {}} 
        clearFilter={() => {}} 
      />
    );
    expect(getByLabelText('Start Date')).toHaveValue('2023-01-01');
    expect(getByLabelText('End Date')).toHaveValue('2023-01-31');
  });
});
