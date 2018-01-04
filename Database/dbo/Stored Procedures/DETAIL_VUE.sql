-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DETAIL_VUE] 
	-- Add the parameters for the stored procedure here
	@IDVUE int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    SELECT * FROM [dbo].[VUE] WHERE IDVUE = @IDVUE
    SELECT * FROM [dbo].[ELEMENT] WHERE IDVUE = @IDVUE

END