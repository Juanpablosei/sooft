import { User } from '../../domain/entities/user.entity';
import { UserSchema, UserDocument } from '../schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { UserRepositoryMongoAdapter } from './user.repository';

describe('UserRepositoryMongoAdapter', () => {
  let mongoServer: MongoMemoryServer;
  let userModel: Model<UserDocument>;
  let userRepository: UserRepositoryMongoAdapter;

  beforeAll(async () => {
    // Inicia MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Conéctate a la base de datos en memoria
    await mongoose.connect(uri);

    // Crea el modelo usando el esquema
    userModel = mongoose.model<UserDocument>('User', UserSchema);

    // Instancia el repositorio
    userRepository = new UserRepositoryMongoAdapter(userModel);
  });

  afterAll(async () => {
    // Cierra la conexión y detén MongoDB en memoria
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpia la colección después de cada prueba
    await userModel.deleteMany({});
  });

  it('should save a new user', async () => {
    const user = new User('user@example.com', 'hashedPassword123');

    const savedUser = await userRepository.save(user);

    expect(savedUser).toBeDefined();
    expect(savedUser?.email).toBe(user.email);
    expect(savedUser?.password).toBe(user.password);

    const dbUser = await userModel.findOne({ email: user.email });
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(user.email);
    expect(dbUser?.password).toBe(user.password);
  });

  it('should not save a user if email already exists', async () => {
    const user = new User('user@example.com', 'hashedPassword123');
    await userRepository.save(user);

    const duplicateUser = new User('user@example.com', 'anotherPassword123');
    const result = await userRepository.save(duplicateUser);

    expect(result).toBeNull();

    const usersInDb = await userModel.find({ email: user.email });
    expect(usersInDb.length).toBe(1);
  });

  it('should find a user by email', async () => {
    const user = new User('user@example.com', 'hashedPassword123');
    await userRepository.save(user);

    const foundUser = await userRepository.findByEmail(user.email);

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(user.email);
    expect(foundUser?.password).toBe(user.password);
  });

  it('should return null if user is not found by email', async () => {
    const foundUser = await userRepository.findByEmail('nonexistent@example.com');
    expect(foundUser).toBeNull();
  });

  it('should update the token for a user', async () => {
    const user = new User('user@example.com', 'hashedPassword123');
    await userRepository.save(user);

    const token = 'mockedToken123';
    await userRepository.updateToken(user.email, token);

    const updatedUser = await userModel.findOne({ email: user.email });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.token).toBe(token);
  });
});