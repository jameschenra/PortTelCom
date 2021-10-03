<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->increments('ID');
            $table->unsignedInteger('planID');
            $table->unsignedInteger('userID');
            $table->unsignedInteger('paymentMethod')->nullable();
            $table->unsignedInteger('paymentStatus')->nullable();
            $table->double('appliedVAT', 8, 2);
            $table->timestamp('startDate')->nullable();
            $table->timestamp('endDate')->nullable();
            $table->unsignedTinyInteger('expireStatus')->default(0);
            $table->timestamps();

            $table->foreign('userID')
                ->references('ID')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('planID')
                ->references('ID')
                ->on('subscription_plans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriptions');
    }
}
