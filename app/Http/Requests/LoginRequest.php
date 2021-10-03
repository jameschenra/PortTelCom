<?php

namespace App\Http\Requests;

// use App\Exceptions\ValidateException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;


class LoginRequest extends FormRequest
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
            'username' => 'required|email',
            'password' => 'required',
            'deviceID' => 'required|regex:/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/',
            'deviceName' => 'required|max:60'
        ];
    }

    public function attributes()
    {
        return [
            'username' => 'Username',
            'password' => 'Password',
            'deviceID' => 'Device ID',
            'deviceName' => 'Device Name'
        ];
    }

    public function messages()
    {
        return [
            //'max' => ['length', 'Device Name is longer than 60 characters!']
            // 'email.required' => 'email is required!',
        ];
    }

    /* protected function failedValidation(Validator $validator)
    {
        throw (new ValidateException($validator));
    } */
}
