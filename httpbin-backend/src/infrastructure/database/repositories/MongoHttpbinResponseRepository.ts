import { HttpbinResponse } from '../../../domain/entities/HttpbinResponse';
import { HttpbinResponseRepository } from '../../../application/interfaces/repositories/HttpbinResponseRepository';
import { HttpbinResponseModel } from '../models/HttpbinResponseModel';

export class MongoHttpbinResponseRepository implements HttpbinResponseRepository {
  async save(response: HttpbinResponse): Promise<HttpbinResponse> {
    const model = new HttpbinResponseModel(response);
    return await model.save();
  }

  async findAll(): Promise<HttpbinResponse[]> {
    return await HttpbinResponseModel.find().sort({ timestamp: -1 }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<HttpbinResponse[]> {
    return await HttpbinResponseModel.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: -1 }).exec();
  }
}