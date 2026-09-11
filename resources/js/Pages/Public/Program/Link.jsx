import { ProgramSingle } from './Inklusi';

export default function LinkPage({ program = {}, contents, sectionTitle }) {
    if ((contents !== undefined || sectionTitle !== undefined) && (!program || !program.judul)) {
        const first = Array.isArray(contents) ? contents[0] : null;
        const merged = {
            judul: first?.judul || sectionTitle || 'LINK',
            nama_menu: first?.nama_menu || sectionTitle || 'Program LLD UNPAM',
            gambar: first?.gambar,
            deskripsi: first?.deskripsi,
        };
        return <ProgramSingle program={merged} />;
    }
    return <ProgramSingle program={program} />;
}
