<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Store wajib unggah file; update boleh tanpa file baru.
        $fileRule = ($this->isMethod('put') || $this->isMethod('patch')) ? 'nullable' : 'required';

        return [
            'semester' => ['required', 'integer', 'min:1', 'max:14'],
            'judul_jadwal' => ['nullable', 'string', 'max:150'],
            'file_jadwal' => [$fileRule, 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120'],
            'keterangan' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'semester.required' => 'Semester wajib diisi.',
            'semester.integer' => 'Semester harus berupa angka.',
            'semester.min' => 'Semester minimal 1.',
            'semester.max' => 'Semester maksimal 14.',
            'file_jadwal.required' => 'File jadwal wajib diunggah.',
            'file_jadwal.file' => 'Jadwal harus berupa file.',
            'file_jadwal.mimes' => 'File jadwal harus berformat PDF, JPG, JPEG, PNG, atau WEBP.',
            'file_jadwal.max' => 'Ukuran file jadwal maksimal 5 MB.',
        ];
    }
}
