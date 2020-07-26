<%@ WebHandler Language="C#" Debug="true" Class="HelpDocument" %>
using System.IO;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Web;

public class HelpDocument : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string targetPath = HttpContext.Current.Server.MapPath("~/HelpDocuments/");

        if (!Directory.Exists(targetPath))
        {
            Directory.CreateDirectory(targetPath);
            var info = new DirectoryInfo(targetPath);
            var self = WindowsIdentity.GetCurrent();
            var ds = info.GetAccessControl();
            ds.AddAccessRule(new FileSystemAccessRule(self.Name, FileSystemRights.FullControl,
                InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit, PropagationFlags.None,
                AccessControlType.Allow));
            info.SetAccessControl(ds);
        }
        if (context.Request.UrlReferrer == null) return;

        string requestPath = context.Request.UrlReferrer.AbsolutePath;
        var uploadedFiles = context.Request.Files;
        if (uploadedFiles.Count > 0)
        {
            for (int i = 0; i < uploadedFiles.Count; i++)
            {
                if (uploadedFiles[i].FileName == "") continue;

                var file = context.Request.Files[i];
                string strFileName = file.FileName;
                var fileName = Path.Combine(targetPath, strFileName);
                file.SaveAs(fileName);
            }
            context.Response.Write(targetPath);
        }
        else
        {
            if (!requestPath.Contains("AdditionalSteps.html") && !requestPath.Contains("ObjectDocument.ashx")) return;
            context.Response.Write("<span id='successmsg'> Select file to upload</span>");
            context.Response.WriteFile("AdditionalSteps.html");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}