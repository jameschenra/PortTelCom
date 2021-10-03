<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'firstName' => 'Super Admin',
            'lastName' => 'Super Admin',
            'email' => 'admin@admin.com',
            'emailVerified' => true,
            'password' => bcrypt('123456'),
            'type' => 1,
            'roleID' => 1,
            'countryID' => 1,
            'locked' => 0,
        ]);
    }
}
