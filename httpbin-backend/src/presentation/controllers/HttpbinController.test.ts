import { HttpbinController } from '../../../src/presentation/controllers/HttpbinController';
import { HttpbinResponseRepository } from '../../../src/application/interfaces/repositories/HttpbinResponseRepository';
import { Request, Response } from 'express';

describe('HttpbinController', () => {
  let controller: HttpbinController;
  let repository: jest.Mocked<HttpbinResponseRepository>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
    };
    controller = new HttpbinController(repository);
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('should return all responses', async () => {
      const mockResponses = [
        { id: 1, timestamp: new Date(), requestPayload: {}, responseData: {} },
        { id: 2, timestamp: new Date(), requestPayload: {}, responseData: {} }
      ];
      repository.findAll.mockResolvedValue(mockResponses);

      await controller.getAll(req as Request, res as Response);

      expect(repository.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockResponses);
    });

    it('should handle errors', async () => {
      repository.findAll.mockRejectedValue(new Error('Database error'));

      await controller.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getByDateRange', () => {
    it('should return responses within date range', async () => {
      const mockResponses = [{ id: 1, timestamp: new Date(), requestPayload: {}, responseData: {} }];
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      req = {
        query: { startDate, endDate }
      };
      repository.findByDateRange.mockResolvedValue(mockResponses);

      await controller.getByDateRange(req as Request, res as Response);

      expect(repository.findByDateRange).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate)
      );
      expect(res.json).toHaveBeenCalledWith(mockResponses);
    });
  });
});