export class Transfer {
    constructor(
      public readonly amount: number,
      public readonly companyId: string,
      public readonly creditAccount: string,
      public readonly debitAccount: string,
      public readonly date: Date,
    ) {}
  }