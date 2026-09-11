import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { route } from '../../lib/route';

export default function ResetPassword({ token = '', username = '', flash }) {
    const form = useForm({
        token: token || '',
        username: username || '',
        password: '',
        password_confirmation: '',
    });
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        form.post(route('password.store'));
    };
    return (
        <AuthLayout title="Reset Password" subtitle="Buat kata sandi baru akun Anda" flash={flash}>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Username</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-person text-lg leading-none" />
                        </div>
                        <input
                            value={form.data.username}
                            onChange={(e) => form.setData('username', e.target.value)}
                            placeholder="Masukkan username"
                            readOnly
                            required
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none cursor-not-allowed dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-400"
                        />
                    </div>
                    {form.errors.username && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.username}</div>}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Password Baru</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-lock text-lg leading-none" />
                        </div>
                        <input
                            type={show ? 'text' : 'password'}
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            required
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
                        />
                        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition">
                            <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} text-lg leading-none`} />
                        </button>
                    </div>
                    {form.errors.password && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.password}</div>}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Konfirmasi Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-shield-lock text-lg leading-none" />
                        </div>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={form.data.password_confirmation}
                            onChange={(e) => form.setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password baru"
                            required
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition">
                            <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'} text-lg leading-none`} />
                        </button>
                    </div>
                    {form.errors.password_confirmation && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.password_confirmation}</div>}
                </div>

                {form.errors.token && <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.token}</div>}

                <button 
                    type="submit" 
                    disabled={form.processing} 
                    className="h-12 w-full rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-4 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer dark:bg-[#2196f3] dark:hover:bg-[#1e88e5]"
                >
                    <i className="bi bi-check2-circle text-lg leading-none" />
                    <span>{form.processing ? 'Menyimpan...' : 'Simpan Password Baru'}</span>
                </button>

                <div className="pt-2 text-center">
                    <Link href={route('login')} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2196f3] hover:text-[#1976d2] hover:underline dark:text-sky-400 dark:hover:text-sky-300">
                        <i className="bi bi-arrow-left" /> Kembali ke Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
