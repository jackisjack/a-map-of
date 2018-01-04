function GenerateurHTML(Id_Div_Template, context, Div_Cible) {

    // Grab the template script
    var theTemplateScript = $(Id_Div_Template).html();

    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);

    // Pass our data to the template
    var theCompiledHtml = theTemplate(context);

    // Add the compiled html to the page
    $(Div_Cible).html(theCompiledHtml);

};