<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServerRequest extends FormRequest
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
            'countryID' => 'required|exists:countries,id',
            'number' => 'required|integer|min:0',
            'ip' => 'required|ip',
            'port' => 'required|integer|between:0,65535',
            'active' => 'required|boolean'
        ];
    }

    public function messages()
    {
        return [
            'number.integer' => 'format' . '#' . 'Number must be positive number!',
            'number.min' => 'format' . '#' . 'Number must be positive number!',
            'ip.ip' => 'format' . '#' . 'Invalid IP address!',
            'port.integer' => 'format' . '#' . 'Invalid port number!',
            'port.between' => 'format' . '#' . 'Invalid port number!'
        ];
    }

    public function attributes()
    {
        return [
            'countryID' => 'country',
            'number' => 'number',
            'ip' => 'IP',
            'port' => 'port',
            'active' => 'active'
        ];
    }
}
