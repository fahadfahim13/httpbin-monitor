import { Request, Response } from 'express';
import { HttpbinResponseRepository } from '../../application/interfaces/repositories/HttpbinResponseRepository';

export class HttpbinController {
  constructor(private readonly repository: HttpbinResponseRepository) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const responses = await this.repository.findAll();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const responses = await this.repository.findByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
