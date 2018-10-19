-- C8_MANAGE_OPS_GENIE_ALERT.sql

/*



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'OPS_GENIE_ALERT' and ss.name = 'MWH')
       DROP TABLE MWH.OPS_GENIE_ALERT
GO


CREATE TABLE [MWH].[OPS_GENIE_ALERT](
       [ID]                                     [int] IDENTITY(1,1) NOT NULL,
       INSERT_DTTM                              DATETIME                   CONSTRAINT OPS_GENIE_ALERT_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
       UPDATE_DTTM                              DATETIME                   CONSTRAINT OPS_GENIE_ALERT_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
       LST_MOD_USER                      VARCHAR(80)                CONSTRAINT OPS_GENIE_ALERT_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
       ACTIVE_FLG                               SMALLINT                   CONSTRAINT OPS_GENIE_ALERT_ACTIVE_FLG_DF DEFAULT 1 NOT NULL,
-- POPULATED BY SP
       [STORED_PROCEDURE_NAME]           VARCHAR(100), --  Stored Procedure Inserting/Updating table
       [RUNBOOK_NAME]                           [varchar](400),  --  the run book will contain suggestions on how to fix
-- Values passed by Calling process
       [OPS_GENIE_ID]                           [varchar](80),
       [OPSGENIE_PRIORITY]               [CHAR](3),           --  P1 through P6
       [OPSGENIE_ALERT_STATUS]           [varchar](200),      -- Opened, Closed
       [EMAIL_ALERT_SENT]                [datetime],
       [EMAIL_SENT_TO]                          [varchar](4000),
       [EMAIL_TITLE]                     [varchar](200),
       [EMAIL_DETAILS]                          [varchar](4000),
       [DATAMART_NAME]                          [varchar](80),

CONSTRAINT [PK_OPS_GENIE_ALERT] PRIMARY KEY NONCLUSTERED
(
       [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON [PRIMARY]
) ON   [PRIMARY]

GO


CREATE TRIGGER MWH.OPS_GENIE_ALERT_UD_TRIG
ON MWH.OPS_GENIE_ALERT
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.OPS_GENIE_ALERT
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO


CREATE UNIQUE NONCLUSTERED INDEX [OPS_GENIE_ALERT_IDX_01] ON [MWH].[OPS_GENIE_ALERT]
(
       [OPS_GENIE_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


CREATE NONCLUSTERED INDEX [OPS_GENIE_ALERT_IDX_02] ON [MWH].[OPS_GENIE_ALERT]
(
       [OPSGENIE_ALERT_STATUS]  ASC
)
INCLUDE ( [OPS_GENIE_ID],
                [STORED_PROCEDURE_NAME]
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


CREATE NONCLUSTERED INDEX [OPS_GENIE_ALERT_IDX_03] ON [MWH].[OPS_GENIE_ALERT]
(
       [DATAMART_NAME]  ASC
)
INCLUDE ( [OPS_GENIE_ID],
                [STORED_PROCEDURE_NAME]
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO





*/





USE [UMA_DWH]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MANAGE_OPS_GENIE_ALERT' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MANAGE_OPS_GENIE_ALERT
GO


CREATE PROCEDURE [MWH].[MANAGE_OPS_GENIE_ALERT]
  @message VARCHAR(200),           --  valid messages :   NEW
  @VARCHAR_01 varchar(200) = '',   --  OPS_GENIE_ID  or a DATA_MART_NAME
  @VARCHAR_02 varchar(200) = '',   --  OPSGENIE_ALERT_STATUS,  I will use the message to populate this  i.e.  NEW message will be NEW status
  @VARCHAR_03 varchar(200) = '',   --  OPSGENIE_PRIORITY,   P1 through P6
  @VARCHAR_04 varchar(200) = '',   --  EMAIL_ALERT_SENT
  @VARCHAR_05 varchar(4000) = '',  --  EMAIL_SENT_TO
  @VARCHAR_06 varchar(200) = '',   --  EMAIL_TITLE
  @VARCHAR_07 varchar(4000) = '',  --  EMAIL_DETAILS
  @VARCHAR_08 varchar(200) = '',    --  DATAMART_NAME
  @VARCHAR_09 varchar(200) = ''

  with recompile  , EXECUTE as OWNER
 AS

  SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;





  /*

DECLARE    @message VARCHAR(200) = 'GET DATE BY DATAMART NAME';           --  valid messages :   NEW
DECLARE    @VARCHAR_01 varchar(200) = '';   --  OPS_GENIE_ID  or a DATA_MART_NAME
DECLARE    @VARCHAR_02 varchar(200) = '';   --  OPSGENIE_ALERT_STATUS,  I will use the message to populate this  i.e.  NEW message will be NEW status
DECLARE    @VARCHAR_03 varchar(200) = '';   --  OPSGENIE_PRIORITY,   P1 through P6
DECLARE    @VARCHAR_04 varchar(200) = '';   --  EMAIL_ALERT_SENT
DECLARE    @VARCHAR_05 varchar(4000) = '';  --  EMAIL_SENT_TO
DECLARE    @VARCHAR_06 varchar(200) = '';   --  EMAIL_TITLE
DECLARE    @VARCHAR_07 varchar(4000) = '';  --  EMAIL_DETAILS
DECLARE    @VARCHAR_08 varchar(200) = 'I3_NON-MCS';    --  DATAMART_NAME
DECLARE    @VARCHAR_09 varchar(200) = '';

*/




--   @LOG_HISTORY to turn ON Logging into the ETL_HISTORY table
DECLARE             @LOG_HISTORY  INTEGER  = 0 ;

DECLARE             @ERR                 INTEGER  = 0 ;
DECLARE             @ErrorSeverity       INTEGER;
DECLARE             @ErrorState          INTEGER;
DECLARE             @ErrorProcedure      nvarchar(128) ;
DECLARE             @ErrorLine           INTEGER;
DECLARE             @ErrorMessage nvarchar(4000);
DECLARE             @TryCatchError_ID  INTEGER = 0;

DECLARE             @ETL_CYCLE_START     INTEGER;
DECLARE             @ETL_CYCLE_END             INTEGER;
DECLARE             @CYCLE_HISTORY_START_ID           INTEGER;
DECLARE             @CYCLE_HISTORY_END_ID             INTEGER;
DECLARE             @DATAMARTS_IN_CYCLE                      INTEGER;
DECLARE             @CYCLES_TO_REPORT                 INTEGER;

DECLARE             @VALID_DB_SP                      INTEGER;
DECLARE             @LastEngineHisoryID               INTEGER;

DECLARE             @SP_RUN_CHECK_NAME   varchar(80) = '';
DECLARE             @PERIOD_POSITION           INTEGER = -1;

DECLARE             @ERROR_ID                         INTEGER = -1;
DECLARE             @SOURCE_SERVER             varchar(80) = '';
DECLARE             @SOURCE_DB                 varchar(80) = '';


DECLARE @END_DATETIME                                                     DATETIME2;
DECLARE @START_DATETIME                                             DATETIME2;
SET @START_DATETIME = sysdatetime();

DECLARE  @rtn_Insert_Cnt                                            INTEGER = -1;
 DECLARE  @rtn_Update_Cnt                                            INTEGER = -1;
DECLARE  @rtn_Delete_Cnt                                            INTEGER = -1;
DECLARE  @LOAD_HIST_PKID                                            INTEGER;
DECLARE  @lookup_id                                                 INTEGER = null;

DECLARE  @OPS_GENIE_ID                         varchar(200) = '';
 DECLARE  @OPSGENIE_ALERT_STATUS  varchar(200);   --  OPSGENIE_ALERT_STATUS,  I will use the message to populate this  i.e.  NEW message will be NEW status
DECLARE  @OPSGENIE_PRIORITY             varchar(200);
DECLARE  @EMAIL_ALERT_SENT              DATETIME;
DECLARE  @EMAIL_SENT_TO                 varchar(4000);
 DECLARE  @EMAIL_TITLE                          varchar(200);
DECLARE  @EMAIL_DETAILS                 varchar(4000);
DECLARE  @RUNBOOK_NAME                         varchar(200);

DECLARE  @DATAMART_NAME                 varchar(200);




DECLARE             @My_SP_NAME varchar(50);
SET @My_SP_NAME =  OBJECT_SCHEMA_NAME (@@PROCID) +'.'+ OBJECT_NAME(@@PROCID);

--  The Source Names are either LOCAL or REMOTE,  when REMOTE, manually enter the nameed automatically
--  Using the FUNCTION below for LOCAL, and when we move to NEW server, these will be updat
DECLARE             @Source_Server_Name varchar(60);
SET @Source_Server_Name = @@SERVERNAME;

DECLARE             @Source_DB_Name varchar(40);
SET  @Source_DB_Name = DB_NAME();

DECLARE             @Source_Schema_Name varchar(40);
SET  @Source_Schema_Name  =  'WEB-APP';

DECLARE             @Source_Table_Name varchar(60);
SET  @Source_Table_Name  =  'OPS_GENIE_ALERT';
---------------------------------------------------------------------------------------------------------

--  This is defaulted to 'BROWSER' ,  'POWERBI'  or  'WEB-APP', depending on the target ( Caller )
--  ETL procedure will be manually entered
DECLARE             @Target_Schema_Name varchar(40);
SET   @Target_Schema_Name = 'WEB-APP';

DECLARE             @Target_Table_Name varchar(60);
SET   @Target_Table_Name  =  '[MWH].[OPS_GENIE_ALERT] : ' + @message;

--     NEW
--     UPDATE
--     GET_DATE
--     REPORT








IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0 , @Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME, '', '', 0 , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
end;


IF  @message = 'NEW'
BEGIN

       BEGIN TRY

              SET    @OPS_GENIE_ID = rtrim(@VARCHAR_01);
              SET  @OPSGENIE_ALERT_STATUS   =  rtrim(@VARCHAR_02);
              SET  @OPSGENIE_PRIORITY =  rtrim(@VARCHAR_03);
              SET  @EMAIL_ALERT_SENT = cast(@VARCHAR_04 as datetime);
              SET  @EMAIL_SENT_TO  = rtrim(@VARCHAR_05);
              SET  @EMAIL_TITLE =   rtrim(@VARCHAR_06);
              SET  @EMAIL_DETAILS =   rtrim(@VARCHAR_07);
              SET  @DATAMART_NAME =    rtrim(@VARCHAR_08);

              select @lookup_id = ID from [MWH].[OPS_GENIE_ALERT]  with(nolock) where OPS_GENIE_ID = @OPS_GENIE_ID;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

       IF( @ERR = 0) BEGIN

              --  @RUNBOOK_NAME  lookup function, to be created

              IF ( @lookup_id is null) BEGIN
                     INSERT INTO [MWH].[OPS_GENIE_ALERT] (
                     [STORED_PROCEDURE_NAME], [OPS_GENIE_ID], [OPSGENIE_ALERT_STATUS], [OPSGENIE_PRIORITY], [EMAIL_ALERT_SENT], [EMAIL_SENT_TO], [EMAIL_TITLE], [EMAIL_DETAILS], [RUNBOOK_NAME], [DATAMART_NAME]
                     )
                     VALUES(
                     @My_SP_NAME, @OPS_GENIE_ID,  @OPSGENIE_ALERT_STATUS,  @OPSGENIE_PRIORITY, @EMAIL_ALERT_SENT, @EMAIL_SENT_TO, @EMAIL_TITLE, @EMAIL_DETAILS, @RUNBOOK_NAME, @DATAMART_NAME
                     );
              END
                     else
              BEGIN
                     UPDATE [MWH].[OPS_GENIE_ALERT]
                     SET           [STORED_PROCEDURE_NAME] = @My_SP_NAME,
                                  [OPSGENIE_ALERT_STATUS] = @OPSGENIE_ALERT_STATUS ,
                                  [OPSGENIE_PRIORITY] = @OPSGENIE_PRIORITY,
                                  [EMAIL_ALERT_SENT] = @EMAIL_ALERT_SENT,
                                  [EMAIL_SENT_TO] = @EMAIL_SENT_TO,
                                  [EMAIL_TITLE] = @EMAIL_TITLE,
                                  [EMAIL_DETAILS] = @EMAIL_DETAILS,
                                  [RUNBOOK_NAME] = @RUNBOOK_NAME,
                                  [DATAMART_NAME] = @DATAMART_NAME
                     WHERE ID = @lookup_id;
              END
       END;
END;



IF  @message = 'UPDATE'
BEGIN

       BEGIN TRY

              SET    @OPS_GENIE_ID = rtrim(@VARCHAR_01);
              SET  @OPSGENIE_ALERT_STATUS   =  rtrim(@VARCHAR_02);
              SET  @OPSGENIE_PRIORITY =  rtrim(@VARCHAR_03);
              SET  @EMAIL_ALERT_SENT = cast(@VARCHAR_04 as datetime);
              SET  @EMAIL_SENT_TO  = rtrim(@VARCHAR_05);
              SET  @EMAIL_TITLE =   rtrim(@VARCHAR_06);
              SET  @EMAIL_DETAILS =   rtrim(@VARCHAR_07);
              SET  @DATAMART_NAME =    rtrim(@VARCHAR_08);

              select @lookup_id = ID from [MWH].[OPS_GENIE_ALERT]  with(nolock) where OPS_GENIE_ID = @OPS_GENIE_ID;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END CATCH;

       IF( @ERR = 0) and (@lookup_id is not null)  BEGIN

              --  @RUNBOOK_NAME  lookup function, to be created
              BEGIN TRY
                     UPDATE [MWH].[OPS_GENIE_ALERT]
                     SET           [STORED_PROCEDURE_NAME] = @My_SP_NAME,
                                  [OPSGENIE_ALERT_STATUS] = @OPSGENIE_ALERT_STATUS ,
                                  [OPSGENIE_PRIORITY] = @OPSGENIE_PRIORITY,
                                  [EMAIL_ALERT_SENT] = @EMAIL_ALERT_SENT,
                                  [EMAIL_SENT_TO] = @EMAIL_SENT_TO,
                                  [EMAIL_TITLE] = @EMAIL_TITLE,
                                  [EMAIL_DETAILS] = @EMAIL_DETAILS,
                                  [RUNBOOK_NAME] = @RUNBOOK_NAME,
                                  [DATAMART_NAME] = @DATAMART_NAME
                     WHERE ID = @lookup_id;
              END TRY
              BEGIN CATCH
                     SELECT
                      @ERR = ERROR_NUMBER()
                     ,@ErrorSeverity = ERROR_SEVERITY()
                     ,@ErrorState = ERROR_STATE()
                     ,@ErrorProcedure = ERROR_PROCEDURE()
                     ,@ErrorLine = ERROR_LINE()
                     ,@ErrorMessage = ERROR_MESSAGE() ;

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

              END CATCH;
       END;

       IF (@lookup_id is  null)  BEGIN

                     SET    @ERR = 911;
                     SET    @ErrorSeverity = 911;
                     SET    @ErrorState = 911;
                     SET    @ErrorProcedure = @My_SP_NAME;
                     SET    @ErrorLine = 320
                     SET    @ErrorMessage = 'UPDATE on [MWH].[OPS_GENIE_ALERT] falied,  OPS_GENIE_ID : (' + @OPS_GENIE_ID + ') NOT FOUND!'

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END

END;

--   exec [MWH].[MANAGE_OPS_GENIE_ALERT] 'GET DATE BY DATAMART NAME',  '','','','','','','','I3_NON-MCS',''

--  select [DATAMART_NAME], count(*) from  [MWH].[OPS_GENIE_ALERT]  with(nolock)  group by  [DATAMART_NAME]
--  select * from [MWH].[OPS_GENIE_ALERT]  with(nolock)

--INSERT INTO UMA_DWH.MWH.OPS_GENIE_ALERT (  STORED_PROCEDURE_NAME, RUNBOOK_NAME, OPS_GENIE_ID, OPSGENIE_PRIORITY, OPSGENIE_ALERT_STATUS, EMAIL_ALERT_SENT, EMAIL_SENT_TO, EMAIL_TITLE, EMAIL_DETAILS, DATAMART_NAME) VALUES ( 'MWH.MANAGE_OPS_GENIE_ALERT', null, '34b010e2-5d1e-4ca5-b935-7ccc3b559ff8', 'P3 ', 'OPENED', '2018-10-15 14:26:35.000', '', 'DWH ETL FAILED', '{"data_mart_name": "I3_DIRECT_REPORTING", "data_mart_status": "NOT STARTED", "data_mart_status_internal": "FAILED"}', 'I3_NON-MCS');


IF  @message = 'GET DATE BY DATAMART NAME'
BEGIN

       BEGIN TRY
              SET    @ERR = 0;
              SET   @DATAMART_NAME = rtrim(@VARCHAR_08);

              select @lookup_id = max(ID) from [MWH].[OPS_GENIE_ALERT]  with(nolock) where [DATAMART_NAME] = @DATAMART_NAME;

       END TRY
       BEGIN CATCH
         SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

         EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END CATCH;

       IF( @ERR = 0) and (@lookup_id is not null)  BEGIN
              --  @RUNBOOK_NAME  lookup function, to be created

              select  INSERT_DTTM  , UPDATE_DTTM, EMAIL_ALERT_SENT
              from [MWH].[OPS_GENIE_ALERT]  with(nolock)
              where ID = @lookup_id;


       END;

       IF (@lookup_id is  null)  BEGIN

                     SET    @ERR = 911;
                     SET    @ErrorSeverity = 911;
                     SET    @ErrorState = 911;
                     SET    @ErrorProcedure = @My_SP_NAME;
                     SET    @ErrorLine = 320
                     SET    @ErrorMessage = 'UPDATE on [MWH].[OPS_GENIE_ALERT] falied,  OPS_GENIE_ID : (' + @OPS_GENIE_ID + ') NOT FOUND!'

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END

END;




IF  @message = 'GET DATES BY OPSGENIE ID'
BEGIN

       BEGIN TRY

              SET    @OPS_GENIE_ID = rtrim(@VARCHAR_01);

              select @lookup_id = ID from [MWH].[OPS_GENIE_ALERT]  with(nolock) where OPS_GENIE_ID = @OPS_GENIE_ID;

       END TRY
       BEGIN CATCH
         SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END CATCH;

       IF( @ERR = 0) and (@lookup_id is not null)  BEGIN
              --  @RUNBOOK_NAME  lookup function, to be created

              select  INSERT_DTTM  , UPDATE_DTTM, EMAIL_ALERT_SENT
              from [MWH].[OPS_GENIE_ALERT]  with(nolock)
              where ID = @lookup_id;

       END;

       IF (@lookup_id is  null)  BEGIN

                     SET    @ERR = 911;
                     SET    @ErrorSeverity = 911;
                     SET    @ErrorState = 911;
                     SET    @ErrorProcedure = @My_SP_NAME;
                     SET    @ErrorLine = 320
                     SET    @ErrorMessage = 'UPDATE on [MWH].[OPS_GENIE_ALERT] falied,  OPS_GENIE_ID : (' + @OPS_GENIE_ID + ') NOT FOUND!'

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END

END;



IF  @message = 'REPORT'
BEGIN

       BEGIN TRY

              SET    @OPS_GENIE_ID = rtrim(@VARCHAR_01);

              select @lookup_id = ID from [MWH].[OPS_GENIE_ALERT]  with(nolock) where OPS_GENIE_ID = @OPS_GENIE_ID;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END CATCH;

       IF( @ERR = 0) and (@lookup_id is not null)  BEGIN
              --  @RUNBOOK_NAME  lookup function, to be created

              select [ID], INSERT_DTTM, UPDATE_DTTM, LST_MOD_USER, ACTIVE_FLG, [STORED_PROCEDURE_NAME], [RUNBOOK_NAME], [OPS_GENIE_ID],
                           [OPSGENIE_PRIORITY], [OPSGENIE_ALERT_STATUS], [EMAIL_ALERT_SENT], [EMAIL_SENT_TO], [EMAIL_TITLE], [EMAIL_DETAILS], [DATAMART_NAME]
              from [MWH].[OPS_GENIE_ALERT]  with(nolock)
              where ID = @lookup_id;


       END;

       IF (@lookup_id is  null)  BEGIN

                     SET    @ERR = 911;
                     SET    @ErrorSeverity = 911;
                     SET    @ErrorState = 911;
                     SET    @ErrorProcedure = @My_SP_NAME;
                     SET    @ErrorLine = 320
                     SET    @ErrorMessage = 'UPDATE on [MWH].[OPS_GENIE_ALERT] falied,  OPS_GENIE_ID : (' + @OPS_GENIE_ID + ') NOT FOUND!'

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;

       END

END;


SET @END_DATETIME = sysdatetime();

IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'FINISHED', @END_DATETIME, @LOAD_HIST_PKID ,  @Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME, '', '', @rtn_Insert_Cnt , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
END;



GO





grant execute on [MWH].[MANAGE_OPS_GENIE_ALERT] to public;
