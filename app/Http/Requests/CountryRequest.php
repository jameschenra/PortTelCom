<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CountryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:40',
            'VAT' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'active' => 'required|boolean'
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Name',
            'active' => 'Active',
            'VAT' => 'VAT'
        ];
    }

    public function messages()
    {
        return [
            'VAT.regex' => 'format' . '#' . 'VAT must be 0 or positive floating-point number!'
        ];
    }
}
