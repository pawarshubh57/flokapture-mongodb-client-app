var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
var userId = window.localStorage.getItem("userId");
$(document).ready(function () {
    fillSolutionDropDown();
    fillProjectDropDown();
    var pOpt = 1;
    var uploadedFiles = "";
    $('#ejFileUpload').ejUploadbox({
        width: "150px",
        multipleFilesSelection: false,
        dialogText: { title: "Upload Project (.zip)" },
        dialogAction: { closeOnComplete: true, modal: true },
        buttonText: { browse: "Browse", upload: "Upload", cancel: "Cancel" },
        customFileDetails: { title: true, name: true, size: true, status: true, action: true },
        saveUrl: "handlers/UploadFiles.ashx?pOpt=" + pOpt,
        fileSize: 999999999,
        extensionsAllow: ".zip",
        removeUrl: "",
        showBrowseButton: true,
        complete: function (args) {
            var fileName = args.file;
            var serverResponce = args.responseText;
            if (serverResponce.indexOf("Ok") !== -1) {
                uploadedFiles += fileName + ",";
            }
            $('#ejFileUpload').val(uploadedFiles);
            $("#tdError12")[0].innerHTML = "File uploaded successfully";
            $("#tdError12")[0].style.color = "green";
        },
        error: function (args) {
            console.log(args);
        },
        fileSelect: function (args) {
            var files = "";
            files = files + args.files[0].name;
            $("#path").val(files);
        }
    });
    $('#ejFileUpload').on('uploadStart', function (event) {
        var fileName = event.args.file;
        $("#path").val(fileName);
    });

    $('#ejFileUpload').on('complete', function (event) {
        var args = event.args;
        var fileName = args.file;
        var serverResponce = args.responseText;
        if (serverResponce.indexOf("Ok") !== -1) {
            uploadedFiles += fileName + ",";
        }
        $('#ejFileUpload').val(uploadedFiles);
        $("#selectedFiles").val(fileName);
        $("#tdError12")[0].innerHTML = "File uploaded successfully";
    });

    $('#ejFileUpload').on('select', function (event) {
        var args = event.args;
        $("#selectedFiles").val(args.file);
    });
    fillLoadProjects();
    //$.get(baseAddress + "ProjectMaster/GetProjectWorkSpaces",
    //    function (projectData) {
    //        if (projectData != null) {
    //            drawTable(projectData, 'allProjects');
    //        }
    //    });

    $("#btnSubmitProjectDatais").click(function () {
        submitProjectDetails();
    });

    $("#btnNext").click(function () {
        document.getElementById("tdError").innerHTML = "";
        $("#txtSolutionType").val("");
        fillLanguageDropDown();
        $("#divSolution").modal("show");

    });

    $("#btnAddSolutionType").click(function () {
        var error = document.getElementById("tdError");
        if ($("#txtSolutionType").val() === "") {
            error.innerHTML = "Please enter solution type";
            $("#txtSolutionType").focus();
            $("#txtSolutionType").css("border-color", "red");
            $("#txtSolutionType").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var solutionDetails = [];
        solutionDetails.push({
            "SolutionType": $("#txtSolutionType").val(),
            "LanguageId": $("#ddlLanguageType").val()
        });
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "SolutionMaster/POST",
            data: solutionDetails[0], // {"UserName": userName, "Password": password},
            success: function (result) {
                if (result !== null) {
                    document.getElementById("tdError").innerHTML = "Solution details added successfully";
                    document.getElementById("tdError").style.color = "green";
                    $("#divSolution").modal("hide");
                    fillSolutionDropDown();
                }
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                },
                404: function (response) {
                    document.getElementById("tdError").innerHTML = response.statusText;
                },
                500: function (response) {
                    document.getElementById("tdError").innerHTML = response.statusText;
                }
            },
            error: function () {
                document.getElementById("tdError").innerHTML = "Error while connecting to API";
            }
        });

    });

    $("#ddlProjectName").attr("disabled", "disabled");

    $("#rdExisting").click(function () {
        $("#ddlProjectName").removeAttr("disabled");
        $("#projectName").attr("disabled", "disabled");
        $.get(baseAddress + "ProjectMaster/Get", function (projects) {
            if (projects !== null && typeof projects !== 'undefined') {
                $("#ddlProjectName").html("");
                var option = '';
                for (var i = 0; i < projects.length; i++) {
                    option += '<option value="' + projects[i].ProjectId + '">' + projects[i].ProjectName + '</option>';
                }
                $("#ddlProjectName").append(option);
            }
        });
    });

    $("#rdNew").click(function () {
        $("#projectName").removeAttr("disabled");
        $("#ddlProjectName").attr("disabled", "disabled");
    });
});

function submitProjectDetails() {
    document.getElementById("tdError12").innerHTML = "";
    var projectDetails = [];
    projectDetails.push({
        "ProjectConfigType": $("#ddlProjectType").val(),
        "LanguageId": 0,
        "ProjectName": $("#projectName").val(),
        "ProjectDescription": $("#projectDesc").val(),
        "PhysicalPath": $("#path").val(),
        "SolutionId": $("#ddlsolutionType").val(),
        "Active": 1,
        "IsCtCode": document.getElementById("chkidCtCode").checked
    });
    var solutionId = $("#ddlsolutionType").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/IsDuplicate?projectName=" + $("#projectName").val() + "&solutId=" + solutionId,
        success: function (result) {
            if (result === "exist") {
                bootbox.confirm({
                    message: "Project with the same name exists in the solution selected. Do you want to replace. ?",
                    callback: function (r) {
                        if (r === true) {
                            jQuery.ajax({
                                type: "POST",
                                url: baseAddress + "ProjectMaster/POST",
                                data: projectDetails[0],
                                success: function (rr) {
                                    if (rr !== null) {
                                        document.getElementById("tdError12").innerHTML = "Project details uploaded successfully. You will be redirected to Load Project Workspace page in 2 sec.";
                                        document.getElementById("tdError12").style.color = "green";
                                        setTimeout(function () {
                                            location.href = "load_projects.html";
                                        }, 2000);
                                    }
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
                            document.getElementById("tdError12").innerHTML = "Project details uploaded successfully. You will be redirected to Load Project Workspace page in 2 sec.";
                            document.getElementById("tdError12").style.color = "green";
                            setTimeout(function () {
                                location.href = "load_projects.html";
                            }, 2000);
                        }
                    }
                });
            } else {
                jQuery.ajax({
                    type: "POST",
                    url: baseAddress + "ProjectMaster/POST",
                    data: projectDetails[0],
                    success: function (result) {
                        if (result !== null) {
                            document.getElementById("tdError12").innerHTML = "Project details uploaded successfully";
                            document.getElementById("tdError12").style.color = "green";
                        }
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
            }
        }
    });
}

function drawTable(data, tableName) {
    if (tableName === "allProjects") {
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i], tableName, '');
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer');
        }
    }
}

var startProjectProcessing = function (ctrl) {
    var data = ctrl.data;
    console.log(data);
    var trId = $(ctrl.target).closest("tr").attr("id");
    console.log(trId);
    var languageId = data.LanguageId;
    var url = languageId === 5
        ? "UniverseBasic/StartProcess?projectId=" + data.ProjectId
        : languageId === 4
            ? "CobolProcessingVersionBatch/ExecuteProcessActionsOneByOne?projectId=" + data.ProjectId
            : "VbaProcessingVersion1/ExecuteProcessActionsOneByOne/?projectId=" + data.ProjectId;
    var hostName = window.location.hostname;
    // var baseUrl = "http://" + hostName + ":5555/api/";
    var baseUrl = "http://localhost:5555/api/";
    jQuery.ajax({
        type: "GET",
        url: baseUrl + url,
        success: function (res) {
            console.log(res);
            $(ctrl.target).css("display", "none");
        }
    });
};

var startProcessStep = function (ctrl) {
    var data = ctrl.data;
    var pid = data.ProjectId;

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetReProcessSteps?projectId=" + pid,
        success: function (result) {
            var processSteps = $("#reProcessSteps").html("");
            var stepCnt = 0;
            result.forEach(function (ps) {
                stepCnt++;
                var row = $("<tr />");
                row.append($("<td />").html(stepCnt))
                    .append($("<td />").html(ps.ProcessStepDescription))
                    .append($("<td />").html(ps.StartDate || "-"))
                    .append($("<td />").html(ps.EndDate || "-"))
                    .append($("<td />").html(ps.Status === true ? "Completed" : "Pending"))
                    .append($("<td />").html(ps.ReProcess));
                processSteps.append(row);
            });
            $("#showReProcessStepsDialog").modal("show");
        }
    });
}

function drawRow(rowData, tableName, css) {
    var row = $("<tr title='record_" + rowData.ProjectId + "' id='projectTr_" + rowData.ProjectId + "' />");
    // style='cursor: " + css + ";' onclick='changeBg(this);' ; />");
    $("#" + tableName).append(row);
    var pStatus = rowData.ProcessedDate ? rowData.ProcessedDate : "Not Processed";
    var proStatus = rowData.Processed === 3 ? "Processing..." : pStatus;
    var d = rowData.ProcessedDate ? "none" : "inline";
    var disp = rowData.Processed === 3 ? "none" : d;
    var load = rowData.Processed === 3 || rowData.Processed === 0 ? "none" : "inline";
    var procSteps = proStatus === "Processing..."
        ? "<a href='#' onclick=showProcessSteps(" +
        rowData.ProjectId +
        "); style='color: blue; text-decoration: underline;'> Processing... </a>"
        : proStatus;
    // var now = new Date("13-01-2011".replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    row.append($("<td>" + rowData.ProjectName + "</td>"));
    row.append($("<td>" + rowData.PhysicalPath + "</td>"));
    row.append($("<td>" + rowData.UploadedDate/*parseDateTime(rowData.UploadedDate)*/ + "</td>"));
    row.append($("<td>" + procSteps /*parseDateTime(rowData.ProcessedDate)*/ + "</td>"));
    var btnCtrl = $("<button />").attr("class", "btn btn-mint").html("Load in Workspace");
    var startProcessButton = $("<button />").attr("class", "btn btn-primary").html("Start Processing");
    startProcessButton.on("click", { ProjectId: rowData.ProjectId, ProjectName: rowData.ProjectName, LanguageId: rowData.LanguageId }, startProjectProcessing);
    var ap = $('<a />')
        .prop("href", "projects_workspace.html?pid=" + rowData.ProjectId).css("display", load)
        .append(btnCtrl);
    var aProcess = $('<a />')
        .prop("href", "#").css("padding", "2px").css("display", disp)
        .append(startProcessButton);
    row.append($("<td />").append(aProcess).append(ap));

    var btnProcess = $("<button/>").attr("class", "btn btn-success").html("Process Step");
    btnProcess.on("click", { ProjectId: rowData.ProjectId, ProjectName: rowData.ProjectName, LanguageId: rowData.LanguageId }, startProcessStep);
    var aProcessStep = $("<a/>").append(btnProcess);
    row.append($("<td />").append(aProcessStep));
}

var reProcessStep = function (processId, projectId, langId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/UpdateProcessSteps?stepId=" + processId,
        success: function (result) {
            if (result !== null) {
                var languageId = langId;
                var url = languageId === 5
                    ? "UniverseBasic/StartProcess?projectId=" + projectId
                    : languageId === 4
                        ? "CobolProcessingVersionBatch/ExecuteProcessActionsOneByOne?projectId=" + data.ProjectId
                        : "VbaProcessingVersion1/ExecuteProcessActionsOneByOne/?projectId=" + data.ProjectId;
                var hostName = window.location.hostname;
                var baseUrl = "http://" + hostName + ":5555/api/";
                jQuery.ajax({
                    type: "GET",
                    url: baseUrl + url,
                    success: function (res) {
                        console.log(res);
                        //  $(ctrl.target).css("display", "none");
                    }
                });
            }
        }
    })
}

var showProcessSteps = function (pid) {
    console.log(pid);
    /*
    var steps = [
        {
            StepNumber: 0,
            Step: "ChangeFileExtensions",
            Description: "Change Extensions of all related files like .jcl, .icd"
        }, {
            StepNumber: 1,
            Step: "StartProcessUbProject",
            Description: "Instert file information into database"
        }, {
            StepNumber: 2,
            Step: "UploadFileMenuDataRevised",
            Description: "Upload Menu file details"
        }, {
            StepNumber: 3,
            Step: "UploadDataDictionary",
            Description: "Upload Data Dictionary details"
        }, {
            StepNumber: 4,
            Step: "ProcessForUniverseDescriptor",
            Description: "Upload UniVerse Descriptor details"
        }, {
            StepNumber: 5,
            Step: "ProcessUniverseJcls",
            Description: "JCL file processing"
        }, {
            StepNumber: 6,
            Step: "ProcessUniversePrograms",
            Description: "Program file processing"
        }, {
            StepNumber: 7,
            Step: "ProcessUniverseSubRoutinesAndIncludes",
            Description: "SubRoutine and Include file processing"
        }, {
            StepNumber: 8,
            Step: "ViewSource",
            Description: "Dump file contents into database"
        }, {
            StepNumber: 9,
            Step: "UpdateRefFileIdForProgramsAndSubRoutines",
            Description: "Update file reference details for Programs and SubRoutines"
        }, {
            StepNumber: 10,
            Step: "UpdateRefFileIdForIncludes",
            Description: "Update file reference details for Includes"
        }, {
            StepNumber: 11,
            Step: "UpdateReferenceFileIdForPrograms",
            Description: "Update file reference details for Programs"
        }, {
            StepNumber: 12,
            Step: "UpdateBusinessNamesForMethods",
            Description: "Update Business Name of Paragraphs / Methods for Programs"
        }, {
            StepNumber: 13,
            Step: "UpdateBusinessNamesForIncludes",
            Description: "Update Business Name for Includes"
        }, {
            StepNumber: 14,
            Step: "UpdateBusinessNameForBaseCommandId19",
            Description: "Update Business Name for Starting Statement"
        }, {
            StepNumber: 15,
            Step: "StartParsingProcessUniverseBasic",
            Description: "Parsing Process of all Programs, JCLs, Includes and SubRoutines"
        }, {
            StepNumber: 16,
            Step: "UpdateBusinessNameTo651Chars",
            Description: "Limit the business names upto 650 characters"
        }, {
            StepNumber: 17,
            Step: "ProcessPseudoCodeConversion",
            Description: "Process for Pseudo Code Conversions of IF Statements"
        }, {
            StepNumber: 18,
            Step: "InsertActionWorkflowsFromUniverseMenuFile",
            Description: "Insert ActionWorkflows From UniVerse Menu File"
        }, {
            StepNumber: 19,
            Step: "GetAllStartingPoints",
            Description: "Process all starting points of workflow"
        }, {
            StepNumber: 20,
            Step: "ProcessUniverseProgramWorkflows",
            Description: "Process of Program Workflows"
        }, {
            StepNumber: 21,
            Step: "ProcessCrudObjectReferences",
            Description: "Process of CRUD References (OPEN Statements in Includes)"
        }, {
            StepNumber: 22,
            Step: "ProcessIncludeToInclude",
            Description: "Process of Include to Include references"
        }, {
            StepNumber: 23,
            Step: "ProcessDataDependencyForUniVerse",
            Description: "Process for Data Dependency"
        }, {
            StepNumber: 24,
            Step: "ProcessCrudActivity",
            Description: "Process for CRUD Activity"
        }, {
            StepNumber: 25,
            Step: "ProcessActionWorkflowDetails",
            Description: "Process for Action Workflow Details"
        }, {
            StepNumber: 26,
            Step: "ProcessSubRoutineWorkflows",
            Description: "Process for SubRoutine Workflows"
        }, {
            StepNumber: 27,
            Step: "ProcessIncludeWorkflows",
            Description: "Process for Includes Workflows"
        }, {
            StepNumber: 28,
            Step: "MissingObjectsReport",
            Description: "Process for Missing Objects Report"
        }, {
            StepNumber: 29,
            Step: "ProcessForProjectInventory",
            Description: "Process for Project Inventory Report"
        }, {
            StepNumber: 30,
            Step: "ProcessForDataInventory",
            Description: "Process for Data Inventory Repoprt"
        }, {
            StepNumber: 31,
            Step: "ProcessEntityAttributeUsageReport",
            Description: "Process for Entity-Attribute Usage Report"
        }, {
            StepNumber: 32,
            Step: "UpdateProjectStatus",
            Description: "Update Project Status as Completed."
        }
    ];
    */
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProcessSteps?projectId=" + pid,
        success: function (result) {
            var processSteps = $("#processSteps").html("");
            var stepCounter = 0;
            result.forEach(function (ps) {
                // var spepDetails = steps.shift();
                stepCounter++;
                var row = $("<tr />");
                row.append($("<td />").html(stepCounter))
                    .append($("<td />").html(ps.Step.ProcessStepDescription))
                    .append($("<td />").html(ps.StartDate || "-"))
                    .append($("<td />").html(ps.EndDate || "-"))
                    .append($("<td />").html(ps.Step.Status === true ? "Completed" : "Pending"));
                processSteps.append(row);
            });
            $("#showStepsDialog").modal("show");
        }
    });
};

function parseDateTime(dt) {
    var today = Date.parse(dt);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var date = mm + '/' + dd + '/' + yyyy;
    return date;
}

function fillProjectTypeDropdown() {
    jQuery.ajax({
        type: "GET",
        //url: baseAddress + "General/GetNameValue?entity=ProjectType",
        url: baseAddress + "General/GetNameValue?entity=ProjectMaster",
        success: function (result) {
            $.each(result, function (key, value) {
                $("#ddlProjectType").append("<option value=" + value.Value + ">" + value.Name + "</option>");
            });
        }
    });
}

function fillProjectDropDown() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectType/GetAllItems",
        success: function (result) {
            $("#ddlProjectType").append("<option value='0'>Select</option>");
            $.each(result, function (key, value) {
                $("#ddlProjectType").append("<option value=" + value.ProjectTypeId + ">" + value.ProjectTypeName + "</option>");
            });

        }
    });
}

function fillSolutionDropDown() {
    $("#ddlsolutionType option").remove();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "SolutionMaster/GetAllItems",
        success: function (result) {
            $("#ddlsolutionType").append("<option value='0'>Select</option>");
            $.each(result, function (key, value) {
                $("#ddlsolutionType").append("<option value=" + value.SolutionId + ">" + value.SolutionType + "</option>");
            });
        }
    });
}

function fillLanguageDropDown() {
    $("#ddlLanguageType option").remove();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "LanguageMaster/GetAllItems",
        success: function (result) {
            $("#ddlLanguageType").append("<option value='0'>Select</option>");
            $.each(result,
                function (key, value) {
                    $("#ddlLanguageType").append("<option value=" + value.LanguageId + ">" + value.LanguageName + "</option>");
                });
        }
    });
};

function fillLoadProjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProjectWorkSpaces",
        success: function (projectData) {
            if (projectData !== null) {
                drawTable(projectData, 'allProjects');
            }
        }
    });
}