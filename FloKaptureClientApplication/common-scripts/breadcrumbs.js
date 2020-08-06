var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var prjctId = window.localStorage.getItem("prjctId");

$(document).ready(function () {
    var nPart = "";
    var option = "";
    var dashBoard = "";
    if (typeof prjctId !== 'undefined' && prjctId !== '0') {
        var prjWorkspace = "projects_workspace.html?pid=" + prjctId;
        dashBoard = "<li><a href='landing.html'>Dashboard</a></li><li><a href='" + prjWorkspace + "'>Project Dashboard</a></li>";
    } else {
        dashBoard = "<li><a href='landing.html'>Dashboard</a></li>";
    }
    var url = window.location.href;
    var parts = url.split("#").shift().split("?").shift();
    var part = parts.split("/").pop();
    if (part.includes("landing.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li><li class='active'>Dashboard</li>");
        return false;
    }
    else if (part.includes("projects_workspace.html")) {
        var projWorkspace = "projects_workspace.html?pid=" + prjctId;
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li><li><a href='landing.html'>Dashboard</a></li><li class='active'><a href='" + projWorkspace + "'>Project Dashboard</a></li>");
        return false;
    }
    /*------------------ Site Admin -------------*/
    else if (part.includes("review_logs.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'>Review Logs</li>");
        return false;
    }
    else if (part.includes("product_config.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='product_config.html'>Product Config</a></li>");
        return false;
    }
    else if (part.includes("db_config.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='db_config.html'>DB Config</a></li>");
        return false;
    }
    else if (part.includes("lic_details.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='lic_details.html'>License Details</a></li>");
        return false;
    }
    else if (part.includes("pseudocode.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='pseudocode.html'>Pseudo Code</a></li>");
        return false;
    }
    else if (part.includes("user_activity_report.html")) {
        nPart = url.split("?");
        option = nPart[1];
        if (option === "opt=1") {
            $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='user_activity_report.html'>User Activity Report</a></li>");
            return false;
        }
        if (option === "opt=2") {
            $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li><a href='#'>Reports</a></li><li class='active'><a href='user_activity_report.html?opt=2'>Unused Attributes</a></li>");
            return false;
        }
    }
    else if (part.includes("tag-categories.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='tag-categories.html'>Tag Category</a></li>");
        return false;
    }
    else if (part.includes("tag-category-master.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li><a href='#'>Site Admin</a></li><li class='active'><a href='tag-category-master.html'>Tag Categories</a></li>");
        return false;
    }
        /*------------------ Client Admin -------------*/
    else if (part.includes("user_management.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='user_management.html'>User Management</a></li>");
        return false;
    }

        /*------------------ Project Admin -------------*/
    else if (part.includes("submit_new_projects.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='submit_new_projects.html'>Submit New Project</a></li>");
        return false;
    }
    else if (part.includes("load_projects.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='load_projects.html'>Load Project</a></li>");
        return false;
    }
        //else if (part.includes("submit_new_projects.html")) {
        //    $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='submit_new_projects.html'>Submit New Project</a></li>");
        //    return false;
        //}
    else if (part.includes("view_rules.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='view_rules.html'>View Business Functions</a></li>");
        return false;
    }
    else if (part.includes("task_queue.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='task_queue.html'>Task Queue</a></li>");
        return false;
    }

        /*------------------ Inventory -------------*/



        /*------------------ Reports -------------*/

    else if (part.includes("crud_activity_report.html")) {
        nPart = url.split("?");
        option = nPart[1];
        if (option === "opt=1") {
            $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li><a href='#'>Reports</a></li><li class='active'><a href='crud_activity_report.html?opt=1'>Entity/Attribute Usage</a></li>");
            return false;
        }
        if (option === "opt=2") {
            $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li><a href='#'>Reports</a></li><li class='active'><a href='crud_activity_report.html?opt=2'>DB Activity Report</a></li>");
            return false;
        }
    }
    else if (part.includes("report.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='report.html'>Report</a></li>");
        return false;
    }
    else if (part.includes("missing_objects.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li><a href='#'>Reports</a></li><li class='active'><a href='missing_objects.html'>Missing Objects</a></li>");
        return false;
    }

        /*------------------ Custom Impacts -------------*/
    else if (part.includes("custom-requirements.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" +
            dashBoard +
            "<li class='active'><a href='custom-requirements.html'>Custom Impacts</a></li>");
        return false;
    }
    else if (part.includes("custom_diagram.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" +
            dashBoard +
            "<li class='active'><a href='custom_diagram.html'>Custom Diagram</a></li>");
        return false;
    }

        /*------------------ My Profile -------------*/
    else if (part.includes("my_profile.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" +
            dashBoard +
            "<li class='active'><a href='my_profile.html'>My Profile</a></li>");
        return false;
    }

        /*------------------ I want To -------------*/
    else if (part.includes("guide1.html") || part.includes("guide2.html")
        || part.includes("guide3.html") || part.includes("guide4.html")
        || part.includes("guide5.html") || part.includes("guide6.html")
        || part.includes("guide7.html") || part.includes("guide8.html")
        || part.includes("guide9.html") || part.includes("guide10.html")) {
        $(".breadcrumb").append("<li><a href='index.html'>Home</a></li><li><a href='login.html'>Login</a></li>" + dashBoard + "<li class='active'><a href='guide1.html'>I Want To...</a></li>");
        return false;
    }
});



