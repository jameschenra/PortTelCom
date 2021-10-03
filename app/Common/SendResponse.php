<?php namespace App\Common;

trait SendResponse {

	public function send_access_denied() {
		return response()->json([
			'error' => 1005,
			'description' => 'Access denied!'
		], 403);
	}

	public function send_not_found($item, $errorCode) {
		return response()->json([
			'error' => $errorCode,
			'description' => $item . ' not found!'
		], 404);
	}

	public function send_error($statusCode, $errorCode, $description) {
		return response()->json([
			'error' => $errorCode,
			'description' => $description
		], $statusCode);
	}
}