export interface DocumentType {
  idDocumentType: number;
  name: string;
  description?: string; // Mantener opcional en frontend si el backend lo permite
}

export interface Department {
  idDepartment: number;
  name: string;
}

export interface Province {
  idProvince: number;
  name: string;
  department: Department; // Anidar objeto completo
}

export interface District {
  idDistrict: number;
  name: string;
  province: Province; // Anidar objeto completo
}

export interface Address {
  idAddress: number;
  street: string;
  number: string;
  reference?: string; // Mantener opcional en frontend si el backend lo permite
  district: District; // Anidar objeto completo
}

export interface Client {
  idClient: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: DocumentType; // Anidar objeto completo
  address: Address; // Anidar objeto completo
  createdAt?: string; // Asumo que el backend usa camelCase para esto también
  updatedAt?: string; // Asumo que el backend usa camelCase para esto también
}

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: DocumentType; // Aquí se usa el objeto completo
  address: {
    street: string;
    number: string;
    reference?: string;
    district: District; // Aquí se usa el objeto District completo
  };
}

export interface UpdateClientDTO extends Partial<Omit<CreateClientDTO, 'address'>> {
  idClient: number;
  address?: {
    street: string;
    number: string;
    reference?: string;
    districtId: number;
  };
}
