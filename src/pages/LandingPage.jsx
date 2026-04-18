import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Calendar, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    jenis_kelamin: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nama.trim()) {
      setError('Nama harus diisi');
      return;
    }
    if (!formData.usia || formData.usia < 1 || formData.usia > 120) {
      setError('Usia harus diisi dengan benar (1-120 tahun)');
      return;
    }
    if (!formData.jenis_kelamin) {
      setError('Jenis kelamin harus dipilih');
      return;
    }
    
    // Simpan sesi user ke localStorage (untuk dipakai di Dashboard & Riwayat)
    const userSession = {
      nama: formData.nama,
      usia: parseInt(formData.usia),
      jenis_kelamin: formData.jenis_kelamin,
      startTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    // Langsung ke Dashboard (scan akan dilakukan di Dashboard)
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoring Kesehatan</h1>
          <p className="text-slate-500 mt-2">Isi data diri Anda sebelum memulai</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <User className="inline h-4 w-4 mr-1" /> Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" /> Usia (Tahun)
            </label>
            <input
              type="number"
              name="usia"
              value={formData.usia}
              onChange={handleInputChange}
              placeholder="Contoh: 25"
              min="1"
              max="120"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Users className="inline h-4 w-4 mr-1" /> Jenis Kelamin
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="Laki-laki"
                  checked={formData.jenis_kelamin === 'Laki-laki'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Laki-laki</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="Perempuan"
                  checked={formData.jenis_kelamin === 'Perempuan'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Perempuan</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Mulai Scan
          </button>

          <button
            type="button"
            onClick={() => navigate('/riwayat')}
            className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Lihat Riwayat
          </button>
        </form>
      </div>
    </div>
  );
}