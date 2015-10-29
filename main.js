var rejex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;


var currentPage = "justinoboyle/markdown-render";
var Rule = function(key, value) {
    this.key = key;
    this.value = value
};
var devMode = false;
checkCurrentPage(true);
if (devMode)
    console.log("Developer Mode: on");
var url = (devMode ? "https://rawgit.com/" : "https://cdn.rawgit.com/") + currentPage;
httpGetAsync(url, function(data, status) {
    var rulesArr = [];
    var linesArr = [];
    var lines = data.split('\n');
    //Directive code
    var directiveListening = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if(line.startsWith("[//]: # (mr@stoplisten)")) directiveListening = false;
        if (directiveListening && line.startsWith("[//]: # (mr@") && line.endsWith(")") && line.includes("=")) {
            line = line.substring("[//]: # (mr@".length);
            line = line.substring(0, line.length - 1);
            rulesArr.push(new Rule(line.split("=")[0], line.substring(line.split("=")[0].length + 1)));
        } else
            linesArr.push(line.replace(rejex, ""));
    }
    for (var i = 0; i < rulesArr.length; i++) {
        if (rulesArr[i].key == "redir") {
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("?")) + "?" + (devMode ? "dev&" : "") + rulesArr[i].value;
        }
        if (rulesArr[i].key == "redir-silently") {
            currentPage = rulesArr[i].value;
            checkCurrentPage(false);
        }
    }
    render(linesArr.join("\n"));
});


function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4)
            callback(xmlHttp.responseText, xmlHttp.status);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function checkCurrentPage(fullPass) {
    var temp = window.location.href;
    temp = temp.replace("?page=", "?");
    temp = temp.replace("&page=", "&");

    temp = temp.replace("?dev=true", "?dev");
    temp = temp.replace("&dev=true", "&dev");

    if (temp.includes("?")) {
        if (fullPass)
            currentPage = temp.substring(temp.split("?")[0].length + 1);
        if (fullPass && currentPage.startsWith("dev&")) {
            currentPage = currentPage.substring("dev&".length);
            devMode = true;
        }
        if (fullPass && currentPage.endsWith("&dev")) {
            currentPage = currentPage.substring(0, currentPage.length - "dev&".length);
            devMode = true;
        }
        if (fullPass && currentPage == "dev") {
            currentPage = "justinoboyle/markdown-render";
            devMode = true;
        }
    }

    while (currentPage.endsWith("/"))
        currentPage = currentPage.substring(0, currentPage.length - 1);
    while (currentPage.startsWith("page="))
            currentPage = currentPage.substring("page=".length);
    while (currentPage.startsWith("/"))
        currentPage = currentPage.substring(1);
    if (currentPage.split("/").length < 3) {
        currentPage += "/master";
    }
    if (!currentPage.toLowerCase().endsWith(".md")) {
        currentPage += "/README.md";
    }

}

function render(data) {
	$("#content").html(marked(data));
	var nodes = document.getElementsByTagName("a"), i = nodes.length;
	var regExp = new RegExp("//" + location.host + "($|/)");
	while(i--){
   	    var href = nodes[i].href;
    	var isLocal = (href.substring(0,4) === "http") ? regExp.test(href) : true;
   	    if(isLocal) {
   	    	var temp = currentPage;
   	    	temp = temp.substring(0, temp.lastIndexOf("/"));
   	    	temp += "/" + href.substring(href.lastIndexOf(currentPage));
          if(!temp.endsWith(".md")) {
            var temp2 = currentPage;
            var recur = 0;
            while(++recur < 100 && temp2.split("/").length > 3) {
              var arr = temp2.split("/");
              temp2 = temp2.substring(0, temp2.length - temp2.lastIndexOf("/"));
            }
            nodes[i].href = "https://github.com/" + temp2 + "/" + href.substring(window.location.href.replace("/index.html?", "/?").split("?")[0].length);
          } else
   	    	nodes[i].href = "?" + temp + (devMode ? "&dev" : "");
   	    }
	}
}
