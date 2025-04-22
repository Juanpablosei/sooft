import { UserSchema } from './user.schema';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('UserSchema', () => {
  let UserModel: mongoose.Model<any>;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Inicia MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Conéctate a la base de datos en memoria
    await mongoose.connect(uri);

    // Crea el modelo usando el esquema
    UserModel = mongoose.model('User', UserSchema);
  });

  afterAll(async () => {
    // Cierra la conexión y detén MongoDB en memoria
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpia la colección después de cada prueba
    await UserModel.deleteMany({});
  });

  it('should define the schema correctly', () => {
    const schemaPaths = Object.keys(UserSchema.paths);
    expect(schemaPaths).toEqual(
      expect.arrayContaining(['email', 'password', 'token']),
    );
  });

  it('should require email and password fields', async () => {
    const user = new UserModel({}); // Sin valores
    const error = user.validateSync();

    expect(error).toBeDefined();
    expect(error.errors['email']).toBeDefined();
    expect(error.errors['password']).toBeDefined();
  });

  it('should allow saving a user without a token', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'hashedPassword123',
    };

    const user = new UserModel(userData);
    await user.save();

    expect(user._id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.token).toBeUndefined();
  });

  it('should validate a valid user', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'hashedPassword123',
      token: 'mockedToken',
    };

    const user = new UserModel(userData);
    const error = user.validateSync();

    expect(error).toBeUndefined();
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.token).toBe(userData.token);
  });

  it('should enforce unique email', async () => {
    const userData1 = {
      email: 'user@example.com',
      password: 'hashedPassword123',
    };

    const userData2 = {
      email: 'user@example.com', // Mismo email que el anterior
      password: 'anotherPassword123',
    };

    const user1 = new UserModel(userData1);
    await user1.save();

    const user2 = new UserModel(userData2);

    await expect(user2.save()).rejects.toThrow(/duplicate key error/); // Verifica el error de clave duplicada
  });
});