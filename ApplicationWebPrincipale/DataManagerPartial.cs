using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SIMANAGER
{
    public partial class TYPEOBJET
    {

        public string FAVORISMENUtrim
        {
            get
            {
                return FAVORISMENU.Trim();

            }
        }
    }

}