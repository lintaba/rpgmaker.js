<?php
function dir2json($path){
$dir_handle = @opendir($path) or die("exception('php error');");
$a=array();
while ($f=readdir($dir_handle)) {
/*0:{//sz�mmal indexelve (a file els� 3 karakter�b�l gener�lva)
			src:'char/001-Fighter01.png',//el�r�si �t
			w:128,//sz�less�g
			h:192,//magass�g
			name:'Fighter01'//n�v, a f�jl nev�b�l k�pezve
			}*/
	if($f=="." || $f==".."){continue;}
	$src=$path.'/'.$f;
	$data=getimagesize($src);
	@ereg("[a-z]*\/([0-9]{3})-([a-zA-Z0-9]*)\..*",$src,$x);
	$sor=($x[1]*1).":{src:'$src',w:$data[0],h:$data[1],name:'".$x[2]."'}";
	$sor=($x[1]*1).":[".($data[0]/32).",".($data[1]/32).",'$x[2]']";
	array_push($a,$sor);
	
}
closedir($dir_handle);
return implode($a,",");
}
$x="char";
if(is_file("tmp/r_$x.tmp") && false){
	echo file_get_contents("tmp/r_$x.tmp");
}else{
	$out=dir2json("char");
	file_put_contents("tmp/r_$x.tmp",$out);
	echo $out;
}
?>