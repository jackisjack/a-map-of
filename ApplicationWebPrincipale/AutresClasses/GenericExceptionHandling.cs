using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SIMANAGER
{

    public static class Generic
    {
        
        // UPDATE, DELETE, CREATE

        public static int SaveChanges(A_MAP_OFEntities context)
        {
            try
            {
                return context.SaveChanges();
            }
            catch (DbEntityValidationException e) // échec de validation du SaveChanges (exemple : contrainte de taille du champ)
            {

                string LibelleErreur = "";
                foreach (var eve in e.EntityValidationErrors)
                {
                    LibelleErreur = string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:", eve.Entry.Entity.GetType().Name, eve.Entry.State);

                    foreach (var ve in eve.ValidationErrors)
                    {
                        LibelleErreur += "<br />" + string.Format("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }
            catch (DbUpdateException ex) // échec de l'enregistrement en base
            {

                string LibelleErreur = GetaAllMessages(ex).Replace(System.Environment.NewLine, "");

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }
            catch (Exception ex) // Autres exceptions : 
                                 // - base de données hors ligne / chaine de connexion incorrecte
                                 // - contraintes SQL : exemple : id auto que l'on forcerait manuellement
            {

                string LibelleErreur = ex.Message.Replace(System.Environment.NewLine, "");

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }
        }

        // READ 

        public static List<TR> Call_Read_ToList<TR>(IEnumerable<TR> SelectQuery)
        {
            try
            {
                return SelectQuery.ToList();
            }
            catch (Exception ex)
            {

                string LibelleErreur = ex.Message.Replace(System.Environment.NewLine, "");

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }

        }

        public static int Call_Read_Count<TR>(IEnumerable<TR> SelectQuery)
        {
            try
            {
                return SelectQuery.Count();
            }
            catch (Exception ex)
            {

                string LibelleErreur = ex.Message.Replace(System.Environment.NewLine, "");

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }

        }

        public static object Call_Read_FirstOrDefault<TR>(IEnumerable<TR> SelectQuery)
        {
            try
            {
                return SelectQuery.FirstOrDefault();
            }
            catch (Exception ex)
            {

                string LibelleErreur = ex.Message.Replace(System.Environment.NewLine, "");

                var resp = new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    ReasonPhrase = LibelleErreur
                };

                Trace.TraceError(LibelleErreur);

                throw new HttpResponseException(resp);

            }

        }

        // Méthodes pour obtenir la liste de tous les messages des innerexceptions
        // https://stackoverflow.com/questions/9314172/getting-all-messages-from-innerexceptions
        #region

        public static IEnumerable<TSource> FromHierarchy<TSource>(
        this TSource source,
        Func<TSource, TSource> nextItem,
        Func<TSource, bool> canContinue)
        {
            for (var current = source; canContinue(current); current = nextItem(current))
            {
                yield return current;
            }
        }

        public static IEnumerable<TSource> FromHierarchy<TSource>(
            this TSource source,
            Func<TSource, TSource> nextItem)
            where TSource : class
        {
            return FromHierarchy(source, nextItem, s => s != null);
        }

        public static string GetaAllMessages(this Exception exception)
        {
            var messages = exception.FromHierarchy(ex => ex.InnerException)
                .Select(ex => ex.Message);
            return String.Join("|", messages);
        }
        #endregion
    }

}