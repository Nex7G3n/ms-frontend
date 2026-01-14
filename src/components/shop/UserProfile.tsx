import { useState } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No hay información de usuario disponible</p>
        <Link to="/login" className="text-teal-400 hover:text-teal-300 mt-4 inline-block">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setIsEditing(false);
    } catch (error: any) {
      alert(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Guardar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-teal-400" />
                <label className="text-sm text-slate-400">Nombre</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              ) : (
                <p className="text-white font-medium">{user.firstName}</p>
              )}
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-teal-400" />
                <label className="text-sm text-slate-400">Apellido</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              ) : (
                <p className="text-white font-medium">{user.lastName}</p>
              )}
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-teal-400" />
                <label className="text-sm text-slate-400">Email</label>
              </div>
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-teal-400" />
                <label className="text-sm text-slate-400">Teléfono</label>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              ) : (
                <p className="text-white font-medium">{user.phone}</p>
              )}
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-teal-400" />
                <label className="text-sm text-slate-400">Miembro desde</label>
              </div>
              <p className="text-white font-medium">
                {new Date(user.createdAt).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-slate-700/50">
            <Link
              to="/orders"
              className="block w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium text-center"
            >
              Ver Mis Órdenes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
