var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
// $.fn.getLicenseDetails("no");

$(document).ready(function () {
    fillRoleDropDown();
    fillUserDetailsGrid();
    fillProjectDropDown();
    $('#txtContactNumber').formatter({
        'pattern': '({{999}}) {{999}}-{{9999}}',
        'persistent': true
    });
    $("#btnCreateNewUser").click(function () {
        // fillRoleDropDown();
        $("#divView").hide();
        $("#divAdd").show();
        $("#divUpdate").hide();
    });
    var elem = document.querySelector("#chkstatusUpdate");
    //var elemNew = document.querySelector("#chkStatus");

    var k = window.Switchery(elem, { checked: false });
    //var tt = window.Switchery(elemNew, { checked: true }); // chkShowFlowWithBusinessFun
    //var specials = document.querySelector('#chkStatus');
    //$(specials).attr("checked", true);

    elem.click();

    $("#btnSaveUser").click(function () {
        var error = document.getElementById("tdError");
        if ($("#txtFirstName").val() === "") {
            error.innerHTML = "Please enter First name";
            $("#txtFirstName").focus();
            $("#txtFirstName").css("border-color", "red");
            $("#txtFirstName").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtLastName").val() === "") {
            error.innerHTML = "Please enter Last name";
            $("#txtLastName").focus();
            $("#txtLastName").css("border-color", "red");
            $("#txtLastName").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtUserName").val() === "") {
            error.innerHTML = "Please enter User name";
            $("#txtUserName").focus();
            $("#txtUserName").css("border-color", "red");
            $("#txtUserName").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtPassword").val() === "") {
            error.innerHTML = "Please enter Password";
            $("#txtPassword").focus();
            $("#txtPassword").css("border-color", "red");
            $("#txtPassword").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtPassword").val() !== $("#txtConfirmPassword").val()) {
            error.innerHTML = "Passwords do not match";
            $("#txtConfirmPassword").focus();
            $("#txtConfirmPassword").css("border-color", "red");
            $("#txtConfirmPassword").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtConfirmPassword").val() !== "" && $("#txtPassword").val() === $("#txtConfirmPassword").val()) {
            if (!checkPassword($("#txtPassword").val())) {
                error.innerHTML = "Password must be at least 6 characters long, contains 1 upper case 1 lower case and 1 special character";
                $("#txtPassword").focus();
                $("#txtPassword").css("border-color", "red");
                $("#txtPassword").on("keypress", function () {
                    $(this).css("border-color", "");
                });
                return false;
            }
        }
        if ($("#txtContactNumber").val() === "(   )    -    ") {
            error.innerHTML = "Please enter Contact number";
            $("#txtContactNumber").focus();
            $("#txtContactNumber").css("border-color", "red");
            $("#txtContactNumber").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtEmailId").val() === "") {
            error.innerHTML = "Please enter Email Id";
            $("#txtEmailId").focus();
            $("#txtEmailId").css("border-color", "red");
            $("#txtEmailId").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtEmailId").val() !== "") {
            var email = document.getElementById('txtEmailId');
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email.value)) {
                document.getElementById("tdError").innerHTML = "Please provide a valid email address";
                $("#txtEmailId").focus();
                $("#txtEmailId").css("border-color", "red");
                $("#txtEmailId").on("keypress", function () {
                    $(this).css("border-color", "");
                    document.getElementById("tdError").innerHTML = "";
                });
                return false;
            }
        }
        saveUserDetails();
        return false;
    });
    $("#btnEditUserDetails").click(function () {
        editUserDetails();
        return false;
    });
});

function saveUserDetails() {
    var error = document.getElementById("tdError");
    var enable = 'Active';
    var userMaster = [];
    userMaster.push({
        UserName: $("#txtUserName").val(),
        PassWord: $("#txtPassword").val(),
        CreatedDate: parseDateTime(),
        UserDetails:
            {
                FirstName: $("#txtFirstName").val(),
                LastName: $("#txtLastName").val(),
                ContactNumber: $("#txtContactNumber").val(),
                EmailId: $("#txtEmailId").val(),
                Address: $("#txtAddress").val(),
                Status: enable,
                RoleId: $("#ddlRole").val(),
                CreatedDate: parseDateTime(),
                ProjectIds: document.getElementById("hdnProjectIds").value,
                OrgnizationId: 1
            }
       
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "UserMaster/AddNewItem",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(userMaster[0]),
        success: function (result) {
            if (result === "User name already exist") {
                error.innerHTML = "User name already exist";
                error.style.color = "red";
                return false;
            }
            if (result !== null) {
                error.innerHTML = "User details added successfully.";
                error.style.color = "green";
                clearSaveData();
                fillUserDetailsGrid();
                return true;
            }
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                error.innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                error.innerHTML = response.statusText;
            },
            500: function (response) {
                error.innerHTML = response.statusText;
            }
        },
        error: function () {
            error.innerHTML = "Error while connecting to API";
        }
    });
}

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(str);
}

function clearSaveData() {
    $("#txtFirstName").val("");
    $("#txtPassword").val("");
    $("#txtFirstName").val("");
    $("#txtLastName").val("");
    $("#txtContactNumber").val("");
    $("#txtEmailId").val("");
    $("#txtUserName").val("");
    $("#txtConfirmPassword").val("");
}

function fillUserDetailsGrid() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/GetAllUserMasters",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }
            var dataDetails = data;
            var userDetailsNew = [];
            for (var i = 0; i < dataDetails.length; i++) {
                userDetailsNew.push({
                    "UserName": data[i].UserName,
                    "Status": data[i].UserDetails.Status,
                    "FirstName": data[i].UserDetails.FirstName,
                    "LastName": data[i].UserDetails.LastName,
                    // "Role": data[i].UserDetails.RoleMaster.RoleType,
                    "UserId": data[i].UserId,
                    "UserDetailsId": data[i].UserDetails.UserDetailsId
                });
            }
            if (data.length > 0) {
                $("#userDetails").ejGrid(
                    {
                        dataSource: userDetailsNew,
                        allowSorting: true,
                        allowPaging: true,
                        allowReordering: true,
                        allowResizeToFit: true,
                        allowScrolling: true,
                        scrollSettings: { width: width },
                        allowSearching: true,
                        allowResizing: true,
                        toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                        columns: [
                            { headerText: 'UserId', visible: false, field: 'UserId' },
                            { headerText: 'UserDetailsId', visible: false, field: 'UserDetailsId' },
                            { headerText: 'Username', field: 'UserName' },
                            { headerText: 'First Name', field: 'FirstName' },
                            { headerText: 'Last Name', field: 'LastName' },
                            { headerText: 'Status', field: 'Status' }
                        ],
                        rowSelected: function (args) {
                            var userId = args.data.UserId;
                            var userDetailsId = args.data.UserDetailsId;
                            document.getElementById("hdnCurrentUserId").value = userId;
                            document.getElementById("hdnUserDetailsId").value = userDetailsId;
                            viewUserDetails(userId);
                        }
                    });
            }
        }
    });
}

function viewUserDetails(userId) {
    $("#divView").show();
    $("#divAdd").hide();
    $("#divUpdate").hide();
    document.getElementById("tdError2").innerHTML = "";
    $.ajaxSetup({ cache: false });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/GetItems?tKey=" + userId + "&opt",
        contentType: "application/json; charset=utf-8",
        success: function (userData) {
            if (userData !== "undefined") {
                var userDetails = userData.UserDetails;
                $("#firstName")[0].innerHTML = userDetails.FirstName;
                $("#lastName")[0].innerHTML = userDetails.LastName;
                $("#currentUserName")[0].innerHTML = userData.UserName;
                $("#forgotUserName").val(userData.UserName);
                $("#contactNumber")[0].innerHTML = userDetails.ContactNumber;
                $("#userEmail").html('');
                $("#txtEmail").val(userDetails.EmailId);
                $("#userEmail").append($("<a />").append(userDetails.EmailId).prop("href", "mailto:" + userDetails.EmailId));
                $("#userAddress")[0].innerHTML = userDetails.Address;
                $("#userRole").html(userDetails.RoleMaster.RoleType);
                $("#status")[0].innerHTML = userDetails.Status;
                $("#userRole")[0].innerHTML = userDetails.RoleMaster.RoleType;
                var names = userDetails.ProjectIds;
                var joinedstr = names.split(',');
                var nameList = "";
                for (var i = 0; i < joinedstr.length; i++) {
                    nameList += "<li>" + joinedstr[i] + "</li>";
                }
                $("#projects")[0].innerHTML = nameList;
            }
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {

            },
            404: function (response) {
            }
        },
        error: function (data) {
            document.getElementById("tdError").innerHTML = "Error while connecting to API";

        }
    });
}

function editUserDetails() {
    var currentUserId = document.getElementById("hdnCurrentUserId").value;
    $("#tdError12").html("");
    if (currentUserId !== "") {
        fillRoleDropDown();
        $("#divView").hide();
        $("#divAdd").hide();
        $("#divUpdate").show();
        $.get(baseAddress + "UserMaster/GetItems?tKey=" + currentUserId+ "&opt" , function (result) {
            if (result !== null) {
                //$("#ddlRoles12 option").remove();
                //document.getElementById("#ddlRoles12").innerHTML = "";
                var userDetails = result.UserDetails;
                document.getElementById("hdnUserDetailsId").value = userDetails.UserDetailsId;
                $("#txtFirstName12").val(userDetails.FirstName);
                $("#txtLastName12").val(userDetails.LastName);
                $("#txtUserName12").val(result.UserName);
                $("#txtContactNumber12").val(userDetails.ContactNumber);
                $("#txtEmailId12").val(userDetails.EmailId);
                $("#txtAddress12").val(userDetails.Address);
                $("#ddlcompanyname12").val(userDetails.SiteCustomerId);
                $("#ddlRoles12").val(userDetails.RoleId);
                var status = userDetails.Status;
                if (status === "Active") {
                    var specials = document.querySelector('#chkstatusUpdate');
                    $(specials).attr("checked", true);
                    specials.checked = true;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event121 = document.createEvent('HTMLEvents');
                        event121.initEvent('change', true, true);
                        specials.dispatchEvent(event121);
                    } else {
                        specials.fireEvent('onchange');
                    }
                } else if (status === "InActive") {
                    var specials1 = document.querySelector('#chkstatusUpdate');
                    $(specials1).attr("checked", false);
                    specials1.checked = false;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event1211 = document.createEvent('HTMLEvents');
                        event1211.initEvent('change', false, false);
                        specials1.dispatchEvent(event1211);
                    } else {
                        specials1.fireEvent('onchange');
                    }
                }
                fillProjectDropDownUpdate();
            }
            return false;
        });
    }
    return false;
}

$("#btnUpdateUserDetails").click(function () {
    var error = document.getElementById("tdError12");
    if ($("#txtFirstName12").val() === "") {
        error.innerHTML = "Please enter First name";
        $("#txtFirstName12").focus();
        $("#txtFirstName12").css("border-color", "red");
        $("#txtFirstName12").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#txtLastName12").val() === "") {
        error.innerHTML = "Please enter Last name";
        $("#txtLastName12").focus();
        $("#txtLastName12").css("border-color", "red");
        $("#txtLastName12").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#txtUserName12").val() === "") {
        error.innerHTML = "Please enter User name";
        $("#txtUserName12").focus();
        $("#txtUserName12").css("border-color", "red");
        $("#txtUserName12").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#txtContactNumber12").val() === "(   )    -    ") {
        error.innerHTML = "Please enter Contact number";
        $("#txtContactNumber12").focus();
        $("#txtContactNumber12").css("border-color", "red");
        $("#txtContactNumber12").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#txtEmailId12").val() === "") {
        error.innerHTML = "Please enter Email Id";
        $("#txtEmailId12").focus();
        $("#txtEmailId12").css("border-color", "red");
        $("#txtEmailId12").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#txtEmailId12").val() !== "") {
        var email = document.getElementById('txtEmailId12');
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email.value)) {
            error.innerHTML = "Please provide a valid email address";
            $("#txtEmailId12").focus();
            $("#txtEmailId12").css("border-color", "red");
            $("#txtEmailId12").on("keypress", function () {
                $(this).css("border-color", "");
                error.innerHTML = "";
            });
            return false;
        }
    }
    updateUserDetails();
    return false;
});

function updateUserDetails() {
    var error = document.getElementById("tdError12");
    var currentUserId = document.getElementById("hdnCurrentUserId").value;
    var enable = "";
    if (document.getElementById('chkstatusUpdate').checked) {
        enable = 'Active';
    } else {
        enable = 'InActive';
    }
    var UserDetails = [];
    UserDetails.push({
        FirstName: $("#txtFirstName12").val(),
        LastName: $("#txtLastName12").val(),
        ContactNumber: $("#txtContactNumber12").val(),
        EmailId: $("#txtEmailId12").val(),
        Address: $("#txtAddress12").val(),
        RoleId: $("#ddlRoles12").val(),
        Status: enable,
        UserId: currentUserId,
        UserDetailsId: parseInt(document.getElementById("hdnUserDetailsId").value),
        ProjectIds: document.getElementById("hdnprojectupdate").value,
        OrgnizationId: 1
    });
    jQuery.ajax({
        type: "PUT",
        url: baseAddress + "UserMaster/UpdateItem?option=option",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(UserDetails[0]),
        success: function (result) {
            if (result !== null) {
                error.innerHTML = "User details updated successfully.";
                error.style.color = "green";
                ClearDataUpdate();
                fillUserDetailsGrid();
                return true;
            }
            return false;
        },
        error: function () {
            return false;
        }
    });
}

function fillRoleDropDown() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "RoleMaster/GetAllItems",
        // url: baseAddress + "General/GetEntity?entity=RoleMaster",
        success: function (result) {
            $("#ddlRoles12 option").remove();
            $("#ddlRole option").remove();
            if (result != null) {
                $.each(result, function (key, value) {
                    $("#ddlRole").append("<option value=" + value.RoleId + ">" + value.RoleType + "</option>");
                    $("#ddlRoles12").append("<option value=" + value.RoleId + ">" + value.RoleType + "</option>");
                });
            }
        }
    });
}

function ClearDataUpdate() {
    $("#txtFirstName12").val("");
    $("#txtLastName12").val("");
    $("#txtContactNumber12").val("");
    $("#txtEmailId12").val("");
    //$("#txtAddress12").val("");
    $("#ddlRoles12").val("");
    $("#txtUserName12").val("");
}

function parseDateTime() {
    var today = new Date();
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

function fillProjectDropDownUpdateOld() {
    // var projectId = $("#projects")[0].innerHTML;
    var ids = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetEntity?entity=ProjectMaster",
        success: function (result) {
            $.each(result, function (key, value) {
                $("#ddlProjectNameUpdate").append("<option value=" + value.Value + ">" + value.Name + "</option>");
            });
            $("#ddlProjectNameUpdate").ejDropDownList({
                showCheckbox: true,
                width: 415,
                checkChange: function (args) {
                    var id = args.selectedValue;
                    if (args.isChecked === true) {
                        ids += id + ',';
                    } else if (args.isChecked === false) {
                        var n = ids.includes(id);
                        if (n === true) {
                            ids = ids.replace(id + ',', '');
                        }
                    }
                    document.getElementById("hdnprojectupdate").value = ids;
                }
            });
        }
    });
}

function fillProjectDropDownUpdate() {
    var ids = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetAllItems",
        //url: baseAddress + "General/GetNameValue?entity=ProjectMasterSelectAll&id=0&pids=0&opt",
        success: function (result) {
            if (result != null) {
                $.each(result, function (key, value) {
                    if (value.Value === 0) return;
                    $("#ddlProjectNameUpdate").append("<option value=" + value.ProjectId + ">" + value.ProjectName + "</option>");
                });
                $('#ddlProjectNameUpdate').ejDropDownList({
                    showCheckbox: true,
                    width: 320,
                    checkChange: function (args) {
                        var DropDownListObj = $('#ddlProjectNameUpdate').ejDropDownList({}).data("ejDropDownList");
                        var id = args.selectedValue;
                        var selectedValue = args.selectedText;
                        if (selectedValue === "Select All") {
                            if (args.isChecked === true) {
                                args.selectedText = "UnSelect All";
                                args.text = "UnSelect All";
                                dataPrepend();
                                DropDownListObj.checkAll();
                                var aaa = DropDownListObj._selectedValue;
                                if (aaa === "0") {
                                    ids += id + ',';
                                }
                            } else if (args.isChecked === false) {
                                args.selectedText = "Select All";
                                DropDownListObj.uncheckAll();
                            }
                        } else {
                            if (args.isChecked === true) {
                                ids += id + ',';
                            } else if (args.isChecked === false) {
                                var n = ids.includes(id);
                                if (n === true) {
                                    ids = ids.replace(id + ',', '');
                                }
                            }
                        }
                        var aaaaaa = DropDownListObj.getSelectedValue();
                        document.getElementById("hdnprojectupdate").value = aaaaaa;
                    }
                });
            }

            function dataPrepend() {
                var prepend = $('#ddlProjectNameUpdate').data("ejDropDownList");
                if (prepend.model.dataSource != null) {
                    prepend.model.dataSource.splice(0, 0, { text: "Select All", value: "0" });
                    var b = prepend.model.dataSource;
                    prepend.model.dataSource = null;
                    prepend.option("dataSource", b);
                }
            }
        }
    });
    document.getElementById("ddlProjectName").style.fontFamily = "Verdana";
}

function fillProjectDropDown() {
    var ids = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetAllItems",
        // url: baseAddress + "General/GetNameValue?entity=ProjectMasterSelectAll&id=0&pids=0&opt",
        success: function (result) {
            if (result != null) {
                $.each(result, function (key, value) {
                    if (value.Value === 0) return;
                    $("#ddlProjectName").append("<option value=" + value.ProjectId + ">" + value.ProjectName + "</option>");
                });
                $('#ddlProjectName').ejDropDownList({
                    showCheckbox: true,
                    width: 320,
                    checkChange: function (args) {
                        var DropDownListObj = $('#ddlProjectName').ejDropDownList({}).data("ejDropDownList");
                        var id = args.selectedValue;
                        var selectedValue = args.selectedText;
                        if (selectedValue === "Select All") {
                            if (args.isChecked === true) {
                                args.selectedText = "UnSelect All";
                                args.text = "UnSelect All";
                                dataPrepend();
                                DropDownListObj.checkAll();

                                var aaa = DropDownListObj._selectedValue;
                                if (aaa === "0") {
                                    ids += id + ',';
                                }

                            } else if (args.isChecked === false) {
                                args.selectedText = "Select All";
                                DropDownListObj.uncheckAll();
                            }
                        } else {
                            if (args.isChecked === true) {
                                ids += id + ',';
                            } else if (args.isChecked === false) {
                                var n = ids.includes(id);
                                if (n === true) {
                                    ids = ids.replace(id + ',', '');
                                }
                            }
                        }
                        var aaaaaa = DropDownListObj.getSelectedValue();
                        document.getElementById("hdnProjectIds").value = aaaaaa;
                    }
                });
            }
            function dataPrepend() {
                var prepend = $('#ddlProjectName').data("ejDropDownList");
                if (prepend.model.dataSource != null) {
                    prepend.model.dataSource.splice(0, 0, { text: "Select All", value: "0" });
                    var b = prepend.model.dataSource;
                    prepend.model.dataSource = null;
                    prepend.option("dataSource", b);
                }
            }
        }
    });

    document.getElementById("ddlProjectName").style.fontFamily = "Verdana";
}

function fillProjectDropDownOld() {
    var ids = "";
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetAllItems",
        // url: baseAddress + "General/GetEntity?entity=ProjectMaster",
        success: function (result) {
            $.each(result, function (key, value) {
                if (value.Value === 0) return;
                $("#ddlProjectName").append("<option value=" + value.ProjectId + ">" + value.ProjectName + "</option>");
            });
            $("#ddlProjectName").ejDropDownList({
                showCheckbox: true,
                selectedIndex: 0,
                width: 415,
                "font-size": 10,
                "font-family": "Times New Roman",
                checkChange: function (args) {
                    var id = args.selectedValue;
                    if (args.isChecked === true) {
                        ids += id + ',';
                    } else if (args.isChecked === false) {
                        var n = ids.includes(id);
                        if (n === true) {
                            ids = ids.replace(id + ',', '');
                        }
                    }
                    document.getElementById("hdnProjectIds").value = ids;
                }
            });
        }
    });
}

$(document).ready(function () {
    $("#btnResetPassword").click(function () {
        $("#tdMsg").html("");
        var userName = $("#forgotUserName").val();
        var email = $("#txtEmail").val();
        var newPass = $("#txtNewPassowrd").val();
        var confirmPass = $("#txtConfirmPassoword").val();
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {
            $("#tdMsg").html("Please provide a valid email address");
            $("#tdMsg").attr("style", "color: red");
            $("#txtEmail").focus();
            $("#txtEmail").css("border-color", "red");
            $("#txtEmail").on("keypress", function () {
                $(this).css("border-color", "");
                document.getElementById("tdError").innerHTML = "";
            });
            return false;
        }
        if (!checkPassword(newPass)) {
            $("#tdMsg").html("Password must be at least 6 characters long, contains 1 upper case 1 lower case and 1 special character");
            $("#tdMsg").attr("style", "color: red");
            $("#txtNewPassowrd").focus();
            $("#txtNewPassowrd").css("border-color", "red");
            $("#txtNewPassowrd").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if (newPass !== confirmPass) {
            $("#tdMsg").attr("style", "color: red;");
            $("#tdMsg").html("Password and Confirm Password do not match.");
            return false;
        } else {
            forgotPassword.checkDetails(userName, email, newPass);
        }
        return true;
    });
});

function showForgotPassword() {
    var userName = $("#forgotUserName").val();
    var email = $("#txtEmail").val();
    if (userName === "" || email === "") {
        bootbox.alert({
            message: "Please select user from list!",
            size: "medium"
        });
    } else {
        $("#forgotPasswordDialog").modal("show");
    }
}

var forgotPassword = function () { };
forgotPassword.checkDetails = function (userName, email, newPass) {
    var postData = {
        UserName: userName,
        Email: email,
        NewPassword: newPass
    };
    $.ajax({
        url: baseAddress + "UserMaster/ForgotPassword",
        type: "POST",
        data: postData,
        success: function () {
            $("#tdMsg").html("");
            $("#tdMsg").attr("style", "color: green;");
            $("#tdMsg").html("Password reset successfully.");
        },
        error: function (e) {
            // $("#trForgotPass").hide();
            $("#tdMsg").attr("style", "color: red;");
            $("#tdMsg").html(e.responseJSON.Message);
        }
    });
};
