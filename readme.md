# Httpbin Monitor - Technical Documentation

## Table of Contents
- [Overview](#overview)
- [Backend Architecture](#backend-architecture)
  - [Clean Architecture](#clean-architecture)
  - [Core Components](#core-components)
  - [API Endpoints](#api-endpoints)
  - [WebSocket Implementation](#websocket-implementation)
- [Frontend Architecture](#frontend-architecture)
  - [State Management](#state-management)
  - [Real-time Updates](#real-time-updates)
  - [Components](#components)
- [Installation & Setup](#installation--setup)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Deployment](#deployment)

## Overview

This project implements a real-time monitoring system for httpbin.org responses. It consists of a Node.js backend built with Clean Architecture principles and a Next.js frontend with RTK Query for state management.

### Tech Stack

Backend:
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- Socket.IO
- Clean Architecture
- Docker

Frontend:
- Next.js
- TypeScript
- RTK Query
- Socket.IO Client
- Tailwind CSS

## Backend Architecture

### Clean Architecture

The backend follows Clean Architecture principles with four main layers:

1. **Domain Layer** (`src/domain/`)
   - Contains business entities and interfaces
   - Technology-agnostic
   ```typescript
   // Example: HttpbinResponse entity
   interface HttpbinResponse {
     _id?: string;
     timestamp: Date;
     requestPayload: any;
     responseData: any;
   }
   ```

2. **Application Layer** (`src/application/`)
   - Contains use cases and business logic
   - Depends only on the domain layer
   ```typescript
   // Example: MonitorHttpbin use case
   class MonitorHttpbin {
     constructor(
       private repository: HttpbinResponseRepository,
       private wsService: WebSocketService
     ) {}
     
     async execute(): Promise<void> {
       // Implementation
     }
   }
   ```

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Contains implementations of interfaces
   - Handles external concerns (database, HTTP, etc.)
   ```typescript
   // Example: MongoDB Repository implementation
   class MongoHttpbinResponseRepository implements HttpbinResponseRepository {
     async save(response: HttpbinResponse): Promise<HttpbinResponse> {
       // Implementation
     }
   }
   ```

4. **Presentation Layer** (`src/presentation/`)
   - Contains controllers and route handlers
   - Handles HTTP requests and responses

### Core Components

#### Database Models
```typescript
const httpbinResponseSchema = new Schema({
  timestamp: { type: Date, required: true },
  requestPayload: { type: Schema.Types.Mixed, required: true },
  responseData: { type: Schema.Types.Mixed, required: true }
});
```

#### Repository Pattern
```typescript
interface HttpbinResponseRepository {
  save(response: HttpbinResponse): Promise<HttpbinResponse>;
  findAll(): Promise<HttpbinResponse[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<HttpbinResponse[]>;
}
```

### API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/responses` | GET | Fetch all responses |
| `/api/responses/range` | GET | Fetch responses by date range |

### WebSocket Implementation

- Uses Socket.IO for real-time communication
- Broadcasts new responses to connected clients
- Handles automatic reconnection

## Frontend Architecture

### State Management

#### RTK Query Setup
```typescript
export const httpbinApi = createApi({
  reducerPath: 'httpbinApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL 
  }),
  endpoints: (builder) => ({
    getResponses: builder.query<HttpbinResponse[], void>({
      query: () => '/api/responses',
    }),
    // Other endpoints
  }),
});
```

### Real-time Updates

#### WebSocket Hook
```typescript
export const useWebSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
    
    socket.on('new-response', (data: HttpbinResponse) => {
      dispatch(
        httpbinApi.util.updateQueryData('getResponses', undefined, (draft) => {
          draft.unshift(data);
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};
```

### Components

#### Component Hierarchy
```
Dashboard
├── StatusBar
├── DateRangeFilter
└── ResponseTable
```

## Installation & Setup

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/fahadfahim13/httpbin-monitor.git
cd httpbin-monitor/httpbin-backend/
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/httpbin_monitor
PORT=3000
HTTPBIN_INTERVAL=300000
```

4. Run with Docker:
```bash
docker-compose up --build
```

Or without Docker:
```bash
npm run build
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd httpbin-monitor/http-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

### Run Backend, Frontend & DB with Docker
```bash
docker-compose up
```

## Development Guide

### Backend Development

1. Adding a new endpoint:
   - Create controller in `src/presentation/controllers`
   - Add route in `src/main.ts`
   - Implement required use cases in `src/application/use-cases`

2. Adding a new feature:
   - Start with domain entities
   - Create interfaces in application layer
   - Implement in infrastructure layer
   - Add to presentation layer if needed

### Frontend Development

1. Adding a new feature:
   - Add RTK Query endpoint if needed
   - Create new components in `src/components`
   - Update types in `src/types`
   - Add to main Dashboard component

2. Styling:
   - Use Tailwind CSS utilities
   - Follow responsive design principles
   - Test across different screen sizes

## Testing

### Backend Tests
```bash
npm test
```

### Frontend Tests
```bash

npm test
```

## Deployment

### Backend Deployment

1. Build Docker image:
```bash
docker build -t httpbin-backend ./httpbin-backend
```

2. Run container:
```bash
docker run -p 3000:3000 httpbin-backend
```

### Frontend Deployment

1. Build application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port
- `HTTPBIN_INTERVAL`: Interval for httpbin.org requests

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket server URL