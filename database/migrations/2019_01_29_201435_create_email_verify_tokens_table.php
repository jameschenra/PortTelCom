<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmailVerifyTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_verify_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->string('email')->unique();
            $table->string('verificationCode');
            $table->unsignedTinyInteger('verifyAttempt')->default(0);
            $table->timestamp('expiresIn')->nullable();
            $table->timestamps();

            $table->foreign('email')
                ->references('email')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_verify_tokens');
    }
}
