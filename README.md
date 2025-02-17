# A-Board Backend

## Project Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication module
│   │   │   ├── controllers/ # Route controllers
│   │   │   ├── services/    # Business logic
│   │   │   ├── guards/      # Authentication guards
│   │   │   ├── dto/        # Data transfer objects
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/          # User management module
│   │   └── boards/         # Board management module
│   │
│   ├── common/             # Shared resources
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   ├── guards/        # Common guards
│   │   ├── interceptors/  # Request/Response interceptors
│   │   └── pipes/         # Data transformation pipes
│   │
│   ├── config/            # Configuration
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── prisma/           # Database
│   │   ├── migrations/   # Database migrations
│   │   └── schema.prisma # Database schema
│   │
│   └── main.ts          # Application entry point
│
└── test/                # Test files
    └── e2e/            # End-to-end tests
```

# A-Board Architecture Documentation

## System Architecture
```mermaid
graph TB
%% Frontend Section
   subgraph "Frontend Layer"
      Client[Browser/Client] --> Next[Next.js]
      Next --> ReactComponents[React Components]
      Next --> Pages[Pages]
      Next --> FrontendRouting[Routing]
      ReactComponents --> UIComponents[UI Components]
      ReactComponents --> SharedComponents[Shared Components]
      ReactComponents --> StateManagement[State Management]
   end

%% API Layer
   subgraph "API Layer"
      FrontendRouting --> APIGateway[API Gateway]
      APIGateway --> AuthModule[Auth Module]
      APIGateway --> UserModule[User Module]
      APIGateway --> BoardModule[Board Module]
   end

%% Backend Section
   subgraph "Business Layer"
      AuthModule --> AuthService[Auth Service]
      UserModule --> UserService[User Service]
      BoardModule --> BoardService[Board Service]
   end

%% Database Layer
   subgraph "Data Layer"
      AuthService --> PrismaORM[Prisma ORM]
      UserService --> PrismaORM
      BoardService --> PrismaORM
      PrismaORM --> PostgreSQL[(PostgreSQL)]
   end

%% External Services
   subgraph "External Services"
      BoardService --> S3[AWS S3]
      AuthService --> Redis[(Redis Cache)]
   end

%% Deployment
   subgraph "Infrastructure"
      LoadBalancer[Load Balancer] --> Next
      LoadBalancer --> APIGateway
   end

   style Client fill:#f9f,stroke:#333,stroke-width:2px
   style Next fill:#bbf,stroke:#333,stroke-width:2px
   style APIGateway fill:#bfb,stroke:#333,stroke-width:2px
   style PostgreSQL fill:#fbb,stroke:#333,stroke-width:2px
```

## Database ER Diagram
```mermaid
erDiagram
   User ||--o{ Post : creates
   User ||--o{ Comment : writes
   Post ||--o{ Comment : has
   Post }|--|| Community : belongs_to

   User {
      int id PK
      string username
      string email
      string password
      string avatar_url
      datetime created_at
      datetime updated_at
   }

   Post {
      int id PK
      string title
      text content
      int user_id FK
      int community_id FK
      datetime created_at
      datetime updated_at
   }

   Comment {
      int id PK
      text content
      int user_id FK
      int post_id FK
      datetime created_at
   }

   Community {
      int id PK
      string name
      string description
      enum category
   }
```

## Service Flow
```mermaid
flowchart TB
%% User Entry Points
   Start((Start)) --> Login[Login/Register]
   Start --> ViewPosts[View Posts]

%% Authentication Flow
   Login -->|Username/Password| AuthService{Auth Service}
   AuthService -->|Success| GenerateToken[Generate JWT]
   AuthService -->|Fail| LoginError[Error Message]
   GenerateToken --> StoreToken[Store Token]

%% Post Management Flow
   ViewPosts --> PostService{Post Service}
   PostService -->|Fetch| DisplayPosts[Display Posts]

   subgraph "Post Operations"
      CreatePost[Create Post] -->|Requires Auth| PostValidation{Validate}
      PostValidation -->|Valid| SavePost[Save Post]
      PostValidation -->|Invalid| PostError[Show Error]

      EditPost[Edit Post] -->|Check Owner| PostValidation
      DeletePost[Delete Post] -->|Check Owner| PostValidation
   end

%% Comment System
   subgraph "Comment Operations"
      AddComment[Add Comment] -->|Requires Auth| CommentService{Comment Service}
      CommentService -->|Valid| SaveComment[Save Comment]
      CommentService -->|Invalid| CommentError[Show Error]

      ViewComments[View Comments] --> FetchComments[Fetch Comments]
   end

%% Community Management
   subgraph "Community Features"
      SelectCommunity[Select Community] --> CommunityService{Community Service}
      CommunityService -->|Fetch| DisplayCommunity[Display Community Posts]

      FilterByCategory[Filter by Category] --> CommunityService
   end

%% Database Operations
   SavePost --> Database[(Database)]
   SaveComment --> Database
   FetchComments --> Database
   DisplayCommunity --> Database

%% State Management
   StoreToken --> UserState[User State]
   UserState -->|Auth Required| CreatePost
   UserState -->|Auth Required| AddComment
   UserState -->|Auth Required| EditPost
   UserState -->|Auth Required| DeletePost

   style Start fill:#f96,stroke:#333,stroke-width:2px
   style Database fill:#f9f,stroke:#333,stroke-width:2px
   style AuthService fill:#bbf,stroke:#333,stroke-width:2px
   style PostService fill:#bfb,stroke:#333,stroke-width:2px
   style CommentService fill:#bfb,stroke:#333,stroke-width:2px
   style CommunityService fill:#bfb,stroke:#333,stroke-width:2px
```

## Authentication Flow
```mermaid
sequenceDiagram
   participant C as Client
   participant F as Frontend
   participant A as Auth Service
   participant D as Database
   participant R as Redis Cache

%% Login Flow
   C->>F: Submit Login
   F->>A: POST /auth/login
   A->>D: Check Credentials
   D-->>A: User Data
   A->>A: Generate JWT
   A->>R: Cache Token
   A-->>F: Return Token & User
   F-->>C: Update UI State

%% Protected Route Access
   C->>F: Access Protected Route
   F->>A: Verify Token
   A->>R: Check Token Cache
   R-->>A: Token Status
   alt Valid Token
      A-->>F: Allow Access
      F-->>C: Show Protected Content
   else Invalid Token
      A-->>F: Deny Access
      F-->>C: Redirect to Login
   end
```

## Data Flow
```mermaid
flowchart TB
%% Client Layer
   Client([Client Browser])

%% Frontend Layer
   subgraph Frontend
      UIComponents[UI Components]
      ReactQuery[React Query]
      APIClient[API Client]
      StateManagement[State Management]
   end

%% Backend Layer
   subgraph Backend
      Controller[NestJS Controllers]
      Service[Services]
      Repository[Repositories]
      DTO[DTOs]

   %% Data Flow in Backend
      Controller --> |Validate DTO| DTO
      DTO --> |Process| Service
      Service --> |CRUD| Repository
   end

%% Database Layer
   subgraph Database
      PrismaClient[Prisma Client]
      DB[(PostgreSQL)]
      Cache[(Redis)]
   end

%% Connections
   Client <--> |HTTP/WebSocket| UIComponents
   UIComponents <--> |State Updates| StateManagement
   UIComponents <--> |Data Fetch| ReactQuery
   ReactQuery <--> |API Calls| APIClient
   APIClient <--> |HTTP| Controller
   Repository <--> PrismaClient
   PrismaClient <--> DB
   Service <--> |Cache| Cache

%% Styles
   classDef frontend fill:#bbf,stroke:#333,stroke-width:2px
   classDef backend fill:#bfb,stroke:#333,stroke-width:2px
   classDef database fill:#fbb,stroke:#333,stroke-width:2px

   class UIComponents,ReactQuery,APIClient,StateManagement frontend
   class Controller,Service,Repository,DTO backend
   class PrismaClient,DB,Cache database
```

## Service Architecture
```mermaid
graph TB
   subgraph "Authentication Service"
      Auth[Auth Service]
      Auth --> UserRepo[(User Repository)]
   end

   subgraph "Post Service"
      Post[Post Service]
      Post --> PostRepo[(Post Repository)]
      Post --> CommentRepo[(Comment Repository)]
   end

   subgraph "Community Service"
      Community[Community Service]
      Community --> CommunityRepo[(Community Repository)]
   end

   AuthController --> Auth
   PostController --> Post
   CommunityController --> Community

   Auth -.-> PostService
   Community -.-> PostService
```

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query

### Backend
- NestJS
- TypeScript
- Prisma
- PostgreSQL

## Project Structure
```
a-board/
├── frontend/                # Next.js application
│   └── src/
│       ├── app/            # Next.js app directory
│       ├── components/     # React components
│       └── lib/           # Utilities & configurations
└── backend/               # NestJS application
    └── src/
        ├── modules/       # Feature modules
        ├── common/        # Shared resources
        └── prisma/        # Database configuration
```

## Naming Conventions

### Files and Folders

1. Modules:
    - Use kebab-case for folders: `auth/`, `user-management/`
    - Module files: `auth.module.ts`

2. Components:
    - Controllers: `auth.controller.ts`
    - Services: `auth.service.ts`
    - DTOs: `create-user.dto.ts`
    - Entities: `user.entity.ts`

3. Common:
    - Decorators: `auth.decorator.ts`
    - Guards: `jwt-auth.guard.ts`
    - Filters: `http-exception.filter.ts`

### Code Structure

1. Controllers:
```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

2. Services:
```typescript
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

3. DTOs:
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

## Database Conventions

1. Prisma Schema:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Migrations:
    - Descriptive names: `YYYYMMDDHHMMSS_create_users_table.ts`
    - One migration per schema change

## API Conventions

1. Endpoints:
    - Use RESTful naming
    - Group by resource
    - Version prefix: `/api/v1/`

2. HTTP Methods:
    - GET: Retrieve
    - POST: Create
    - PUT: Update (full)
    - PATCH: Update (partial)
    - DELETE: Remove

3. Response Format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
```

## Error Handling

1. Exception Filter:
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Implementation
  }
}
```

2. Custom Exceptions:
```typescript
export class UserNotFoundException extends NotFoundException {
  constructor(userId: number) {
    super(`User with id ${userId} not found`);
  }
}
```

## Testing

1. Unit Tests:
```typescript
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Test setup
  });

  it('should validate user', async () => {
    // Test implementation
  });
});
```

2. E2E Tests:
```typescript
describe('Auth (e2e)', () => {
  it('/auth/login (POST)', () => {
    // Test implementation
  });
});
```

## Development Setup

1. Installation:
```bash
npm install
```

2. Database Setup:
```bash
npx prisma migrate dev
npx prisma generate
```

3. Running the App:
```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=4000
```