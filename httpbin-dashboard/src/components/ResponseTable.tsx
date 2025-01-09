import React from 'react';
import { HttpbinResponse } from '../types';

interface ResponseTableProps {
  responses: HttpbinResponse[];
}

export const ResponseTable: React.FC<ResponseTableProps> = ({ responses }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Request Payload
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Data
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((response) => (
            <tr key={response._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(response.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <pre className="max-w-xs overflow-x-auto">
                  {JSON.stringify(response.requestPayload, null, 2)}
                </pre>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <pre className="max-w-xs overflow-x-auto">
                  {JSON.stringify(response.responseData, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};