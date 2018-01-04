using System.ComponentModel.DataAnnotations;

namespace SIMANAGER
{
 
    public class Utilisateur
    {
        [Required(ErrorMessage = "Saisissez votre nom.")]
        [Display(Name = "Nom :")]
        public string Nom { get; set; }

        [Required(ErrorMessage = "Saisissez votre mot de passe :)")]
        [DataType(DataType.Password)]
        [Display(Name = "Mot de passe :")]
        public string MotDePasse { get; set; }

    }
}