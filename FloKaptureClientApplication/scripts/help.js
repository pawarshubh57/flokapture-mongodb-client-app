var baseAddress = $.fn.baseAddress();
var $body = $("body");

$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

$(document).ready(function () {
    document.getElementById("tdError3").innerHTML = "";
    var helpDetails = new HelpDetails();
    helpDetails.showFileUpload();
    $("#btnSubmitDocument").click(helpDetails.saveHelpDocuments);
    showExistingHelps();
    $("#btn-delete-help").click(deleteHelps);
    $("#ddl-existing-helps").change(helpChange);
});

var helpChange = function () {
    if ($(this).val() === "Select") {
        $("#txtHelpTitle").attr("disabled", false);
    } else {
        $("#txtHelpTitle").attr("disabled", true);
    }
};

var showExistingHelps = function () {
    var helpDetails = new HelpDetails();
    helpDetails.showExistingHelps().then(function (res) {
        var helpDocs = res.data;
        var helpTable = $("#help-docs").html("");
        var existingHelps = $("#ddl-existing-helps").empty();
        existingHelps.append($("<option />").html("Select").val("Select"));
        helpDocs.forEach(function (hd) {
            existingHelps.append($("<option />").html(hd.HelpTitle).val(hd.HelpMasterId));
            var row = $("<tr />");
            var title = $("<td />").html(hd.HelpTitle);
            row.append($("<td />").append($("<label />").attr({ "class": "form-checkbox form-icon" })
                .append($("<input />").attr({ "type": "checkbox" }).attr({ id: hd.HelpMasterId })
                    .attr({ lang: hd.HelpTitle }))));
            var filename = hd.FilePath.replace(/^.*[\\\/]/, '');
            var downloadLink = hd.FilePath.replace(/C:\\inetpub\\wwwroot\\flokapture\\/i, "");
            var imgLink = downloadLink.replace(/\\/g, "\\\\");
            var aLink = $("<a />").css({ color: "#296bb1", "text-decoration": "underline", "cursor": "pointer" })
                .attr({
                    href: "javascript:window.open('" +
                        imgLink +
                        "', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=600');"
                })
                .html(filename);
            row.append(title).append($("<td />").append(aLink));
            helpTable.append(row);
        });
    }).catch(function (err) {
        console.log(err);
    });
};

var deleteHelps = function () {
    var helpDetails = new HelpDetails();
    var helpIds = [];
    $(".tbl-help-docs").find("input[type=checkbox]").each(function () {
        var isChecked = $(this).is(":checked");
        if (!isChecked) return;
        helpIds.push(parseInt($(this).attr("id")));
    });
    helpDetails.deleteHelp(helpIds)
        .then(showExistingHelps)
        .catch(function (e) { console.log(e); });
};

var HelpDetails = function () { };

HelpDetails.prototype = {
    showFileUpload: function () {
        $("#divFileUpload").ejUploadbox({
            width: "200px",
            height: "26px",
            multipleFilesSelection: false,
            dialogText: { title: "Upload Files" },
            dialogAction: { closeOnComplete: true, modal: true },
            buttonText: { browse: "Browse...", upload: "Upload", cancel: "Cancel" },
            customFileDetails: { title: true, name: true, size: true, status: true, action: true },
            saveUrl: "handlers/ObjectDocument.ashx",
            removeUrl: "",
            extensionsAllow: ".docx,.pdf,.doc,.png,.jpg,.jpeg",
            fileSize: 999999999,
            showBrowseButton: true,
            begin: function (args) {
                var saveUrl = "handlers/HelpDocument.ashx";
                args.model.saveUrl = saveUrl;
            },
            complete: function (args) {
                var fileName = args.files.name;
                // var serverResponce = args.responseText;
                $("#txtFileName").val(fileName);
                if (fileName !== "") {
                    document.getElementById("tdError3").innerHTML = "File uploaded successfully";
                    document.getElementById("tdError3").style.color = "green";
                    return false;
                } else {
                    document.getElementById("tdError3").innerHTML = "Error occured. Please try again";
                    document.getElementById("tdError3").style.color = "red";
                }
            },
            error: function (args) {
                console.log(args);
            },
            fileSelect: function (args) {
                console.log(args);
            }
        });
    },
    saveHelpDocuments: function () {
        // var isExisting = $("#ddl-existing-helps").val() === "Select" ? false : true;
        var existingHelpId = $("#ddl-existing-helps").val();
        var error = document.getElementById("tdError3");
        if ($("#txtHelpTitle").val() === "" && existingHelpId === "Select") {
            error.innerHTML = "Please enter Help title";
            $("#txtHelpTitle").focus();
            $("#txtHelpTitle").css("border-color", "red");
            $("#txtHelpTitle").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return;
        }
        var helpMaster = {
            FilePath: $("#txtFileName").val(),
            HelpTitle: $("#txtHelpTitle").val(),
            HelpMasterId: existingHelpId === "Select" ? 0 : parseInt(existingHelpId)
        };
        $.ajax({
            type: "POST",
            data: helpMaster,
            url: baseAddress + "HelpMaster/SaveDocument",
            success: function (result) {
                if (result !== null) {
                    document.getElementById("tdError3").innerHTML = "Help document saved successfully";
                    document.getElementById("tdError3").style.color = "green";
                    showExistingHelps();
                }
            }
        });
    },
    showExistingHelps: function () {
        return window.axios({
            method: "GET",
            url: baseAddress + "HelpMaster/GetAllHelps"
        });
    },
    deleteHelp: function (helpIds) {
        return window.axios({
            method: "POST",
            url: baseAddress + "HelpMaster/DeleteHelp",
            data: { HelpIds: helpIds }
        });
    }
};