<?php
	if( empty( $_POST['subject'] ) || empty( $_POST['name'] ) || empty( $_POST['email'] ) || empty( $_POST['message'] ) ) {
		header("Location: contact.html?success=0");
	}
	
	$sub = $_POST['subject'] == q ? "Question" : "Suggestion";
	$name = $_POST['name'];
	$email = $_POST['email'];
	
	$to = "238SAMIxD <samijedrzejewski@gmail.com>";
	$subject = "Devlog contact - $sub";
	$message = $_POST['message'];
	$headers = "From: $name <$email> \r\n";
	$headers .= "Reply-To: $name <$email> \r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
	
	mail( $to, $subject, $message, $headers );
	
	$webhookurl = "https://discord.com/api/webhooks/954404085325504542/jcK6jN6BYhj-sU7Y8LOx1RvkuNYO5y3RBJaw0V1BVW5Oslo-p9Ed7iqk9UGU54Gwtizi";

	$timestamp = date("c", strtotime("now"));

	$json_data = json_encode([
		// Message
		"content" => "<@226625130124673025>",
		
		// Username
		//"username" => "krasin.space",

		// Avatar URL.
		//"avatar_url" => "",

		// Text-to-speech
		//"tts" => false,

		// File upload
		// "file" => "",

		// Embeds Array
		"embeds" => [
			[
				// Embed Title
				"title" => "$subject",

				// Embed Type
				"type" => "rich",

				// Embed Description
				"description" => $message,

				// URL of title link
				//"url" => "https://gist.github.com/Mo45/cb0813cb8a6ebcd6524f6a36d4f8862c",

				// Timestamp of embed must be formatted as ISO8601
				"timestamp" => $timestamp,

				// Embed left border color in HEX
				"color" => hexdec( "3366ff" ),

				// Footer
				/*"footer" => [
					"text" => "GitHub.com/Mo45",
					"icon_url" => "https://ru.gravatar.com/userimage/28503754/1168e2bddca84fec2a63addb348c571d.jpg?size=375"
				],*/

				// Image to send
				/*"image" => [
					"url" => "https://ru.gravatar.com/userimage/28503754/1168e2bddca84fec2a63addb348c571d.jpg?size=600"
				],*/

				// Thumbnail
				//"thumbnail" => [
				//    "url" => "https://ru.gravatar.com/userimage/28503754/1168e2bddca84fec2a63addb348c571d.jpg?size=400"
				//],

				// Author
				"author" => [
					"name" => $name
					//"url" => "https://krasin.space/"
				]

				// Additional Fields array
				/*"fields" => [
					// Field 1
					[
						"name" => "Field #1 Name",
						"value" => "Field #1 Value",
						"inline" => false
					],
					// Field 2
					[
						"name" => "Field #2 Name",
						"value" => "Field #2 Value",
						"inline" => true
					]
					// Etc..
				]*/
			]
		]
			

	], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );


	$ch = curl_init( $webhookurl );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $json_data);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	// debug
	// echo $response;
	curl_close( $ch );
	
	
	header("Location: ../../contact.html?success=1");
?>