SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO
 
 
--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOAD_ETL_HISORY' , 'eee', '3'
 
 
USE [UMA_DWH]
GO
 
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'UMA_WAREHOUSE_ADMIN_CONSOLE' and ss.name = 'MWH')
       DROP PROCEDURE MWH.UMA_WAREHOUSE_ADMIN_CONSOLE
GO
 
 
 
 
CREATE PROCEDURE [MWH].[UMA_WAREHOUSE_ADMIN_CONSOLE]
  @message VARCHAR(20),   --  valid meaages :   LOAD_ETL_HISORY
  @VARCHAR_01 varchar(80),
  @VARCHAR_02 varchar(80)
 
AS
 
 DECLARE             @ERR                 INTEGER  = 0 ;
DECLARE             @ErrorSeverity       INTEGER;
DECLARE             @ErrorState          INTEGER;
DECLARE             @ErrorProcedure      nvarchar(128) ;
DECLARE             @ErrorLine           INTEGER;
DECLARE             @ErrorMessage nvarchar(4000);
DECLARE             @TryCatchError_ID  INTEGER = 0;
 
DECLARE             @ETL_CYCLE_START     INTEGER;
DECLARE             @ETL_CYCLE_END             INTEGER;
 
 
IF  @message = 'LOAD_ETL_HISORY'
BEGIN

BEGIN TRY
       SET @ETL_CYCLE_START = cast(@VARCHAR_01 as INTEGER);
       SET @ETL_CYCLE_END = cast(@VARCHAR_02 as INTEGER);
 
 
 
 
END TRY
BEGIN CATCH 
    SELECT 
         @ERR = ERROR_NUMBER() 
        ,@ErrorSeverity = ERROR_SEVERITY() 
        ,@ErrorState = ERROR_STATE() 
        ,@ErrorProcedure = ERROR_PROCEDURE()  
        ,@ErrorLine = ERROR_LINE()  
        ,@ErrorMessage = ERROR_MESSAGE() ; 
 
              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
 
END CATCH;
 
END;
 
return @TryCatchError_ID;
 
 
 
GO
