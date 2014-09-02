<?php
function dir2json($path){
$dir_handle = @opendir($path) or die("exception('php error');");
$a=array();
while ($f=readdir($dir_handle)) {
/*0:{//számmal indexelve (a file elsõ 3 karakterébõl generálva)
			src:'char/001-Fighter01.png',//elérési út
			w:128,//szélesség
			h:192,//magasság
			name:'Fighter01'//név, a fájl nevébõl képezve
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