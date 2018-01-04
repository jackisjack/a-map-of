using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Security.Claims;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;

namespace SIMANAGER.Controllers
{
    // POST : api/Tuto/POST/Done
    public class TutoDone_POST
    {
        public int idTutoDone { get; set; }
    }

    [MyAuthorizeAttribute]
    public class TutoController : ApiController
    {

        private int getCurrentIdUser()
        {
            ClaimsIdentity claimsIdentity = RequestContext.Principal.Identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.Name);

            int IdUtilisateur = 0;
            if (claim == null)
            {
                IdUtilisateur = 5; // si aucune identification (mode test)
            }
            else
            {
                IdUtilisateur = Int32.Parse(claim.Value);
            }
            return IdUtilisateur;
        }

        // GET

        // La liste de tous les tutos
        [Route("api/Tuto/GET")]
        [HttpGet]
        public object GET()
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Récupération de l'id de l'utilisateur en cours
                int IdUtilisateur = getCurrentIdUser();

                // Appel de la procédure stockée
                IEnumerable<object> SelectQuery;
                SelectQuery = context.LISTETUTOS(IdUtilisateur);

                return Generic.Call_Read_ToList<Object>(SelectQuery);
                
            }

        }

        // Les étapes d'un tuto donné
        [Route("api/Tuto/{IDTUTO}/GET/Step")]
        [HttpGet]
        public object STEPGET(int IDTUTO)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                IEnumerable<object> SelectQuery;

                // SELECT 

                SelectQuery = from r in context.TUTOSTEPs
                              where r.IDTUTO == IDTUTO
                              orderby r.ORDRE ascending
                              select new
                              {
                                  IDTUTOSTEP = r.IDTUTOSTEP,
                                  IDTUTO = r.IDTUTO,
                                  INDICATION = r.INDICATION,
                                  IDEVENTTOLISTEN = r.IDEVENTTOLISTEN,
                                  JSFONCTION = r.JSFONCTION
                              };
                
                return Generic.Call_Read_ToList<object>(SelectQuery);
                
            }

        }

        // Le score de l'utilisateur qui lance le truc
        [Route("api/Tuto/GET/Score")]
        [HttpGet]
        public object GETSCORE()
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {
                
                // Récupération de l'id de l'utilisateur en cours

                int IdUtilisateur = getCurrentIdUser();
                
                // Calcul du nombre de tuto réalisé par l'utilisateur

                IEnumerable<int> SelectQuery;

                SelectQuery =   from r in context.TUTODONEs              
                                where r.IDUSER == IdUtilisateur
                                group r by r.IDTUTO into gr
                                select gr.Key;

                int NbTutoDone = Generic.Call_Read_Count<int>(SelectQuery);

                // Calcul du nombre de tuto total

                IEnumerable<int> SelectQuery2;

                SelectQuery2 = from r in context.TUTOes
                                select r.IDTUTO;

                int NbTutoTotal = Generic.Call_Read_Count<int>(SelectQuery2);


                decimal PourcentageRealise = ((decimal)NbTutoDone / (decimal)NbTutoTotal) * 100;

                // Pourcentage de tuto réalisé

                return new { NbTutoDone = PourcentageRealise};

            }
            
        }

        // Le score de l'utilisateur qui lance le truc
        [Route("api/Tuto/GET/ToDo")]
        [HttpGet]
        public object TODO()
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Récupération de l'id de l'utilisateur en cours
                int IdUtilisateur = getCurrentIdUser();

                // Appel de la procédure stockée
                IEnumerable<int?> SelectQuery;
                SelectQuery = context.NBTUTOTODO(IdUtilisateur);

                return Generic.Call_Read_ToList<int?>(SelectQuery);

            }

        }

        // POST

        [Route("api/Tuto/POST/Done")]
        [HttpPost]
        public IHttpActionResult Post([FromBody]TutoDone_POST mTutoDone_POST)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Récupération de l'id de l'utilisateur en cours

                int IdUtilisateur = getCurrentIdUser();

                // création de l'objet

                TUTODONE mTutoDone = new TUTODONE();
                mTutoDone.IDTUTO = mTutoDone_POST.idTutoDone;
                mTutoDone.IDUSER = IdUtilisateur;
                mTutoDone.DATE_CREATION = DateTime.Now;
                context.TUTODONEs.Add(mTutoDone);

                try {
                    Generic.SaveChanges(context);
                }
                catch (HttpResponseException ex)
                {
                    string LibelleErreur = ex.Response.ReasonPhrase.Replace(System.Environment.NewLine, "");
                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    {ReasonPhrase = LibelleErreur};
                    throw new HttpResponseException(resp);
                 };

                return Ok();
            }
        }

    }

}