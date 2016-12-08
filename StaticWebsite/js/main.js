/*!
 * CCyber (https://ccyber.co.uk) - @olliegeek
 * Copyright 2016 CCyber.
 * Licensed under GPLv3 (https://github.com/Pr09het/ccyber/blob/master/LICENSE)
 */
 
// main javascript file

$(function() {

	
	$.expr[":"].icontains = $.expr.createPseudo(function(arg) {
		return function( elem ) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});
	
	$(".navrunopt").on("click", navRunOption);

	$("input[data-onenterbutclick]").on('keyup', function (e) {
		if (e.which == 13) {
			var dbf = $(this).data("onenterbutclick");
			$('#'+dbf).trigger('click');
			return false;
		 }
	});
	
	returnCurrentDateDiv();
	
	$("#invColourOpt").on("click", toggleInvertedColourOption);
	setInvertedColourOption_onLoad();

	$(".theregsec").on("click", function() {
		var $btn = $(this).button('loading');
		rssFeedTest("http://www.theregister.co.uk/security/headlines.atom", ".theregsec");
		$('li[data-action="feed"]').click();
	});

	$(".ibtimescybersec").on("click", function() {
		var $btn = $(this).button('loading');
		rssFeedTest("http://www.ibtimes.co.uk/rss/cybersecurity", ".ibtimescybersec");
		$('li[data-action="feed"]').click();
	});
	
	$("a.listboxswitchviewmode").on("click", toggleListBoxView);
	$(".item .btn.editbtn").unbind('click').on("click", editItem);
	$("#searchbtn").on("click", searchBtnClick);
	
	$("#searchtext").on('keyup', function (e) {
		if (e.which == 13) {
			$('#searchbtn').trigger('click');
			return false;
		 }
	});	
	
	setItemsButtonTooltip();
	setListBoxSwitchButton();
	
	resetMediaItemVars();
	
	hideLoadingModal();
});

function hideLoadingModal() {
	window.setTimeout(function(){
		console.log("Page loaded.");
		$("body").removeClass("modal-open");
		$("#modLoading").removeClass("modaldefoshow").modal("hide");
	}, 2000);	
}

function searchBtnClick() {
	resetSearch();
	
	var searchval = $("#searchtext").val();
	if (searchval.length != 0) {
		if (searchval.indexOf("tag:") == 0) {
			searchval = searchval.replace("tag:","").toUpperCase();
			var matchedtags = $(".datedivcontent .item .tagdiv:contains('"+searchval+"')");
			if (matchedtags.length != 0) {
				$(".datedivcontent div.item").hide();
				matchedtags.each(function() {
					var tagitem = $(this).parent().parent();
					tagitem.show();
				});
			}
		} else {
			var matches = $(".datedivcontent .item:icontains('"+searchval+"')");
			if (matches.length != 0) {
				$(".datedivcontent div.item").hide();
				matches.show();
			}
		}
	}
	
	hideNonVisibleDateDivs();
	hideNonVisibleOptionDivs();
}

function resetSearch() {
	$(".datedivslist .datediv").show();
	showOptionDivsWithItems();
	$(".datedivcontent div.item").show();
}

function hideNonVisibleDateDivs() {
	$(".datedivslist .datediv").each(function() {
		var datedivitems = $(this).find(".item:visible");
		if (datedivitems.length == 0) {
			$(this).hide();
		}
	});
}

function hideNonVisibleOptionDivs() {
	$(".datedivslist .datediv").each(function() {
		var datediv = $(this);
		var datedivopts = datediv.children("div");
		datedivopts.each(function() {
			var datedivopt = $(this);
			if ( !datedivopt.hasClass("noitems") ) {
				if (datedivopt.find(".item:visible").length == 0) {
					datedivopt.hide();
				}
			}
		});
	});
}

function showOptionDivsWithItems() {
	$(".datedivslist .datediv").each(function() {
		var datediv = $(this);
		var datedivopts = datediv.children("div");
		datedivopts.each(function() {
			var datedivopt = $(this);
			if ( !datedivopt.hasClass("noitems") ) {
				datedivopt.show();
			}
		});
	});
}

function navRunOption() {
	var thisopt = $(this);
	var thisclasses = thisopt.prop("class");
	if (thisclasses.indexOf("active") == -1) {
		var parentUl = $(this).parent("ul");
		var dataWindow = parentUl.data("window");
		if (dataWindow == "sidebaroption") {
			showSidebar();
		}
		// hide all sidebars
		$("."+dataWindow).hide();
		// show the sidebar set by data-action
		var action = thisopt.data("action");
		$("."+dataWindow+"-"+action).show();
		
		parentUl.children("li").removeClass("active")
		thisopt.addClass("active")
	}
}

function returnDomainFromURL(url) {
	return singleRegexMatch( /\:\/\/([^\/\?]*)/, url, true);
}

function extractYouTubeId(url) {
	return singleRegexMatch( /\?v=([^&]*)|\.be\/([^&]*)/, url, false);
}

var tempMediaItem = {};
var currentMediaItem = {};

function resetMediaItemVars() {
	tempMediaItem = {domain:"unknown", domType:"unknown", saveHtml:"", url:""};
	setCurrentMItoTMI();
}
function setCurrentMItoTMI() {
	currentMediaItem.domain = tempMediaItem.domain;
	currentMediaItem.domType = tempMediaItem.domType;
	currentMediaItem.saveHtml = tempMediaItem.saveHtml;
	currentMediaItem.url = tempMediaItem.url;
}

var youTubeIframe = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/{id}' frameborder='0' allowfullscreen></iframe>";

$('#modFindMedia').on('show.bs.modal', function (event) {
	var modFindMediaOK = $(".modFindMediaOK");
	var modFindMediaOKVal = "OK";
	tempMediaItem.saveHtml = "";
	tempMediaItem.domType = "unknown";
	var modalEmbHtml = false;
	var modal = $(this);
	modal.find('.modFindMedContent').html("");
	
	tempMediaItem.url = $("#NewContentUrl").val();
	if (tempMediaItem.url.indexOf("http") == 0) {
		
		tempMediaItem.domain = returnDomainFromURL(tempMediaItem.url);
		if (tempMediaItem.domain) {
			switch(tempMediaItem.domain) {
				case "twitter.com":
					tempMediaItem.domType = "Twitter";
					modFindMediaOKVal = "Add";
					break;
					
				case "youtu.be":				
				case "www.youtube.com":
				case "youtube.com":
					tempMediaItem.domType = "YouTube";
					var ytid = extractYouTubeId(tempMediaItem.url);
					tempMediaItem.saveHtml = youTubeIframe.replace("{id}", ytid);
					modalEmbHtml = "<div class='modal-video'>" + tempMediaItem.saveHtml + "</div>";
					modFindMediaOKVal = "Add";
					break;
					
				default:
					break;
			}
		}
	}
	
	modFindMediaOK.text(modFindMediaOKVal);
	modFindMediaOK.unbind('click').on("click", addMediaItem);
	
	modal.find('.modMediaType').text(tempMediaItem.domType);
	if (modalEmbHtml) {
		modal.find('.modFindMedContent').html(modalEmbHtml);
	}
	
	//var modal = $(this);
	//modal.find('.modal-title').text('New message to ' + recipient);
	//modal.find('.modal-body input').val(recipient);
	
	window.setTimeout(function() {
		$(".modFindMedLoading").hide(); $(".modFindMedLoaded").show();
	}, 1000);
});

$('#modFindMedia').on('hide.bs.modal', function (event) {
	$(".modFindMedLoaded").hide();
	$(".modFindMedLoading").show();
	
	$(".modFindMediaOK").text("OK");
	var saveHtml = "";
	var modal = $(this);
	modal.find('.modFindMedContent').html("");
	modal.find('.modMediaType').text("unknown");
});

function addMediaItem() {
	var ligp = $(".panel-linkup ul.list-group");
	ligp.children().remove();	
	
	if (tempMediaItem.domType == "unknown") {
		resetMediaItemVars();
	} else {
		setCurrentMItoTMI();
		
		var litxt = currentMediaItem.domType + ": " + currentMediaItem.url;
		var li = $('<li class="list-group-item mediaitem mediatype-'+currentMediaItem.domType+'">').text(litxt).prop("title", litxt);
		var rmbut = $('<button type="button" class="btn btn-warning" onclick="javascript:removeMediaItem();">');
		rmbut.append($('<span class="glyphicon glyphicon-remove" aria-hidden="true">'));
		li.append(rmbut);
	
		ligp.append(li);
	}
	
	$('#modFindMedia').modal('hide');
}

function removeMediaItem() { 
	$(".panel-linkup ul.list-group").children().remove();
	resetMediaItemVars();
}

function setAddType(sender) {
	var type = $(sender).text();
	$("#curtype").text(type);
}

var currentIoCs = new Array();

function setAddIoC(sender) {
	var ioc = $(sender).text();
	$("#curioc").text(ioc);
}

function addIoC() {
	var ioc = $("#addioc").val();
	if (ioc.length == 0) {
		alert("Nothing entered.");
	} else {
		var type = $("#curioc").text();
		if (ioc != "" && IoCinCurrent(ioc) == -1) {
			var newioc = checkIoC(ioc, type);
			if (newioc != false) {
				if (newioc != true) {
					ioc = newioc;
				}
				var iocObj = {ioc:ioc, type:type};
				currentIoCs.push(iocObj);
				
				var li = createIocLiObj(ioc, type);
				add2Ioc(li);
			}
		} else {
			alert("Indicator of compromise '"+ioc+"' already added.");
		}
		$("#addioc").val("");
		$("#addioc").focus();
	}
}

function IoCinCurrent(ioc) {
	var res = -1;
	for (i = 0; i < currentIoCs.length; i++) {
		if (currentIoCs[i].ioc == ioc) {
			res = i;
			break;
		}
	}
	return res;
}

function removeIoC(sender) {
	var senderLi = $(sender).parent("li");
	var ioc = senderLi.prop("data-ioc");
	var iocno = IoCinCurrent(ioc);
	if (iocno != -1) {
		currentIoCs.splice(iocno, 1);
		senderLi.remove();
	}
}

function checkIoC(ioc, type) {
	var res = false;
	
	switch (type) {
		case "IP":
			var re = new RegExp("[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$");
			res = re.test(ioc);
			if (!res) {
				alert("IP looks invalid.");
			}
			break;
		default:
			res = true;
			break;
	}
	
	return res;
}

function newIoCClear() {
	$("#addioc").val("");
	$("#curioc").text("IP");
	$(".panel-iocs ul.list-group").children().remove();
	currentIoCs = new Array();
}

function createIocLiObj(ioc, type) {
	var ioctype = type.replace(" ","");
	var li = $('<li class="list-group-item iocitem ioctype-'+ioctype+'">').text(ioc).prop("title",ioc);
	li.prop("data-ioctype", ioctype).prop("data-ioc", ioc);
	li.append($('<span class="badge">').text(type));
	var rmbut = $('<button type="button" class="btn btn-warning" onclick="javascript:removeIoC(this);">');
	rmbut.append($('<span class="glyphicon glyphicon-remove" aria-hidden="true">'));
	li.append(rmbut);
	return li;
}

function add2Ioc(newli) {
	$(".panel-iocs ul.list-group").append(newli);
}

function addTag() {
	var tagraw = $("#addtags").val();
	if (tagraw.length == 0) {
		alert("Nothing entered.");
	} else {
		addTag_action(tagraw);
		
		$("#addtags").val("");
		$("#addtags").focus();
	}
}

function addTag_action(taginput) {
	var tag = taginput.toUpperCase();
	
	var li = $('<li class="list-group-item tagitem">').text(tag).prop("title",tag);
	li.prop("data-tag", tag);
	var rmbut = $('<button type="button" class="btn btn-warning" onclick="javascript:removeTag(this);">');
	rmbut.append($('<span class="glyphicon glyphicon-remove" aria-hidden="true">'));
	li.append(rmbut);
	
	$(".panel-tags ul.list-group").append(li);
}

function removeTag(sender) {
	$(sender).parent("li").remove();
}

function writeContentFromNew() {
	var rawtitle = $("#NewContTitle").val();
	if (rawtitle.length == 0) {
		alert("Title cannot be empty.");
	} else {
		var desc = $("#NewContDesc").val();
		var rawurl = $("#NewContentUrl").val();
		var tagopts = new Array();
		$(".panel-tags ul.list-group li").each(
			function(s,e) {
				var dt = $(e).prop("data-tag"); 
				tagopts.push(dt);
			}
		);
		
		var uid = $("#hidUID").val();
		
		writeContentObj(uid, rawtitle, desc, rawurl, currentIoCs, tagopts, getCurrentDateID());
		newContClear();
	}
}

function setItemsButtonTooltip() {
	var selector = '.datedivslist a.btn[data-toggle="tooltip"]';
	$(selector).tooltip("destroy");
	window.setTimeout(function() {
		var position = "top";
		if (isBoxView()) { position = "left"; }
		$(selector).tooltip({ placement: position });
	}, 300);
}

function setListBoxSwitchButton () {
	var selector = ".listboxswitchviewmode span.glyphicon";
	if (isBoxView()) {
		$(selector).removeClass("glyphicon-th").addClass("glyphicon-align-justify").prop("title", "List Mode");
	} else {
		$(selector).removeClass("glyphicon-align-justify").addClass("glyphicon-th").prop("title", "Box Mode");
	}
}

function isBoxView() {
	var winObj = $(".mainwindow .windowoption.windowoption-items");
	var isBox = winObj.hasClass("boxview");
	return isBox;
}

function toggleListBoxView() {
	var winObj = $(".mainwindow .windowoption.windowoption-items");
	if (isBoxView()) {
		winObj.removeClass("boxview");
		winObj.addClass("listview");
		setItemsButtonTooltip();
	} else {
		winObj.removeClass("listview");
		winObj.addClass("boxview");
		setItemsButtonTooltip();
	}
	setListBoxSwitchButton();
}

function writeContentObj(uid,title,desc,rawurl,iocopts,tagopts,dateid) {
	var titleobj = $("<div class='itemtitle'>").text(title);
	var descobj = $("<div class='itemcontent'>").text(desc);
	
	//var urldiv = $("<div>");
	if (rawurl.length != 0) {
		//var urlp = "Link: <a target='_blank' href='"+rawurl+"'>"+rawurl+"</a>";
		//urldiv = $("<div>").html(urlp);
		titleobj.html("<a target='_blank' href='"+rawurl+"'>"+title+"</a>")
	}
	
	var timestr = getCurrentPrettyDate(true);
	
	var curtype = $("#curtype").text();
	var optVal = "opt-"+curtype.toLowerCase().replace(/\s/g,"");
	
	var isEdit = false;
	var rcdd = false;
	
	if (hasValue(uid)) {
		rcdd = $("div[data-uniqueid='"+uid+"']");
		rcdd.children().remove();
		isEdit = true;
	} else {
		var uniqueid = sha256(timestr + title);
		rcdd = $("<div class='item' data-uniqueid='"+uniqueid+"'>");
	}	
	
	var editbtn = $('<a class="btn btn-xs btn-warning editbtn" data-toggle="tooltip" title="Edit">').append('<span class="glyphicon glyphicon-pencil" aria-hidden="true">');
	var timepostedbtn = $('<a class="btn btn-xs btn-info timepostedbtn" data-toggle="tooltip" title="Date Added: '+timestr+'">').append('<span class="glyphicon glyphicon-time" aria-hidden="true">');
	rcdd.append(titleobj).append(timepostedbtn).append(editbtn).append(descobj); // .append(urldiv)
	
	var iocslen = iocopts.length;
	if (iocslen != 0) {
		iocopts.sort(dynamicSortMultiple("type", "ioc"));
		var iocds = $("<div class='iocs'>");
		iocds.append($("<div class='iocsheader'>").text("Indicators of Compromise"));
		for (var j = 0; j < iocslen; j++) {
			var ioc = iocopts[j].ioc;
			var type = iocopts[j].type;		
			var iocd = $("<div>").html(type+": <span class='iocbold'>"+ioc+'</span>');
			iocds.append(iocd);
		}
		rcdd.append(iocds);
	}
		
	var tagslen = tagopts.length;
	if (tagslen != 0) {
		tagopts.sort();
		var tds = $("<div class='tags'>");
		for (var k = 0; k < tagslen; k++) {
			var td = createTagDiv(tagopts[k]);
			tds.append(td);
		}
		rcdd.append(tds);
	}
	
	if (!isEdit) {
		var dateoptdiv = returnDateDiv(dateid).find("."+optVal);
		var dateoptdivcont = dateoptdiv.find(".datedivcontent");
		dateoptdiv.removeClass("noitems");
		dateoptdivcont.prepend(rcdd);
	}
	
	$(".item .btn.editbtn").unbind('click').on("click", editItem);
	setItemsButtonTooltip();
}


function editItem() {
	var parentItem = $($(this).parent());
	var uniqueid = parentItem.data("uniqueid");
	console.log("Edit Item: ", uniqueid);
	
	var contin = checkUnsubmitted();
	if (!contin) {
		return;
	}
	
	$("#hidUID").val(uniqueid);
	
	var itemtitle = parentItem.find(".itemtitle a");
	
	var title = itemtitle.text();
	var url = itemtitle.prop("href");
	var content = parentItem.find("div.itemcontent").text();
	
	$("#NewContTitle").val(title);
	$("#NewContDesc").val(content);
	$("#NewContentUrl").val(url);
	
	parentItem.find("div.tagdiv").each(function() {
		addTag_action( $(this).text() );
	});

	/*if (hasValue(feed)) {
		addTag_action(feed);
	}
	
	if (hasValue(author)) {
		addTag_action(author);
	}*/
}

function returnTypeOptions(parentobj) {
	if (typeof(parentobj) == "object") {
		$(".newtypeoptions li a").each(function() {
			var thisOpj = $(this);
			var optText = thisOpj.text();
			var optVal = "opt-"+optText.toLowerCase().replace(/\s/g,"");
			var plural = thisOpj.data("plural");
			if (typeof(plural) != "undefined") {
				optText = plural;
			}
			if(parentobj.find("."+optVal).length == 0) {
				var newdivcontent = $("<div class='datedivcontent'>");
				var newOptDiv = $("<div class='"+optVal+" noitems'>").append($("<div class='typeoptheader'>").text(optText));
				newOptDiv.append(newdivcontent);
				parentobj.append(newOptDiv);
			}
		});
	}
}

function returnDateDiv(dateId) {
	if ($("#"+dateId+".datediv").length == 0) {
		var newdiv = $("<div id='"+dateId+"' class='datediv'>");
		var newdivh3 = $("<h3>").text(getCurrentPrettyDate(false));
		newdiv.append(newdivh3);
		returnTypeOptions(newdiv);
		$(".datedivslist").prepend(newdiv);
	}
	return $("#"+dateId+".datediv");
}

function returnCurrentDateDiv() {
	return returnDateDiv(getCurrentDateID());
}

function newContClear() {
	$(".panel-tags ul.list-group").children().remove();
	$("#addtags").val("");
	
	newIoCClear();
	
	$("#NewContTitle").val("");
	$("#NewContDesc").val("");
	$("#NewContentUrl").val("");
	
	$("#hidUID").val("");
		
	window.setTimeout(function() { $("#NewContTitle").focus(); }, 100);
}

function newContSubmit() {
	$('li[data-action="items"]').click();
	if (hasValue($("#addtags").val())) {
		$("#btnaddtag").click();
	}
	writeContentFromNew();
}

function createTagDiv(inputword) {
	var res = false;
	var iwl = inputword.length;
	if (iwl != 0) {
		var seed = (inputword.toLowerCase().charCodeAt(0)-96) * iwl;
		var terc = randomColor({luminosity: 'light', seed: seed});
		console.log(terc);
		var newp = $("<div class='tagdiv' style='background-color:"+terc+"'>");
		newp.text(inputword);
		res = newp;
	}
	return res;
}

var rssFeedPreUrl = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json&callback=?&q=";

function rssFeedTest(url, btn) {
	$.getJSON(rssFeedPreUrl + url, function(data) {
		var feed = data.responseData.feed.title;
		$(".feeditems").append($("<div class='feeditem header'>").text(feed))
		$(data.responseData.feed.entries).each(function () { // or "item" or whatever suits your feed
			var el = $(this);
			var url = el[0].link;
			if (url.length != 0) {
				var buildItem = $("<div class='feeditem'>").prop("data-feed", feed);
				var alink = $("<a target='_blank'>").text(el[0].title).prop("href", url);
				buildItem.append($("<div class='title'>").append(alink));
				buildItem.append($("<div class='contentSnippet'>").text(el[0].contentSnippet));
				var author = el[0].author;
				if (hasValue(author)) {
					buildItem.append($("<div class='author'>").prop("data-val", author).html("<span class='bold'>Article by:</span> "+author));
				}
				buildItem.append($("<div class='published'>").html("<span class='bold'>Published:</span> "+el[0].publishedDate));
				var buttons = $('<div class="btn-group" role="group" aria-label="...">');
				buttons.append($('<button class="btn btn-default btn-xs btn-success" type="button" title="add to items">').html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'));
				buttons.append($('<button class="btn btn-default btn-xs btn-warning" type="button" title="mark as seen">').html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'));
				buildItem.append(buttons);
				$(".feeditems").append(buildItem);
			}
		});
		$(".feeditem .btn-group .btn-success").unbind('click').on("click", addFeedToItems);
		$(".feeditem .btn-group .btn-warning").unbind('click').on("click", hideFeedItem);
		$(btn).button('reset');
	});
}

function hideFeedItem() {
	var parentfeeditem = $(this).parent().parent();
	parentfeeditem.addClass("feeditemseen");
}

function checkUnsubmitted() {
	var currTitle = $("#NewContTitle").val();
	var currUid = $("#hidUID").val();
	
	if (hasValue(currTitle) || hasValue(currUid)) {
		if (confirm("It looks like there's an unsubmitted item, continue?") == false) {
			return false;
		} else {
			newContClear();
		}
	}
	
	return true;
}

function addFeedToItems() {
	var contin = checkUnsubmitted();
	if (!contin) {
		return;
	}
	
	$('li[data-action="new"]').click();
	if ( !sidebarVisible() ) {
		showSidebar();
	}
	
	var parentfeeditem = $(this).parent().parent();
	var feed = parentfeeditem.prop("data-feed");
	var title = parentfeeditem.find(".title a").text();
	var url = parentfeeditem.find(".title a").prop("href");
	var contentSnippet = parentfeeditem.find(".contentSnippet").text();
	var author = parentfeeditem.find(".author").prop("data-val");
	
	$("#NewContTitle").val(title);
	$("#NewContDesc").val(contentSnippet);
	$("#NewContentUrl").val(url);
	
	if (hasValue(feed)) {
		addTag_action(feed);
	}
	
	if (hasValue(author)) {
		addTag_action(author);
	}
	
	parentfeeditem.addClass("feeditemseen");
}

function toggleSidebar() {
	if ( sidebarVisible() ) {
		hideSidebar();
	} else {
		showSidebar();
	}
}

function sidebarVisible() {
	return !$(".container div.mainwindow").hasClass("sidebarhidden");
}

function showSidebar() {
	$(".container div.mainwindow").removeClass("sidebarhidden");
	$(".container div.sidebar").removeClass("sidebarhidden");
	$("#asidebarswitch").find("a").text("Hide Sidebar");
}

function hideSidebar() {
	$(".container div.mainwindow").addClass("sidebarhidden");
	$(".container div.sidebar").addClass("sidebarhidden");
	$("#asidebarswitch").find("a").text("Show Sidebar");
}

//$("#asidebarswitch").on("click", toggleSidebar);

function toggleInvertedColourOption() {
	var notInverted = !$("body").hasClass("inverted");
	setInvertedColourOptionOption(notInverted);
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("setting_invertedcolour", notInverted);
	}
}

function setInvertedColourOptionOption (test) {
	if (test) {
		$("body").addClass("inverted");
		$("#invColourOpt").prop("checked", true);
	} else {
		$("body").removeClass("inverted");
		$("#invColourOpt").prop("checked", false);
	}
}


function setInvertedColourOption_onLoad() {
	if (typeof(Storage) !== "undefined") {
		var t = localStorage.getItem("setting_invertedcolour");
		if (t != null) {
			t = (t == "true");
			setInvertedColourOptionOption(t);
		}
	}
}