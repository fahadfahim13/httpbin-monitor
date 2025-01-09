import { HttpbinResponse } from '../../../domain/entities/HttpbinResponse';
import { HttpbinResponseRepository } from '../../../application/interfaces/repositories/HttpbinResponseRepository';
import { HttpbinResponseModel } from '../models/HttpbinResponseModel';
import logger from '../../logger';

export class MongoHttpbinResponseRepository
  implements HttpbinResponseRepository
{
  async save(response: HttpbinResponse): Promise<HttpbinResponse> {
    try {
      logger.info('Saving response:', response);
      const model = new HttpbinResponseModel(response);
      const savedResponse = await model.save();
      logger.info('Response saved successfully:', savedResponse);
      return savedResponse;
    } catch (error) {
      logger.error('Error saving response:', error);
      throw error;
    }
  }

  async findAll(): Promise<HttpbinResponse[]> {
    try {
      logger.info('Fetching all responses');
      const result = await HttpbinResponseModel.find()
        .sort({ timestamp: -1 })
        .exec();
      logger.info('Fetched responses:', result);
      return result;
    } catch (error) {
      logger.error('Error fetching all responses:', error);
      throw error;
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<HttpbinResponse[]> {
    try {
      logger.info(`Fetching responses from ${startDate} to ${endDate}`);
      const result = await HttpbinResponseModel.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .sort({ timestamp: -1 })
        .exec();
      logger.info('Fetched responses:', result);
      return result;
    } catch (error) {
      logger.error(
        `Error fetching responses from ${startDate} to ${endDate}:`,
        error,
      );
      throw error;
    }
  }
}
