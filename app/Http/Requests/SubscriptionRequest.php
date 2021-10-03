<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
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
            'userID' => 'exists:users,id',
            'planID' => 'required|exists:subscription_plans,id',
            'paymentMethod' => 'required|integer|between:1,4',
            'paymentStatus' => 'required|integer|between:1,5'
        ];
    }

    public function messages()
    {
        return [
        ];
    }

    public function attributes()
    {
        return [
            'userID' => 'user',
            'planID' => 'subscription plan',
            'paymentMethod' => 'payment method',
            'paymentStatus' => 'payment status'
        ];
    }
}
