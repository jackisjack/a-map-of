using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Optimization;

namespace SIMANAGER
{

    // BUNDLE = 1 fichier (trop de fichiers pose des problèmes car limite de 6 max par onglet) + minification (petite taille)

    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {


            var bundle = new ScriptBundle("~/bundles/scriptsE")

                                                             // Bibliothèques JS : EASEJS, TWEENJ, JQUERY, HANDLEBARS, BOOSTRAP, W3DATA

                                                             .Include("~/Scripts/externes/jquery-3.2.0.min.js")
                                                             .Include("~/Scripts/externes/bootstrap.min.js")
                                                             .Include("~/Scripts/externes/jquery-ui.min.js")
                                                             .Include("~/Scripts/externes/tweenjs-0.6.2.min.js")
                                                             .Include("~/Scripts/externes/easeljs-0.8.2.min.js")
                                                             .Include("~/Scripts/externes/handlebars-v4.0.5.js")
                                                             .Include("~/Scripts/externes/handlebars_Conditions.js")
                                                             .Include("~/Scripts/externes/w3data.js")
                                                             ;

            bundle.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(bundle);

            var bundle2 = new ScriptBundle("~/bundles/scriptsA")

                                                             // Scripts applicatifs

                                                             .Include("~/Scripts/applicatifs/technique/class_helper.js")
                                                             .Include("~/Scripts/applicatifs/technique/appels_api.js")
                                                             .Include("~/Scripts/applicatifs/technique/easefunctions.js")
                                                             .Include("~/Scripts/applicatifs/technique/random.js")
                                                             .Include("~/Scripts/applicatifs/technique/generateur_html.js")
                                                             .Include("~/Scripts/applicatifs/technique/geometrie.js")
                                                             .Include("~/Scripts/applicatifs/technique/loadimages.js")

                                                             .Include("~/Scripts/applicatifs/tutos.js")
                                                             .Include("~/Scripts/applicatifs/form.js")
                                                             .Include("~/Scripts/applicatifs/zzz_tests.js")
                                                             .Include("~/Scripts/applicatifs/graphismes.js")
                                                             .Include("~/Scripts/applicatifs/loading.js")
                                                             .Include("~/Scripts/applicatifs/_main.js")
                                                             ;

            bundle2.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(bundle2);

            var bundle3 = new StyleBundle("~/bundles/stylesE")

                                                             // Feuilles de styles

                                                             .Include("~/Content/bootstrap.min.css")
                                                             //.Include("~/Content/jquery-ui.theme.min.css") // pas bundle car ils contiennent des chemins relatifs, et ça fait bugger.
                                                             //.Include("~/Content/jquery-ui.structure.min.css")
                                                             //.Include("~/Content/jquery-ui.css")
                                                             ;


            bundle3.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(bundle3);

            var bundle4 = new StyleBundle("~/bundles/stylesA")

                                                 // Feuilles de styles
                                                 .Include("~/Content/menu.css")
                                                 .Include("~/Content/loading.css");


            bundle4.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(bundle4);

        }

        // Interface nécessaire pour que le bundle 

        class NonOrderingBundleOrderer : IBundleOrderer
        {

            IEnumerable<BundleFile> IBundleOrderer.OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
            {
                return files;

            }
        }
    }

}
