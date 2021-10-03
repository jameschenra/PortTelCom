<?php

namespace App\Http\Requests;

use App\Enums\UserType;
// use App\Exceptions\ValidateException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class RegisterRequest extends FormRequest
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

        $validation = [
            'email' => 'required|max:255|regex:/[a-zA-Z0-9_]+@[a-zA-Z0-9-]+\.com/|unique:users',
            'password' => 'required|min:6|max:40|regex:/^[A-Za-z0-9-_]+$/D',
            'countryID' => 'required|exists:countries,id',
            'type' => 'required|exists:user_types,id'
        ];

        $uri_path = request()->path();
        $uri_parts = explode('/', $uri_path);
        $uri_tail = end($uri_parts);

        if($uri_tail == 'create') {
            $validation['roleID'] = 'required|exists:roles,id';
        }

        $type = request()->input('type');

        if($type) {
            if ($type == UserType::COMPANY) {
                $validation = array_merge($validation, [
                    'companyName' => 'required|max:255',
                    'companyAddress' => 'required|max:255',
                    'companyRegistrationNumber' => 'required|max:60',
                    'companyVATNumber' => 'max:60',
                    'contactFirstName' => 'required|max:255',
                    'contactLastName' => 'required|max:255',
                ]);
            } else {
                $validation = array_merge([
                    'firstName' => 'required|max:255',
                    'lastName' => 'required|max:255',
                ], $validation);
            }
        }

        return $validation;
    }

    public function messages()
    {
        return [
            'password.regex' => 'format' . '#' . 'Password contains unacceptable characters!',
            'email.regex' => 'format' . '#' . 'Invalid email address!'
        ];
    }

    public function filters()
    {
        return [
            // 'password' => 'trim|lowercase',
            // 'name' => 'trim|capitalize|escape'
        ];
    }

    public function attributes()
    {
        return [
            'type' => 'user type',
            'email' => 'email',
            'password' => 'password',
            'firstName' => 'first name',
            'lastName' => 'last name',
            'countryID' => 'country',
            'companyVATNumber' => 'company VAT number',
            'roleID' => 'user role'
        ];
    }

    /* protected function failedValidation(Validator $validator)
    {
        throw (new ValidateException($validator));
    } */
}
