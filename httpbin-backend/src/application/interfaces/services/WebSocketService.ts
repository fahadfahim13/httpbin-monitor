export interface WebSocketService {
  broadcast(event: string, data: any): void;
}
