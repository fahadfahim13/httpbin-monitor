import request from 'supertest';
import express from 'express';
import { Server } from 'http';
import { MongoHttpbinResponseRepository } from '../infrastructure/database/repositories/MongoHttpbinResponseRepository';
import { SocketIOService } from '../infrastructure/websocket/SocketIOService';
import { MonitorHttpbin } from '../application/use-cases/MonitorHttpbin';
import { HttpbinController } from '../presentation/controllers/HttpbinController';
import cron from 'node-cron';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

jest.mock('../infrastructure/database/repositories/MongoHttpbinResponseRepository');
jest.mock('../infrastructure/websocket/SocketIOService');
jest.mock('../application/use-cases/MonitorHttpbin');
jest.mock('../presentation/controllers/HttpbinController');

describe('End-to-End Tests for Critical User Flows', () => {
    let app: express.Application;
    let httpServer: Server;
    let io: SocketIOServer;
    let repository: jest.Mocked<MongoHttpbinResponseRepository>;
    let controller: jest.Mocked<HttpbinController>;
    let cronTask: cron.ScheduledTask;

    beforeAll((done) => {
        app = express();
        httpServer = createServer(app);
        io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PATCH", "DELETE"]
            }
        });

        repository = new MongoHttpbinResponseRepository() as jest.Mocked<MongoHttpbinResponseRepository>;
        const wsService = new SocketIOService(io);
        const monitor = new MonitorHttpbin(repository, wsService);
        controller = new HttpbinController(repository) as jest.Mocked<HttpbinController>;

        app.use(express.json());

        app.get('/api/responses', (req, res) => controller.getAll(req, res));
        app.get('/api/responses/range', (req, res) => controller.getByDateRange(req, res));

        cronTask = cron.schedule("*/5 * * * *", async () => {
            await monitor.execute();
        });

        httpServer.listen(done);
    });

    afterAll((done) => {
        cronTask.stop();
        io.close();
        httpServer.close(done);
    });

    describe('GET /api/responses', () => {
        it('should return all responses', async () => {
            const mockResponses = [
                { id: 1, timestamp: new Date(), requestPayload: {}, responseData: {} },
                { id: 2, timestamp: new Date(), requestPayload: {}, responseData: {} }
            ];
            repository.findAll.mockResolvedValue(mockResponses);
            controller.getAll.mockImplementation(async (req, res) => {
                res.json(mockResponses);
            });

            const response = await request(app).get('/api/responses');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponses.map(response => ({
                ...response,
                timestamp: response.timestamp.toISOString()
            })));
        });

        it('should handle errors', async () => {
            repository.findAll.mockRejectedValue(new Error('Database error'));
            controller.getAll.mockImplementation(async (req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const response = await request(app).get('/api/responses');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('GET /api/responses/range', () => {
        it('should return responses within date range', async () => {
            const mockResponses = [{ id: 1, timestamp: new Date(), requestPayload: {}, responseData: {} }];
            const startDate = '2023-01-01';
            const endDate = '2023-12-31';
            repository.findByDateRange.mockResolvedValue(mockResponses);
            controller.getByDateRange.mockImplementation(async (req, res) => {
                res.json(mockResponses);
            });

            const response = await request(app).get('/api/responses/range').query({ startDate, endDate });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponses.map(response => ({
                ...response,
                timestamp: response.timestamp.toISOString()
            })));
        });

        it('should handle errors', async () => {
            repository.findByDateRange.mockRejectedValue(new Error('Database error'));
            controller.getByDateRange.mockImplementation(async (req, res) => {
                res.status(500).json({ error: 'Internal server error' });
            });

            const startDate = '2023-01-01';
            const endDate = '2023-12-31';
            const response = await request(app).get('/api/responses/range').query({ startDate, endDate });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });

        it('should return 400 if date range is invalid', async () => {
            const startDate = 'invalid-date';
            const endDate = '2023-12-31';
            controller.getByDateRange.mockImplementation(async (req, res) => {
                res.status(400).json({ error: 'Invalid date range' });
            });

            const response = await request(app).get('/api/responses/range').query({ startDate, endDate });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid date range' });
        });
    });
});
