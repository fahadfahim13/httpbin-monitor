import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from '../Dashboard';
import useDashboardFunctionalities from '../../hooks/useDashboardFunctionalities';

jest.mock('../../hooks/useDashboardFunctionalities', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    (useDashboardFunctionalities as jest.Mock).mockReturnValue({});
  });
  it('renders loading state correctly', () => {
    (useDashboardFunctionalities as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      setEndDate: jest.fn(),
      setStartDate: jest.fn(),
      startDate: '',
      endDate: '',
      handleFilter: jest.fn(),
      clearFilter: jest.fn(),
      isFiltering: false,
      filteredResponses: [],
      responses: [],
      lastUpdateTime: null,
    });

    const { getByText } = render(<Dashboard />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (useDashboardFunctionalities as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Test error'),
      setEndDate: jest.fn(),
      setStartDate: jest.fn(),
      startDate: '',
      endDate: '',
      handleFilter: jest.fn(),
      clearFilter: jest.fn(),
      isFiltering: false,
      filteredResponses: [],
      responses: [],
      lastUpdateTime: null,
    });

    const { getByText } = render(<Dashboard />);
    expect(getByText('Error: Test error')).toBeInTheDocument();
  });

  it('renders dashboard correctly with data', () => {
    (useDashboardFunctionalities as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      setEndDate: jest.fn(),
      setStartDate: jest.fn(),
      startDate: '',
      endDate: '',
      handleFilter: jest.fn(),
      clearFilter: jest.fn(),
      isFiltering: false,
      filteredResponses: [],
      responses: [
        {
          _id: '1',
          timestamp: new Date().toISOString(),
          requestPayload: { key: 'value1' },
          responseData: { data: 'response1' },
        },
      ],
      lastUpdateTime: new Date().toISOString(),
    });

    const { getByText } = render(<Dashboard />);
    expect(getByText('Httpbin Response Monitor')).toBeInTheDocument();
    expect(getByText('Total Responses')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('Last Update')).toBeInTheDocument();
  });
});
