using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace SIMANAGER
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuration et services API Web
            
            config.Filters.Add(new MyAuthorizeAttributeWebAPI());

            config.MapHttpAttributeRoutes();
            
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        public class MyAuthorizeAttributeWebAPI : AuthorizeAttribute
        {
            protected override bool IsAuthorized(HttpActionContext context)
            {
                if (context.RequestContext.IsLocal)
                {
                    return true;
                }
                return base.IsAuthorized(context);
            }
        }

    }
}
