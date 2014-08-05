var loclevpack=false;
//loclevpack=true;
var levpack;
var loclevpackstr='';
try{
	if(loclevpack&&loclevpackstr!="")levpack=JSON.parse(loclevpackstr);
}catch(e){alert("本地关卡包载入失败");loclevpack=false;}