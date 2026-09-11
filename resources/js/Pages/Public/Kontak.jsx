import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { route } from '../../lib/route';

export default function Kontak() {
    const { flash } = usePage().props;
    const form = useForm({ nama: '', email: '', pesan: '' });
    const submit = (e) => {
        e.preventDefault();
        form.post(route('kontak.kirim'));
    };

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Informasi &amp; Lokasi
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                            KONTAK KAMI
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5">
                            Lembaga Layanan Disabilitas — Universitas Pamulang
                        </p>
                        <a
                            href="https://linktr.ee/lld_unpam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2196f3] hover:bg-[#1976d2] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <img src="/assets/Linktree.png" alt="Linktree" className="w-4 h-4 object-contain" />
                            Kunjungi Linktree Kami
                        </a>
                    </div>

                    {/* Content Grid & Form */}
                    <div className="space-y-8">
                        {/* Campus Location Boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { nama: 'Kampus Pusat', icon: 'bi-geo-alt-fill', alamat: 'Jl. Surya Kencana No.1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417' },
                                { nama: 'Kampus Viktor', icon: 'bi-geo-alt-fill', alamat: 'Jl. Raya Puspitek, Buaran, Kec. Pamulang, Kota Tangerang Selatan, Banten 15310' },
                                { nama: 'Kampus Witana Harja', icon: 'bi-geo-alt-fill', alamat: 'Jl. Witana Harja No.18b, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan' },
                                { nama: 'Kampus Serang', icon: 'bi-geo-alt-fill', alamat: 'Jl. Lintas Serang - Jakarta Kampung Malandang, Kel. Kelodran, Kec. Walantaka, Kota Serang, Banten 42183' },
                            ].map((k) => (
                                <div key={k.nama} className="bg-white border border-slate-200/80 border-l-4 border-l-[#2196f3] rounded-2xl p-5 text-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 dark:border-white/10 dark:border-l-4 dark:border-l-[#2196f3] dark:bg-slate-900/60 dark:text-slate-200">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                                        <i className={`bi ${k.icon} text-[#2196f3]`}></i> {k.nama}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {k.alamat}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Contact Form Wrap */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hubungi Kami</h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">Silakan kirimkan pesan, pertanyaan, atau saran melalui formulir di bawah ini.</p>
                            </div>

                            {flash?.success && (
                                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-700/40 dark:text-emerald-300">
                                    <i className="bi bi-check-circle-fill text-emerald-600 dark:text-emerald-400"></i>
                                    <span>{flash.success}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="nama"
                                            placeholder="Nama Anda"
                                            value={form.data.nama}
                                            onChange={(e) => form.setData('nama', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/20 focus:bg-white transition-all dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-slate-400"
                                        />
                                        {form.errors.nama && <p className="text-red-500 text-xs mt-1">{form.errors.nama}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Alamat Email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/20 focus:bg-white transition-all dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-slate-400"
                                        />
                                        {form.errors.email && <p className="text-red-500 text-xs mt-1">{form.errors.email}</p>}
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        name="pesan"
                                        rows="4"
                                        placeholder="Tuliskan pesan Anda..."
                                        value={form.data.pesan}
                                        onChange={(e) => form.setData('pesan', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/20 focus:bg-white transition-all resize-y dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-slate-400"
                                    ></textarea>
                                    {form.errors.pesan && <p className="text-red-500 text-xs mt-1">{form.errors.pesan}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full py-3.5 px-6 rounded-xl bg-[#2196f3] hover:bg-[#1976d2] disabled:opacity-50 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <i className="bi bi-send-fill text-xs"></i>
                                    <span>{form.processing ? 'Mengirim...' : 'Kirim Pesan'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
