var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");
var userId = window.localStorage.getItem("userId");
var languageId = window.localStorage.getItem("languageId");

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
    $("#mainnav-menu").metisMenu();
});

$(document).ready(function () {
    document.getElementById("dvError").innerHTML = "";
    document.getElementById("dvErr1").innerHTML = "";
    document.getElementById("dvErr2").innerHTML = "";
    languageId = parseInt(languageId);
    if (prjctId === "0") {
        document.getElementById("dvError").innerHTML = "Please select project for custom impacts from main dashboard page!";
        return false;
    }

    var options = {
        contentWidth: 850,
        contentHeight: 450,
        showCancel: true,
        progressBarCurrent: true,
        languageId: languageId
    };
    if (languageId === 6) {
        options.title = "Vba";
        var wizardVba = $("#some-wizard-vba").wizard(options);
        fillVbaObjects(wizardVba);
    }
    else if (languageId === 4) {
        var wizardCobol = $("#some-wizard-Cobol").wizard(options);
        // funEntityCobolObject(); // This is for entity object
        fillJclObjectsCobol(wizardCobol);
    }
    else if (languageId === 5) {
        var wizard = $("#some-wizard").wizard(options);
        funEntityObject();
        funIDescriptorLoad();
        fillJclObjects(wizard);
    }


    $("#btnGenerate").on("click", function () {
        document.getElementById("tdError").innerHTML = "";
        document.getElementById("tdError1").innerHTML = "";
        document.getElementById("tdError101").innerHTML = "";
        var customRequirmentDocDetails = languageId === 4
            ? documentCobolGenarate()
            : languageId === 5
                ? documentGenarate()
                : documentVbaGenarate();
        $body.addClass("loading");
        /*
        window.axios.post(baseAddress + "ExportWordDocument/GenerateCustomReqDocument", customRequirmentDocDetails)
            .then(function (data) {
                document.getElementById("hdnDownloadPath").value = data;
                document.getElementById("tdError").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError").style.color = "green";
                document.getElementById("tdError1").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError1").style.color = "green";
                $body.removeClass("loading");
            }).catch(function () {
                $body.removeClass("loading");
            });
        */

        $.ajax({
            type: "POST",
            url: baseAddress + "ExportWordDocument/GenerateCustomReqDocument",
            data: customRequirmentDocDetails,
            contenttype: "application/json",
            success: function (data) {
                document.getElementById("hdnDownloadPath").value = data;
                document.getElementById("tdError").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError").style.color = "green";
                document.getElementById("tdError1").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError1").style.color = "green";
                document.getElementById("tdError101").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
                document.getElementById("tdError101").style.color = "green";
                $body.removeClass("loading");
            },
            error: function () {
                $body.removeClass("loading");
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    $body.removeClass("loading");
                },
                404: function (response) {
                    $body.removeClass("loading");
                },
                500: function (response) {
                    $body.removeClass("loading");
                }
            }
        });
    });

    $("#btnDownload").on("click", function () {
        var path = document.getElementById("hdnDownloadPath").value;
        window.open(path, "_self");
        // wizard.close();
    });

    $("#btnSummary").on("click", function () {
        $("#tblSummary").html('');
        $("#tblCobolSummary").html('');
        languageId === 4 ? funCobolSummary() : languageId === 5 ? funSummary() : funVbaSummary();
        /*
        if (languageId === 4) {
            funCobolSummary();
        }
        else if (languageId === 5) {
            funSummary();
        }
        */
    });

    $("#btnIncludeEntity").click(function () {
        $('#listSelectedEntityObject').jqxListBox('refresh');
        var items = $("#listEntityObjects").jqxListBox('getCheckedItems');
        var entityObject = [];
        $.each(items, function (i, item) {
            entityObject.push({
                FileName: item.originalItem.FileName,
                FileId: item.originalItem.RowId,
            });
            $("#listSelectedEntityObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.RowId
                });
        });
        funIDescriptor(entityObject);
        return false;
    });

    $("#btnRemoveEntity").click(function () {
        var items = $("#listSelectedEntityObject").jqxListBox('getCheckedItems');
        var entityObject = [];
        $.each(items, function (i, item) {
            $("#listSelectedEntityObject").jqxListBox('removeItem', item);
        });
        var entityItems = $("#listSelectedEntityObject").jqxListBox('getItems');
        $.each(entityItems, function (i, item) {
            entityObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 100
            });
        })
        funIDescriptor(entityObject);
        return false;
    });

    $("#btnIncludeIDescriptor").click(function () {
        $('#listSelectedIDescriptor').jqxListBox('refresh');
        var items = $("#listIDescriptor").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIDescriptor").jqxListBox('addItem',
                {
                    label: item.originalItem.CompleteName,
                    value: item.originalItem.DescriptorId
                });
        }); return false;
    });

    $("#btnRemoveIDescriptor").click(function () {
        var items = $("#listSelectedIDescriptor").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIDescriptor").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludeJcl").click(function () {
        $('#listSelectedJclObject').jqxListBox('refresh');
        var items = $("#listJclObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedJclObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludePrograms").click(function () {
        $('#listSelectedProgramsObject').jqxListBox('refresh');
        var items = $("#listProgramsObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedProgramsObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemovePrograms").click(function () {
        var items = $("#listSelectedProgramsObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProgramsObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludeSubroutines").click(function () {
        $('#listSelectedSubroutinesObject').jqxListBox('refresh');
        var items = $("#listSubroutinesObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveSubroutines").click(function () {
        var items = $("#listSelectedSubroutinesObject").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('removeItem', item);
            }); return false;
    });

    $("#btnIncludeIncludes").click(function () {
        $('#listSelectedIncludesObject').jqxListBox('refresh');
        var items = $("#listIncludesObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveIncludes").click(function () {
        var items = $("#listSelectedIncludesObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('removeItem', item);
        }); return false;
    });

    /* Cobol */

    // Jcl //
    $("#btnIncludeJclCobol").click(function () {
        $('#listSelectedCobolJclObject').jqxListBox('refresh');
        var items = $("#listCobolJclObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedCobolJclObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });
    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedCobolJclObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedCobolJclObject").jqxListBox('removeItem', item);
        }); return false;
    });

    // Program // 

    $("#btnIncludeIProgramCobol").click(function () {
        $('#listSelectedCobolProgramObjects').jqxListBox('refresh');
        var items = $("#listCobolProgramObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedCobolProgramObjects").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });
    $("#btnRemoveProgramCobol").click(function () {
        var items = $("#listSelectedCobolProgramObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedCobolProgramObjects").jqxListBox('removeItem', item);
        }); return false;
    });

    // InputLib // 

    $("#btnIncludeProc").click(function () {
        $('#listSelectedProcObject').jqxListBox('refresh');
        var items = $("#listProcObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProcObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });
    $("#btnRemoveProc").click(function () {
        var items = $("#listSelectedProcObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProcObject").jqxListBox('removeItem', item);
        }); return false;
    });

    // Proc // 
    $("#btnIncludeInputLib").click(function () {
        $('#listSelectedInputLibObject').jqxListBox('refresh');
        var items = $("#listInputLibObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedInputLibObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });
    $("#btnRemoveInputLib").click(function () {
        var items = $("#listSelectedInputLibObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedInputLibObject").jqxListBox('removeItem', item);
        }); return false;
    });

    // Entity  // 

    $("#btnIncludeCblEntity").click(function () {
        $('#listSelectedEntityCblObject').jqxListBox('refresh');
        var items = $("#listEntityCblObjects").jqxListBox('getCheckedItems');
        var entityObject = [];
        $.each(items, function (i, item) {
            entityObject.push({
                FileName: item.originalItem.FileName,
                FileId: item.originalItem.RowId,
            });
            $("#listSelectedEntityCblObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.RowId
                });
        });
        funIDescriptor(entityObject);
        return false;
    });

    $("#btnRemoveCblEntity").click(function () {
        var items = $("#listSelectedEntityCblObject").jqxListBox('getCheckedItems');
        var entityObject = [];
        $.each(items, function (i, item) {
            $("#listSelectedEntityCblObject").jqxListBox('removeItem', item);
        });
        var entityItems = $("#listSelectedEntityCblObject").jqxListBox('getItems');
        $.each(entityItems,
            function (i, item) {
                entityObject.push({
                    FileName: item.label,
                    FileId: item.value,
                    FileTypeExtenstionId: 100
                });
            });
        funIDescriptor(entityObject);
        return false;
    });

    // VBA //

    $("#btnIncludeForm").click(function () {
        $('#listSelectedForm').jqxListBox('refresh');
        var items = $("#listFormObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedForm").jqxListBox('addItem',
                    {
                        label: item.originalItem.FileName,
                        value: item.originalItem.FileId
                    });
            }); return false;
    });

    $("#btnRemoveForm").click(function () {
        var items = $("#listSelectedForm").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedForm").jqxListBox('removeItem', item);
        });
        return false;
    });


    $("#btnIncludeBas").click(function () {
        $('#listSelectedBasObjects').jqxListBox('refresh');
        var items = $("#listBasObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedBasObjects").jqxListBox('addItem',
                    {
                        label: item.originalItem.FileName,
                        value: item.originalItem.FileId
                    });
            }); return false;
    });

    $("#btnRemoveBas").click(function () {
        var items = $("#listSelectedBasObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedBasObjects").jqxListBox('removeItem', item);
        });
        return false;
    });


    $("#btnIncludeRpt").click(function () {
        $('#listSelectedReport').jqxListBox('refresh');
        var items = $("#listReportObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedReport").jqxListBox('addItem',
                    {
                        label: item.originalItem.FileName,
                        value: item.originalItem.FileId
                    });
            }); return false;
    });

    $("#btnRemoveRpt").click(function () {
        var items = $("#listSelectedReport").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedReport").jqxListBox('removeItem', item);
        });
        return false;
    });


    $("#btnIncludeQuery").click(function () {
        $('#listSelectedQueryObject').jqxListBox('refresh');
        var items = $("#listQueryObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedQueryObject").jqxListBox('addItem',
                    {
                        label: item.originalItem.FileName,
                        value: item.originalItem.FileId
                    });
            }); return false;
    });

    $("#btnRemoveQuery").click(function () {
        var items = $("#listSelectedQueryObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedQueryObject").jqxListBox('removeItem', item);
        });
        return false;
    });
});


function documentGenarate() {
    var title = $("#txtTitle").val();
    var description = $("#txtDescription").val();

    /* Entity */
    var entityObject = [];
    var chkEntitySchema = document.getElementById("chkEntitySchema").checked;
    var entityItems = $("#listSelectedEntityObject").jqxListBox('getItems');
    $.each(entityItems, function (i, item) {
        entityObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 100
        });
    });
    var entityOjbectDet = {
        ObjDetailsLst: entityObject,
        EntitySchema: chkEntitySchema,
        PseudoCode: false,
        SourceCode: false
    };
    /* IDescriptor */
    var iDescriptorObject = [];
    var iDescriptorItems = $("#listSelectedIDescriptor").jqxListBox('getItems');
    $.each(iDescriptorItems, function (i, item) {
        iDescriptorObject.push({
            FileName: item.label,
            FileId: item.value,
        });
    });
    var iDescriptorOjbectDet = {
        ObjDetailsLst: iDescriptorObject,
        EntitySchema: false,
        PseudoCode: false,
        SourceCode: false
    };

    /* Jcl Object */
    var jclObject = [];
    var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
    var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
    var chkJclSource = document.getElementById("chkSourceJCL").checked;
    var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
    $.each(jclItems, function (i, item) {
        jclObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 10
        });
    });
    var jclOjbectDet = {
        ObjDetailsLst: jclObject,
        EntitySchema: chkJclDbAct,
        PseudoCode: chkJclPseudo,
        SourceCode: chkJclSource
    };

    /* Program Object */
    var programObject = [];
    var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
    var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
    var chkPrgSource = document.getElementById("chkSourceProg").checked;
    var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
    $.each(programItems, function (i, item) {
        programObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 9
        });
    });

    var programOjbectDet = {
        ObjDetailsLst: programObject,
        EntitySchema: chkPrgDbAct,
        PseudoCode: chkPrgPseudo,
        SourceCode: chkPrgSource
    };

    /* SubRoutine Object */

    var subRoutineObject = [];
    var chkSubDbAct = document.getElementById("chkDBActSub").checked;
    var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
    var chkSubSource = document.getElementById("chkSourceSub").checked;
    var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
    $.each(subRoutineItems, function (i, item) {
        subRoutineObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var subRoutineOjbectDet = {
        ObjDetailsLst: subRoutineObject,
        EntitySchema: chkSubDbAct,
        PseudoCode: chkSubPseudo,
        SourceCode: chkSubSource
    };

    /* Include Object */
    var includeObject = [];
    var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
    var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
    var chkIncludeSource = document.getElementById("chkSourceInc").checked;
    var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
    $.each(includeItems, function (i, item) {
        includeObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var includeOjbectDet = {
        ObjDetailsLst: includeObject,
        EntitySchema: chkIncludeDbAct,
        PseudoCode: chkIncludePseudo,
        SourceCode: chkIncludeSource
    };

    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        Description: description,
        EntityObject: entityOjbectDet,
        DescriptorObject: iDescriptorOjbectDet,
        JclObject: jclOjbectDet,
        ProgramObject: programOjbectDet,
        SubRoutineObject: subRoutineOjbectDet,
        IncludeObject: includeOjbectDet
    };
    return customRequirmentDocDetails;
}

// For Cobol

function documentCobolGenarate() {
    var title = $("#txtCobolTitle").val();
    var description = $("#txtCobolDescription").val();

    /* Entity */
    /*     
    var entityObject = [];
    var chkEntitySchema = document.getElementById("chkEntityCblSchema").checked;
    var entityItems = $("#listSelectedEntityCblObject").jqxListBox('getItems');
    $.each(entityItems, function (i, item) {
        entityObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 100
        });
    });
    var entityOjbectDet = {
        ObjDetailsLst: entityObject,
        EntitySchema: chkEntitySchema,
        PseudoCode: false,
        SourceCode: false
    };
    */
    var entityOjbectDet = {
        ObjDetailsLst: [],
        EntitySchema: false,
        PseudoCode: false,
        SourceCode: false
    };
    /* Jcl Object */
    var jclObject = [];
    var chkJclDbAct = document.getElementById("chkDBActJClCbl").checked;
    var chkJclPseudo = document.getElementById("chkPseudoJclCbl").checked;
    var chkJclSource = document.getElementById("chkSourceJCLCbl").checked;
    var jclItems = $("#listSelectedCobolJclObject").jqxListBox('getItems');
    $.each(jclItems, function (i, item) {
        jclObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 7
        });
    });
    var jclOjbectDet = {
        ObjDetailsLst: jclObject,
        EntitySchema: chkJclDbAct,
        PseudoCode: chkJclPseudo,
        SourceCode: chkJclSource
    };

    /* Program Object */
    var programObject = [];
    var chkPrgDbAct = document.getElementById("chkDBActPgmCbl").checked;
    var chkPrgPseudo = document.getElementById("chkPseudoPgmCbl").checked;
    var chkPrgSource = document.getElementById("chkSourcePgmCbl").checked;
    var programItems = $("#listSelectedCobolProgramObjects").jqxListBox('getItems');
    $.each(programItems, function (i, item) {
        programObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 6
        });
    });

    var programOjbectDet = {
        ObjDetailsLst: programObject,
        EntitySchema: chkPrgDbAct,
        PseudoCode: chkPrgPseudo,
        SourceCode: chkPrgSource
    };

    /* Proc Object */

    var procObject = [];
    var chkProcDbAct = document.getElementById("chkDBActProc").checked;
    var chkProcPseudo = document.getElementById("chkPseudoProc").checked;
    var chkProcSource = document.getElementById("chkSourceProc").checked;
    var procItems = $("#listSelectedProcObject").jqxListBox('getItems');
    $.each(procItems, function (i, item) {
        procObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 8
        });
    });
    var procOjbectDet = {
        ObjDetailsLst: procObject,
        EntitySchema: chkProcDbAct,
        PseudoCode: chkProcPseudo,
        SourceCode: chkProcSource
    };

    /* InputLib Object */
    var inputLibObject = [];
    var chkinputLibDbAct = document.getElementById("chkDBActInputLib").checked;
    var chkinputLibPseudo = document.getElementById("chkPseudoInputLib").checked;
    var chkinputLibSource = document.getElementById("chkSourceInputLib").checked;
    var inputLibItems = $("#listSelectedInputLibObject").jqxListBox('getItems');
    $.each(inputLibItems, function (i, item) {
        inputLibObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var inputLibOjbectDet = {
        ObjDetailsLst: inputLibObject,
        EntitySchema: chkinputLibDbAct,
        PseudoCode: chkinputLibPseudo,
        SourceCode: chkinputLibSource
    };

    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        Description: description,
        EntityObject:  entityOjbectDet,
        DescriptorObject: [],
        JclObject: jclOjbectDet,
        ProgramObject: programOjbectDet,
        SubRoutineObject: procOjbectDet,
        IncludeObject: inputLibOjbectDet
    };
    return customRequirmentDocDetails;
}

// For VBA

function documentVbaGenarate() {
    var title = $("#txtVBATitle").val();
    var description = $("#txtVBADescription").val();

    /* Form Object */
    var formObject = [];
    var chkFormDbAct = document.getElementById("chkDBActForm").checked;
    var chkFormPseudo = document.getElementById("chkPseudoForm").checked;
    var chkFormSource = document.getElementById("chkSourceForm").checked;
    var formItems = $("#listSelectedForm").jqxListBox('getItems');
    $.each(formItems, function (i, item) {
        formObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 14
        });
    });
    var formOjbectDet = {
        ObjDetailsLst: formObject,
        EntitySchema: chkFormDbAct,
        PseudoCode: chkFormPseudo,
        SourceCode: chkFormSource
    };

    /* Bas Object */
    var basObject = [];
    var chkBasDbAct = document.getElementById("chkDBActBas").checked;
    var chkBasPseudo = document.getElementById("chkPseudoBas").checked;
    var chkBasSource = document.getElementById("chkSourceBas").checked;
    var basItems = $("#listSelectedBasObjects").jqxListBox('getItems');
    $.each(basItems, function (i, item) {
        basObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 15
        });
    });

    var basOjbectDet = {
        ObjDetailsLst: basObject,
        EntitySchema: chkBasDbAct,
        PseudoCode: chkBasPseudo,
        SourceCode: chkBasSource
    };

    /* Report Object */

    var reportObject = [];
    var chkRptDbAct = document.getElementById("chkDBActRpt").checked;
    var chkRptPseudo = document.getElementById("chkPseudoRpt").checked;
    var chkRptSource = document.getElementById("chkSourceRpt").checked;
    var reportItems = $("#listSelectedReport").jqxListBox('getItems');
    $.each(reportItems, function (i, item) {
        reportObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 13
        });
    });
    var reportOjbectDet = {
        ObjDetailsLst: reportObject,
        EntitySchema: chkRptDbAct,
        PseudoCode: chkRptPseudo,
        SourceCode: chkRptSource
    };

    /* Query Object */
    var queryObject = [];
    var chkQryDbAct = document.getElementById("chkDBActQry").checked;
    var chkQryPseudo = document.getElementById("chkPseudoQry").checked;
    var chkQrySource = document.getElementById("chkSourceQry").checked;
    var qyueryItems = $("#listSelectedQueryObject").jqxListBox('getItems');
    $.each(qyueryItems, function (i, item) {
        queryObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 16
        });
    });
    var queryOjbectDet = {
        ObjDetailsLst: queryObject,
        EntitySchema: chkQryDbAct,
        PseudoCode: chkQryPseudo,
        SourceCode: chkQrySource
    };
    var entityOjbectDet = {
        ObjDetailsLst: [],
        EntitySchema: false,
        PseudoCode: false,
        SourceCode: false
    };
    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        Description: description,
        EntityObject: entityOjbectDet,
        DescriptorObject: {},
        JclObject: formOjbectDet,
        ProgramObject: basOjbectDet,
        SubRoutineObject: reportOjbectDet,
        IncludeObject: queryOjbectDet
    };
    return customRequirmentDocDetails;
}

function funSummary() {
    $("#tblSummary").html('');
    var title = $("#txtTitle").val();
    var description = $("#txtDescription").val();
    /* Entity */
    var chkEntitySchema = document.getElementById("chkEntitySchema").checked;
    var entityItems = $("#listSelectedEntityObject").jqxListBox('getItems');
    var eFileName = [];

    $.each(entityItems, function (i, item) {
        eFileName.push(item.label);
    });
    var entityOjbectDet = {
        "Object Name": eFileName,
        "Entity Schema": chkEntitySchema === true ? "Yes" : "No"
    };
    /* IDescriptor Object  */

    var iDescptItems = $("#listSelectedIDescriptor").jqxListBox('getItems');
    var iDescptFileName = [];
    $.each(iDescptItems, function (i, item) {
        iDescptFileName.push(item.label);
    });
    var iDescptOjbectDet = {
        "Object Name": iDescptFileName
    };

    /* Jcl Object */
    var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
    var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
    var chkJclSource = document.getElementById("chkSourceJCL").checked;
    var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
    var jFileName = [];
    $.each(jclItems, function (i, item) {
        jFileName.push(item.label);
    });
    var jclOjbectDet = {
        "Object Name": jFileName,
        "Entity Schema": chkJclDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkJclPseudo === true ? "Yes" : "No",
        "Source Code": chkJclSource === true ? "Yes" : "No"
    };

    /* Program Object */

    var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
    var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
    var chkPrgSource = document.getElementById("chkSourceProg").checked;
    var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
    var pFileName = [];
    $.each(programItems, function (i, item) {
        pFileName.push(item.label);
    });
    var programOjbectDet = {
        "Object Name": pFileName,
        "Entity Schema": chkPrgDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkPrgPseudo === true ? "Yes" : "No",
        "Source Code": chkPrgSource === true ? "Yes" : "No"
    };

    /* SubRoutine Object */

    var chkSubDbAct = document.getElementById("chkDBActSub").checked;
    var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
    var chkSubSource = document.getElementById("chkSourceSub").checked;
    var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
    var sFileName = [];
    $.each(subRoutineItems, function (i, item) {
        sFileName.push(item.label);
    });
    var subRoutineOjbectDet = {
        "Object Name": sFileName,
        "Entity Schema": chkSubDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkSubPseudo === true ? "Yes" : "No",
        "Source Code": chkSubSource === true ? "Yes" : "No"
    };


    /* Include Object */
    var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
    var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
    var chkIncludeSource = document.getElementById("chkSourceInc").checked;
    var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
    var iFileName = [];
    $.each(includeItems, function (i, item) {
        iFileName.push(item.label);
    });
    var includeOjbectDet = {
        "Object Name": iFileName,
        "Entity Schema": chkIncludeDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkIncludePseudo === true ? "Yes" : "No",
        "Source Code": chkIncludeSource === true ? "Yes" : "No"
    };

    var customRequirmentDocDetails = {
        Title: title,
        Description: description,
        "Entity Objects": entityOjbectDet,
        "I-Descriptors": iDescptOjbectDet,
        "JCL Objects": jclOjbectDet,
        "Program Objects": programOjbectDet,
        "Sub-Routine Objects": subRoutineOjbectDet,
        "Include Objects": includeOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblSummary").append(html);
    // var obj = JSON.stringify(customRequirmentDocDetails, undefined, 5);
    var obj = JSON.stringify(customRequirmentDocDetails, undefined, 5);
    // $("#tableXml").JSONView(obj);
}


function funCobolSummary() {
    $("#tblCobolSummary").html('');
    var title = $("#txtCobolTitle").val();
    var description = $("#txtCobolDescription").val();

    /* Entity */
    /*
    var chkEntitySchema = document.getElementById("chkEntityCblSchema").checked;
    var entityItems = $("#listSelectedEntityCblObject").jqxListBox('getItems');
    var eFileName = [];

    $.each(entityItems, function (i, item) {
        eFileName.push(item.label);
    });
    var entityOjbectDet = {
        "Object Name": eFileName,
        "Entity Schema": chkEntitySchema === true ? "Yes" : "No"
    };
    */
    /* Jcl Object */
    var chkJclDbAct = document.getElementById("chkDBActJClCbl").checked;
    var chkJclPseudo = document.getElementById("chkPseudoJclCbl").checked;
    var chkJclSource = document.getElementById("chkSourceJCLCbl").checked;
    var jclItems = $("#listSelectedCobolJclObject").jqxListBox('getItems');
    var jFileName = [];
    $.each(jclItems, function (i, item) {
        jFileName.push(item.label);
    });
    var jclOjbectDet = {
        "Object Name": jFileName,
        "Entity Schema": chkJclDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkJclPseudo === true ? "Yes" : "No",
        "Source Code": chkJclSource === true ? "Yes" : "No"
    };

    /* Program Object */
    var chkPrgDbAct = document.getElementById("chkDBActPgmCbl").checked;
    var chkPrgPseudo = document.getElementById("chkPseudoPgmCbl").checked;
    var chkPrgSource = document.getElementById("chkSourcePgmCbl").checked;
    var programItems = $("#listSelectedCobolProgramObjects").jqxListBox('getItems');
    var pFileName = [];
    $.each(programItems, function (i, item) {
        pFileName.push(item.label);
    });
    var programOjbectDet = {
        "Object Name": pFileName,
        "Entity Schema": chkPrgDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkPrgPseudo === true ? "Yes" : "No",
        "Source Code": chkPrgSource === true ? "Yes" : "No"
    };

    /* Proc Object */
    var chkProcDbAct = document.getElementById("chkDBActProc").checked;
    var chkProcPseudo = document.getElementById("chkPseudoProc").checked;
    var chkProcSource = document.getElementById("chkSourceProc").checked;
    var procItems = $("#listSelectedProcObject").jqxListBox('getItems');
    var procFileName = [];
    $.each(procItems, function (i, item) {
        procFileName.push(item.label);
    });
    var procOjbectDet = {
        "Object Name": procFileName,
        "Entity Schema": chkProcDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkProcPseudo === true ? "Yes" : "No",
        "Source Code": chkProcSource === true ? "Yes" : "No"
    };


    /* InputLib Object */
    var chkIncludeDbAct = document.getElementById("chkDBActInputLib").checked;
    var chkIncludePseudo = document.getElementById("chkPseudoInputLib").checked;
    var chkIncludeSource = document.getElementById("chkSourceInputLib").checked;
    var includeItems = $("#listSelectedInputLibObject").jqxListBox('getItems');
    var iFileName = [];
    $.each(includeItems, function (i, item) {
        iFileName.push(item.label);
    });
    var inputLibOjbectDet = {
        "Object Name": iFileName,
        "Entity Schema": chkIncludeDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkIncludePseudo === true ? "Yes" : "No",
        "Source Code": chkIncludeSource === true ? "Yes" : "No"
    };
    var customRequirmentDocDetails = {
        Title: title,
        Description: description,
        "Entity Objects": "", // entityOjbectDet,
        "I-Descriptors": "",
        "JCL Objects": jclOjbectDet,
        "Cobol Objects": programOjbectDet,
        "Proc Objects": procOjbectDet,
        "InputLib Objects": inputLibOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblCobolSummary").append(html);
}

function funVbaSummary() {
    $("#tblVBASummary").html('');
    var title = $("#txtVBATitle").val();
    var description = $("#txtVBADescription").val();

    /* Form Object */
    var chkFormDbAct = document.getElementById("chkDBActForm").checked;
    var chkformPseudo = document.getElementById("chkPseudoForm").checked;
    var chkFormSource = document.getElementById("chkSourceForm").checked;
    var formItems = $("#listSelectedForm").jqxListBox('getItems');
    var formFileName = [];
    $.each(formItems, function (i, item) {
        formFileName.push(item.label);
    });
    var formOjbectDet = {
        "Object Name": formFileName,
        "Entity Schema": chkFormDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkformPseudo === true ? "Yes" : "No",
        "Source Code": chkFormSource === true ? "Yes" : "No"
    };

    /* Bas Object */
    var chkBasDbAct = document.getElementById("chkDBActBas").checked;
    var chkBasPseudo = document.getElementById("chkPseudoBas").checked;
    var chkBasSource = document.getElementById("chkSourceBas").checked;
    var basItems = $("#listSelectedBasObjects").jqxListBox('getItems');
    var bFileName = [];
    $.each(basItems, function (i, item) {
        bFileName.push(item.label);
    });
    var basOjbectDet = {
        "Object Name": bFileName,
        "Entity Schema": chkBasDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkBasPseudo === true ? "Yes" : "No",
        "Source Code": chkBasSource === true ? "Yes" : "No"
    };

    /* Report Object */
    var chkRptDbAct = document.getElementById("chkDBActRpt").checked;
    var chkRptPseudo = document.getElementById("chkPseudoRpt").checked;
    var chkRptSource = document.getElementById("chkSourceRpt").checked;
    var reportItems = $("#listSelectedReport").jqxListBox('getItems');
    var rFileName = [];
    $.each(reportItems, function (i, item) {
        rFileName.push(item.label);
    });
    var reportOjbectDet = {
        "Object Name": rFileName,
        "Entity Schema": chkRptDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkRptPseudo === true ? "Yes" : "No",
        "Source Code": chkRptSource === true ? "Yes" : "No"
    };


    /* Query Object */
    var chkQryDbAct = document.getElementById("chkDBActQry").checked;
    var chkQryPseudo = document.getElementById("chkPseudoQry").checked;
    var chkQrySource = document.getElementById("chkSourceQry").checked;
    var qryItems = $("#listSelectedQueryObject").jqxListBox('getItems');
    var qFileName = [];
    $.each(qryItems, function (i, item) {
        qFileName.push(item.label);
    });
    var queryOjbectDet = {
        "Object Name": qFileName,
        "Entity Schema": chkQryDbAct === true ? "Yes" : "No",
        "Pseudo Code": chkQryPseudo === true ? "Yes" : "No",
        "Source Code": chkQrySource === true ? "Yes" : "No"
    };
    var customRequirmentDocDetails = {
        Title: title,
        Description: description,
        // "Entity Objects": entityOjbectDet,
        // "I-Descriptors": "",
        "Form Objects": formOjbectDet,
        "Bas Objects": basOjbectDet,
        "Report Objects": reportOjbectDet,
        "Query Objects": queryOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblVBASummary").append(html);
}

function drawRow(enities, cObject) {
    var html = "";
    html += "<tr>";
    html += "<td>" + enities + "</td>";
    html += "<td><table style='width: 100%;' class='table-bordered table-striped table table-hover'>";
    html += "<tr>";
    var entString = "";
    for (var k = 0; k <= cObject["Object Name"].length - 1; k++) {
        entString += cObject["Object Name"][k] + ", ";
    }
    entString = entString.trim();
    var lastChar = entString.slice(-1);
    if (lastChar === ',') {
        entString = entString.slice(0, -1);
    };
    html += "<td style='width: 23%;'>Objects</td><td>" + entString + "</td></tr>";
    var entitySchema = cObject["Entity Schema"];
    if (entitySchema)
        html += "<tr><td>Entity Schema</td><td>" + entitySchema + "</td></tr> ";
    var pseudoCode = cObject["Pseudo Code"];
    if (pseudoCode)
        html += "<tr><td>Pseudo Code</td><td>" + pseudoCode + "</td></tr> ";
    var sourceCode = cObject["Source Code"];
    if (sourceCode)
        html += "<tr><td>Source Code</td><td>" + sourceCode + "</td></tr> ";

    html += "</td></table>";
    return html;
}

function funEntityObject() {
    return new Promise(function (r, rj) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomRequirment/GetEntityObject?projectId=" + prjctId,
            success: function (result) {
                if (result !== null) {
                    $("#listEntityObjects").jqxListBox({
                        displayMember: 'FileName',
                        valueMember: 'RowId',
                        width: 200,
                        source: result,
                        checkboxes: true,
                        height: 200
                    });
                    $("#listSelectedEntityObject").jqxListBox({
                        displayMember: 'FileName',
                        valueMember: 'RowId',
                        width: 200,
                        source: [],
                        checkboxes: true,
                        height: 200
                    });
                    r();
                }
            }
        });
    });
}

function funIDescriptorLoad() {
    $("#listIDescriptor").jqxListBox({
        displayMember: 'CompleteName',
        valueMember: 'DescriptorId',
        width: 200,
        source: [],
        checkboxes: true,
        height: 200
    });
    $("#listSelectedIDescriptor").jqxListBox({
        displayMember: 'CompleteName',
        valueMember: 'DescriptorId',
        width: 200,
        source: [],
        checkboxes: true,
        height: 200
    });
}

function funIDescriptor(entityObject) {
    var entityOjbectDet = {
        ObjDetailsLst: entityObject,
        EntitySchema: false,
        PseudoCode: false,
        SourceCode: false
    };
    return new Promise(function (r, rj) {
        jQuery.ajax({
            type: "POST",
            data: entityOjbectDet,
            contenttype: "application/json",
            url: baseAddress + "CustomRequirment/GetIDescriptor?projectId=" + prjctId,
            success: function (result) {
                if (result !== null) {
                    $("#listIDescriptor").jqxListBox({
                        displayMember: 'CompleteName',
                        valueMember: 'DescriptorId',
                        width: 200,
                        source: result,
                        checkboxes: true,
                        height: 200
                    });
                    r();
                }
            }
        });

    });
}

function fillJclObjects(wizard) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetUniverseObjects?projectId=" + prjctId,
        success: function (result) {
            var jcls = result.filter(function (element) {
                return element.FileTypeExtensionId === 10;
            });
            $("#listJclObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: jcls,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedJclObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var programs = result.filter(function (element) {
                return element.FileTypeExtensionId === 9;
            });
            $("#listProgramsObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: programs,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedProgramsObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var subroutines = result.filter(function (element) {
                return element.FileTypeExtensionId === 17;
            });
            $("#listSubroutinesObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: subroutines,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedSubroutinesObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var includes = result.filter(function (element) {
                return element.FileTypeExtensionId === 12;
            });
            $("#listIncludesObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: includes,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedIncludesObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            wizard.show();
        }
    });
}

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

// Cobol Functions // 
function funEntitySchema(entityObject) {
    var entityOjbectDet = {
        ObjDetailsLst: entityObject,
        EntitySchema: false,
        PseudoCode: false,
        SourceCode: false
    };
    return new Promise(function (r, rj) {
        jQuery.ajax({
            type: "POST",
            data: entityOjbectDet,
            contenttype: "application/json",
            url: baseAddress + "CustomRequirment/GetEntitySchema?projectId=" + prjctId,
            success: function (result) {
                if (result !== null) {
                    $("#listIDescriptor").jqxListBox({
                        displayMember: 'FileName',
                        valueMember: 'RowId',
                        width: 200,
                        source: result,
                        checkboxes: true,
                        height: 200
                    });
                    r();
                }
            }
        });

    });
}

function fillJclObjectsCobol(wizardCobol) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetCobolObjects?projectId=" + prjctId,
        success: function (result) {
            var jcls = result.filter(function (element) {
                return element.FileTypeExtensionId === 7;
            });
            $("#listCobolJclObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: jcls,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedCobolJclObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var programs = result.filter(function (element) {
                return element.FileTypeExtensionId === 6;
            });

            $("#listCobolProgramObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: programs,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedCobolProgramObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var proc = result.filter(function (element) {
                return element.FileTypeExtensionId === 8;
            });

            $("#listProcObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: proc,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedProcObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var inputLib = result.filter(function (element) {
                return element.FileTypeExtensionId === 19;
            });

            $("#listInputLibObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: inputLib,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedInputLibObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            wizardCobol.language = 4;
            wizardCobol.show();
        }
    });
}

function funEntityCobolObject() {
    return new Promise(function (r, rj) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomRequirment/GetEntityObject?projectId=" + prjctId,
            success: function (result) {
                if (result !== null) {
                    $("#listEntityCblObjects").jqxListBox({
                        displayMember: 'FileName',
                        valueMember: 'RowId',
                        width: 200,
                        source: result,
                        checkboxes: true,
                        height: 200
                    });
                    $("#listSelectedEntityCblObject").jqxListBox({
                        displayMember: 'FileName',
                        valueMember: 'RowId',
                        width: 200,
                        source: [],
                        checkboxes: true,
                        height: 200
                    });
                    r();
                }
            }
        });
    });
}

function fillVbaObjects(wizardVba) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetVbaObjects?projectId=" + prjctId,
        success: function (result) {
            var forms = result.filter(function (element) {
                return element.FileTypeExtensionId === 14;
            });
            $("#listFormObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: forms,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedForm").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var bas = result.filter(function (element) {
                return element.FileTypeExtensionId === 15;
            });

            $("#listBasObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: bas,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedBasObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var reports = result.filter(function (element) {
                return element.FileTypeExtensionId === 13;
            });

            $("#listReportObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: reports,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedReport").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var query = result.filter(function (element) {
                return element.FileTypeExtensionId === 16;
            });

            $("#listQueryObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: query,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedQueryObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            wizardVba.language = 6;
            wizardVba.show();
        }
    });
}


