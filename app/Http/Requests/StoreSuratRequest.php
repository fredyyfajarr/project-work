<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jenisSurat' => ['required', 'string', 'max:100'],
            'kodePejabat' => ['required', 'string', 'max:50'],
            'kodeSurat' => ['required', 'string', 'max:50'],
            'kodePerihal' => ['nullable', 'string', 'max:50'],
            'perihal' => ['required', 'string', 'max:255'],
            'tujuanSurat' => ['nullable', 'string', 'max:255'],
            'tanggalSurat' => ['required', 'date'],
            'penandatangan' => ['nullable', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:draft,keluar,arsip'],
        ];
    }

    public function messages(): array
    {
        return [
            'jenisSurat.required' => 'Jenis surat wajib diisi.',
            'kodePejabat.required' => 'Kode pejabat wajib diisi.',
            'kodeSurat.required' => 'Kode surat wajib diisi.',
            'perihal.required' => 'Perihal wajib diisi.',
            'tanggalSurat.required' => 'Tanggal surat wajib diisi.',
            'tanggalSurat.date' => 'Tanggal surat harus berupa tanggal yang valid.',
            'status.in' => 'Status harus draft, keluar, atau arsip.',
        ];
    }
}
