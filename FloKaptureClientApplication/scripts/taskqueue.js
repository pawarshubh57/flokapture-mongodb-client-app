var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");

var deletedWorkFlowIds = [];

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    loadData();
});

function loadData() {
    var userId = window.localStorage.getItem("userId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkflowProcess/GetAllProjectTaskStatus?userId=" + parseInt(userId),
        contentType: "application/json; charset=uft-8",
        success: function (data) {
            $("#namedemo-foo-col-exp").html('');
            if (data != null) {
                drawTaskQueueProjects(data, 'demo-foo-col-exp-no-page');
            }
        }
    });
}

function drawTaskQueueProjects(data, tableName) {
    for (var i = 0; i < data.length; i++) {
        drawTaskQueueProjectRow(data[i], tableName, i + 1);
    }
}


function drawTaskQueueProjectRow(rowData, tableName, srNo) {
    var row = $("<tr />");
    $("#" + tableName).append(row);
    var status;
    status = "";
    if (rowData.Active === 1) {
        status = "COMPLETED SUCCESSFULLY";
    } else if (rowData.Processed === 0) {
        status = "PENDING";
    }
    row.append($("<td style='width: 10px;'/>").append($("<input />").attr("id", "chk_" + rowData.ProjectId).attr("type", "checkbox").attr("style", "width: 70px;")));
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.ProjectName + "</td>"));
    row.append($("<td>" + rowData.SystemDescription + "</td>"));
    row.append($("<td>" + rowData.UploadedTm + " " + rowData.ProcessedTm + "</td>"));
    row.append($("<td>" + status + "</td>"));
    if (rowData.Active === 1) {
        row.append($("<td style='width: 15px;'/>").append($("<input />").attr("type", "button").attr("value", "Download").attr("onclick", "downloadFile(" + rowData.ProjectId + ")").attr("style", "width: 70px;")));
    } else {
        row.append($("<td>" + "-" + "</td>"));
    }
}


function drawTaskQueue(data, tableName) {
    for (var i = 0; i < data.length; i++) {
        drawTaskQueueRow(data[i], tableName, i + 1);
    }
}

function drawTaskQueueRow(rowData, tableName, srNo) {
    var row = $("<tr />");
    $("#" + tableName).append(row);
    var status;
    status = "";
    if (rowData.Processed === 1) {
        status = "COMPLETED SUCCESSFUL";
    } else if (rowData.Processed === 0) {
        status = "PENDING";
    }
    row.append($("<td style='width:15px;'/>").append($("<input />").attr("id", "chk_" + rowData.WorkflowProcessId).attr("type", "checkbox").attr("style", "width:70px;")));
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.Name + "</td>"));
    row.append($("<td>" + rowData.UserName + "</td>"));
    row.append($("<td>" + rowData.CreatedDate + "</td>"));
    row.append($("<td>" + status + "</td>"));
    if (rowData.Processed === 1) {
        row.append($("<td style='width:15px;'/>").append($("<input />").attr("type", "button").attr("value", "Download").attr("onclick", "downloadFile(" + rowData.WorkflowProcessId + ")").attr("style", "width:70px;")));
    } else {
        row.append($("<td>" + "-" + "</td>"));
    }
}

function downloadFile(workflowProId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "Test/downloadFileTaskQueqe?workflowProcessId=" + workflowProId,
        contentType: "application/json; charset=uft-8",
        success: function (data) {
            if (data != null) {
            }
        }
    });
}

function viewDiagramFile(projectId, name, workflowProId) {
    if (name === "Overall Workflow") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("connectivityName", name);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.location = "connectivityView.html";
    } else if (name === "Project Portfolio Workflow") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.localStorage.setItem("connectivityName", name);
        window.location = "connectivityView.html";
    } else if (name === "Multiple projects") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("connectivityName", name);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.location = "connectivityView.html";
    } else if (name === "Project Connectivity") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("connectivityName", name);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.location = "connectivityView.html";
    } else if (name === "Overall Connectivity") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("connectivityName", name);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.location = "connectivityView.html";
    } else if (name === "Project Connectivity with Dictionary") {
        window.localStorage.setItem("projectId", projectId);
        window.localStorage.setItem("connectivityName", name);
        window.localStorage.setItem("workFlowId", workflowProId);
        window.location = "connectivityView.html";
    }
}

$("#btnDelete").click(function () {
    // var rowCount = $('#demo-foo-col-exp tr').length;
    var deletedWorkFlowIdsNew = [];
    $("#demo-foo-col-exp input[type=checkbox]:checked").each(function () {
        var dataId = $(this)[0].id.substring(4);
        deletedWorkFlowIdsNew.push(dataId);
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkflowProcess/DeletedItem?WorkflowIds=" + deletedWorkFlowIdsNew,
        success: function (result) {
            if (result === "Ok") {
                $("#tdError")[0].innerHTML = "Record deleted successfully.";
                loadData();
            }
        }
    });
});