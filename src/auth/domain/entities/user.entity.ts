export class User {
    constructor(
      public readonly email: string,
      public readonly password: string,
      public readonly token?: string, 
    ) {}
  }