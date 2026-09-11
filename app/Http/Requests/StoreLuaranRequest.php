<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLuaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Admin mengisi fileBukti sebagai teks path, mahasiswa mengunggah file.
        $fileBukti = $this->hasFile('fileBukti')
            ? ['file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120']
            : ['string', 'max:255'];

        return [
            'idMahasiswa' => ['sometimes', 'required', 'exists:mahasiswa,idMahasiswa'],
            'judul' => ['required', 'string', 'max:150'],
            'jenisLuaran' => ['required', 'string', 'max:100'],
            'tingkat' => ['nullable', 'string', 'max:50'],
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'deskripsi' => ['nullable', 'string'],
            'fileBukti' => array_merge(['nullable'], $fileBukti),
            'status' => ['sometimes', 'string', 'in:pending,diterima,ditolak'],
        ];
    }

    public function messages(): array
    {
        return [
            'idMahasiswa.required' => 'Mahasiswa wajib dipilih.',
            'idMahasiswa.exists' => 'Data mahasiswa tidak ditemukan.',
            'judul.required' => 'Judul luaran wajib diisi.',
            'judul.max' => 'Judul maksimal 150 karakter.',
            'jenisLuaran.required' => 'Jenis luaran wajib diisi.',
            'jenisLuaran.max' => 'Jenis luaran maksimal 100 karakter.',
            'tahun.integer' => 'Tahun harus berupa angka.',
            'fileBukti.file' => 'Bukti harus berupa file.',
            'fileBukti.mimes' => 'Bukti harus berformat PDF, JPG, JPEG, PNG, atau WEBP.',
            'fileBukti.max' => 'Ukuran bukti maksimal 5 MB.',
            'status.in' => 'Status harus pending, diterima, atau ditolak.',
        ];
    }
}
