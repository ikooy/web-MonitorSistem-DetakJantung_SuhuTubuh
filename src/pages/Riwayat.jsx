import { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../firebase';
import { Activity, Download, Heart, Thermometer, Trash2 } from 'lucide-react';

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const riwayatRef = ref(db, 'riwayat');
    const unsubscribe = onValue(riwayatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        // Urutkan dari yang terbaru
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRiwayat(list);
      } else {
        setRiwayat([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // FUNGSI HAPUS DATA
  const handleDelete = async (id, nama) => {
    const confirm = window.confirm(`Yakin ingin menghapus data ${nama}?`);
    if (confirm) {
      try {
        const dataRef = ref(db, `riwayat/${id}`);
        await remove(dataRef);
        alert(`Data ${nama} berhasil dihapus`);
      } catch (error) {
        alert('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const exportCSV = () => {
    if (!riwayat.length) {
      alert('Belum ada data');
      return;
    }

    const headers = ['No', 'Waktu', 'Nama', 'Usia', 'Jenis Kelamin', 'BPM', 'Suhu', 'Status Jantung', 'Status Suhu'];
    const rows = riwayat.map((item, index) => [
      index + 1,
      new Date(item.timestamp).toLocaleString('id-ID'),
      item.nama,
      item.usia,
      item.jenis_kelamin,
      item.bpm,
      item.suhu,
      item.status_jantung,
      item.status_suhu
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat-monitoring-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status, type) => {
    if (status === 'Normal') {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (type === 'jantung') {
      if (status.includes('Bradikardia')) return 'bg-blue-100 text-blue-700';
      if (status.includes('Takikardia')) return 'bg-orange-100 text-orange-700';
    }
    if (type === 'suhu') {
      if (status.includes('Hipotermia')) return 'bg-blue-100 text-blue-700';
      if (status.includes('Demam')) return 'bg-orange-100 text-orange-700';
    }
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Riwayat Pemeriksaan</h2>
          <p className="text-slate-500 mt-1">Semua data pasien yang telah melakukan scan</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium transition-all shadow-sm"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-slate-500 text-sm">Total Scan</p>
          <p className="text-2xl font-bold text-slate-900">{riwayat.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-slate-500 text-sm">Rata-rata BPM</p>
          <p className="text-2xl font-bold text-slate-900">
            {riwayat.length > 0 
              ? Math.round(riwayat.reduce((s, item) => s + (item.bpm || 0), 0) / riwayat.length)
              : 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-slate-500 text-sm">Rata-rata Suhu</p>
          <p className="text-2xl font-bold text-slate-900">
            {riwayat.length > 0 
              ? (riwayat.reduce((s, item) => s + (item.suhu || 0), 0) / riwayat.length).toFixed(1)
              : 0}°C
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-slate-500 text-sm">Status Normal</p>
          <p className="text-2xl font-bold text-emerald-600">
            {riwayat.filter(item => item.status_jantung === 'Normal' && item.status_suhu === 'Normal').length}
          </p>
        </div>
      </div>

      {/* Tabel Riwayat */}
      {riwayat.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Belum Ada Data</h3>
          <p className="text-slate-400">Silakan lakukan scan terlebih dahulu di halaman Home</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Waktu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Usia</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">JK</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">BPM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Suhu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status Jantung</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status Suhu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {riwayat.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.usia}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.jenis_kelamin}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.bpm}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.suhu}°C</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status_jantung, 'jantung')}`}>
                        {item.status_jantung}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status_suhu, 'suhu')}`}>
                        {item.status_suhu}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}