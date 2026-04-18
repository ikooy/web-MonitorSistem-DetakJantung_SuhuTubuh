import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Heart, Home, LayoutDashboard, History } from 'lucide-react';

export function Layout({ children, className }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className={twMerge("min-h-screen bg-slate-50 font-sans flex flex-col", className)}>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-xl text-slate-800 tracking-tight">TugasAkhir</span>
                            </Link>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link
                                    to="/"
                                    className={clsx(
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        isActive('/')
                                            ? "border-blue-500 text-slate-900"
                                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    )}
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className={clsx(
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        isActive('/dashboard')
                                            ? "border-blue-500 text-slate-900"
                                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    )}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                                {/* TAMBAHAN MENU RIWAYAT */}
                                <Link
                                    to="/riwayat"
                                    className={clsx(
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        isActive('/riwayat')
                                            ? "border-blue-500 text-slate-900"
                                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    )}
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    Riwayat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-slate-500">
                        &copy; Tugas Akhir Kelompok 4 2026.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export function Container({ children, className }) {
    return (
        <div className={twMerge("bg-white rounded-2xl shadow-sm border border-slate-100 p-6", className)}>
            {children}
        </div>
    );
}