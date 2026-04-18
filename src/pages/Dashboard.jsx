import { useEffect, useState } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../firebase";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import {
    Activity,
    Thermometer,
    AlertTriangle,
    Download,
    Heart,
    Clock,
    UserCircle
} from "lucide-react";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [monitoring, setMonitoring] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentUser, setCurrentUser] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ambil data user dari localStorage
    useEffect(() => {
        const userSession = localStorage.getItem('currentUser');
        if (userSession) {
            try {
                const user = JSON.parse(userSession);
                setCurrentUser(user);
                console.log("User saat ini:", user.nama);
            } catch(e) {}
        }
    }, []);

    // Update clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const exportCSV = () => {
        if (!data.length) {
            alert("Data belum tersedia");
            return;
        }

        const header = "Waktu,BPM,Suhu,Nama,Usia,Jenis Kelamin\n";
        const rows = data
            .map(d => `${d.time},${d.bpm},${d.suhu},${currentUser?.nama || 'Tamu'},${currentUser?.usia || '-'},${currentUser?.jenis_kelamin || '-'}`)
            .join("\n");

        const csvContent = header + rows;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `monitoring-${currentUser?.nama || 'pasien'}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // BACA DARI scan_terbaru
    useEffect(() => {
        const scanRef = ref(db, "scan_terbaru");
        let lastSavedBpm = 0;
        let lastSavedSuhu = 0;

        const unsubscribe = onValue(scanRef, async (snapshot) => {
            const val = snapshot.val();
            console.log("Data dari scan_terbaru:", val);
            
            setIsLoading(false);
            
            // SELALU update monitoring (meskipun bpm = 0)
            if (val) {
                setMonitoring(val);
            }
            
            // HANYA update grafik jika bpm > 0 (data valid)
            if (val && val.bpm > 0 && val.bpm !== 0 && val.suhu > 0) {
                // Update grafik
                setData((prev) => [
                    ...prev.slice(-19),
                    {
                        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        bpm: val.bpm,
                        suhu: val.suhu
                    }
                ]);

                // CEK APAKAH DATA BERUBAH (scan baru)
                const isNewData = (val.bpm !== lastSavedBpm) || (val.suhu !== lastSavedSuhu);

                if (isNewData && val.bpm > 0 && val.suhu > 0) {
                    lastSavedBpm = val.bpm;
                    lastSavedSuhu = val.suhu;
                    
                    // Ambil user dari localStorage
                    let userData = { nama: 'Tamu', usia: 0, jenis_kelamin: '-' };
                    const userSession = localStorage.getItem('currentUser');
                    if (userSession) {
                        try {
                            userData = JSON.parse(userSession);
                        } catch(e) {}
                    }
                    
                    // SIMPAN KE RIWAYAT
                    try {
                        const riwayatRef = push(ref(db, 'riwayat'));
                        await set(riwayatRef, {
                            nama: userData.nama,
                            usia: userData.usia,
                            jenis_kelamin: userData.jenis_kelamin,
                            timestamp: new Date().toISOString(),
                            bpm: val.bpm,
                            suhu: val.suhu,
                            status_jantung: val.status_jantung || 'Normal',
                            status_suhu: val.status_suhu || 'Normal'
                        });
                        console.log('✅ Data tersimpan ke riwayat');
                        setLastSaved({
                            bpm: val.bpm,
                            suhu: val.suhu,
                            time: new Date().toLocaleTimeString()
                        });
                        setTimeout(() => setLastSaved(null), 3000);
                    } catch(err) {
                        console.log('Gagal simpan riwayat:', err);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const getStatusColor = (status, type) => {
        if (status === "Normal") return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (status === "Menunggu...") return "text-slate-500 bg-slate-50 border-slate-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    // Tampilkan loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Activity size={20} />
                        </div>
                        <h1 className="font-bold text-xl tracking-tight text-slate-900">
                            Monitoring <span className="text-slate-400 font-normal">Sistem</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                            <Clock size={16} />
                            <span>{currentTime.toLocaleTimeString()}</span>
                        </div>
                        {currentUser && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700">
                                <UserCircle size={16} />
                                <span>{currentUser.nama}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {currentUser && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-blue-700">
                            <strong>👤 Pasien aktif:</strong> {currentUser.nama} | 
                            <strong> Usia:</strong> {currentUser.usia} tahun | 
                            <strong> Jenis Kelamin:</strong> {currentUser.jenis_kelamin}
                        </p>
                        <p className="text-blue-500 text-sm mt-1">
                            💡 Tempelkan jari ke sensor pulse, dan tempelkan sensor suhu ke kulit. Scan akan otomatis tersimpan.
                        </p>
                    </div>
                )}

                {lastSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-700">
                            ✅ Data scan tersimpan! BPM: {lastSaved.bpm} | Suhu: {lastSaved.suhu}°C
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Monitoring {currentUser ? `- ${currentUser.nama}` : ''}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {monitoring && monitoring.bpm > 0 
                                ? `Real-time vital signs untuk ${currentUser?.nama || 'pasien'}`
                                : 'Menunggu scan... tempelkan jari ke sensor pulse dan sensor suhu'}
                        </p>
                    </div>
                    <button
                        onClick={exportCSV}
                        disabled={!data.length}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                {/* ALERT - HANYA TAMPIL JIKA ABNORMAL DAN BUKAN MENUNGGU */}
                {monitoring && monitoring.bpm > 0 && (monitoring.status_jantung !== "Normal" || monitoring.status_suhu !== "Normal") && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-red-800 text-sm uppercase tracking-wide">Critical Alert</h4>
                            <div className="mt-1 text-red-700 text-sm space-y-1">
                                {monitoring.status_jantung !== "Normal" && (
                                    <p>Abnormal Heart Rate detected: <span className="font-semibold">{monitoring.status_jantung}</span></p>
                                )}
                                {monitoring.status_suhu !== "Normal" && (
                                    <p>Abnormal Body Temperature detected: <span className="font-semibold">{monitoring.status_suhu}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* KPI CARDS - DENGAN GAMBAR BACKGROUND HEART & THERMOMETER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Heart Rate Card dengan background heart besar */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        {/* GAMBAR HEART BESAR DI BACKGROUND (seperti kode lama) */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart size={120} className="text-rose-500 -mr-8 -mt-8" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                                    <Heart size={20} className={monitoring && monitoring.bpm > 0 ? "animate-pulse" : ""} />
                                </div>
                                <span className="font-semibold text-slate-700">Heart Rate</span>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(monitoring?.status_jantung || 'Menunggu...', 'bpm')}`}>
                                {monitoring?.status_jantung || 'Menunggu...'}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <span className="text-5xl font-bold text-slate-900 tracking-tight">
                                {monitoring && monitoring.bpm > 0 ? monitoring.bpm : '--'}
                            </span>
                            <span className="text-slate-500 font-medium text-lg">BPM</span>
                        </div>
                        {(!monitoring || monitoring.bpm === 0) && (
                            <p className="text-slate-400 text-sm mt-2 relative z-10">Menunggu scan...</p>
                        )}
                    </div>

                    {/* Temperature Card dengan background thermometer besar */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        {/* GAMBAR THERMOMETER BESAR DI BACKGROUND (seperti kode lama) */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Thermometer size={120} className="text-blue-500 -mr-8 -mt-8" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <Thermometer size={20} />
                                </div>
                                <span className="font-semibold text-slate-700">Body Temperature</span>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(monitoring?.status_suhu || 'Menunggu...', 'suhu')}`}>
                                {monitoring?.status_suhu || 'Menunggu...'}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <span className="text-5xl font-bold text-slate-900 tracking-tight">
                                {monitoring && monitoring.suhu > 0 ? monitoring.suhu : '--'}
                            </span>
                            <span className="text-slate-500 font-medium text-lg">°C</span>
                        </div>
                        {(!monitoring || monitoring.suhu === 0) && (
                            <p className="text-slate-400 text-sm mt-2 relative z-10">Menunggu scan...</p>
                        )}
                    </div>
                </div>

                {/* CHARTS - SELALU TAMPIL (meskipun data kosong) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-slate-800">Heart Rate History</h3>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                {data.length > 0 ? 'Live' : 'Menunggu Data'}
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            {data.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <Heart size={48} className="text-slate-300 mb-2" />
                                    <p>Belum ada data scan</p>
                                    <p className="text-sm">Tempelkan jari ke sensor pulse</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="bpm" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorBpm)" name="BPM" dot={{ r: 4 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-slate-800">Temperature History</h3>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                {data.length > 0 ? 'Live' : 'Menunggu Data'}
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            {data.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <Thermometer size={48} className="text-slate-300 mb-2" />
                                    <p>Belum ada data scan</p>
                                    <p className="text-sm">Tempelkan sensor suhu ke kulit</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[34, 42]} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="suhu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSuhu)" name="Temperature" dot={{ r: 4 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}