<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCmsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'menu_slug' => ['sometimes', 'required', 'string', 'max:100'],
            'judul' => ['required', 'string', 'max:150'],
            'deskripsi' => ['nullable', 'string'],
            'link_berita' => ['nullable', 'url', 'max:255'],
            'urutan' => ['nullable', 'integer', 'min:1'],
            'gambar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
        ];
    }

    public function messages(): array
    {
        return [
            'menu_slug.required' => 'Lokasi menu CMS wajib dipilih.',
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 150 karakter.',
            'link_berita.url' => 'Link berita harus berupa URL lengkap, contoh: https://example.com/berita.',
            'urutan.integer' => 'Urutan harus berupa angka.',
            'urutan.min' => 'Urutan minimal 1.',
            'gambar.image' => 'File gambar harus berupa gambar.',
            'gambar.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
            'gambar.max' => 'Ukuran gambar maksimal 4 MB.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus aktif atau nonaktif.',
        ];
    }
}
