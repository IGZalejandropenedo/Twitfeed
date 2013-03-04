<?php
set_time_limit(0);

class TwitFeed {
	
	// Usuario y contrase�a
	// Seria mejor usar oAuth
	private static $user = "";
	private static $pass = "";
	private static $exit = FALSE;
	
	// El socket que usaremos para conectar al servicio
	private static $socket = null;
	
	
	// Conectamos al servicio y almacenamos el socket por el que lo hemos hecho.
	public static function connect(){
		self::$socket = fsockopen("ssl://stream.twitter.com", 443, $errno, $errstr, 30);
		return (self::$socket);
	}
	
	// Realizamos la petici�n segun la palabra indicada.
	public static function request($keyword) {
		
		// Generamos la cadena necesaria para la petici�n
		$request = "GET /1/statuses/filter.json?" . http_build_query(array('track' => $keyword)) . " HTTP/1.1\r\n";
		$request .= "Host: stream.twitter.com\r\n";
		$request .= "Authorization: Basic " . base64_encode(self::$user . ':' . self::$pass) . "\r\n\r\n";
		
		// Enviamos la petici�n
		fwrite(self::$socket, $request);
		
		// Ejecutamos el codigo indefinidamente, el metodo handleShutdown se encargara de terminar el script
		echo str_repeat("\n", 1024);
		ob_flush();
    flush();
		while(!feof(self::$socket) && self::$exit === FALSE){
			$json = fgets(self::$socket);
			$data = json_decode($json, true);
			if($data && empty($data["limit"]) && stripos($data["text"], $keyword) !== FALSE){
				// Extraemos la informacion relevante y la almacenamos en base de datos y la lanzamos al cliente
				$id = self::saveData($keyword, $json);
				echo json_encode(self::extract_data($id, $keyword, $data)). PHP_EOL;
				ob_flush();
        flush();
			}
		}
		self::close();
	}
	
	// Cerramos el socket
	public static function close() {
		if(self::$socket !== null) {
			fclose(self::$socket);
			self::$socket = null;
		}
	}
	
	// Conectamos con la base de datos para marcar un twit como favorito
	public static function favTwit($id, $value){
		self::connectDB();
		return mysql_query("UPDATE twits  SET favourite = $value WHERE id = $id");
	}
	
	// Conectamos con la base de datos para obtener todos los twits marcados como favoritos
	public static function getFavTwits(){
		self::connectDB();
		$result = mysql_query("SELECT * FROM twits WHERE favourite = 1");
		
		if($result){
			$data = array();
			while($row = mysql_fetch_assoc($result)){
				$data[] = self::extract_data($row["id"], $row["keyword"], json_decode($row["data"], true));
			}
			return $data;
		}
		return null;
	}
	
	public static function handleShutdown() {
	  $connectionStatus = connection_status();
	  switch(connection_status()) {
	  	case ABORTED:
	   	case TIMEOUT:
	   		self::quit();
	   		exit(0);
	  		break;
	  }	
	}
	
	private static function quit(){
		self::$exit = TRUE;
	}
	
	// Conectamos a la base de datos y almacenamos la informaci�n obtenida.
	private static function saveData($keyword, $data) {
		if(strlen($data) > 2){
			self::connectDB();
			mysql_query("INSERT INTO twits (keyword, data, favourite) VALUES ('".addslashes($keyword)."', '".addslashes($data)."', false)");
			return mysql_insert_id();
		}
		return null;
	}
	
	// Saca la informaci�n relevante de lo que nos devuelve Twitter
	private static function extract_data($id, $keyword, $data){
		return array(
			"id" 		=> $id,
			"image" => $data["user"]["profile_image_url"], 
			"date" 	=> date("d-m-Y H:i:s", strtotime($data["created_at"])), 
			"name" 	=> $data["user"]["name"], 
			"text" 	=> preg_replace("/($keyword)/i", "<span style='color:red'>$1</span>", $data["text"])
		);
	}

	// Funcion para calcular el tiempo actual en segundos como float
	private static function microtime_float() {
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
	}
	
	private static function connectDB(){
		mysql_connect("localhost", "igz_twitfeeder", "12345");
		mysql_select_db("igz_twitfeed");
	}
}

switch($_REQUEST["action"]) {
	case "getTwits": {
		// Si hemos podido conectar, hacemos la peticion.
		register_shutdown_function('TwitFeed::handleShutdown');
		if(TwitFeed::connect()){
			TwitFeed::request($_REQUEST["keyword"]);
		}
		break;
	}
		
	case "favTwit": {
		echo TwitFeed::favTwit($_REQUEST["id"], $_REQUEST["value"]);
		break;
	}
	
	case "getFavTwits": {
		echo json_encode(TwitFeed::getFavTwits());
		break;
	}
}

