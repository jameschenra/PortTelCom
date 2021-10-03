<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('userID');
            $table->string('sessionID', 255);
            $table->string('deviceID', 36);
            $table->string('deviceName', 60);
            $table->timestamp('expiresIn')->nullable();
            $table->timestamps();

            $table->foreign('userID')
                ->references('ID')
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
        Schema::dropIfExists('sessions');
    }
}
