CREATE PROCEDURE [dbo].[LISTETUTOS]
	-- Add the parameters for the stored procedure here
	@IDUSER INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT 
		DISTINCT
	T.IDTUTO AS 'IDTUTO',
	T.LIBELLE AS 'LIBELLE',
	CASE WHEN TD.IDUSER is null THEN '' ELSE 'Fait' END AS 'DEJAFAIT'
	FROM TUTO T
	LEFT JOIN
		TUTODONE TD ON 
		(T.IDTUTO = TD.IDTUTO AND
		 TD.IDUSER = @IDUSER)

END