var pages = [
    "guide324.html", "guide1.html", "guide2.html", "guide3.html", "guide4.html", "guide5.html", "guide6.html", "guide7.html",
    "guide8.html", "guide9.html", "guide10.html", "guide11.html", "guide12.html", "guide13.html"
];
$(document).ready(function () {
    var url = window.location.pathname;
    var fileName = url.substring(url.lastIndexOf('/') + 1);
    console.log(fileName);
    var menuToShow = "landingRoleMenu";
    for (var f = 0; f < pages.length; f++) {
        if (pages[f] === fileName) {
            menuToShow = "userRoleMenu";
            break;
        }
    }
    var finalMeunBar = window.localStorage.getItem(menuToShow);
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});
