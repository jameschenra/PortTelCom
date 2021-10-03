<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Common\SendResponse;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
    use SendResponse;
    
    public function getAll($table) {
        $list = DB::table($table)->get();

        return response()->json($list);
    }

}
