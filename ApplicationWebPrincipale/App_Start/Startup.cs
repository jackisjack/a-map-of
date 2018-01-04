using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;

[assembly: OwinStartup(typeof(SIMANAGER.Startup))]
namespace SIMANAGER
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {

            // Définition de la page par défaut si non-authentification
            
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Authentification/Login")
            });

        }

    }


}