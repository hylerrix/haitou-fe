/**
 * 获取宣讲会信息
 * setTalkInfor 内部分为 get 和 render 方法
 * @return {string} talkInfo
 */
function setTalkInfor () {
	// talkInfor 保存当前省份的所有宣讲会信息
	var totalTalkInfor = [];

	if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
	    xmlhttp = new XMLHttpRequest();
	} else {
	    // code for IE6, IE5
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	// 默认必须先请求第一页
	var currentPage = 1;
	var url = "https://javaapi.changxiaoyuan.com/ht/infor/getTalkInfor.action?province=xa&pageNum=" + currentPage;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

    		// 获取到所请求的页面宣讲会信息并 JSON 化
	    	var currentTalkInfor = xmlhttp.responseText;
	    	var currentTalk = JSON.parse(currentTalkInfor);
		    // 获取到总页面数 totalPageNum
		    var totalPageNum = currentTalk.totalPageNum;
		    // 将当前页面的宣讲会列表和个数传递到 addTalkInfor
		    // console.log(currentTalk.rows);
		    addTalkInfor(currentTalk);

		    // 判断是否进行下一个页面的请求
		    if (currentPage < totalPageNum) {
		    	currentPage++;
		    	url = "https://javaapi.changxiaoyuan.com/ht/infor/getTalkInfor.action?province=xa&pageNum=" + currentPage;
				xmlhttp.open("GET", url, true);
			    xmlhttp.send();
		    } else {
		    	rmLoadingInfor();
		    	console.log(currentPage + " 个页面资源获取成功");
		    	renderTalkInfor(totalTalkInfor);
		    }
  		}
  	}

  	function addTalkInfor (currentInforJSON) {
  		totalTalkInfor.push(currentInforJSON);
  	}
}

/**
 * 渲染宣讲会信息
 * @param {Array} totalTalkInfor
 */
function renderTalkInfor (totalTalkInfor) {
	var totalPageNum = totalTalkInfor.length;
	var totalTalkNum = 0;
    var pn = document.getElementsByClassName("xjhItemTeamWrap")[0];
    var op;

 	for (var i = 0; i < totalPageNum; i++) {
		for (var j = 0; j < totalTalkInfor[i].rows.length; j++) {
			var currentTalk = totalTalkInfor[i].rows[j];
			op = document.createElement("div");
			op.innerHTML = "\
				<a>\
				    <!-- 某一场宣讲会 -->\
					<div class=\"xjhItemWrap\">\
				    	<div class=\"xjhItemLogoWrap\">\
				    		<img src=\"public/chang-logo.jpeg\">\
				    	</div>\
				    	<div class=\"xjhItemContentWrap\">\
				    		<div class=\"xjhItemCompanyName\">公司名</div>\
				    		<div class=\"xjhItemSchoolInfoWrap\">\
				    			<div class=\"xjhItemSchoolName\">大学名</div>\
				    			<div class=\"xjhItemSchoolAddress\">宣讲地点</div>\
				    		</div>\
				    		<div class=\"xjhItemTimeWrap\">\
				    		    <div class=\"xjhItemWeek\">宣讲时间</div>\
				    			<div class=\"xjhItemTimePoint\">时间状况</div>\
				    		</div>\
				    	</div>\
				    	<div class=\"clear\"></div>\
				    	<div class=\"xjhItemPointImgWrap\">\
				    	</div>\
				    	<div class=\"xjhSaveBtn\">\
				    		<img src=\"\">\
				    	</div>\
				    </div>\
				</a>\
			";
		    pn.appendChild(op);
			var xjhItemLogoWrap = document.getElementsByClassName("xjhItemLogoWrap")[totalTalkNum];
	    	var xjhItemCompanyName = document.getElementsByClassName("xjhItemCompanyName")[totalTalkNum];
	    	var xjhItemSchoolName = document.getElementsByClassName("xjhItemSchoolName")[totalTalkNum];
	    	var xjhItemSchoolAddress = document.getElementsByClassName("xjhItemSchoolAddress")[totalTalkNum];
	    	var xjhItemWeek = document.getElementsByClassName("xjhItemWeek")[totalTalkNum];
	    	var xjhItemTimePoint = document.getElementsByClassName("xjhItemTimePoint")[totalTalkNum];

	    	xjhItemLogoWrap.children[0].src = "public/chang-logo.jpeg";
	    	xjhItemCompanyName.innerHTML = currentTalk.companyName;
	    	xjhItemSchoolName.innerHTML = "西安";
	    	// currentTalk.xjhItemSchoolName
	    	xjhItemSchoolAddress.innerHTML = currentTalk.place;
			// currentTalk.xjhItemSchoolAddress
	    	xjhItemWeek.innerHTML = currentTalk.holdTime;
	    	xjhItemTimePoint.innerHTML = "(近期)";

	    	totalTalkNum++;
	    }
	}

	console.log(totalTalkNum + " 条宣讲会信息填充成功");

	op = document.createElement("div");
	op.setAttribute('class', 'loadMore');
	op.innerHTML = "加载完成，共 " + totalTalkNum + " 条宣讲会信息";
	pn.appendChild(op);
}

function rmLoadingInfor () {
    var parent = document.getElementsByClassName("xjhItemTeamWrap")[0];
	var xmlLoading = document.getElementsByClassName("xmlLoading")[0];
	parent.removeChild(xmlLoading);
}

window.onload = function () {
	setTalkInfor();
}