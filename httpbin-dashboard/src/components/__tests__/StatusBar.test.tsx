import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusBar } from '../StatusBar';

describe('StatusBar', () => {
  it('renders total responses correctly', () => {
    const { getByText } = render(<StatusBar totalResponses={5} lastUpdateTime={null} />);
    expect(getByText('Total Responses')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('renders last update time correctly when provided', () => {
    const lastUpdateTime = new Date().toISOString();
    const { getByText } = render(<StatusBar totalResponses={5} lastUpdateTime={lastUpdateTime} />);
    expect(getByText('Last Update')).toBeInTheDocument();
    expect(getByText(new Date(lastUpdateTime).toLocaleTimeString())).toBeInTheDocument();
  });

  it('renders "N/A" when last update time is not provided', () => {
    const { getByText } = render(<StatusBar totalResponses={5} lastUpdateTime={null} />);
    expect(getByText('Last Update')). toBeInTheDocument();
    expect(getByText('N/A')).toBeInTheDocument();
  });
});
