<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            [
                'name' => 'Administrator',
                'guard_name' => 'access_token'
            ],
            [
                'name' => 'Support',
                'guard_name' => 'access_token'
            ],
            [
                'name' => 'Regular',
                'guard_name' => 'access_token'
            ]
        ]);

        User::find(1)->assignRole('Administrator');
    }
}
