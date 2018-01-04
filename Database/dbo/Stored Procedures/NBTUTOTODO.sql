-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[NBTUTOTODO]
	-- Add the parameters for the stored procedure here
	@IDUSER INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT COUNT(DISTINCT T.IDTUTO) AS 'NBTUTOTODO'
    FROM TUTO T
	    LEFT JOIN TUTODONE TD ON(T.IDTUTO = TD.IDTUTO
						    AND TD.IDUSER = @IDUSER)
    WHERE TD.IDUSER IS NULL;
END