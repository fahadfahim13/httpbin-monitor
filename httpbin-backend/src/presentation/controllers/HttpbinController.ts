import { Request, Response } from 'express';
import { HttpbinResponseRepository } from '../../application/interfaces/repositories/HttpbinResponseRepository';
import logger from '../../infrastructure/logger';

export class HttpbinController {
  constructor(private readonly repository: HttpbinResponseRepository) {}

  async getAll(req: Request, res: Response): Promise<void> {
    logger.info('Received request to get all responses');
    try {
      const responses = await this.repository.findAll();
      logger.info('Successfully retrieved all responses', { count: responses.length });
      res.json(responses);
    } catch (error) {
      logger.error('Error retrieving all responses', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByDateRange(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = req.query;
    logger.info('Received request to get responses by date range', { startDate, endDate });
    try {
      const responses = await this.repository.findByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      logger.info('Successfully retrieved responses by date range', { count: responses.length });
      res.json(responses);
    } catch (error) {
      logger.error('Error retrieving responses by date range', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
