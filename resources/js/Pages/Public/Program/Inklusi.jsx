import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { route } from '../../../lib/route';

function assetSrc(gambar, fallback = 'assets/dummy.jpg') {
    const g = gambar || fallback;
    const s = String(g);
    if (/^https?:\/\//.test(s)) return s;
    return `/${s.replace(/^\//, '')}`;
}

export function ProgramSingle({ program = {} }) {
    const p = program || {};
    const judul = p.judul || 'Program LLD';
    const namaMenu = p.nama_menu || 'Program LLD UNPAM';
    const deskripsi = p.deskripsi || 'Konten program belum tersedia.';
    const gambar = assetSrc(p.gambar);

    return (
        <PublicLayout>
            <section className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#eef5fb] dark:bg-[#050d24] transition-colors duration-300">
                <div className="container mx-auto max-w-4xl space-y-8">
                    <div className="text-center mb-8">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#e3f2fd] border border-[#bbdefb] text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-2 dark:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300">
                            Program Kerja LLD
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {judul}
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {namaMenu}
                        </p>
                    </div>

                    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-md">
                        {p.gambar && (
                            <div className="w-full max-h-[480px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                                <img
                                    src={gambar}
                                    alt={judul}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6 sm:p-10 space-y-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {judul}
                            </h2>
                            <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line text-justify">
                                {deskripsi}
                            </p>
                        </div>
                    </article>

                    <div className="text-center pt-4">
                        <Link
                            href={route('program.index')}
                            className="inline-flex items-center gap-2 rounded-full border border-[#2196f3] bg-white px-7 py-3 text-xs font-bold text-[#1976d2] shadow-xs transition duration-200 hover:bg-[#2196f3] hover:text-white dark:bg-white/10 dark:text-white dark:border-sky-400/30"
                        >
                            <i className="bi bi-arrow-left" />
                            <span>Kembali ke Daftar Program</span>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

export default function Inklusi({ program = {}, contents, sectionTitle }) {
    if ((contents !== undefined || sectionTitle !== undefined) && (!program || !program.judul)) {
        const first = Array.isArray(contents) ? contents[0] : null;
        const merged = {
            judul: first?.judul || sectionTitle || 'Program LLD',
            nama_menu: first?.nama_menu || sectionTitle || 'Program LLD UNPAM',
            gambar: first?.gambar,
            deskripsi: first?.deskripsi,
        };
        return <ProgramSingle program={merged} />;
    }
    return <ProgramSingle program={program} />;
}
