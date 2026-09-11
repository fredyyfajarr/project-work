<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAspirasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subjek' => ['required', 'string', 'max:150'],
            'kategori' => ['required', 'string', 'max:100'],
            'pesan' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'subjek.required' => 'Subjek aspirasi wajib diisi.',
            'subjek.max' => 'Subjek maksimal 150 karakter.',
            'kategori.required' => 'Kategori aspirasi wajib diisi.',
            'kategori.max' => 'Kategori maksimal 100 karakter.',
            'pesan.required' => 'Pesan aspirasi wajib diisi.',
        ];
    }
}
