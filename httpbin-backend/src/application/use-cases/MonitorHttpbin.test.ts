import { MonitorHttpbin } from '../../../src/application/use-cases/MonitorHttpbin';
import { HttpbinResponseRepository } from '../../../src/application/interfaces/repositories/HttpbinResponseRepository';
import { WebSocketService } from '../../../src/application/interfaces/services/WebSocketService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MonitorHttpbin', () => {
  let repository: jest.Mocked<HttpbinResponseRepository>;
  let wsService: jest.Mocked<WebSocketService>;
  let monitor: MonitorHttpbin;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
    };
    wsService = {
      broadcast: jest.fn(),
    };
    monitor = new MonitorHttpbin(repository, wsService);
  });

  it('should successfully monitor httpbin and save response', async () => {
    const mockResponse = {
      data: { test: 'response' },
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    await monitor.execute();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://httpbin.org/post',
      expect.any(Object),
    );

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Date),
        requestPayload: expect.any(Object),
        responseData: mockResponse.data,
      }),
    );
    expect(wsService.broadcast).toHaveBeenCalled();
  });
});
