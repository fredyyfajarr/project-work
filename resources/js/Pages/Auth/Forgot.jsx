import { Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { route } from '../../lib/route';

export default function Forgot({ flash }) {
    const form = useForm({ username: '', email: '' });
    const submit = (e) => { e.preventDefault(); form.post(route('password.email')); };
    return (
        <AuthLayout title="Lupa Password" subtitle="Ajukan permohonan reset kata sandi ke Admin LLD" flash={flash}>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Username / NIM
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-person text-lg leading-none" />
                        </div>
                        <input 
                            type="text" 
                            value={form.data.username} 
                            onChange={(e) => form.setData('username', e.target.value)} 
                            placeholder="Masukkan NIM mahasiswa atau username staff" 
                            required 
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20" 
                        />
                    </div>
                    {form.errors.username && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.username}</div>}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Email Terdaftar
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-envelope text-lg leading-none" />
                        </div>
                        <input 
                            type="email" 
                            value={form.data.email} 
                            onChange={(e) => form.setData('email', e.target.value)} 
                            placeholder="Masukkan alamat email akun Anda" 
                            required 
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20" 
                        />
                    </div>
                    {form.errors.email && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.email}</div>}
                </div>

                {/* Info Card Alur ACC */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-slate-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                        <i className="bi bi-shield-check text-[#2196f3] text-sm shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                            <strong className="text-slate-800 dark:text-slate-100">Alur Keamanan Akun:</strong>
                            <p className="mt-0.5">
                                Permohonan reset akan divalidasi oleh Admin LLD. Setelah di-ACC, Anda dapat menggunakan tautan reset yang diberikan untuk membuat kata sandi baru.
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={form.processing} 
                    className="h-12 w-full rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-4 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer dark:bg-[#2196f3] dark:hover:bg-[#1e88e5]"
                >
                    <i className="bi bi-send-check text-lg leading-none" />
                    <span>{form.processing ? 'Mengirim Permohonan...' : 'Ajukan Reset Password'}</span>
                </button>

                <div className="pt-2 text-center">
                    <Link href={route('login')} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2196f3] hover:text-[#1976d2] hover:underline dark:text-sky-400 dark:hover:text-sky-300">
                        <i className="bi bi-arrow-left" /> Sudah ingat password? Kembali ke Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
