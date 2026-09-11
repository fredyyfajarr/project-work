<?php

namespace App\Http\Requests;

class UpdateMahasiswaRequest extends StoreMahasiswaRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['nim'] = ['required', 'string', 'max:20', 'unique:mahasiswa,nim,'.$this->route('id').',idMahasiswa'];

        return $rules;
    }
}
