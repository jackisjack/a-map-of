using Microsoft.AspNet.Identity;
using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using System;
using System.Linq;
using System.Data.Entity.Infrastructure;
using System.Net.Http;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace SIMANAGER.Controllers
{
    public class AuthentificationController : Controller
    {

        public readonly static Dictionary<string, Utilisateur> TempUsers = new Dictionary<string, Utilisateur>();

        [AllowAnonymous]
        public ActionResult Login()
        {
            // Pour rendre impossible les pseudos multiples sur un même navigateur.
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            return View(new Utilisateur() { Nom = "" });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Utilisateur model, string returnUrl)
        {

            ViewBag.ReturnUrl = returnUrl;

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            int IdUtilisateur = 0;

            // Vérification de l'existence du mot de passe et du nom d'utilisateur

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {
                try
                {

                    // Recherche du pseudo et du mot de passe

                    var c = (from r in context.USERs
                             where (r.NOM == model.Nom)
                             select r.MOTDEPASSE).SingleOrDefault();

                    if (c == null) // Le nom d'utilisateur n'existe pas
                    {
                        // éjection

                        ModelState.AddModelError(string.Empty, "Authentification incorrecte");
                        return View(model);

                    } else // Si l'utilisateur existe
                    {
                        // calcul du hash de la saisie

                        string hash_code_mdp_soumis = GetHash(model.MotDePasse); 

                        // vérification que le hash correspond à ce qui existe en base

                        if (hash_code_mdp_soumis != c)
                        {
                            // éjection

                            ModelState.AddModelError(string.Empty, "Authentification incorrecte");
                            return View(model);
                        }

                    }

                    // Succès de l'authentification.

                    // Récupération de l'id de l'utilisateur
                    IdUtilisateur = (from r in context.USERs
                             where (r.NOM == model.Nom)
                             select r.IDUSER).SingleOrDefault();

                }
                catch (DbUpdateException ex)
                {

                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    {
                        ReasonPhrase = ex.InnerException.InnerException.Message.Replace(System.Environment.NewLine, "")
                    };

                    ModelState.AddModelError(string.Empty, "Connexion impossible");
                    return View(model);

                }

            }

            // L'authentification est réussie, 
            // injecter les informations utilisateur dans le cookie d'authentification :
            var userClaims = new List<Claim>();
            // Identifiant utilisateur :
            userClaims.Add(new Claim(ClaimTypes.NameIdentifier, model.Nom));
            // Id d'utilisateur
            userClaims.Add(new Claim(ClaimTypes.Name, IdUtilisateur.ToString()));

            // Rôles utilisateur :
            userClaims.AddRange(LoadRoles(model.Nom));
            var claimsIdentity = new ClaimsIdentity(userClaims, DefaultAuthenticationTypes.ApplicationCookie);
            var ctx = Request.GetOwinContext();
            var authenticationManager = ctx.Authentication;
            authenticationManager.SignIn(claimsIdentity);

            // Rediriger vers l'url d'origine :
            if (Url.IsLocalUrl(ViewBag.ReturnUrl))
                return Redirect(ViewBag.ReturnUrl);

            // Par défaut, rediriger vers la page d'accueil :
            return RedirectToAction("Index", "Home");

        }

        private IEnumerable<Claim> LoadRoles(string login)
        {
            // TODO : Charger ici les rôles de l'utilisateur...

            // Pour ce tutoriel, je considère que l'utilisateur a les rôles "Contributeur" et "Modérateur" :
            yield return new Claim(ClaimTypes.Role, "Contributeur");
            yield return new Claim(ClaimTypes.Role, "Modérateur");
        }

        [HttpGet]
        public ActionResult Logout()
        {

            var ctx = Request.GetOwinContext();
            var authenticationManager = ctx.Authentication;
            authenticationManager.SignOut();

            // Rediriger vers la page d'accueil :
            return RedirectToAction("Index", "Home");

        }

        public static string GetHash(string inputString)
        {
            HashAlgorithm algorithm = SHA1.Create();

            return string.Join("",algorithm.ComputeHash(
                Encoding.Unicode.GetBytes(inputString)
                ).Select(s => s.ToString("x2")));
        }

    }
}