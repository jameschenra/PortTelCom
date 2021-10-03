<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionPlanRequest extends FormRequest
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
            'name' => 'required|max:50',
            'description' => 'required|max:200',
            'price' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'priceCurrency' => 'required|size:3',
            'countryID' => 'exists:countries,id',
            'months' => 'required|integer|min:0',
            'days' => 'required|integer|min:0',
            'active' => 'required|boolean'
        ];
    }

    public function messages()
    {
        return [
            'price.regex' => 'format' . '#' . 'Price must be a floating-point number!',
            'months.integer' => 'format' . '#' . 'Months must be 0 or positive integer number!',
            'months.min' => 'format' . '#' . 'Months must be 0 or positive integer number!',
            'days.integer' => 'format' . '#' . 'Days must be 0 or positive integer number!',
            'days.min' => 'format' . '#' . 'Days must be 0 or positive integer number!'
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'name',
            'description' => 'description',
            'price' => 'price',
            'priceCurrency' => 'price currency',
            'countryID' => 'country',
            'months' => 'months',
            'days' => 'days',
            'active' => 'active'
        ];
    }
}
