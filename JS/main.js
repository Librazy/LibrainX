var levsaved = localObj("levsaved"+"LibrainX");
var enterkeyreqbind = false;
var lastpass="";
var levpackldr;
var passed=false;
var currentlev=0;
/*
*-levsaved
*|-nprevpass
*|-nlastpass
*|-nlastlev
*|-levpassx
*-visbefore
*/

/*X
*-levpack
*|-levpackname 关卡包名称
*|-levpacktot 关卡数
*|-levpackloaded =true
*|-problems 
*|--pname 本关名称
*|--pdesc 本关介绍
*|--ptype-(enchtma,enchtmb,encimga,encimgb,hyba,hybb) 本关类型 加密htmlA 加密htmlB 加密图片A 加密图片B 混合A 混合B
*|--pencdata 加密数据A
*|--pencdatb 加密数据B
*|--pencdatc 加密数据C
*|--pencdatd 加密数据D
*|--penchash 加密的密码hash
*|--phint 本关提示
*/
function dec(passwd,encdat){
	return CryptoJS.AES.decrypt(encdat,passwd).toString(CryptoJS.enc.Utf8);
}
function test(passwd, prevpass, levreq) {
	try{
		if(!levpack.levpackloaded)return false;
		//!------hash(hash +hash(hash))-------!
		var tmpshaf = CryptoJS.SHA512(passwd).toString();
		return !!(CryptoJS.SHA512(tmpshaf + CryptoJS.SHA512(tmpshaf).toString()).toString() == CryptoJS.AES.decrypt(levpack.problems[levreq].penchash, prevpass.toString()))
	}catch(e){
		return false;
	}
}
function enchtma(levreq,tmpmd5){
	/**/console.log("htma");/**/
	var p=levpack.problems;
	$("#divqusa").text(dec(tmpmd5,p[levreq].pencdata));
	$("#divqusb").text(dec(tmpmd5,p[levreq].pencdatb));
}
function enchtmb(levreq,tmpmd5){
	/**/console.log("htmb");/**/
	var p=levpack.problems;
	$("#divqusa").html(dec(tmpmd5,p[levreq].pencdata));
	$("#divqusb").html(dec(tmpmd5,p[levreq].pencdatb));
}
function encimga(levreq,tmpmd5){
	/**/console.log("imga");/**/
	var p=levpack.problems;
	$("#divqusa").html("<img src=\""+dec(tmpmd5,p[levreq].pencdata)+"\" alt=\""+dec(tmpmd5,p[levreq].pencdatb)+"\"/>");
	if(dec(tmpmd5,p[levreq].pencdatc)!=""){console.log("imga2");$("#divqusb").html("<img src=\""+dec(tmpmd5,p[levreq].pencdatc)+"\" alt=\""+dec(tmpmd5,p[levreq].pencdatd)+"\"/>");}
}
function encimgb(levreq,tmpmd5){
	/**/console.log("imgb");/**/
	var p=levpack.problems;
	$("#divqusa").html('<figure> <figcaption>'+dec(tmpmd5,p[levreq].pencdatc)+'</figcaption><img src="'+dec(tmpmd5,p[levreq].pencdata)+'" alt="'+dec(tmpmd5,p[levreq].pencdatb)+'"/></figure>');
}
function hyba(levreq,tmpmd5){
	/**/console.log("hyba");/**/
	var p=levpack.problems;
	$("#divqusa").html('<img src="'+dec(tmpmd5,p[levreq].pencdata)+'" alt="'+dec(tmpmd5,p[levreq].pencdatb)+'"/>');
	$("#divqusb").html(dec(tmpmd5,p[levreq].pencdatc));
	try{if(dec(tmpmd5,p[levreq].pencdatd)!="")eval(dec(tmpmd5,p[levreq].pencdatd));}catch(e){}
}
function hybb(levreq,tmpmd5){
	/**/console.log("hybb");/**/
	var p=levpack.problems;
	$("#divqusa").html('<figure> <figcaption>'+dec(tmpmd5,p[levreq].pencdatc)+'</figcaption><img src="'+dec(tmpmd5,p[levreq].pencdata)+'" alt="'+dec(tmpmd5,p[levreq].pencdatb)+'"/></figure>');
	try{if(dec(tmpmd5,p[levreq].pencdatd)!="")eval(dec(tmpmd5,p[levreq].pencdatd));}catch(e){}
}
function setproblem(levreq) {
	//*XTODO*//
	var p=levpack.problems;
	var tmpmd5=CryptoJS.MD5(lastpass).toString();
	$("#levcurrent").animate({
		backgroundColor: 'green',
	}, 500);
	$("#levcurrent").animate({
		backgroundColor: '#464646',
	}, 500);
	$("#levcurrent").text(levreq);
	$("#levtit").text(dec(tmpmd5,p[levreq].pname));
	$("#levdesc").text(dec(tmpmd5,p[levreq].pdesc));
	$("#levhint").text(dec(tmpmd5,p[levreq].phint));
	switch(p[levreq].ptype){
		case "enchtma":enchtma(levreq,tmpmd5);break;
		case "enchtmb":enchtmb(levreq,tmpmd5);break;
		case "encimga":encimga(levreq,tmpmd5);break;
		case "encimgb":encimgb(levreq,tmpmd5);break;
		case "hyba":hyba(levreq,tmpmd5);break;
		case "hybb":hybb(levreq,tmpmd5);break;
		default :break;
	}	
}
function clearlev() {
    levsaved.remove('nprevpass').remove("nlastpass").remove('nlastlev').save();
    window.localStorage.removeItem("nvisbefore"+levpack.levpackID);
}
function levpackpassed() {
	$("#levpacktit").animate({
		backgroundColor: '#0c72a9',
	}, 300);
	$("#levpacktit").animate({
		backgroundColor: 'green',
	}, 500);
	$("#levpacktit").animate({
		backgroundColor: '#464646',
	}, 3500);

	$("#divqus").animate({
		backgroundColor: '#46AA46',
	}, 500);
	$("#divqus").animate({
		backgroundColor: '#464646',
	}, 2500);
}
function loadfailed() {
	$("#levpacktit").animate({
		backgroundColor: 'red',
	}, 500);
	$("#levpacktit").animate({
		backgroundColor: '#464646',
	}, 3000);
	$("#iptans").attr('disabled', "true");
	$("#subchkans").attr('disabled', "true");
	$("#levtit").text("Oops！");
	$("#levpacktit").html("关卡包<s>再入</s>载入失败");
	$("#divqus").text("……或者敌人已经遍布五湖四海");
	$("#levdesc").text("我们中出了一个叛徒");
}
function loadlevpack() {
	if((!loclevpack)&&levpackldr.status!=200){
		loadfailed();
		return 1;
	}
	try{
		/**/console.log("loadinglevpack");/**/
		if(!loclevpack)levpack=levpackldr.responseJSON;
		if (!levpack.levpackloaded){
			/**/console.log("levpacknotloaded");/**/
			loadfailed();
		}else{
			levsaved = localObj("levsaved"+levpack.levpackID);
			$("#levpacktit").text(levpack.levpackname);
			$("#doctitle").text(levpack.levpackname+" via LibrainX")
			if (window.localStorage.getItem("nvisbefore"+levpack.levpackID) && levsaved.has("nlastpass")) {
				/**/console.log("readingstate");/**/
				currentlev = parseInt(levsaved.get("nlastlev"));
				var tmplastpass = levsaved.get("nlastpass");
				if (currentlev==levpack.levpacktot) {clearlev();window.location.href = window.location.href;}else{
					if (test(tmplastpass, levsaved.get("nprevpass"), currentlev)) {
						lastpass=tmplastpass
						$("#iptans").val("");
						$("#iptans").text("");
						/**/console.log("readingstate2");/**/
						currentlev += 1;
						setproblem(currentlev);
					} else {
						/**/console.log("clr");/**/
						levsaved.clear().save();
						lastpass=levpack.levpackpass;
						setproblem(0);
					}
				}
			} else {
				lastpass=levpack.levpackpass;
				setproblem(0);
			}
		}
	}catch(e){loadfailed();}
}
function setlev(arg) {
	try{
		var tmplastpass;
		var prevpass;
		var levreq = parseInt(arg);
		if(levreq==0){clearlev();return true;}
		if(levreq==1){
			prevpass=levpack.levpackpass;
			tmplastpass=levsaved.get("levpass0");
		}else{
			tmplastpass=levsaved.get("levpass" + (levreq-1));
			prevpass=levsaved.get("levpass" + (levreq-2));
		}
		if(test(tmplastpass, prevpass, (levreq-1))){
			levsaved.set('nlastpass', tmplastpass);
			levsaved.set('nprevpass', prevpass);
			levsaved.set('nlastlev', (levreq-1)).save();
			window.localStorage.setItem('nvisbefore'+levpack.levpackID, true);
			return true;
		}else{return false;}
	}catch(e){return false;}
}
$(document).ready(function () {
	QueryString.Initial();
	//*XTODO
	$("#levpacktit").animate({
		color: '#AAD',
	}, 1200);
	$("#levcurrent").animate({
		color: '#ADD',
	}, 1800);
	$("#levdesc").animate({
		color: '#CCC',
	}, 2100);
	$("#con").slideToggle(2000,function () {$("#subchkans").slideToggle(200);});
	$("#levtit").animate({
		color: '#AAA',
	}, 600);
	if(loclevpack){loadlevpack();}else{
		var levpackaddr="levpack.json";
		if(QueryString.GetValue('levpackaddr')!=null){
			levpackaddr=QueryString.GetValue('levpackaddr');
		}
		levpackldr=$.getJSON(levpackaddr);
		levpackldr.complete(loadlevpack);
	}
});
$("#subchkans").click(function () {
    /**/console.log("submited");/**/
    var anssubed = $("#iptans").val().toString().trim().replace(".", "");
	$.get("log.txt", { "levelnow": currentlev,"ans": anssubed, "levpack": levpack.levpackID});
    if (test(anssubed, lastpass, currentlev)) {
		lastpass = anssubed;
	    if (currentlev==levpack.levpacktot) {
            $("#iptans").attr('disabled', "true");
            $("#subchkans").attr('disabled', "true");
			//SET ROBLEM
            passed = true;
			levpackpassed();
			levsaved.set('nlastpass', lastpass);
			levsaved.set('nlastlev', currentlev);
			levsaved.set('levpass' + (currentlev).toString(), lastpass).save();
        } else {
            currentlev += 1;
			setproblem(currentlev);
			window.localStorage.setItem('nvisbefore'+levpack.levpackID, true);
			if (currentlev != 1) {
				levsaved.set('nprevpass', levsaved.get("nlastpass"));
			} else {
				levsaved.set('nprevpass', levpack.levpackpass);
			}
			levsaved.set('nlastpass', lastpass);
			levsaved.set('nlastlev', currentlev-1);
			levsaved.set('levpass' + (currentlev-1).toString(), lastpass).save();
			/**/console.log("savingstate");/**/
			$("#iptans").val("");//清除文字
			$("#iptans").text("");
		}
    }
    else {//warning
        $("#iptans").animate({
            backgroundColor: 'red',
        }, 500);
        $("#iptans").animate({
            backgroundColor: 'white',
        }, 500);
        $("#iptans").val("");
        $("#iptans").text("");
        $("#iptans").focus();
    }
	
});
document.onkeydown = function (e) {//
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;
    if (code == 13 ) {
        if (enterkeyreqbind) {
            $("#sublevreq").click();
        } else if(!passed){
            $("#subchkans").click();
        }
    }
}
$("#sublevreq").click(function () {
    if (setlev($("#levreq").val())) { window.location.href = window.location.href; }
    else {
        $("#divtools").animate({
            backgroundColor: 'red',
        }, 500);
        $("#divtools").animate({
            backgroundColor: 'black',
        }, 500);
    }
});
$("#subclear").click(function () {
    if ($("#ifclearall").attr("checked")) {
        levsaved.clear().save();
		window.localStorage.removeItem("nvisbefore"+levpack.levpackID);
    } else {
        clearlev();
    }
    window.location.href = window.location.href;
});
$("#tools").click(function () {
    $("#divtools").slideToggle(500);
});
$("#levreq").focus(function () {
    enterkeyreqbind = true;
});
$("#levreq").blur(function () {
    enterkeyreqbind = false;
});
