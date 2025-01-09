import { HttpbinResponseModel } from '../models/HttpbinResponseModel';
import { MongoHttpbinResponseRepository } from './MongoHttpbinResponseRepository';

jest.mock('../models/HttpbinResponseModel');

describe('MongoHttpbinResponseRepository', () => {
  let repository: MongoHttpbinResponseRepository;
  const mockResponse = {
    timestamp: new Date(),
    requestPayload: { test: 'request' },
    responseData: { test: 'response' },
  };

  beforeEach(() => {
    repository = new MongoHttpbinResponseRepository();
    jest.clearAllMocks();
  });

  it('should save httpbin response', async () => {
    const mockSave = jest.fn().mockResolvedValue(mockResponse);
    (HttpbinResponseModel as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await repository.save(mockResponse);

    expect(HttpbinResponseModel).toHaveBeenCalledWith(mockResponse);
    expect(result).toEqual(mockResponse);
  });

  it('should find all responses', async () => {
    const mockResponses = [mockResponse];
    const mockExec = jest.fn().mockResolvedValue(mockResponses);
    const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    HttpbinResponseModel.find = mockFind;

    const result = await repository.findAll();

    expect(mockFind).toHaveBeenCalled();
    expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });
    expect(result).toEqual(mockResponses);
  });

  it('should find responses by date range', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const mockResponses = [mockResponse];
    const mockExec = jest.fn().mockResolvedValue(mockResponses);
    const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    HttpbinResponseModel.find = mockFind;

    const result = await repository.findByDateRange(startDate, endDate);

    expect(mockFind).toHaveBeenCalledWith({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    expect(result).toEqual(mockResponses);
  });
});
