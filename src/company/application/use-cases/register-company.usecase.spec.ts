import { Company, CompanyRepository } from "../../../company/domain";
import { SaveCompanyUseCase } from "./register-company.usecase";


describe('SaveCompanyUseCase', () => {
  let useCase: SaveCompanyUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    // Mock del repositorio de empresas
    companyRepository = {
      existsByCuit: jest.fn(),
      save: jest.fn(),
      findCompaniesRegisteredLastMonth: jest.fn(),
      findByCuit: jest.fn(),
    } as any;

    // Inicializar el caso de uso con el mock del repositorio
    useCase = new SaveCompanyUseCase(companyRepository);
  });

  it('should save a new company successfully', async () => {
    const company = new Company('20304050607', 'Company A', new Date('2025-03-15'));

    // Configurar el mock para indicar que la empresa no existe
    companyRepository.existsByCuit.mockResolvedValueOnce(false);
    companyRepository.save.mockResolvedValueOnce(company);

    // Llamar al caso de uso
    const result = await useCase.execute(company);

    // Verificar el resultado
    expect(result).toEqual(company);
    expect(companyRepository.existsByCuit).toHaveBeenCalledWith(company.cuit);
    expect(companyRepository.save).toHaveBeenCalledWith(company);
  });

  it('should throw an error if a company with the same CUIT already exists', async () => {
    const company = new Company('20304050607', 'Company A', new Date('2025-03-15'));

    // Configurar el mock para indicar que la empresa ya existe
    companyRepository.existsByCuit.mockResolvedValueOnce(true);

    // Llamar al caso de uso y verificar que lanza un error
    await expect(useCase.execute(company)).rejects.toThrow(
      `A company with CUIT ${company.cuit} already exists.`,
    );

    expect(companyRepository.existsByCuit).toHaveBeenCalledWith(company.cuit);
    expect(companyRepository.save).not.toHaveBeenCalled();
  });
});