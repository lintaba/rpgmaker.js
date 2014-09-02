<?php
$list=explode(",","css.css,window.css,game.css,map.css,fonts.css,editor.css");
$a="";
for($i=0;$i<count($list);$i++){
	$a.=file_get_contents($list[$i])."\r\n";
}
$a=str_replace(array("\r","\n","\t"),"",$a);
$a=preg_replace("/\/\*.*?\*\//","",$a);
echo $a;
file_put_contents("mini.css",$a);
?>