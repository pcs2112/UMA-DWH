--  C8_ETL_MERGE_TryCatchError_Mgr.sql
--  CFM
--  Jan 4, 2018

/*
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'ETL_TryCatchError' and ss.name = 'MWH')
       DROP TABLE MWH.ETL_TryCatchError
GO

CREATE TABLE MWH.ETL_TryCatchError(
              ID INT NOT NULL IDENTITY (1,1),
              INSERT_DTTM DATETIME CONSTRAINT MWH_ETL_TryCatchError_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
              UPDATE_DTTM DATETIME CONSTRAINT MWH_ETL_TryCatchError_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
              LST_MOD_USER VARCHAR(80) CONSTRAINT MWH_ETL_TryCatchError_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
              ERR                        INTEGER,
              ErrorSeverity INTEGER,
              ErrorState           INTEGER,
              ErrorProcedure       nvarchar(128),
              ErrorLine            INTEGER,
              ErrorMessage  nvarchar(4000),
              ETLProcedureName     nvarchar(300),
CONSTRAINT PK_ETL_TryCatchError  PRIMARY KEY NONCLUSTERED
 (
              ID            ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON FG_UMA_DWH_DIM_IDX
) ON  FG_UMA_DWH_DIM_DATA
GO





CREATE TRIGGER MWH.ETL_TryCatchError_UD
ON MWH.ETL_TryCatchError
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.ETL_TryCatchError
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO


 
*/




USE [UMA_DWH]
GO


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MERGE_ETL_TryCatchError' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MERGE_ETL_TryCatchError
GO


CREATE PROCEDURE MWH.MERGE_ETL_TryCatchError
              @message             varchar(15),
              @ERR                 INTEGER,
              @ErrorSeverity       INTEGER,
              @ErrorState          INTEGER,
              @ErrorProcedure      nvarchar(128),
              @ErrorLine           INTEGER,
              @ErrorMessage nvarchar(4000),
              @ProcedureName       nvarchar(300)
AS



IF (@message = 'save error') begin
insert into MWH.ETL_TryCatchError (
             ERR                        ,
              ErrorSeverity ,
              ErrorState           ,
              ErrorProcedure       ,
              ErrorLine            ,
              ErrorMessage  ,
              ETLProcedureName
) VALUES (
             @ERR                 ,
              @ErrorSeverity       ,
              @ErrorState          ,
              @ErrorProcedure      ,
              @ErrorLine           ,
              @ErrorMessage ,
              @ProcedureName
)

end;
