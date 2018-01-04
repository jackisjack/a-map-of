﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré à partir d'un modèle.
//
//     Des modifications manuelles apportées à ce fichier peuvent conduire à un comportement inattendu de votre application.
//     Les modifications manuelles apportées à ce fichier sont remplacées si le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SIMANAGER
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class A_MAP_OFEntities : DbContext
    {
        public A_MAP_OFEntities()
            : base("name=A_MAP_OFEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<OBJET> OBJET { get; set; }
        public virtual DbSet<TYPEOBJET> TYPEOBJET { get; set; }
        public virtual DbSet<LIEN> LIENs { get; set; }
        public virtual DbSet<VUE> VUEs { get; set; }
        public virtual DbSet<USER> USERs { get; set; }
        public virtual DbSet<TUTO> TUTOes { get; set; }
        public virtual DbSet<TUTOSTEP> TUTOSTEPs { get; set; }
        public virtual DbSet<TUTODONE> TUTODONEs { get; set; }
        public virtual DbSet<ELEMENT> ELEMENTs { get; set; }
    
        public virtual ObjectResult<LISTETUTOS_Result> LISTETUTOS(Nullable<int> iDUSER)
        {
            var iDUSERParameter = iDUSER.HasValue ?
                new ObjectParameter("IDUSER", iDUSER) :
                new ObjectParameter("IDUSER", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<LISTETUTOS_Result>("LISTETUTOS", iDUSERParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> NBTUTOTODO(Nullable<int> iDUSER)
        {
            var iDUSERParameter = iDUSER.HasValue ?
                new ObjectParameter("IDUSER", iDUSER) :
                new ObjectParameter("IDUSER", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("NBTUTOTODO", iDUSERParameter);
        }
    
        public virtual int DELETE_ALL_DATA()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("DELETE_ALL_DATA");
        }
    
        public virtual ObjectResult<DETAIL_VUE_Result> DETAIL_VUE(Nullable<int> iDVUE)
        {
            var iDVUEParameter = iDVUE.HasValue ?
                new ObjectParameter("IDVUE", iDVUE) :
                new ObjectParameter("IDVUE", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<DETAIL_VUE_Result>("DETAIL_VUE", iDVUEParameter);
        }
    
        public virtual int USER_CREATION(string nOM_UTILISATEUR, string mOT_DE_PASSE)
        {
            var nOM_UTILISATEURParameter = nOM_UTILISATEUR != null ?
                new ObjectParameter("NOM_UTILISATEUR", nOM_UTILISATEUR) :
                new ObjectParameter("NOM_UTILISATEUR", typeof(string));
    
            var mOT_DE_PASSEParameter = mOT_DE_PASSE != null ?
                new ObjectParameter("MOT_DE_PASSE", mOT_DE_PASSE) :
                new ObjectParameter("MOT_DE_PASSE", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("USER_CREATION", nOM_UTILISATEURParameter, mOT_DE_PASSEParameter);
        }
    }
}