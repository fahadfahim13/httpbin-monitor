import { Server } from 'socket.io';
import { WebSocketService } from '../../application/interfaces/services/WebSocketService';

export class SocketIOService implements WebSocketService {
  constructor(private readonly io: Server) {}

  broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }
}