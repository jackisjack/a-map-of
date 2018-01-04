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

namespace SIMANAGER.Controllers
{

    public class TypeObjet_POST
    {
        public string LIBELLE { get; set; }
        public string FAVORISMENU { get; set; }
        public string ICONE { get; set; }
    }

    [MyAuthorizeAttribute]
    public class TypeObjetController : ApiController
    {

        // GET

        [Route("api/TypeObjet/GET")]
        [HttpGet]
        public object GET([FromUri] string ColonnesAffichees = "", [FromUri] string FiltreLibelle = "")
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                IEnumerable<object> SelectQuery;

                // SELECT 

                switch (ColonnesAffichees)
                {
                    case "Toutes":

                        SelectQuery = from r in context.TYPEOBJET
                                      select new
                                      {
                                          IDTYPEOBJET = r.IDTYPEOBJET,
                                          LIBELLE = r.LIBELLE,
                                          FAVORISMENUtrim = r.FAVORISMENU.Trim(),
                                          ICONE = r.ICONE
                                      };
                        break;

                    case "Libelle":

                        if (FiltreLibelle != "")
                        {
                            SelectQuery = from r in context.TYPEOBJET
                                              // select new { IDTYPEOBJET = r.IDTYPEOBJET };
                                          where r.LIBELLE.Contains(FiltreLibelle)
                                          select r.LIBELLE.ToString();

                        }
                        else
                        {
                            SelectQuery = from r in context.TYPEOBJET
                                              // select new { IDTYPEOBJET = r.IDTYPEOBJET };
                                          select r.LIBELLE.ToString();
                        }


                        break;

                    default:
                        SelectQuery = from r in context.TYPEOBJET
                                      select new
                                      {
                                          IDTYPEOBJET = r.IDTYPEOBJET,
                                          LIBELLE = r.LIBELLE,
                                          FAVORISMENUtrim = r.FAVORISMENU.Trim(),
                                          ICONE = r.ICONE
                                      };
                        break;

                }
   
                return Generic.Call_Read_ToList<object>(SelectQuery);

            }

        }

        [Route("api/TypeObjet/GET/Favoris")]
        [HttpGet]
        public object GET_Favoris([FromUri] string ColonnesAffichees = "")
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                IEnumerable<object> SelectQuery;

                // SELECT 

                switch (ColonnesAffichees)
                {
                    case "Toutes":

                        SelectQuery = from r in context.TYPEOBJET
                                      where r.FAVORISMENU == "O"
                                      select new
                                      {
                                          IDTYPEOBJET = r.IDTYPEOBJET,
                                          LIBELLE = r.LIBELLE,
                                          FAVORISMENUtrim = r.FAVORISMENU.Trim(),
                                          ICONE = r.ICONE
                                      };
                        break;

                    case "Libelle":

                        SelectQuery = from r in context.TYPEOBJET
                                      where r.FAVORISMENU == "O"
                                      select r.LIBELLE.ToString();
                        break;

                    default:

                        SelectQuery = from r in context.TYPEOBJET
                                      where r.FAVORISMENU == "O"
                                      select new {
                                          IDTYPEOBJET = r.IDTYPEOBJET,
                                          LIBELLE = r.LIBELLE,
                                          FAVORISMENUtrim = r.FAVORISMENU.Trim(),
                                          ICONE = r.ICONE
                                          };
                        break;

                }

                return Generic.Call_Read_ToList<object>(SelectQuery);

            }

        }

        // PUT

        [Route("api/TypeObjet/PUT/Favoris/{IDTYPEOBJET}")]
        [HttpPut]
        public IHttpActionResult PUT_Favoris(int IDTYPEOBJET)
        {
            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                var c = (TYPEOBJET)Generic.Call_Read_FirstOrDefault<TYPEOBJET>((from r in context.TYPEOBJET
                                                                                where r.IDTYPEOBJET == IDTYPEOBJET
                                                                                select r));
                // si le type d'objet n'existe pas
                if (c == null)
                {
                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    { ReasonPhrase = "Le type d'objet " + IDTYPEOBJET + " n'existe pas." };
                    throw new HttpResponseException(resp);
                }

                // passage en non favoris
                c.FAVORISMENU = "O";

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

        [Route("api/TypeObjet/PUT/NonFavoris/{IDTYPEOBJET}")]
        [HttpPut]
        public IHttpActionResult PUT_NonFavoris(int IDTYPEOBJET)
        {
            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                var c = (TYPEOBJET)Generic.Call_Read_FirstOrDefault<TYPEOBJET>((from r in context.TYPEOBJET
                                                                                where r.IDTYPEOBJET == IDTYPEOBJET
                                                                                select r));
                // si le type d'objet n'existe pas
                if (c == null)
                {
                    var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                    {ReasonPhrase = "Le type d'objet " + IDTYPEOBJET + " n'existe pas."};
                    throw new HttpResponseException(resp);
                }

                // passage en non favoris
                c.FAVORISMENU = "N";

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

        // POST

        [Route("api/TypeObjet/POST")]
        [HttpPost]
        public IHttpActionResult Post([FromBody]TypeObjet_POST obj_from_javascript)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {
                // création de l'objet

                TYPEOBJET mTypeObjet = new TYPEOBJET();
                mTypeObjet.LIBELLE = obj_from_javascript.LIBELLE;
                mTypeObjet.FAVORISMENU = obj_from_javascript.FAVORISMENU;
                mTypeObjet.ICONE = obj_from_javascript.ICONE;
                context.TYPEOBJET.Add(mTypeObjet);

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