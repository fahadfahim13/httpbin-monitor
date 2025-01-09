import mongoose, { Schema } from 'mongoose';
import { HttpbinResponse } from '../../../domain/entities/HttpbinResponse';

const httpbinResponseSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    requestPayload: { type: Schema.Types.Mixed, required: true },
    responseData: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const HttpbinResponseModel = mongoose.model<HttpbinResponse>(
  'HttpbinResponse',
  httpbinResponseSchema,
);
