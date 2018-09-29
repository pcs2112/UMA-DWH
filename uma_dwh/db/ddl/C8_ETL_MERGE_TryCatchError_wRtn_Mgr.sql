USE [UMA_DWH]
GO
 

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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF))
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
