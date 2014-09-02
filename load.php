<?php
/*if(isset($_GET["f"]) && isset($_GET["n"])){
$f=ereg_replace("[^a-zA-Z0-9.]*","",$_GET["f"]);
$n=ereg_replace("[^0-9]*","",$_GET["n"]);
$q="@/".$n."/@".$f;
if(is_file($q)){
	echo file_get_contents($q);
}else{
	header("HTTP/1.0 404 Not Found");
	echo "//404, nincs ilyen file:$q\\\\";
}
}else{
	header("HTTP/1.0 502 Internal Server Error");
	echo "//502, nem adtál meg paramétert\\\\";
}
*/
if(isset($_GET["n"]) && isset($_GET["op"])){
	$n=(int)$_GET["n"];
	$op=$_GET["op"];
	if($n==0){
		header("HTTP/1.0 501 ZERO NOT IMPLEMENTED");
		echo "HIBA:ez még nincs kész";
		exit;
	}
	$q="@/".$n."/";
	$r="";
	if(is_file($q."@targyak.js")){
		//kiírás kezdete
		$r.="({";
		$r.="game:{".file_get_contents($q."@game.js")."},\r\n";
		$r.="map:[{".file_get_contents($q."@map.js")."}],\r\n";
		$r.="chipsets:{".file_get_contents($q."@chipset.js")."},\r\n";
		$r.="script:{".file_get_contents($q."@script.js")."},\r\n";
		$r.="charsets:{".file_get_contents("tmp/r_char.tmp")."},\r\n";//FIXME
		$r.="targyak:[".file_get_contents($q."@targyak.js")."]\r\n";//FIXME
		$r.="})";
		header("Content-Type: text/plain; charset=UTF-8");
		die($r);
		
	}
}else{
	header("HTTP/1.0 502 Internal request error");
	echo "HIBA:nem adtál meg paramétert";
}

?>