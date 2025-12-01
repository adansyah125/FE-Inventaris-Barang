import React from 'react';
import { getDashboardStats } from '../../data/utils';
import { PRIMARY_COLOR } from '../../data/constants';

const DashboardContent = ({ dataItems }) => {
    const stats = getDashboardStats(dataItems);
    // Cari max value untuk skala chart, tambahkan buffer sedikit agar tidak mentok atas
    const maxValue = Math.max(...stats.kondisiData.map(d => d.value)) * 1.1;
    
    return (
        <div className="w-full text-gray-800">
            
            {/* --- 1. HEADER COMPACT --- */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Aset</h1>
                    <p className="text-sm text-gray-500">Ringkasan inventaris Tahun Anggaran 2025</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-400">Terakhir update: 2 menit lalu</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
            </div>

            {/* --- 2. STATS RIBBON (Lebih Rapi & Menyatu) --- */}
            {/* Menggunakan background abu-abu tipis untuk membungkus data agar fokus */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    
                    {/* Stat 1 */}
                    <div className="px-4 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Valuasi</span>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-sm font-medium text-gray-500">Rp</span>
                            <span className={`text-3xl font-extrabold text-${PRIMARY_COLOR}-600 tabular-nums tracking-tight`}>
                                {stats.totalValuasi}
                            </span>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="px-4 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fisik</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-gray-800 tabular-nums">
                                {stats.totalAset}
                            </span>
                            <span className="text-sm font-medium text-gray-500 bg-white border px-2 py-0.5 rounded-full">Unit Aset</span>
                        </div>
                    </div>

                    {/* Stat 3 (Alert) */}
                    <div className="px-4 flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Rusak Berat</span>
                            <a href="#" className="text-xs text-red-600 hover:underline">Lihat Detail &rarr;</a>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-red-600 tabular-nums">
                                {stats.asetRusakBerat}
                            </span>
                            <span className="text-xs text-red-400 font-medium">Butuh Penghapusan</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. MAIN CONTENT GRID (2 Kolom: 70% Chart, 30% List) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: Chart Kondisi */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Analisis Kondisi</h3>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded transition-colors">
                            Download PDF
                        </button>
                    </div>

                    {/* Chart Container - Tinggi dikurangi biar compact */}
                    <div className="relative h-[220px] w-full pt-6">
                        {/* Grid lines background */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-gray-300">
                           <div className="border-b border-dashed border-gray-200 w-full h-0"></div>
                           <div className="border-b border-dashed border-gray-200 w-full h-0"></div>
                           <div className="border-b border-dashed border-gray-200 w-full h-0"></div>
                           <div className="border-b border-gray-300 w-full h-0"></div> {/* Base line solid */}
                        </div>

                        {/* Bars Layout using Grid to fix alignment issues */}
                        <div className="absolute inset-0 grid grid-cols-3 gap-8 items-end px-4">
                            {stats.kondisiData.map((data, index) => {
                                const heightPct = (data.value / (maxValue || 1)) * 100;
                                return (
                                    <div key={index} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                                        {/* Value Indicator (muncul saat hover) */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-xs font-bold text-gray-600 bg-white px-2 py-0.5 shadow-sm border rounded">
                                            {data.value} Unit
                                        </div>
                                        
                                        {/* The Bar */}
                                        <div 
                                            className={`w-full max-w-[80px] rounded-t-sm transition-all duration-500 relative
                                                ${data.label === 'Baik' ? `bg-${PRIMARY_COLOR}-500 hover:bg-${PRIMARY_COLOR}-600` : 
                                                  data.label === 'Kurang Baik' ? 'bg-amber-400 hover:bg-amber-500' : 
                                                  'bg-rose-500 hover:bg-rose-600'}`}
                                            style={{ height: `${heightPct}%` }}
                                        >
                                            {/* Label percentage inside bar if tall enough, else above */}
                                            {heightPct > 15 && (
                                                <div className="absolute top-2 w-full text-center text-[10px] font-bold text-white/90">
                                                    {((data.value / stats.totalAset) * 100).toFixed(0)}%
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* X-Axis Label */}
                                        <div className="mt-3 text-center">
                                            <p className="text-sm font-semibold text-gray-700 leading-none">{data.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Sebaran Lokasi (Compact List) */}
                <div className="border-l border-gray-100 pl-0 lg:pl-8">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Sebaran Lokasi</h3>
                        <a href="#" className={`text-xs font-bold text-${PRIMARY_COLOR}-600 hover:underline`}>Kelola</a>
                    </div>

                    <div className="space-y-5">
                        {[
                            { name: 'Gudang Utama A', val: 20, color: 'bg-blue-500' },
                            { name: 'Gudang Utama B', val: 15, color: 'bg-blue-400' },
                            { name: 'Gudang Utama C', val: 10, color: 'bg-blue-300' },
                            { name: 'Lainnya', val: 25, color: 'bg-gray-300' },
                        ].map((loc, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">{loc.name}</span>
                                    <span className="text-gray-400 tabular-nums">{loc.val}%</span>
                                </div>
                                {/* Progress Bar Visual */}
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className={`h-1.5 rounded-full ${loc.color}`} 
                                        style={{ width: `${loc.val}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100">
                         <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 flex items-start gap-2">
                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p>Data lokasi diperbarui otomatis berdasarkan input inventaris harian.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;