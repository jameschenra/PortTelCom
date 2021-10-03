<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('ID');
            $table->string('firstName', 255)->nullable();
            $table->string('lastName', 255)->nullable();
            $table->string('email')->unique();
            $table->boolean('emailVerified')->nullable();
            $table->string('password', 255);
            $table->unsignedInteger('type');
            $table->unsignedInteger('roleID');
            $table->unsignedInteger('countryID');
            $table->boolean('locked')->default(false);
            $table->unsignedTinyInteger('loginAttempt')->default(0);
            $table->timestamps('lockExpired');
            $table->string('companyName', 255)->nullable();
            $table->string('companyAddress', 255)->nullable();
            $table->string('companyRegistrationNumber', 60)->nullable();
            $table->string('companyVATNumber', 60)->nullable();
            $table->string('contactFirstName', 255)->nullable();
            $table->string('contactLastName', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
