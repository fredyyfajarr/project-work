<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAkademikRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idMahasiswa' => ['sometimes', 'required', 'exists:mahasiswa,idMahasiswa'],
            'semester' => ['required', 'integer', 'min:1', 'max:14'],
            'ips' => ['required', 'numeric', 'min:0', 'max:4'],
            'ipk' => ['required', 'numeric', 'min:0', 'max:4'],
        ];
    }

    public function messages(): array
    {
        return [
            'idMahasiswa.required' => 'Mahasiswa wajib dipilih.',
            'idMahasiswa.exists' => 'Data mahasiswa tidak ditemukan.',
            'semester.required' => 'Semester wajib diisi.',
            'semester.integer' => 'Semester harus berupa angka.',
            'semester.min' => 'Semester minimal 1.',
            'semester.max' => 'Semester maksimal 14.',
            'ips.required' => 'IPS wajib diisi.',
            'ips.numeric' => 'IPS harus berupa angka.',
            'ips.min' => 'IPS minimal 0.',
            'ips.max' => 'IPS maksimal 4.',
            'ipk.required' => 'IPK wajib diisi.',
            'ipk.numeric' => 'IPK harus berupa angka.',
            'ipk.min' => 'IPK minimal 0.',
            'ipk.max' => 'IPK maksimal 4.',
        ];
    }
}
