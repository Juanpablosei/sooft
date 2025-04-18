import { Company, CompanyRepository } from '../../domain';
import { GetCompaniesLastMonthUseCase } from './get-companies-last-month.usecase';


describe('GetCompaniesLastMonthUseCase', () => {
  let useCase: GetCompaniesLastMonthUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    // Mock del repositorio de empresas
    companyRepository = {
      findCompaniesRegisteredLastMonth: jest.fn(),
      save: jest.fn(),
      existsByCuit: jest.fn(),
      findByCuit: jest.fn(),
    } as any;

    // Inicializar el caso de uso con el mock del repositorio
    useCase = new GetCompaniesLastMonthUseCase(companyRepository);
  });

  it('should return a list of companies registered last month', async () => {
    const mockCompanies: Company[] = [
      new Company('20304050607', 'Company A', new Date('2025-03-15')),
      new Company('30405060708', 'Company B', new Date('2025-03-20')),
    ];

    // Configurar el mock para devolver empresas registradas el mes pasado
    companyRepository.findCompaniesRegisteredLastMonth.mockResolvedValueOnce(mockCompanies);

    // Llamar al caso de uso
    const result = await useCase.execute();

    // Verificar el resultado
    expect(result).toEqual(mockCompanies);
    expect(companyRepository.findCompaniesRegisteredLastMonth).toHaveBeenCalledTimes(1);
  });

  it('should return an empty list if no companies were registered last month', async () => {
    // Configurar el mock para devolver una lista vacía
    companyRepository.findCompaniesRegisteredLastMonth.mockResolvedValueOnce([]);

    // Llamar al caso de uso
    const result = await useCase.execute();

    // Verificar el resultado
    expect(result).toEqual([]);
    expect(companyRepository.findCompaniesRegisteredLastMonth).toHaveBeenCalledTimes(1);
  });
});