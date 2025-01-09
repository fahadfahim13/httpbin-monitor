import { HttpbinResponse } from '../../../domain/entities/HttpbinResponse';

export interface HttpbinResponseRepository {
  save(response: HttpbinResponse): Promise<HttpbinResponse>;
  findAll(): Promise<HttpbinResponse[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<HttpbinResponse[]>;
}