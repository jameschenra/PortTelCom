<?php

namespace App\Exceptions;

use Exception;

class ValidateException extends Exception
{
    protected $validator;

    protected $code = 400;

    public function __construct($validator)
    {
        $this->validator = $validator;
    }

    public function render()
    {
        $errors = [];

        foreach ($this->validator->errors()->toArray() as $key=>$item) {
            $errors[$key] = explode('#', $item[0], 2);
            $errors[$key][1] = ucfirst($errors[$key][1]);
        }
        
        // return a json with desired format
        return response()->json([
            "validationErrors" => $errors,
        ], $this->code);
    }
}
