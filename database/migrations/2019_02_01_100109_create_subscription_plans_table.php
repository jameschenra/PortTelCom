<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubscriptionPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->increments('ID');
            $table->string('name', 50);
            $table->string('description', 200);
            $table->double('price', 8, 2);
            $table->string('priceCurrency', 3);
            $table->unsignedInteger('countryID')->nullable();
            $table->unsignedInteger('months');
            $table->unsignedInteger('days');
            $table->boolean('active');
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
        Schema::dropIfExists('subscription_plans');
    }
}
