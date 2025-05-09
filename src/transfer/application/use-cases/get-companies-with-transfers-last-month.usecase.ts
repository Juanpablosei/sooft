import { CompanyRepository } from "../../../company/domain";
import { TransferRepository } from "../../../transfer/domain";



export class GetCompaniesWithTransfersLastMonthUseCase {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute() {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const transfers = await this.transferRepository.findByDateRange(oneMonthAgo, now);

    const uniqueCuits = Array.from(new Set(transfers.map((transfer) => transfer.companyId)));


    const companies = await Promise.all(
      uniqueCuits.map(async (cuit) => this.companyRepository.findByCuit(cuit)),
    );

    return companies.filter((company) => company !== null);
  }
}