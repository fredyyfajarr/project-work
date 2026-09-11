import { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

function useCountUp(target, duration = 2000) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const end = Number(target) || 0;
        let step = 0;
        const steps = 100;
        const timer = setInterval(() => {
            step += 1;
            const current = Math.min(Math.ceil((end / steps) * step), end);
            setValue(current);
            if (current >= end) clearInterval(timer);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [target]);
    return value;
}

function StatBox({ statKey, stat }) {
    const value = useCountUp(stat?.value ?? 0);
    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xl hover:-translate-y-1 transition duration-300">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-100 font-mono drop-shadow-sm">
                {value}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 uppercase tracking-wider text-center">
                {stat?.label ?? statKey}
            </p>
        </div>
    );
}

function stripTags(html) {
    return String(html ?? '').replace(/<[^>]*>/g, '');
}

export default function Home({ homeStats = {}, beritaHome = [] }) {
    const { flash } = usePage().props;
    const [stats, setStats] = useState(homeStats);
    const entries = Object.entries(stats || {});
    const berita = Array.isArray(beritaHome) ? beritaHome : [];
    const kontak = useForm({ nama: '', email: '', pesan: '' });
    const kirim = (e) => {
        e.preventDefault();
        kontak.post('/kontak', { preserveScroll: true });
    };
    const fetched = useRef(false);

    useEffect(() => {
        setStats(homeStats);
    }, [homeStats]);

    useEffect(() => {
        let alive = true;
        const refresh = async () => {
            try {
                const res = await fetch('/statistik/data', { headers: { Accept: 'application/json' }, cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                if (!alive || !data?.cards) return;
                setStats((prev) => {
                    const next = { ...prev };
                    Object.keys(data.cards).forEach((key) => {
                        if (!next[key]) return;
                        next[key] = { ...next[key], value: Number(data.cards[key].value || 0) };
                    });
                    return next;
                });
            } catch (e) {
                // abaikan bila server offline
            }
        };
        if (!fetched.current) {
            fetched.current = true;
            refresh();
        }
        const timer = setInterval(refresh, 15000);
        return () => {
            alive = false;
            clearInterval(timer);
        };
    }, []);

    return (
        <PublicLayout>
            {/* HERO SECTION */}
            <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-24 sm:pb-32 px-4 text-center overflow-hidden">
                {/* Background Image UNPAM Campus (Crisp, Natural, Fixed) */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/BG UNPAM.jpg')" }}
                />
                {/* Clean Contrast Shadow Overlay (Natural, No Color Fog) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-[#050d24]" />

                {/* Soft Bottom Fade / Gradasi Transition from Dark Hero to Light Academic / Dark Midnight */}
                <div
                    className="absolute -bottom-px left-0 right-0 h-36 sm:h-52 pointer-events-none bg-gradient-to-b from-transparent via-[#eef5fb]/40 to-[#eef5fb] dark:from-transparent dark:via-[#050d24]/60 dark:to-[#050d24] z-[5]"
                    aria-hidden="true"
                />

                {/* Content Container */}
                <div className="relative z-10 container mx-auto max-w-5xl px-4 flex flex-col items-center">
                    {/* Logos Instansi */}
                    <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
                        <img src="/assets/Logo Yayasan Sasmita Jaya.png" alt="Logo Yayasan" className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg" />
                        <img src="/assets/Logo UNPAM.png" alt="Logo UNPAM" className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg" />
                        <img src="/assets/Logo LLD.png" alt="Logo LLD" className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg" />
                    </div>

                    {/* Headline */}
                    <div className="mt-2 mb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                            LEMBAGA LAYANAN DISABILITAS
                        </h1>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-400 mt-2 tracking-wide drop-shadow">
                            UNIVERSITAS PAMULANG
                        </h2>
                        <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base text-slate-200/90 leading-relaxed font-light">
                            Pusat navigasi akademik dan dukungan inklusif bagi mahasiswa penyandang disabilitas Universitas Pamulang.
                        </p>
                    </div>

                    {/* Realtime Statistics Counter Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
                        {entries.map(([key, stat]) => (
                            <StatBox key={key} statKey={key} stat={stat} />
                        ))}
                    </div>

                    {/* CTA Button UNPAM Blue */}
                    <div className="mt-8">
                        <Link
                            href="/statistik"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2196f3] hover:bg-[#1976d2] px-8 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition duration-200 hover:scale-105 active:scale-95"
                        >
                            <i className="bi bi-bar-chart-fill" />
                            <span>Statistik Lengkap LLD</span>
                        </Link>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        {[
                            { href: 'https://www.instagram.com/lld_unpam', icon: 'bi-instagram', label: 'Instagram' },
                            { href: 'https://lld.unpam.ac.id/', icon: 'bi-globe', label: 'Website' },
                            { href: 'https://www.youtube.com/@LLD_UNPAM', icon: 'bi-youtube', label: 'YouTube' },
                            { href: 'https://www.tiktok.com/@lld.unpam', icon: 'bi-tiktok', label: 'TikTok' },
                        ].map((soc) => (
                            <a
                                key={soc.label}
                                href={soc.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={soc.label}
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#2196f3] hover:text-white hover:scale-110 transition duration-200 shadow-md backdrop-blur-sm"
                            >
                                <i className={`bi ${soc.icon} text-lg`} />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* BERITA ACARA SECTION */}
            <section className="py-20 px-4 bg-[#eef5fb] text-slate-800 dark:bg-[#050d24] dark:text-white transition-colors duration-300">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Dokumentasi &amp; Kegiatan
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                            BERITA ACARA
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {berita.length === 0 ? (
                            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
                                Belum ada berita acara aktif.
                            </div>
                        ) : (
                            berita.map((b, i) => {
                                const judul = b?.judul || 'Berita Acara LLD UNPAM';
                                const deskripsi = b?.deskripsi || 'Informasi berita acara LLD UNPAM.';
                                const gambar = b?.gambar || 'assets/dummy.jpg';
                                const src = /^https?:\/\//.test(gambar) ? gambar : `/${String(gambar).replace(/^\//, '')}`;
                                const linkBerita = b?.link_berita || null;
                                const tanggalUpdate = b?.tanggalUpdate || b?.updated_at || null;
                                let tanggal = null;
                                if (tanggalUpdate) {
                                    try {
                                        tanggal = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(tanggalUpdate));
                                    } catch (e) {
                                        tanggal = null;
                                    }
                                }
                                const cardUrl = linkBerita || '/luaran/berita';
                                return (
                                    <a
                                        key={b?.idCms || i}
                                        href={cardUrl}
                                        target={linkBerita ? '_blank' : '_self'}
                                        rel={linkBerita ? 'noopener noreferrer' : ''}
                                        className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:border-[#2196f3] hover:-translate-y-1.5 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md dark:hover:border-[#2196f3]/50"
                                    >
                                        <div className="h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                                            <img src={src} alt={judul} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <span className="inline-block rounded-full bg-[#e3f2fd] border border-[#bbdefb] px-2.5 py-0.5 text-[10px] font-bold text-[#1976d2] uppercase mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                                                    BERITA
                                                </span>
                                                <h3 className="text-base font-bold text-slate-900 transition group-hover:text-[#1976d2] line-clamp-2 dark:text-white dark:group-hover:text-sky-300">
                                                    {judul}
                                                </h3>
                                                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3 dark:text-slate-300">
                                                    {stripTags(deskripsi).slice(0, 130)}
                                                </p>
                                            </div>
                                            {tanggal && <small className="mt-4 block text-[11px] text-slate-500 dark:text-slate-400">{tanggal}</small>}
                                        </div>
                                    </a>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/luaran/berita"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-xs font-bold text-[#1976d2] shadow-sm transition duration-200 hover:bg-[#2196f3] hover:text-white hover:border-[#2196f3] dark:border-sky-400/30 dark:bg-white/10 dark:text-white dark:backdrop-blur-sm dark:hover:bg-[#2196f3]"
                        >
                            <span>Lihat Semua Berita Acara</span>
                            <i className="bi bi-arrow-right" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* KONTAK & ALAMAT SECTION */}
            <section className="py-20 px-4 bg-white dark:bg-[#071330] transition-colors duration-300">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                            KONTAK KAMI
                        </h2>
                        <p className="text-xs text-[#1976d2] dark:text-sky-300 font-bold tracking-wider mt-1 uppercase">
                            LEMBAGA LAYANAN DISABILITAS — UNIVERSITAS PAMULANG
                        </p>
                        <div className="mt-4">
                            <a
                                href="https://linktr.ee/lld_unpam"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#2196f3] hover:bg-[#1976d2] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:scale-105 active:scale-95"
                            >
                                <img src="/assets/Linktree.png" alt="Linktree" className="h-4 w-4 object-contain" />
                                <span>Kunjungi Linktree</span>
                            </a>
                        </div>
                    </div>

                    {/* 4 Kampus Cards */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {[
                            { nama: 'Kampus Pusat', alamat: 'Jl. Surya Kencana No.1, Pamulang Barat, Tangerang Selatan' },
                            { nama: 'Kampus Viktor', alamat: 'Jl. Raya Puspitek, Buaran, Tangerang Selatan' },
                            { nama: 'Kampus Witana Harja', alamat: 'Jl. Witana Harja No.18B, Pamulang Barat, Tangerang Selatan' },
                            { nama: 'Kampus Serang', alamat: 'Jl. Lintas Serang - Jakarta, Kota Serang, Banten' },
                        ].map((k) => (
                            <div key={k.nama} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-xs hover:border-[#2196f3]/50 transition dark:border-white/15 dark:bg-white/5 dark:backdrop-blur-md dark:hover:border-[#2196f3]/40">
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                                    <i className="bi bi-geo-alt-fill text-[#2196f3] dark:text-sky-400" />
                                    <span>{k.nama}</span>
                                </h4>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{k.alamat}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form Hubungi Kami */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 shadow-lg dark:border-white/15 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Kirim Pesan ke Pengelola</h3>
                        <form onSubmit={kirim} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={kontak.data.nama}
                                    onChange={(e) => kontak.setData('nama', e.target.value)}
                                    placeholder="Nama Anda"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-slate-400"
                                />
                                <input
                                    type="email"
                                    value={kontak.data.email}
                                    onChange={(e) => kontak.setData('email', e.target.value)}
                                    placeholder="Alamat Email"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-slate-400"
                                />
                            </div>
                            <textarea
                                value={kontak.data.pesan}
                                onChange={(e) => kontak.setData('pesan', e.target.value)}
                                placeholder="Tuliskan pesan atau pertanyaan Anda..."
                                rows="3"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={kontak.processing}
                                className="w-full rounded-xl bg-[#2196f3] hover:bg-[#1976d2] py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                            >
                                {kontak.processing ? 'Mengirim...' : 'Kirim Pesan'}
                            </button>
                        </form>
                        {flash?.success && (
                            <p className="mt-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">{flash.success}</p>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
