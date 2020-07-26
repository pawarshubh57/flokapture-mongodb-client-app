var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectId = getParameterByName("pid");

$(document).ready(function () {
    customImpact: function (actionExecuted) {
        actionExecuted = actionExecuted || "";
        var jclAction = actionExecuted.trim();
        if (jclAction === "") return;
        var jclName = jclAction.split(" ")[0];
        var endPoint = "CustomRequirment/GetJclObjects?projectId=" + projectId + "&jclName=" + jclName;
        this.ajax.get(endPoint).then((jclData) => {
            this.fillJclObjects(jclData.data);
            var options = {
                contentWidth: 850,
                contentHeight: 450,
                showCancel: false,
                progressBarCurrent: true
            };
            var wizard = $("#revised-menu-wizard").wizard(options);
            wizard.show();
            var self = this;
            wizard.on('incrementCard', function () {
                var currentCard = this.getActiveCard();
                if (currentCard.alreadyVisited()) return;

                var cardName = currentCard.name;
                // console.log(cardName);
                self.fillObjects(cardName);
            });
            wizard.on('decrementCard', function () {
                // console.log(this.getActiveCard());
            });
            wizard.on('submit', function (w) {
                w.submitSuccess();
                w.hideButtons();
                w.updateProgressBar(0);
            });
        }).catch((err) => {
            this.bootBox.alert("There is no JCL file associated with this Menu!");
            console.log(err);
        });
    },

    fillObjects: function (cardName) {
        if (cardName === "Programs") {
            var items = $("#listSelectedJclObject").jqxListBox('getItems');
            var jclFile = [];
            items.forEach(function (item) {
                jclFile.push(item.value);
            });
            var fileIds = jclFile.join(",");
            var endPoint = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + fileIds;
            this.ajax.get(endPoint).then((res) => {
                var fileMaster = res.data;
                this.fillProgramObjects(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillProgramObjects(empty);
            });
        } else if (cardName === "Subroutines" /* || cardName === "Includes" */) {
            var pItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
            var pFile = [];
            pItems.forEach(function (item) {
                pFile.push(item.value);
            });
            var pFileIds = pFile.join(",");
            var endPoint1 = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + pFileIds;
            this.ajax.get(endPoint1).then((res) => {
                var fileMaster = res.data;
                this.fillSubroutinesAndIncludes(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillSubroutinesAndIncludes(empty);
            });
        } else if (cardName === "Summary") {
            this.generateSummary();
        } else if (cardName === "Download") {
            this.generateImpactDocument();
        }
    },

    fillJclObjects: function (jcls) {
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
    },

    fillProgramObjects: function (programs) {
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
    },

    fillSubroutinesAndIncludes: function (result) {
        var subRoutines = result.filter(function (element) {
            return element.FileTypeExtensionId === 17;
        });
        $("#listSubroutinesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: subRoutines,
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
    },

    generateSummary: function () {
        $("#tblSummary").html('');
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();
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
                html += drawSummaryRow(i, item);
        });
        $("#tblSummary").append(html);
    },

    generateImpactDocument: function () {
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();

        /* Entity */
        /*
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
        */
        var entityOjbectDet = {
            ObjDetailsLst: [], // entityObject,
            EntitySchema: false, // chkEntitySchema,
            PseudoCode: false,
            SourceCode: false
        };
        /* IDescriptor */
        /*
        var iDescriptorObject = [];
        var iDescriptorItems = $("#listSelectedIDescriptor").jqxListBox('getItems');
        $.each(iDescriptorItems, function (i, item) {
            iDescriptorObject.push({
                FileName: item.label,
                FileId: item.value
            });
        });
        */
        var iDescriptorOjbectDet = {
            ObjDetailsLst: [], // iDescriptorObject,
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
            ProjectId: projectId,
            Title: title,
            Description: description,
            EntityObject: entityOjbectDet,
            DescriptorObject: iDescriptorOjbectDet,
            JclObject: jclOjbectDet,
            ProgramObject: programOjbectDet,
            SubRoutineObject: subRoutineOjbectDet,
            IncludeObject: includeOjbectDet
        };
        document.getElementById("tdError123").innerHTML = "Please wait... Generating custom impacts document...";
        document.getElementById("tdError123").style.color = "green";
        var endPoint = "ExportWordDocument/GenerateCustomReqDocument";
        this.ajax.post(endPoint, customRequirmentDocDetails).then((res) => {
            document.getElementById("hdnDownloadPath").value = res.data;
            document.getElementById("tdError123").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
            document.getElementById("tdError123").style.color = "green";
            document.getElementById("btnDownload").disabled = false;
        }).catch((e) => {
            document.getElementById("tdError123").innerHTML = "Something went wrong, please try again.";
            document.getElementById("tdError123").style.color = "red";
        });
    }

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

    $("#btnDownload").click(function () {
        var dPath = document.getElementById("hdnDownloadPath").value;
        window.open(dPath, "_self");
        setTimeout(function () {
            window.location.reload(true);
        }, 2500);
    });
});