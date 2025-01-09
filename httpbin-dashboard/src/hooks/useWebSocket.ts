import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { httpbinApi } from '../store/services/httpbin';
import { useDispatch } from 'react-redux';
import { HttpbinResponse } from '../types';

interface UseWebSocketProps {
  onNewResponse: (response: HttpbinResponse) => void;
}

let socket: Socket | null = null;

export const useWebSocket = ({ onNewResponse }: UseWebSocketProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8000');

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('new-response', (data: HttpbinResponse) => {
        dispatch(
          httpbinApi.util.updateQueryData('getResponses', undefined, (draft) => {
            draft.unshift(data);
            // eslint-disable-next-line
          }) as any
        );
        onNewResponse(data)
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch]);

  return socket;
};