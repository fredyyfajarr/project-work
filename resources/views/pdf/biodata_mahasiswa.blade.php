<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Biodata Mahasiswa - {{ $m->nim ?? $m->idMahasiswa }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 18mm 15mm 18mm 15mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            color: #1e293b;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-bottom: 2.5px solid #1e3a8a;
            padding-bottom: 10px;
            margin-bottom: 18px;
        }
        .kop-instansi {
            text-align: center;
        }
        .kop-instansi h1 {
            font-size: 13pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .kop-instansi h2 {
            font-size: 15pt;
            font-weight: bold;
            color: #0f172a;
            margin: 2px 0;
            text-transform: uppercase;
        }
        .kop-instansi p {
            font-size: 8.5pt;
            color: #475569;
            margin: 2px 0 0 0;
        }
        .doc-title {
            text-align: center;
            margin: 15px 0 20px 0;
        }
        .doc-title h3 {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0;
            text-transform: uppercase;
            color: #0f172a;
        }
        .doc-title span {
            font-size: 9pt;
            color: #64748b;
        }
        .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            background-color: #f1f5f9;
            color: #1e3a8a;
            padding: 5px 8px;
            border-left: 4px solid #2563eb;
            margin-top: 15px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
            margin-bottom: 12px;
        }
        table.data-table td {
            padding: 4px 6px;
            vertical-align: top;
        }
        table.data-table td.label {
            width: 28%;
            color: #475569;
            font-weight: 500;
        }
        table.data-table td.colon {
            width: 3%;
            text-align: center;
        }
        table.data-table td.val {
            width: 69%;
            color: #0f172a;
            font-weight: 600;
        }
        table.grid-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 6px;
            margin-bottom: 14px;
        }
        table.grid-table th {
            background-color: #e2e8f0;
            color: #1e293b;
            border: 1px solid #cbd5e1;
            padding: 5px;
            text-align: center;
            font-weight: bold;
        }
        table.grid-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 6px;
            text-align: left;
        }
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 8.5pt;
            font-weight: bold;
        }
        .badge-blue { background-color: #dbeafe; color: #1e40af; }
        .badge-green { background-color: #dcfce7; color: #166534; }
        .signature-section {
            margin-top: 30px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
            font-size: 9.5pt;
        }
        .signature-box {
            text-align: center;
            width: 45%;
        }
    </style>
</head>
<body>

    <!-- KOP RESMI -->
    <table class="header-table">
        <tr>
            <td class="kop-instansi">
                <h1>UNIVERSITAS PAMULANG</h1>
                <h2>LEMBAGA LAYANAN DISABILITAS (LLD)</h2>
                <p>Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417</p>
                <p>Email: lld@unpam.ac.id | Website: lld.unpam.ac.id</p>
            </td>
        </tr>
    </table>

    <div class="doc-title">
        <h3>LEMBAR BIODATA MAHASISWA DISABILITAS</h3>
        <span>Nomor Induk / Arsip Data Akademik & Kemahasiswaan Inklusif</span>
    </div>

    <!-- 1. DATA PRIBADI & AKADEMIK -->
    <div class="section-title">I. IDENTITAS PRIBADI & AKADEMIK</div>
    <table class="data-table">
        <tr>
            <td class="label">Nama Lengkap</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->nama ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nomor Induk Mahasiswa (NIM)</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->nim ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Program Studi / Jurusan</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->jurusan ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Tahun Masuk / Angkatan</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->angkatan ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Kategori Disabilitas</td>
            <td class="colon">:</td>
            <td class="val"><span class="badge badge-blue">{{ $m->disabilitas ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="label">Status Mahasiswa</td>
            <td class="colon">:</td>
            <td class="val"><span class="badge badge-green">{{ strtoupper($m->status ?? 'AKTIF') }}</span></td>
        </tr>
        <tr>
            <td class="label">Tempat, Tanggal Lahir</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->tempatLahir ?? '-' }}, {{ $m->tanggalLahir ? date('d F Y', strtotime($m->tanggalLahir)) : '-' }}</td>
        </tr>
        <tr>
            <td class="label">Jenis Kelamin / Agama</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->jenisKelamin ?? '-' }} / {{ $m->agama ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nomor Handphone / WhatsApp</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->noHp ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Alamat Email</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->email ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Alamat Tempat Tinggal</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->alamat ?? '-' }}</td>
        </tr>
    </table>

    <!-- 2. DATA KELUARGA / WALI -->
    <div class="section-title">II. DATA KELUARGA & KONTAK DARURAT</div>
    <table class="data-table">
        <tr>
            <td class="label">Nama Ayah</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->namaAyah ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Pekerjaan Ayah</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->pekerjaanAyah ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">No. Telepon / HP Ayah</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->noHpAyah ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nama Ibu</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->namaIbu ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Pekerjaan Ibu</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->pekerjaanIbu ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">No. Telepon / HP Ibu</td>
            <td class="colon">:</td>
            <td class="val">{{ $m->keluarga?->noHpIbu ?? '-' }}</td>
        </tr>
    </table>

    <!-- 3. RIWAYAT AKADEMIK -->
    <div class="section-title">III. RIWAYAT PERKEMBANGAN AKADEMIK</div>
    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 15%;">Semester</th>
                <th style="width: 20%;">IPS</th>
                <th style="width: 20%;">IPK Kumulatif</th>
                <th style="width: 20%;">SKS Semester</th>
                <th style="width: 25%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($m->akademik as $akd)
                <tr>
                    <td class="text-center font-bold">Semester {{ $akd->semester }}</td>
                    <td class="text-center">{{ number_format((float)$akd->ips, 2) }}</td>
                    <td class="text-center font-bold">{{ number_format((float)$akd->ipk, 2) }}</td>
                    <td class="text-center">{{ $akd->sks ?? '-' }}</td>
                    <td class="text-center">{{ $akd->status ?? 'Aktif' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="color: #64748b; padding: 10px;">Belum ada riwayat akademik per semester yang dicatat.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- TANDA TANGAN & PENGESAHAN -->
    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td class="signature-box">
                    Mahasiswa Bersangkutan,
                    <br><br><br><br>
                    <strong><u>{{ $m->nama }}</u></strong><br>
                    NIM. {{ $m->nim ?? '-' }}
                </td>
                <td style="width: 10%;"></td>
                <td class="signature-box">
                    Tangerang Selatan, {{ date('d F Y') }}<br>
                    Kepala Lembaga Layanan Disabilitas,
                    <br><br><br><br>
                    <strong><u>Lembaga Layanan Disabilitas UNPAM</u></strong><br>
                    NIDN / NIP. Terlampir
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
