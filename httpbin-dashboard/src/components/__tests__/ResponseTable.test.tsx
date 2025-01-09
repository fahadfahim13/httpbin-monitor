import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResponseTable } from '../ResponseTable';
import { HttpbinResponse } from '../../types';

const mockResponses: HttpbinResponse[] = [
  {
    _id: '1',
    timestamp: new Date().toISOString(),
    requestPayload: { key: 'value1' },
    responseData: { data: 'response1' },
  },
  {
    _id: '2',
    timestamp: new Date().toISOString(),
    requestPayload: { key: 'value2' },
    responseData: { data: 'response2' },
  },
];

describe('ResponseTable', () => {
  it('renders table headers correctly', () => {
    const { getByText } = render(<ResponseTable responses={[]} />);
    expect(getByText('Timestamp')).toBeInTheDocument();
    expect(getByText('Request Payload')).toBeInTheDocument();
    expect(getByText('Response Data')).toBeInTheDocument();
  });

  it('renders response rows correctly', () => {
    const { getAllByText } = render(<ResponseTable responses={mockResponses} />);
    mockResponses.forEach((response) => {
      const requestPayloadElements = getAllByText((content, element) => {
        return element?.textContent === JSON.stringify(response.requestPayload, null, 2);
      });
      const responseDataElements = getAllByText((content, element) => {
        return element?.textContent === JSON.stringify(response.responseData, null, 2);
      });
      expect(requestPayloadElements.length).toBeGreaterThan(0);
      expect(responseDataElements.length).toBeGreaterThan(0);
    });
  });

  it('renders no rows when responses are empty', () => {
    const { container } = render(<ResponseTable responses={[]} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });
});
