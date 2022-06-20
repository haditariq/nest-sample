import { User } from './users.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdfa@gasf.com', 'Adfasdf');
    expect(user.password).not.toEqual('assfa');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in ', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    expect(service.signup('test1@test.com', '12345')).rejects.toThrow();
  });
});
