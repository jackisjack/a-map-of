using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SIMANAGER.Controllers
{
    [MyAuthorizeAttribute]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "A map of";

            return View();
        }
    }
}
