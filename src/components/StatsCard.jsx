import React from 'react';
import { clsx } from 'clsx';

export function StatsCard({ title, value, unit, icon: Icon, status, subtitle, color = "blue" }) {
    const isNormal = status === 'normal' || status === 'Normal' || status === 'AMAN';
    const isDanger = !isNormal && status;

    // Status color logic if provided, otherwise default
    const statusColor = isNormal ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
    const iconColor = isNormal ? 'text-emerald-500' : (isDanger ? 'text-rose-500' : 'text-blue-500');

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center sm:items-start sm:text-left transition-all hover:shadow-md">
            <div className={clsx("p-3 rounded-full mb-4", isDanger ? "bg-rose-100" : "bg-blue-50")}>
                <Icon className={clsx("w-8 h-8", isDanger ? "text-rose-600" : "text-blue-600")} />
            </div>

            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>

            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">{value}</span>
                {unit && <span className="text-xl text-slate-400 font-medium">{unit}</span>}
            </div>

            {status && (
                <div className={clsx("mt-4 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5", statusColor)}>
                    <span className="relative flex h-2 w-2">
                        <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isNormal ? "bg-emerald-400" : "bg-rose-400")}></span>
                        <span className={clsx("relative inline-flex rounded-full h-2 w-2", isNormal ? "bg-emerald-500" : "bg-rose-500")}></span>
                    </span>
                    {status}
                </div>
            )}

            {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </div>
    );
}
