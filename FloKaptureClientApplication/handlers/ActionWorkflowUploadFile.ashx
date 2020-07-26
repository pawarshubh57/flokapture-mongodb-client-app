<%@ WebHandler Language="C#" Class="ActionWorkflowUploadFile" %>

using System.IO;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Web;

public class ActionWorkflowUploadFile : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string targetFolder = HttpContext.Current.Server.MapPath("ActionWorkflowFilesUpload");
        string actionWorkflowId = context.Request.QueryString["actionWorkflowId"];
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }
        if (context.Request.UrlReferrer == null) return;
        string requestPath = context.Request.UrlReferrer.AbsolutePath;
        HttpFileCollection uploadedFiles = context.Request.Files;
        if (uploadedFiles.Count > 0)
        {
            string fileNameWithPath = string.Empty;
            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                if (uploadedFiles[i].FileName == "") continue;
                try
                {
                    var file = context.Request.Files[i];
                    string strFileName = file.FileName;

                    string path = context.Server.MapPath("~/ActionWorkflowFilesUpload/") + actionWorkflowId;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                        var info = new DirectoryInfo(path);
                        var self = WindowsIdentity.GetCurrent();
                        var ds = info.GetAccessControl();
                        ds.AddAccessRule(new FileSystemAccessRule(self.Name, FileSystemRights.FullControl,
                            InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit,
                            PropagationFlags.None,
                            AccessControlType.Allow));
                        info.SetAccessControl(ds);
                    }
                    fileNameWithPath += "ActionWorkflowFilesUpload/" + actionWorkflowId + "/" + strFileName + ",";
                    var fileName = Path.Combine(path, strFileName);
                    file.SaveAs(fileName);
                }
                catch (System.Exception exception)
                {
                    context.Response.Write(exception.Message);
                }
            }
            context.Response.Write(fileNameWithPath);
        }
        else
        {
            if (requestPath.Contains("my_datasets.html") || requestPath.Contains("ActionWorkflowUploadFile.ashx"))
            {
                context.Response.Write("<span id='successmsg'> Select file to upload</span>");
                context.Response.WriteFile("my_datasets.html");
            }
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}