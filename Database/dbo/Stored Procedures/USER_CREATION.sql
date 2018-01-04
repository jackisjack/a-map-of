-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[USER_CREATION] 
	-- Add the parameters for the stored procedure here
@NOM_UTILISATEUR NVARCHAR(50),
@MOT_DE_PASSE    NVARCHAR(50)
AS
     BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
         SET NOCOUNT ON;
         DECLARE @HashThis NVARCHAR(4000);
         SET @HashThis = CONVERT(NVARCHAR(4000), @MOT_DE_PASSE);
         INSERT INTO [dbo].[USER]
         ([NOM],
          [MOTDEPASSE],
          [USER_CREE],
          [DATE_CREE]
         )
         VALUES
         (@NOM_UTILISATEUR,
          LOWER(CONVERT(NVARCHAR(4000), HASHBYTES('SHA1', @HashThis), 2)),
          5,
          GETDATE()
         );
     END;