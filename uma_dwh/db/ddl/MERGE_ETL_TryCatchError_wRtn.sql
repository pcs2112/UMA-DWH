USE [UMA_DWH]
GO
 
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MERGE_ETL_TryCatchError_wRtn' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MERGE_ETL_TryCatchError_wRtn
GO
 
 
CREATE PROCEDURE MWH.MERGE_ETL_TryCatchError_wRtn
              @message             varchar(15),
              @ERR                 INTEGER,
              @ErrorSeverity       INTEGER,
              @ErrorState          INTEGER,
              @ErrorProcedure      nvarchar(128),
              @ErrorLine           INTEGER,
              @ErrorMessage nvarchar(4000),
              @ProcedureName       nvarchar(300),
 
              @TryCatchError_ID  INTEGER OUTPUT 
 
AS
 
DECLARE @InsertedRows AS TABLE (Id int)
 
IF (@message = 'save error') begin
insert into MWH.ETL_TryCatchError (
             ERR                        ,
              ErrorSeverity ,
              ErrorState           ,
              ErrorProcedure       ,
              ErrorLine            ,
              ErrorMessage  ,
              ETLProcedureName
)
  OUTPUT Inserted.ID INTO @InsertedRows
VALUES (
             @ERR                 ,
              @ErrorSeverity       ,
              @ErrorState          ,
              @ErrorProcedure      ,
              @ErrorLine           ,
              @ErrorMessage ,
              @ProcedureName      
);
 
SELECT @TryCatchError_ID = Id FROM @InsertedRows;
 
 
 
 
 
end;
