var baseAddress = $.fn.baseAddress();

var userId = window.localStorage.getItem("userId");
$(document).ready(function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProductConfiguration/Get",
        success:function(result) {
            drawTable(result, "Tblshow");
        }
    });

});

$("#btnUpdate").click(function () {
    updateProduct();
    return false;
});

function drawTable(data, tableName) {    
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i], tableName, '',i);
    }
}

function drawRow(rowData, tableName, css,i) {
    var row = $("<tr title='record_" + rowData.ProductConfigurationId + "' id='productTr_" + rowData.ProductConfigurationId + "' />");
    var newTr = '<td><input type="text" id="txt_' + i + '" value=' + rowData.PropertyValue + ' style="width:100%"/></td>';
    $("#" + tableName).append(row);
    row.append($("<td style='display:none'>" + rowData.ProductConfigurationId + "</td>"));
    row.append($("<td >" + rowData.PropertyName + "</td>"));
    row.append($("<td style='display:none'>" + rowData.CreatedDate + "</td>"));
    row.append($("<td style='display:none'>" + rowData.IsDeleted + "</td>"));
    row.append(newTr);
}

function updateProduct() {
    document.getElementById("tdError12").innerHTML = "";
   
    var designData = { productConfigurationList: [] };
    var tbl = $('#Tblshowbody tr:has(td)').map(function (i, v) {
        var $td = $('td', this);
        var txt = "txt_" + i;
        return {
            ProductConfigurationId: $td.eq(0).text(),
            PropertyName: $td.eq(1).text(),
            PropertyValue: $("#" + txt + "").val(),
            UserId:userId,
            UpdatedDate: getTodaysDate(),
            CreatedDate: $td.eq(2).text(),
            IsDeleted: $td.eq(3).text()
    }
    }).get();
    for (var i = 0; i < tbl.length; i++) {
        designData.productConfigurationList.push(tbl[i]);
    }
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "ProductConfiguration/Post",
        data: designData,
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError12").innerHTML = "Project details uploaded successfully";
                document.getElementById("tdError12").style.color = "green";
            }
            return false;
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                document.getElementById("tdError12").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError12").innerHTML = "Error while connecting to API";
        }

    });
    document.getElementById("tdError12").innerHTML = "Project details uploaded successfully";
    document.getElementById("tdError12").style.color = "green";


}

function getTodaysDate() {
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    var twoDigitDate = fullDate.getDate() + "";
    if (twoDigitDate.length === 1)
        twoDigitDate = "0" + twoDigitDate;

    return twoDigitMonth + "/" + twoDigitDate + "/" + fullDate.getFullYear();
}