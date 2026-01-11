import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, MapPin, Loader2 } from 'lucide-react';
import type { Client, DocumentType, Department, Province, District, CreateClientDTO } from '../types/modelClient';

interface ClientModalProps {
  client: Client | null;
  documentTypes: DocumentType[];
  departments: Department[];
  provinces: Province[];
  districts: District[];
  onSave: (data: CreateClientDTO) => Promise<void>;
  onClose: () => void;
}

export default function ClientModal({
  client,
  documentTypes,
  departments,
  provinces,
  districts,
  onSave,
  onClose,
}: ClientModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentNumber: '',
    documentTypeId: '',
    departmentId: '',
    provinceId: '',
    districtId: '',
    street: '',
    number: '',
    reference: '',
  });
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client && client.address) {
      const districtData = client.address.district;
      const provinceData = districtData?.province;
      const departmentData = provinceData?.department;

      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        documentNumber: client.documentNumber,
        documentTypeId: client.documentType.idDocumentType.toString(),
        departmentId: departmentData?.idDepartment?.toString() || '',
        provinceId: provinceData?.idProvince?.toString() || '',
        districtId: districtData?.idDistrict?.toString() || '',
        street: client.address.street,
        number: client.address.number,
        reference: client.address.reference || '',
      });

      if (departmentData?.idDepartment) {
        setFilteredProvinces(provinces.filter(p => p.department.idDepartment === departmentData.idDepartment));
      }
      if (provinceData?.idProvince) {
        setFilteredDistricts(districts.filter(d => d.province.idProvince === provinceData.idProvince));
      }
    }
  }, [client, provinces, districts]);

  useEffect(() => {
    if (formData.departmentId) {
      const deptId = parseInt(formData.departmentId);
      setFilteredProvinces(provinces.filter(p => p.department.idDepartment === deptId));
      setFormData(prev => ({ ...prev, provinceId: '', districtId: '' }));
    } else {
      setFilteredProvinces([]);
    }
  }, [formData.departmentId, provinces]);

  useEffect(() => {
    if (formData.provinceId) {
      const provId = parseInt(formData.provinceId);
      setFilteredDistricts(districts.filter(d => d.province.idProvince === provId));
      setFormData(prev => ({ ...prev, districtId: '' }));
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.provinceId, districts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedDocumentType = documentTypes.find(
        (type) => type.idDocumentType.toString() === formData.documentTypeId
      );
      const selectedDistrict = districts.find(
        (dist) => dist.idDistrict.toString() === formData.districtId
      );

      if (!selectedDocumentType || !selectedDistrict) {
        throw new Error('Tipo de documento o distrito no seleccionado.');
      }

      const addressData = {
        street: formData.street,
        number: formData.number,
        reference: formData.reference || undefined,
        district: selectedDistrict,
      };

      await onSave({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        documentNumber: formData.documentNumber,
        documentType: selectedDocumentType,
        address: addressData,
      });
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-2";
  const selectClasses = "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {client ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              <User className="h-4 w-4" />
              Información Personal
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Nombres</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Juan Carlos"
                />
              </div>
              <div>
                <label className={labelClasses}>Apellidos</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Pérez García"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              Contacto
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className={labelClasses}>Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="999 999 999"
                />
              </div>
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Documento
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tipo de Documento</label>
                <select
                  required
                  value={formData.documentTypeId}
                  onChange={(e) => setFormData({ ...formData, documentTypeId: e.target.value })}
                  className={selectClasses}
                >
                  <option value="">Seleccionar tipo</option>
                  {documentTypes.map((type) => (
                    <option key={type.idDocumentType} value={type.idDocumentType}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Número de Documento</label>
                <input
                  type="text"
                  required
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: 12345678"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              <MapPin className="h-4 w-4" />
              Dirección
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Departamento</label>
                <select
                  required
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className={selectClasses}
                >
                  <option value="">Seleccionar</option>
                  {(departments || []).map((dept) => (
                    <option key={dept.idDepartment} value={dept.idDepartment}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Provincia</label>
                <select
                  required
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className={selectClasses}
                  disabled={!formData.departmentId}
                >
                  <option value="">Seleccionar</option>
                  {(filteredProvinces || []).map((prov) => (
                    <option key={prov.idProvince} value={prov.idProvince}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Distrito</label>
                <select
                  required
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className={selectClasses}
                  disabled={!formData.provinceId}
                >
                  <option value="">Seleccionar</option>
                  {(filteredDistricts || []).map((dist) => (
                    <option key={dist.idDistrict} value={dist.idDistrict}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Calle/Avenida</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: Av. Principal"
                />
              </div>
              <div>
                <label className={labelClasses}>Número</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className={inputClasses}
                  placeholder="Ej: 123"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Referencia (opcional)</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className={inputClasses}
                placeholder="Ej: Cerca al parque central"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-700/50 bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-300 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
