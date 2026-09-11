import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { route } from '../../lib/route';

export default function Login({ flash }) {
    const form = useForm({ username: '', password: '' });
    const [show, setShow] = useState(false);
    const submit = (e) => { e.preventDefault(); form.post(route('login')); };
    return (
        <AuthLayout title="Login Sistem" subtitle="Admin & Mahasiswa LLD UNPAM" flash={flash}>
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
                            placeholder="Masukkan username atau NIM" 
                            required 
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20" 
                        />
                    </div>
                    {form.errors.username && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.username}</div>}
                </div>

                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <Link href={route('forgot.password')} className="text-xs font-medium text-[#2196f3] hover:text-[#1976d2] hover:underline dark:text-sky-400 dark:hover:text-sky-300">
                            Lupa Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <i className="bi bi-lock text-lg leading-none" />
                        </div>
                        <input 
                            type={show ? 'text' : 'password'} 
                            value={form.data.password} 
                            onChange={(e) => form.setData('password', e.target.value)} 
                            placeholder="Masukkan password" 
                            required 
                            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:border-[#2196f3] focus:ring-4 focus:ring-[#2196f3]/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950 dark:focus:border-sky-400 dark:focus:ring-sky-400/20" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShow(!show)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition"
                            aria-label="Lihat password"
                        >
                            <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} text-lg leading-none`} />
                        </button>
                    </div>
                    {form.errors.password && <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{form.errors.password}</div>}
                </div>

                <button 
                    type="submit" 
                    disabled={form.processing} 
                    className="h-12 w-full rounded-xl bg-[#2196f3] hover:bg-[#1976d2] px-4 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer dark:bg-[#2196f3] dark:hover:bg-[#1e88e5]"
                >
                    <i className="bi bi-box-arrow-in-right text-lg leading-none" />
                    <span>{form.processing ? 'Memproses...' : 'Masuk ke Sistem'}</span>
                </button>
            </form>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                    <i className="bi bi-info-circle-fill text-[#2196f3] dark:text-sky-400 text-sm mt-0.5 shrink-0" />
                    <div className="leading-relaxed">
                        <strong className="font-semibold text-slate-900 dark:text-white">Petunjuk Login Mahasiswa:</strong><br />
                        Username berupa <strong>NIM</strong>. Password default: <span className="font-mono font-semibold text-[#1976d2] bg-blue-100/70 px-1.5 py-0.5 rounded dark:bg-sky-950/80 dark:text-sky-300">lld#6digitakhirNIM</span>.<br />
                        <span className="text-slate-500 dark:text-slate-400">Contoh: NIM 231011407273 → password <strong>lld#407273</strong>.</span>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
