import axios from 'axios';
import { HttpbinResponseRepository } from '../interfaces/repositories/HttpbinResponseRepository';
import { WebSocketService } from '../interfaces/services/WebSocketService';

export class MonitorHttpbin {
    constructor(
      private readonly repository: HttpbinResponseRepository,
      private readonly wsService: WebSocketService
    ) {}
  
    async execute(): Promise<void> {
      try {
        const requestPayload = this.generateRandomPayload();
        const response = await axios.post('https://httpbin.org/post', requestPayload);
  
        const httpbinResponse = {
          timestamp: new Date(),
          requestPayload,
          responseData: response.data
        };

        console.log(httpbinResponse);
  
        const savedResponse = await this.repository.save(httpbinResponse);
        this.wsService.broadcast('new-response', savedResponse);
      } catch (error) {
        console.error('Error monitoring httpbin:', error);
      }
    }
  
    private generateRandomPayload(): any {
      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        data: {
          value: Math.random() * 100,
          message: `Random message ${Math.random().toString(36).substring(7)}`,
          array: Array.from({ length: 3 }, () => Math.floor(Math.random() * 100))
        }
      };
    }
  }