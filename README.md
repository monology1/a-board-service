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
    ├── unit/           # Unit tests
    └── e2e/            # End-to-end tests
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