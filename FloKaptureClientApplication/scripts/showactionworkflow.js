var baseAddress = $.fn.baseAddress();

var userId = window.localStorage.getItem("userId");

function funShowWorkflows(fileId, prjId) {
    $("#tblWorkflows").html('');
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetAllActionWorkflows?fileId=" + fileId + "&projectId=" + prjId,
        success: function (data) {
            if (data !== null) {
                drawTable(data, "tblWorkflows");
            }
            $("#dvActionWorkflows").modal("show");
        }
    });
}
function drawTable(data, tableName) {
    for (var i = 0; i < data.length; i++) {
        drawWorkflowsRow(data[i], tableName);
    }
}
function drawWorkflowsRow(rowData, tableName) {
    var row = $("<tr />");
    $("#" + tableName).append(row);
    row.append($("</td>" + rowData + "</td>"));
}
function funOpenWindow(prjId, stmtId, aId) {
    window.open("workflow_workspace.html?prjId=" + prjId + "&stId=" + stmtId + "&aId=" + aId, "_blank");
}
