//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class ELEMENT
    {
        public int IDELEMENT { get; set; }
        public int IDELEMENTVUE { get; set; }
        public int IDVUE { get; set; }
        public int IDELEMENTVUEPARENT { get; set; }
        public int IDOBJET { get; set; }
        public string LIBELLE { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int FORME { get; set; }
        public int X_DELTA { get; set; }
        public int Y_DELTA { get; set; }
        public int IDTYPEOBJETVUE { get; set; }
    
        public virtual OBJET OBJET { get; set; }
        public virtual VUE VUE { get; set; }
        public virtual TYPEOBJET TYPEOBJET { get; set; }
    }
}
