import { useState } from "react";
import { useWebSocket } from "./useWebSocket";
import {
  useGetResponsesByDateRangeQuery,
  useGetResponsesQuery,
} from "@/store/services/httpbin";

const useDashboardFunctionalities = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  const { data: filteredResponses = [] } =
    useGetResponsesByDateRangeQuery(
      { startDate, endDate },
      { skip: !isFiltering }
    );

  const handleFilter = () => {
    setIsFiltering(true);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFiltering(false);
  };

  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const { data: responses = [], error, isLoading } = useGetResponsesQuery();

  // Initialize WebSocket
  useWebSocket({
    onNewResponse: () => {
      setLastUpdateTime(new Date().toLocaleString());
    },
  });

  return {
    startDate,
    endDate,
    setEndDate,
    setStartDate,
    handleFilter,
    clearFilter,
    isFiltering,
    lastUpdateTime,
    responses,
    filteredResponses,
    isLoading,
    error,
  };
};

export default useDashboardFunctionalities;
