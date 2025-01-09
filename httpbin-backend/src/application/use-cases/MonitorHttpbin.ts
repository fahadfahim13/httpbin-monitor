import axios from 'axios';
import { HttpbinResponseRepository } from '../interfaces/repositories/HttpbinResponseRepository';
import { WebSocketService } from '../interfaces/services/WebSocketService';
import logger from '../../infrastructure/logger';

export class MonitorHttpbin {
    constructor(
      private readonly repository: HttpbinResponseRepository,
      private readonly wsService: WebSocketService
    ) {}
  
    async execute(): Promise<void> {
      try {
      logger.info('Starting execute method');
      
      const requestPayload = this.generateRandomPayload();
      logger.debug('Generated request payload:', requestPayload);
      
      const response = await axios.post('https://httpbin.org/post', requestPayload);
      logger.debug('Received response from httpbin:', response.data);
    
      const httpbinResponse = {
        timestamp: new Date(),
        requestPayload,
        responseData: response.data
      };
      logger.info('Constructed httpbinResponse object:', httpbinResponse);

      logger.info('Saving response to repository');
      const savedResponse = await this.repository.save(httpbinResponse);
      logger.debug('Saved response:', savedResponse);

      logger.info('Broadcasting response via WebSocket');
      this.wsService.broadcast('new-response', savedResponse);
      
      logger.info('Execute method completed successfully');
      } catch (error) {
      logger.error('Error monitoring httpbin:', error);
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