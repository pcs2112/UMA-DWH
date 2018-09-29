--  C8_MWH.ERROR_RESOLUTIONS_MGR.sql
--  CFM



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'ERROR_RESOLUTIONS' and ss.name = 'MWH')
       DROP TABLE MWH.ERROR_RESOLUTIONS
GO

CREATE TABLE MWH.ERROR_RESOLUTIONS(
              ID INT NOT NULL IDENTITY (1,1),
              INSERT_DTTM DATETIME CONSTRAINT ERROR_RESOLUTIONS_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
              UPDATE_DTTM DATETIME CONSTRAINT ERROR_RESOLUTIONS_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
              LST_MOD_USER VARCHAR(80) CONSTRAINT ERROR_RESOLUTIONS_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
              ACTIVE_FLAG                       smallint,
              DESCRIPTION                       varchar(200),
              FILE_PATH_FILENAME         varchar(300)
CONSTRAINT PK_ERROR_RESOLUTIONS  PRIMARY KEY NONCLUSTERED
 (
              ID            ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF)
)
GO





CREATE TRIGGER MWH.ERROR_RESOLUTIONS_UD
ON MWH.ERROR_RESOLUTIONS
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.ERROR_RESOLUTIONS
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO



--  exec MWH.ERROR_RESOLUTIONS_MGR 'save' , '', '1', 'TEST ERROR RESULATION DESCRIPTION' , 'C:\Users\cmatula\Documents\SQL Server Management Studio'

--  select * from MWH.ERROR_RESOLUTIONS






USE [UMA_DWH]
GO


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'ERROR_RESOLUTIONS_MGR' and ss.name = 'MWH')
       DROP PROCEDURE MWH.ERROR_RESOLUTIONS_MGR
GO


CREATE PROCEDURE MWH.ERROR_RESOLUTIONS_MGR
              @message                          varchar(15),
              @ID                                      varchar(20),
              @ACTIVE_FLAG               varchar(20),
              @DESCRIPTION               varchar(200),
              @FILE_PATH_FILENAME        varchar(300)


AS


DECLARE             @ERR                 INTEGER  = 0 ;
DECLARE             @ErrorSeverity       INTEGER;
DECLARE             @ErrorState          INTEGER;
DECLARE             @ErrorProcedure      nvarchar(128) ;
DECLARE             @ErrorLine           INTEGER;
DECLARE             @ErrorMessage nvarchar(4000);
DECLARE             @TryCatchError_ID    INTEGER  = 0 ;
DECLARE             @LU_ID               INTEGER = -1;
DECLARE             @ExistingID  INTEGER = -1;


IF (@message = 'save') begin

  BEGIN TRY

       set @LU_ID  = cast(@ID as INT);

       select @ExistingID = ID from MWH.ERROR_RESOLUTIONS where ID = @LU_ID;


       if(@ExistingID = -1) begin

       insert into MWH.ERROR_RESOLUTIONS (
              ACTIVE_FLAG                       ,
              DESCRIPTION                       ,
              FILE_PATH_FILENAME
       )   VALUES (
              @ACTIVE_FLAG                      ,
              @DESCRIPTION                      ,
              @FILE_PATH_FILENAME
    );
end
else
begin
       update MWH.ERROR_RESOLUTIONS
       set ACTIVE_FLAG = @ACTIVE_FLAG,
              DESCRIPTION = @DESCRIPTION ,
              FILE_PATH_FILENAME = @FILE_PATH_FILENAME
              where ID = @ExistingID;

end;

END TRY
BEGIN CATCH
    SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC  MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, 'MWH.ERROR_RESOLUTIONS_MGR', @TryCatchError_ID    OUTPUT;

END CATCH;


end;
