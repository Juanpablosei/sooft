import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './user.dto';

describe('UserDto', () => {
  it('should validate a valid UserDto', async () => {
    const validUser = {
      email: 'user@example.com',
      password: 'password123456', // Cumple con los requisitos de la contraseña
    };

    const userDto = plainToInstance(UserDto, validUser);
    const errors = await validate(userDto);

    expect(errors.length).toBe(0); // No debe haber errores
  });

  it('should fail if email is invalid', async () => {
    const invalidUser = {
      email: 'invalid-email',
      password: 'password123456',
    };

    const userDto = plainToInstance(UserDto, invalidUser);
    const errors = await validate(userDto);

    expect(errors.length).toBeGreaterThan(0); // Debe haber errores
    expect(errors[0].constraints?.isEmail).toBeDefined(); // Verifica que el error sea por el email
  });

  it('should fail if password does not meet requirements', async () => {
    const invalidUser = {
      email: 'user@example.com',
      password: 'short', // Contraseña no válida
    };

    const userDto = plainToInstance(UserDto, invalidUser);
    const errors = await validate(userDto);

    expect(errors.length).toBeGreaterThan(0); // Debe haber errores
    expect(errors[0].constraints?.matches).toBeDefined(); // Verifica que el error sea por el patrón de la contraseña
  });

  it('should transform email to lowercase and trim spaces', async () => {
    const userWithExtraSpaces = {
      email: '  USER@EXAMPLE.COM  ',
      password: 'password123456',
    };

    const userDto = plainToInstance(UserDto, userWithExtraSpaces);
    expect(userDto.email).toBe('user@example.com'); // El email debe estar en minúsculas y sin espacios
  });
});