// region for external Pseudocode conversion for statements for those we don't have base command Id's

var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
// $.fn.getLicenseDetails("no");
$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    $("#btnTestRegEx").click(function () {
            //var projectId = getParameterByName("prjId");
            var sOrE = document.getElementById("rdStartig").checked;
            var pseudoCodeToNormalStatement = {
                Command: $("#txtInputCommand")[0].value,
                StartOrEnd: sOrE,
                RegularExpression: $("#txtRegExp")[0].value,
                ReplacementPattern: $("#txtReplacementPattern")[0].value,
                ProjectId: 0,
                TestOrSubmit: true
            }
            jQuery.ajax({
                type: "POST",
                data: pseudoCodeToNormalStatement,
                url: baseAddress + "StatementRule/ApplyPseudoCodeToNormalStatementsVba",
                success: function (statements) {
                    if (statements != null) {
                        var sourceNew =
                        {
                            dataType: "json",
                            dataFields: [
                                { name: 'FileId', type: 'int' },
                                { name: 'AlternateName', type: 'string' }
                            ],
                            id: 'StatementId',
                            localData: statements
                        };

                        var dataAdapter = new $.jqx.dataAdapter(sourceNew);
                        $("#testRegExResults")
                            .jqxGrid(
                            {
                                width: "100%",
                                height: 850,
                                source: dataAdapter,
                                showheader: true,
                                columns: [
                                    { text: '#Sr', dataField: 'FileId', width: 30 },
                                    { text: 'Test Output', dataField: 'AlternateName' }
                                ]
                            });
                    }
                }
            });
    });

    $("#btnSubmitPattern").click(function () {
        //var projectId = getParameterByName("prjId");
        var sOrE = document.getElementById("rdStartig").checked;
        var pseudoCodeToNormalStatement = {
            Command: $("#txtInputCommand")[0].value,
            StartOrEnd: sOrE,
            RegularExpression: $("#txtRegExp")[0].value,
            ReplacementPattern: $("#txtReplacementPattern")[0].value,
            ProjectId: 0,
            TestOrSubmit: false
        }
        jQuery.ajax({
            type: "POST",
            data: pseudoCodeToNormalStatement,
            url: baseAddress + "StatementRule/ApplyPseudoCodeToNormalStatementsVba",
            success: function (statements) {
                if (statements === "Done") {
                    $("#testRegExResults").html('');
                    $("#testRegExResults").attr("class", "");
                    $("#testRegExResults")[0]
                        .innerHTML = "Pseudo code conversion applied successfully for all projects. Please wait while page reloads... ";
                    setTimeout(function() {
                        window.location.href = "pseudocode.html";
                    },3000);
                }
            }
        });
    });
});