using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SIMANAGER.Controllers
{
    // 
    public class Objet_POST
    {
        public int IDTYPEOBJETVUE { get; set; }
        public string NOM { get; set; }
    }

    [MyAuthorizeAttribute]
    public class ObjetController : ApiController
    {
        
        [Route("api/Objet/Autocomplete/{IDTYPEOBJET}/GET")]
        [HttpGet]
        public object GET(int IDTYPEOBJET, [FromUri] string term = "")
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                
                IEnumerable<string> SelectQuery;
                
                SelectQuery = (from r in context.OBJET // Les objets ...
                               where r.NOM.Contains(term) // ...dont le nom contient les termes saisis par l'utilisateur, 
                                        && r.IDTYPEOBJET  == IDTYPEOBJET // ...et pour le type donné
                               select r.NOM);

                return Generic.Call_Read_ToList<string>(SelectQuery);

            }

        }


        [Route("api/Objet/ID/GET")]
        [HttpGet]
        public object GETIDOBJET([FromUri] int IDTYPEOBJET, [FromUri] string NOMOBJET)
        {

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {
                
                IEnumerable<int> SelectQuery;

                SelectQuery = (from r in context.OBJET // Les objets ...
                               where r.NOM == NOMOBJET // ...dont le nom contient les termes saisis par l'utilisateur, 
                                  && r.IDTYPEOBJET == IDTYPEOBJET // ...et pour le type donné
                               select r.IDOBJET);

                var resultat = Generic.Call_Read_FirstOrDefault<int>(SelectQuery);

                // Si l'objet n'existe pas

                if ((int)resultat == 0)
                {

                    // Création

                    OBJET mObjet = new OBJET();
                    mObjet.IDTYPEOBJET = IDTYPEOBJET;
                    mObjet.NOM = NOMOBJET;

                    context.OBJET.Add(mObjet);

                    // Enregistrement effectif

                    try
                    {
                        Generic.SaveChanges(context);
                    }
                    catch (HttpResponseException ex)
                    {
                        string LibelleErreur = ex.Response.ReasonPhrase.Replace(System.Environment.NewLine, "");
                        var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                        {
                            ReasonPhrase = LibelleErreur
                        };
                        throw new HttpResponseException(resp);
                    };

                    resultat = mObjet.IDOBJET;

                }

                return new { resultat };

            }

        }


        [Route("api/Objet/POST")]
        [HttpPost]
        public object Post([FromBody]Objet_POST[] obj_from_javascript)
        {

            List<int> IDOBJETs = new List<int>();

            // Suppression des éventuelles doublons

            var obj_from_javascriptSD = obj_from_javascript
                                        .GroupBy(i => new { i.IDTYPEOBJETVUE, i.NOM })
                                        .Select(g => g.First());

            // Création des objets

            using (A_MAP_OFEntities context = new A_MAP_OFEntities())
            {

                // Pour chacun des objets uniques à créer

                foreach (Objet_POST mObjet_POST in obj_from_javascriptSD)
                {

                    // Recherche si l'objet est éventuellement déjà existant en base

                    IEnumerable<int> SelectQuery;

                    SelectQuery = (from r in context.OBJET
                                   where r.NOM == mObjet_POST.NOM
                                            && r.IDTYPEOBJET == mObjet_POST.IDTYPEOBJETVUE
                                   select r.IDOBJET);

                    var resultat = Generic.Call_Read_FirstOrDefault<int>(SelectQuery);

                    // Si non

                    if ((int)resultat == 0)
                    {

                        // Création

                        OBJET mObjet = new OBJET();
                        mObjet.IDTYPEOBJET = mObjet_POST.IDTYPEOBJETVUE;
                        mObjet.NOM = mObjet_POST.NOM;

                        context.OBJET.Add(mObjet);

                        // Enregistrement effectif

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

                        // Récupération de l'id

                        IDOBJETs.Add(mObjet.IDOBJET);

                    } // Fin de test de préexistence de l'objet
                    else // si l'objet existe déjà, son id actuel est stocké
                    {
                        IDOBJETs.Add((int)resultat);
                    }
                } // Fin de boucle sur les objets
                
            } // Fin using

            return  new { IDOBJETS=IDOBJETs};

        } // Fin de méthode

    }

}