var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
var userId = window.localStorage.getItem("userId");
$(document).ready(function () {
    $.ajaxSetup({
        async: false
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/GetBusinessFunctionDetails",
        success: function (projectData) {
            if (projectData != null) {
                for (var k = 0; k < projectData.VwBusinessFunction.length; k++) {
                    drawTable(projectData.VwBusinessFunction[k], 'allProjects', k);
                }
            }
        }
    });
});

function drawTable(data, tableName, k) {
    if (tableName === "allProjects") {
        drawRow(data, tableName, k);
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer');
        }
    }
}

function drawRow(rowData, tableName, k) {
    var row = $("<tr title='record_" +
        rowData[0].ProjectId +
        "' id='projectTr_" +
        rowData[0].ProjectId +
        "' />");
    $("#" + tableName).append(row);
    row.append($("<td>" + (k + 1) + "</td>"));
    
    row.append($("<td>" + rowData[0].ProjectName + "</td>"));
    row.append($("<td>" + rowData[0].UploadedDate + "</td>"));
  //  row.append($("<td>" + rowData[0].UploadedBy + "</td>"));
    var td = $("<td />");
    var tbl = $($("<table class='table' />")); //<th>Action</th>
    tbl.append($("<thead><tr><th>Workflow Name</th><th>Function Name</th><th>Catalog</th><th>Created By</th><th>Action</th></tr>" +
            "</thead>"));
    var tblNew = $($("<tbody class='table' id='table_" + k + "'></tbody>"));
    for (var n = 0; n < rowData.length; n++) {
        var newRow = $("<tr title='rule_" + rowData[n].RuleId + "' id='func_" + rowData[n].RuleId + "' />");
        tblNew.append(newRow);
        newRow.append("<td>" +
            rowData[n].WorkflowName +
            "</td><td>" +
            rowData[n].RuleName +
            "</td><td>" +
            rowData[n].CatalogName +
            "</td>" +
            "<td>" +
            rowData[n].UploadedBy +
            "</td>"+
        " <td><button onclick='editBusinessFun(" + rowData[n].ProjectId + ", " + rowData[n].MethodStatementId + "," + rowData[n].ActionWorkflowId + ");' class='btn btn-mint'>View</button></td>");
    }
    tbl.append(tblNew);
    td.append(tbl);
    row.append(td);
}

function editBusinessFun(prjId, statementId,actionId) {
    window.location.href = "workflow_workspace.html?prjId=" + prjId + "&stId=" + statementId + "&aId=" + actionId + " ";
}

function removeBusinessFun(rowId, statementId, actionId, prjId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/RemoveBusinessFunction?rowId=" + rowId + "&statmentId="
                            + statementId + "&actionId=" + actionId + "&projectId=" + prjId,
        success: function (result) {
            if (result === "Updated successfully");
            {
                displayMessage("Business function removed successfully", "medium");
                return;
            }
            displayMessage("Error occurred please try again!", "medium");
            return false;
        }


    });

}

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}