import { Transfer, TransferRepository } from '../../../transfer/domain';
import { Company, CompanyRepository } from '../../../company/domain';
import { GetCompaniesWithTransfersLastMonthUseCase } from './get-companies-with-transfers-last-month.usecase';


describe('GetCompaniesWithTransfersLastMonthUseCase', () => {
  let getCompaniesWithTransfersLastMonthUseCase: GetCompaniesWithTransfersLastMonthUseCase;
  let transferRepository: jest.Mocked<TransferRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    transferRepository = {
      findByDateRange: jest.fn(),
    } as any;

    companyRepository = {
      findByCuit: jest.fn(),
    } as any;

    getCompaniesWithTransfersLastMonthUseCase = new GetCompaniesWithTransfersLastMonthUseCase(
      transferRepository,
      companyRepository,
    );
  });

  it('should return companies with transfers in the last month', async () => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const mockTransfers: Transfer[] = [
      new Transfer(1000, '20304050607', '1234567890', '0987654321', new Date()),
      new Transfer(2000, '30405060708', '1234567890', '0987654321', new Date()),
      new Transfer(3000, '20304050607', '1234567890', '0987654321', new Date()),
    ];

    const mockCompanies: (Company | null)[] = [
      new Company('20304050607', 'Company A', new Date('2020-01-01')),
      new Company('30405060708', 'Company B', new Date('2021-01-01')),
    ];

    transferRepository.findByDateRange.mockResolvedValueOnce(mockTransfers);
    companyRepository.findByCuit.mockImplementation(async (cuit) =>
      mockCompanies.find((company) => company?.cuit === cuit) || null,
    );

    const result = await getCompaniesWithTransfersLastMonthUseCase.execute();

    expect(companyRepository.findByCuit).toHaveBeenCalledTimes(2); // Una llamada por cada CUIT único
    expect(result).toEqual(mockCompanies);
  });

  it('should return an empty array if no transfers are found', async () => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    transferRepository.findByDateRange.mockResolvedValueOnce([]);
    companyRepository.findByCuit.mockResolvedValueOnce(null);

    const result = await getCompaniesWithTransfersLastMonthUseCase.execute();

    expect(transferRepository.findByDateRange).toHaveBeenCalledWith(oneMonthAgo, now);
    expect(companyRepository.findByCuit).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should skip null companies', async () => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const mockTransfers: Transfer[] = [
      new Transfer(1000, '20304050607', '1234567890', '0987654321', new Date()),
      new Transfer(2000, '30405060708', '1234567890', '0987654321', new Date()),
    ];

    const mockCompanies: (Company | null)[] = [
      new Company('20304050607', 'Company A', new Date('2020-01-01')),
      null, // Una compañía no encontrada
    ];

    transferRepository.findByDateRange.mockResolvedValueOnce(mockTransfers);
    companyRepository.findByCuit.mockImplementation(async (cuit) =>
      mockCompanies.find((company) => company?.cuit === cuit) || null,
    );

    const result = await getCompaniesWithTransfersLastMonthUseCase.execute();

    expect(transferRepository.findByDateRange).toHaveBeenCalledWith(oneMonthAgo, now);
    expect(companyRepository.findByCuit).toHaveBeenCalledTimes(2);
    expect(result).toEqual([mockCompanies[0]]);
  });
});