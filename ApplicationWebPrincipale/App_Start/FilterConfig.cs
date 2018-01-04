using System.Web;
using System.Web.Mvc;

namespace SIMANAGER
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new MyAuthorizeAttribute());

        }
    }

    public class MyAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            
            if (httpContext.Request.IsLocal)
            {
                // It was a local request => authorize the guy
                return true;
            }
            
            return base.AuthorizeCore(httpContext);
        }
    }

}

