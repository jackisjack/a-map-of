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
    
    public partial class TUTOSTEP
    {
        public int IDTUTOSTEP { get; set; }
        public int IDTUTO { get; set; }
        public string INDICATION { get; set; }
        public int ORDRE { get; set; }
        public string IDEVENTTOLISTEN { get; set; }
        public string JSFONCTION { get; set; }
    
        public virtual TUTO TUTO { get; set; }
    }
}
