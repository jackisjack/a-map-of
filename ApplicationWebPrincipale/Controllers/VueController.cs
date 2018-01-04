using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Web;
using System.Security.Claims;

namespace SIMANAGER.Controllers
{

    // Les objets ci-dessous forment une sur-couchage de sécurité
    // entre la couche javascript (très souple) et la couche
    // linq dont les types sont rigides (car lié à SQL Server)

    public class Vue_POST
    {
        public VueCore_POST mVueCore_POST { get; set; }
        public Element_POST[] mElement_POST { get; set; }
    }

    public class VueCore_POST
    {
        public int IDVUE { get; set; }
        public string LIBELLE { get; set; }
        public int MAINCONTAINERY { get; set; }
        public int MAINCONTAINERX { get; set; }
    }

    public class Element_POST
    {
        public int IDELEMENTVUE { get; set; }
        public int IDELEMENTVUEPARENT { get; set; }
        public int IDOBJET { get; set; }
        public int IDTYPEOBJETVUE { get; set; }
        public string LIBELLE { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int X_DELTA { get; set; }
        public int Y_DELTA { get; set; }
        public int FORME { get; set; }
    }

    [MyAuthorizeAttribute]
    public class VueController : ApiController
    {

        private int getCurrentIdUser()
        {
            ClaimsIdentity claimsIdentity = RequestContext.Principal.Identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.Name);

            int IdUtilisateur = 0;
            if (claim == null)
            {
                IdUtilisateur = 3; // si aucune identification (mode test)
            }
            else
            {
                IdUtilisateur = Int32.Parse(claim.Value);
            }
            return IdUtilisateur;
        }

        // POST

        //[Route("api/Vue/POST")]
        //[HttpPost]
        //public int PostTEST([FromBody]Vue_POST obj_from_javascript)
        //{

        //    return 0;
        //}

        [Route("api/Vue/POST")]
        [HttpPost]
        public int Post([FromBody]Vue_POST obj_from_javascript)
        {

            int IDVUE; // IDVUE autogénéré suite à l'ajout

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Récupération de l'id de l'utilisateur en cours

                int IdUtilisateur = getCurrentIdUser();

                // La vue créée ou modifiée

                VUE mVue;

                // Si la vue était inexistante

                if (obj_from_javascript.mVueCore_POST.IDVUE == -1)
                {
                    
                    // initialisation d'une nouvelle vue

                    mVue = new VUE();

                    mVue.USER_CREE = getCurrentIdUser();
                    mVue.DATE_CREE = DateTime.Now;

                }
                else
                { 

                    // Récupération de la vue existante

                    IEnumerable<VUE> SelectQuery;
                    
                    // Renvoi l'éventuelle idvue existant (sauf triche js)

                    SelectQuery = from r in context.VUEs
                                  where
                                      r.USER_CREE == IdUtilisateur &&
                                      r.IDVUE == obj_from_javascript.mVueCore_POST.IDVUE
                                  select r;

                    mVue = (VUE)Generic.Call_Read_FirstOrDefault<VUE>(SelectQuery);

                }

                // Création ou mise à jour de la vue.

                mVue.LIBELLE = obj_from_javascript.mVueCore_POST.LIBELLE;
                mVue.MAINCONTAINERX = obj_from_javascript.mVueCore_POST.MAINCONTAINERX;
                mVue.MAINCONTAINERY = obj_from_javascript.mVueCore_POST.MAINCONTAINERY;

                // Suppression préalable de tous les éléments

                context.ELEMENTs.RemoveRange(mVue.ELEMENTs);

                // Création des éléments

                for (var i = 0; i < obj_from_javascript.mElement_POST.Length;i++)
                {

                    ELEMENT mELEMENT = new ELEMENT();
                    mELEMENT.IDELEMENTVUE = obj_from_javascript.mElement_POST[i].IDELEMENTVUE;
                    mELEMENT.IDELEMENTVUEPARENT = obj_from_javascript.mElement_POST[i].IDELEMENTVUEPARENT;
                    mELEMENT.IDOBJET = obj_from_javascript.mElement_POST[i].IDOBJET;
                    mELEMENT.IDTYPEOBJETVUE = obj_from_javascript.mElement_POST[i].IDTYPEOBJETVUE;
                    mELEMENT.LIBELLE = obj_from_javascript.mElement_POST[i].LIBELLE;
                    mELEMENT.X = obj_from_javascript.mElement_POST[i].X;
                    mELEMENT.Y = obj_from_javascript.mElement_POST[i].Y;
                    mELEMENT.X_DELTA = obj_from_javascript.mElement_POST[i].Y_DELTA;
                    mELEMENT.FORME = obj_from_javascript.mElement_POST[i].FORME;

                    mVue.ELEMENTs.Add(mELEMENT);
                    
                }

                context.VUEs.Add(mVue);

                try
                {
                    Generic.SaveChanges(context);

                }
                catch (HttpResponseException ex)
                {
                    string LibelleErreur = ex.Response.ReasonPhrase.Replace(System.Environment.NewLine, "");
                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    { ReasonPhrase = LibelleErreur };
                    throw new HttpResponseException(resp);
                };

                // récupération de l'IDVUE autogénéré

                IDVUE = mVue.IDVUE;
            }

            return IDVUE;

        }

        // GET

        [Route("api/Vue/Full/GET/{IDVUE}")]
        [HttpGet]
        public object GET_Full(int IDVUE)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Informations générales de la vue

                IEnumerable<object> SelectQuery;

                SelectQuery = from r in context.VUEs
                              where r.IDVUE == IDVUE
                              select new {
                                  r.IDVUE,
                                  r.LIBELLE,
                                  r.MAINCONTAINERX,
                                  r.MAINCONTAINERY
                                  };

                var Vue = Generic.Call_Read_FirstOrDefault<Object>(SelectQuery);

                // Elements de la vue

                IEnumerable<object> SelectQuery2;

                SelectQuery2 = from r in context.ELEMENTs
                               where r.IDVUE == IDVUE
                               select new {
                                   r.IDVUE,
                                   r.IDELEMENTVUE,
                                   r.IDELEMENTVUEPARENT,
                                   r.IDTYPEOBJETVUE,
                                   r.IDOBJET,
                                   r.LIBELLE,
                                   r.FORME,
                                   r.X,
                                   r.Y,
                                   r.X_DELTA,
                                   r.Y_DELTA
                                 };

                var ListeElement = Generic.Call_Read_ToList<Object>(SelectQuery2);

                return new {
                    Vue = Vue,
                    ListeElement = ListeElement
                };


            }

        }

        // Double usage :
        // - Récupération de la liste de toutes les vues de l'utilisateurs
        // - Vérification de l'existence d'une vue pour un utilisateur donné 
        // (si un argument NOMVUE est passé)

        [Route("api/Vue/GET")]
        [HttpGet]
        public object GET([FromUri] string NOMVUE = "")
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Récupération de l'id de l'utilisateur en cours

                int IdUtilisateur = getCurrentIdUser();

                // Si aucun argument n'a été passé :

                if (NOMVUE == "")
                {

                    IEnumerable<object> SelectQuery;

                    // Toutes les vues de l'utilisateurs

                    SelectQuery = from r in context.VUEs
                                  where r.USER_CREE == IdUtilisateur
                                  select new { r.IDVUE, r.LIBELLE };

                    return Generic.Call_Read_ToList<Object>(SelectQuery);

                } else
                {

                    IEnumerable<int> SelectQuery;

                    // Renvoi l'éventuelle idvue existant
                    SelectQuery = from r in context.VUEs
                                  where 
                                      r.USER_CREE == IdUtilisateur &&
                                      r.LIBELLE == NOMVUE     
                                  select r.IDVUE;

                    var resultat = Generic.Call_Read_FirstOrDefault<int>(SelectQuery);

                    return new { resultat };

                }

            }

        }

        // DELETE

        [Route("api/Vue/DELETE/{IDVUE}")]
        [HttpDelete]
        public IHttpActionResult Delete(int IDVUE)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Informations générales de la vue

                IEnumerable<VUE> SelectQuery;

                SelectQuery = from r in context.VUEs
                              where r.IDVUE == IDVUE
                              select r;

                VUE mVue = (VUE)Generic.Call_Read_FirstOrDefault<VUE>(SelectQuery);


                // Suppression de ses éléments

                context.ELEMENTs.RemoveRange(mVue.ELEMENTs);

                // Suppression de la vue

                context.VUEs.Remove(mVue);

                try
                {
                    Generic.SaveChanges(context);

                }
                catch (HttpResponseException ex)
                {
                    string LibelleErreur = ex.Response.ReasonPhrase.Replace(System.Environment.NewLine, "");
                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    { ReasonPhrase = LibelleErreur };
                    throw new HttpResponseException(resp);
                };

            }

            return Ok();

        }
    }

}