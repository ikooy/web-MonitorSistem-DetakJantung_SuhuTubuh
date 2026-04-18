import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, LayoutDashboard, History, Menu, X } from 'lucide-react';

export function Layout({ children, className }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: "/", name: "Home", icon: Home },
        { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
        { path: "/riwayat", name: "Riwayat", icon: History },
    ];

    return (
        <div className={twMerge("min-h-screen bg-slate-50 font-sans flex flex-col", className)}>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
                            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <span className="font-bold text-sm sm:text-xl text-slate-800 tracking-tight">
                                TugasAkhir
                            </span>
                        </Link>

                        {/* Desktop Menu - tampil hanya di layar besar */}
                        <div className="hidden sm:flex sm:ml-8 sm:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={clsx(
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        isActive(link.path)
                                            ? "border-blue-500 text-slate-900"
                                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    )}
                                >
                                    <link.icon className="w-4 h-4 mr-2" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Tombol Menu untuk HP - tampil hanya di layar kecil */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - dropdown untuk HP */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-white border-t border-slate-200 py-2 px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive(link.path)
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
                    <p className="text-center text-xs sm:text-sm text-slate-500">
                        &copy; Tugas Akhir Kelompok 4 2026.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export function Container({ children, className }) {
    return (
        <div className={twMerge("bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6", className)}>
            {children}
        </div>
    );
}
