<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nim' => ['required', 'string', 'max:20', 'unique:mahasiswa,nim'],
            'nama' => ['required', 'string', 'max:100'],
            'jurusan' => ['nullable', 'string', 'max:100'],
            'angkatan' => ['nullable', 'string', 'max:10'],
            'jalurMasuk' => ['nullable', 'string', 'max:50'],
            'jenisReguler' => ['nullable', 'string', 'max:50'],
            'disabilitas' => ['nullable', 'string', 'max:100'],
            'nik' => ['nullable', 'string', 'max:20'],
            'jenisKelamin' => ['nullable', 'string', 'in:L,P,Laki-laki,Perempuan'],
            'tempatLahir' => ['nullable', 'string', 'max:50'],
            'tanggalLahir' => ['nullable', 'date'],
            'agama' => ['nullable', 'string', 'max:20'],
            'noHp' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:100'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'fileKtp' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'fileKk' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'fileSuratKerja' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'fotoProfil' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'jenisHambatan' => ['nullable', 'string', 'max:100'],
            'levelHambatan' => ['nullable', 'string', 'max:50'],
            'kemampuanMobilitas' => ['nullable', 'string', 'max:100'],
            'kemampuanBahasa' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'in:aktif,cuti,nonaktif,lulus'],
            'namaAyah' => ['nullable', 'string', 'max:100'],
            'namaIbu' => ['nullable', 'string', 'max:100'],
            'pekerjaanAyah' => ['nullable', 'string', 'max:100'],
            'pekerjaanIbu' => ['nullable', 'string', 'max:100'],
            'noHpAyah' => ['nullable', 'string', 'max:20'],
            'noHpIbu' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'nim.required' => 'NIM wajib diisi.',
            'nim.max' => 'NIM maksimal 20 karakter.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'nama.required' => 'Nama mahasiswa wajib diisi.',
            'nama.max' => 'Nama maksimal 100 karakter.',
            'nik.max' => 'NIK maksimal 20 karakter.',
            'jenisKelamin.in' => 'Jenis kelamin harus L, P, Laki-laki, atau Perempuan.',
            'tanggalLahir.date' => 'Tanggal lahir harus berupa tanggal yang valid.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 100 karakter.',
            'status.in' => 'Status harus aktif, cuti, nonaktif, atau lulus.',
        ];
    }
}
