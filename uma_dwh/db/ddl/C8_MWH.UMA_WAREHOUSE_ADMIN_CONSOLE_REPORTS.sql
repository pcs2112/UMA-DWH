-- C8_MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS.sql

-- sqlcmd -S localhost -U [srv_mlkpythdap01_DB] -P 1F0rg0t1 -i  C8_MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS.sql
--[srv_mlkpythdap01_DB]



-- sqlcmd -S localhost -U [srv_mlkpythdap01_DB] -P 1F0rg0t1 -i  C8_MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS.sql
--[srv_mlkpythdap01_DB]






/*    MESSAGE SUPPORTED BY THIS SP
use uma_dwh
go


select * from  [MWH].[ETL_HISTORY] eh with(nolock)   where   [CALLING_PROC] = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS'


MLK-TEL-P-SQ02       MCS_LDS
MLK-TEL-P-SQ02       I3_IC_FLM
MLK-TEL-P-SQ01       I3_IC_40
MLK-SQL-P-sq03       i3Leads
MLK-INF-P-SQ02       LION
MLK-EDM-D-SQ02       UMA_DWH
MLK-EDM-D-SQ02       IMPORT
MLK-DWH-P-SQ02       FREEDOM
MLK-DWH-P-SQ02       CV_Prod


select * from  [MWH].[ETL_HISTORY]  where  [TARGET_SCHEMA_NAME] = 'BROWSER'

delete from [MWH].[ETL_HISTORY]  where  [TARGET_SCHEMA_NAME] = 'BROWSER'

update statistics [MWH].[ETL_HISTORY]

sql for REPORT average runtime per day

select top 100 [INSERT_DTTM], [RUN_TIME_SEC]
from [MWH].[ETL_HISTORY] eh with(nolock)



List of of procedures in the ETL_CONTROL_MANAGER view   'LIST_CONTROL_MANAGER_DETAILS'
SELECT * FROM MWH.ETL_CONTROL_MANAGER_view ORDER BY DATA_MART_NAME ASC, PRIORITY DESC

List of all admin console users      'LIST_ADMIN_CONSOLE_USERS'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER ORDER BY ID ASC

Get admin console user by ID             'LIST_ADMIN_CONSOLE_USER_BY_ID'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE ID = ?


Get admin console user by Email address         'LIST_ADMIN_CONSOLE_USER_BY_EMAIL'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE EmployeeEMAIL = ?

List of all error resolution records            'LIST_ERROR_RESOLUTIONS'
SELECT * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID ASC

Get error resolution record by ID        'LIST_ERROR_RESOLUTIONS_BY_ID'
SELECT * FROM MWH.ERROR_RESOLUTIONS WHERE ID = ?

Get last inserted error resolution record       'GET_LAST_ERROR_RESOLUTION'
SELECT TOP 1 * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID DESC







*****  ONE DAY TEST  *****
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORT_RUNS_BY_DAY' , '08-01-2018', '08-01-2018', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORTS_BY_DAY_AVG' , '08-01-2018', '08-01-2018', '' , '', '' , '', '' , '', '';


*****  NULL or EMPTY STRING TEST  *****
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORT_RUNS_BY_DAY' , '', '', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORTS_BY_DAY_AVG' , '', '', '' , '', '' , '', '' , '', '';

*****  7 day test  *****
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORT_RUNS_BY_DAY' , '07-01-2018', '07-07-2018', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_REPORTS_BY_DAY_AVG' , '07-01-2018', '07-07-2018', '' , '', '' , '', '' , '', '';


exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'INVALID_MESSAGE_TEST' , '07-01-2018', '07-07-2018', '' , '', '' , '', '' , '', '';






List of of procedures in the ETL_CONTROL_MANAGER view   'LIST_CONTROL_MANAGER_DETAILS'
SELECT * FROM MWH.ETL_CONTROL_MANAGER_view ORDER BY DATA_MART_NAME ASC, PRIORITY DESC



exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_CONTROL_MANAGER_DETAILS' , '', '', '' , '', '' , '', '' , '', '';


List of all admin console users      'LIST_ADMIN_CONSOLE_USERS'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER ORDER BY ID ASC
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_ADMIN_CONSOLE_USERS' , '', '', '' , '', '' , '', '' , '', '';



Get admin console user by ID             'LIST_ADMIN_CONSOLE_USER_BY_ID'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE ID = ?
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_ADMIN_CONSOLE_USER_BY_ID' , '1', '', '' , '', '' , '', '' , '', '';


Get admin console user by Email address         'LIST_ADMIN_CONSOLE_USER_BY_EMAIL'
SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE EmployeeEMAIL = ?
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_ADMIN_CONSOLE_USER_BY_EMAIL' , 'cmatula@ultimatemedical.edu', '', '' , '', '' , '', '' , '', '';


List of all error resolution records            'LIST_ERROR_RESOLUTIONS'
SELECT * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID ASC
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_ERROR_RESOLUTIONS' , '', '', '' , '', '' , '', '' , '', '';


Get error resolution record by ID        'LIST_ERROR_RESOLUTIONS_BY_ID'
SELECT * FROM MWH.ERROR_RESOLUTIONS WHERE ID = ?
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_ERROR_RESOLUTIONS_BY_ID' , '1', '', '' , '', '' , '', '' , '', '';



Get last inserted error resolution record       'LIST_LAST_ERROR_RESOLUTION'
SELECT TOP 1 * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID DESC
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LIST_LAST_ERROR_RESOLUTION' , '', '', '' , '', '' , '', '' , '', '';


select top 10000 * from [MWH].[ETL_HISTORY] with(nolock)     order by ID desc


select * from [MWH].[ETL_TryCatchError] with(nolock)     where [ETLProcedureName] = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS' order by ID desc

delete from [MWH].[ETL_TryCatchError]      where [ETLProcedureName] = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS'






*/



USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS' and ss.name = 'MWH')
       DROP PROCEDURE MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS
GO


CREATE PROCEDURE [MWH].[UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS]
  @message VARCHAR(256),   --  valid meaages :   LOAD_ETL_HISORY
  @VARCHAR_01 varchar(256),
  @VARCHAR_02 varchar(256),
  @VARCHAR_03 varchar(256),
  @VARCHAR_04 varchar(256),
  @VARCHAR_05 varchar(256),
  @VARCHAR_06 varchar(256),
  @VARCHAR_07 varchar(256),
  @VARCHAR_08 varchar(256),
  @VARCHAR_09 varchar(256)
    WITH EXECUTE as OWNER
 AS


   SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;



--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'DISPLAY_STATISTICS_DATA_BY_DATE' ,  '2018-09-25', 'MWH', '' , '', '' , '', '' , '', '';

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_STATISTICS_Search_Chart' ,'2018-09-25',  '3', 'MWH_DIM', '' , '', '' , '', '' , '';

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'REPORT_SELECT_BY_DATE' ,'2018-09-19',  '', '', '' , '', '' , '', '' , '';


/*
DECLARE               @message VARCHAR(256)  = 'DISPLAY_STATISTICS_DATA_BY_DATE';
DECLARE               @VARCHAR_01 varchar(256) = '2018-09-25';
DECLARE               @VARCHAR_02 varchar(256) = 'MWHcc';
DECLARE               @VARCHAR_03 varchar(256) = 'MWH';
DECLARE               @VARCHAR_04 varchar(256) = '';
DECLARE               @VARCHAR_05 varchar(256) = '';
DECLARE               @VARCHAR_06 varchar(256) = '';
DECLARE               @VARCHAR_07 varchar(256) = '';
DECLARE               @VARCHAR_08 varchar(256) = '';
DECLARE               @VARCHAR_09 varchar(256) = '';
*/


--exec sp_who2


DECLARE              @My_SP_NAME varchar(50);
SET @My_SP_NAME =  OBJECT_SCHEMA_NAME (@@PROCID) +'.'+ OBJECT_NAME(@@PROCID);

--  The Source Names are either LOCAL or REMOTE,  when REMOTE, manually enter the nameed automatically
--  Using the FUNCTION below for LOCAL, and when we move to NEW server, these will be updat
DECLARE              @Source_Server_Name varchar(60);
SET @Source_Server_Name = @@SERVERNAME;

DECLARE              @Source_DB_Name varchar(40);
SET  @Source_DB_Name = DB_NAME();

DECLARE              @Source_Schema_Name varchar(40);
SET  @Source_Schema_Name  =  'MWH';

DECLARE              @Source_Table_Name varchar(60);
SET  @Source_Table_Name  =  'ETL_HISTORY ETC...';
---------------------------------------------------------------------------------------------------------

--  This is defaulted to 'BROWSER'  or  'POWERBI', depending on the target ( Caller )
--  ETL procedure will be manually entered
DECLARE              @Target_Schema_Name varchar(40);
SET    @Target_Schema_Name = 'BROWSER';

DECLARE              @Target_Table_Name varchar(60);
SET   @Target_Table_Name  =  @message;



DECLARE             @ERR                 INTEGER  = 0 ;
DECLARE             @ErrorSeverity       INTEGER;
DECLARE             @ErrorState          INTEGER;
DECLARE             @ErrorProcedure      nvarchar(128) ;
DECLARE             @ErrorLine           INTEGER;
DECLARE             @ErrorMessage nvarchar(4000);
DECLARE             @TryCatchError_ID  INTEGER = 0;
DECLARE             @MyInputError nvarchar(1000) = '';

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

DECLARE             @USER_EMAIL                varchar(80) = '';
DECLARE             @USER_PW                   varchar(256) = '';
 DECLARE             @NEW_PASSWORD        varchar(256) = '';
 DECLARE             @USER_UPDATE_PHONE   varchar(80) = '';
DECLARE             @USER_UPDATE_CELLPHONE     varchar(80) = '';

DECLARE             @REPORT_NAME               varchar(80) ;
DECLARE             @REPORT_FROM_NUM           INTEGER;
DECLARE             @REPORT_TO_NUM                    INTEGER;
DECLARE             @FROM_TO_RANGE                    INTEGER;

DECLARE             @START_DTTM                              DATETIME;
DECLARE             @END_DTTM                                DATETIME;

DECLARE             @User_ID1                                INTEGER;
DECLARE             @PK_ID                                   INTEGER;
DECLARE             @User_ID3                                INTEGER;

DECLARE             @END_DTTMTIME                     DATETIME2;
DECLARE             @START_DTTMTIME                          DATETIME2;
SET @START_DTTMTIME = sysdatetime();

DECLARE             @rtn_Insert_Cnt                          INTEGER = -1;
 DECLARE             @rtn_Update_Cnt                          INTEGER = -1;
DECLARE             @rtn_Delete_Cnt                          INTEGER = -1;

DECLARE             @LOAD_HIST_PKID                          INTEGER;
DECLARE             @MessageValid                     INTEGER = 0;
 DECLARE             @LOG_HISTORY                      INTEGER = 0;

DECLARE             @MyStoredProcedureName            varchar(80) ;
DECLARE             @myLastDate                              DATE;
DECLARE             @myDateWindowMonths               INTEGER;
DECLARE             @VALID_INPUT_DATA                 INTEGER = 1;
DECLARE             @ROW_CNT                                 integer;
DECLARE             @myENDDate                               DATETIME;
DECLARE             @mySTARTDate                      DATE;
DECLARE             @CurrentDate                      DATE   =  getdate();
DECLARE             @MIDPOINT_DATE                           DATE;
DECLARE             @MyInputDate                      DATE;
DECLARE             @MyInputDateTIME                  DATETIME;

DECLARE             @LAST_DATE                               DATE;
DECLARE             @DaysSinceLastStats               INTEGER;



IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'START', @START_DTTMTIME, 0 ,@Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME, '', '', 0 , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
END;


IF  @message = 'LIST_REPORT_RUNS_BY_DAY'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY

              IF( @VARCHAR_01 IS  NOT NULL    AND   @VARCHAR_02 IS  NOT NULL  AND  LEN(@VARCHAR_01) >= 10   AND  LEN(@VARCHAR_02) >= 10)  BEGIN
                     SET           @START_DTTM   =     cast( @VARCHAR_01 as datetime);
                     SET           @END_DTTM     =     cast( @VARCHAR_02 as datetime);  END
              ELSE IF( @VARCHAR_01 IS  NOT NULL    AND   @VARCHAR_02 IS  NULL  AND  LEN(@VARCHAR_01) >= 10   )  BEGIN
                     SET           @START_DTTM   =     cast( @VARCHAR_01 as date);
                     SET           @END_DTTM     =     dateadd(DAY, 1, cast( @START_DTTM as datetime));
              END else BEGIN
                     SELECT @END_DTTM = MAX(START_DTTM)  from [MWH].[ETL_HISTORY] with(nolock);
                     IF(@END_DTTM is NOT null) begin
                           SET           @START_DTTM   =     DATEADD(day, -30,  @END_DTTM);
                     END
              END


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

              select cast( [START_DTTM] as DATE) REPORT_DATE,  sum(RUN_TIME_SEC) TOTAL_SECONDS, count(*) TOTAL_REPORTS,  cast( sum(RUN_TIME_SEC) * 1.0 / count(*) as numeric ( 10 , 2)) AVG_REPORT_RUNTIME_SEC
              from [MWH].[ETL_HISTORY] with(nolock)
              where TARGET_SCHEMA_NAME  = 'POWERBI'
              and [START_DTTM] between @START_DTTM  and   DATEADD(DAY,1, @END_DTTM)
              group by  cast( [START_DTTM] as DATE)
              order by  cast( [START_DTTM] as DATE) asc;

              set @rtn_Insert_Cnt = @@ROWCOUNT;
       END;
END;

IF  @message = 'LIST_REPORTS_BY_DAY_AVG'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY

              IF( @VARCHAR_01 IS  NOT NULL    AND   @VARCHAR_02 IS  NOT NULL  AND  LEN(@VARCHAR_01) >= 10   AND  LEN(@VARCHAR_02) >= 10)  BEGIN
                     SET           @START_DTTM   =     cast( @VARCHAR_01 as datetime);
                     SET           @END_DTTM     =     cast( @VARCHAR_02 as datetime);  END
              ELSE IF( @VARCHAR_01 IS  NOT NULL    AND   @VARCHAR_02 IS  NULL  AND  LEN(@VARCHAR_01) >= 10   )  BEGIN
                     SET           @START_DTTM   =     cast( @VARCHAR_01 as date);
                     SET           @END_DTTM     =     dateadd(DAY, 1, cast( @START_DTTM as datetime));
              END else BEGIN
                     SELECT @END_DTTM = MAX(START_DTTM)  from [MWH].[ETL_HISTORY] with(nolock);
                     IF(@END_DTTM is NOT null) begin
                           SET           @START_DTTM   =     DATEADD(day, -30,  @END_DTTM);
                     END
              END


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


              select cast( [START_DTTM] as DATE) REPORT_DATE, [CALLING_PROC] REPORT, sum(RUN_TIME_SEC) TOTAL_SECONDS, count(*) TOTAL_REPORTS,  cast( sum(RUN_TIME_SEC) * 1.0 / count(*) as numeric ( 10 , 2)) AVG_REPORT_RUNTIME_SEC
              from [MWH].[ETL_HISTORY] with(nolock)
              where TARGET_SCHEMA_NAME  = 'POWERBI'
              and [START_DTTM] between @START_DTTM  and  DATEADD(DAY,1, @END_DTTM)
              group by  cast( [START_DTTM] as DATE), [CALLING_PROC]
              order by  cast( [START_DTTM] as DATE) asc, [CALLING_PROC] asc;

              set @rtn_Insert_Cnt = @@ROWCOUNT;
       END;
END;



IF  @message = 'LIST_CONTROL_MANAGER_DETAILS'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY

              select
              cm.[ID]
              ,upper(cm.[PROCEDURE_NAME]) as 'PROCEDURE_NAME'
              ,upper(cm.[DATA_MART_NAME])  as 'DATA_MART_NAME'
              ,cm.[PRIORITY]
              , max( eh.SOURCE_SERVER_NAME) as SOURCE_SERVER_NAME
              , max(eh.SOURCE_DB_NAME) as  SOURCE_DB_NAME
              , max( eh.SOURCE_TABLE_NAME)  as  SOURCE_TABLE_NAME
              , max( eh.TARGET_TABLE_NAME)  as  TARGET_TABLE_NAME
              , max( eh.SOURCE_SCHEMA_NAME) as SOURCE_SCHEMA_NAME
              , max( eh.TARGET_SCHEMA_NAME)  as  TARGET_SCHEMA_NAME

              FROM MWH.ETL_CONTROL_MANAGER  cm  with(nolock)
              join [MWH].[ETL_HISTORY]  eh with(nolock)   on (cm.PROCEDURE_NAME = eh.CALLING_PROC )
              where eh.INSERT_DTTM > dateadd(day, -30, getdate())
              and cm.[PROCEDURE_NAME] not like '%CHECK_MERGE%'
              and cm.ACTIVE = 1
              group by
               cm.[ID],
              upper(cm.[PROCEDURE_NAME]),
              upper(cm.[DATA_MART_NAME])
              ,cm.[PRIORITY];

              set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;




IF  @message = 'LIST_ADMIN_CONSOLE_USERS'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY

                     SELECT [ID]
                     ,[INSERT_DTTM]
                     ,[UPDATE_DTTM]
                     ,[LST_MOD_USER]
                     ,[MSTR_LOAD_ID]
                     ,[D_STAFF_ID]
                     ,[EmployeeLastName]
                     ,[EmployeeFirstName]
                     ,[EmployeeEMAIL]
                     ,[EmployeePHONE]
                     ,[EmployeeCELLPHONE]
                     ,[EmployeePassword]
                     ,[RECEIVES_ALERTS]
                     FROM MWH_DIM.D_ADMIN_CONSOLE_USER   with(nolock)
                     ORDER BY ID ASC

              set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;




IF  @message = 'LIST_ADMIN_CONSOLE_USER_BY_ID'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY
                     SET  @User_ID1 = CAST(  @VARCHAR_01 as INTEGER);

                     SELECT [ID]
                     ,[INSERT_DTTM]
                     ,[UPDATE_DTTM]
                     ,[LST_MOD_USER]
                     ,[MSTR_LOAD_ID]
                     ,[D_STAFF_ID]
                     ,[EmployeeLastName]
                     ,[EmployeeFirstName]
                     ,[EmployeeEMAIL]
                     ,[EmployeePHONE]
                     ,[EmployeeCELLPHONE]
                     ,[EmployeePassword]
                     ,[RECEIVES_ALERTS]
                     FROM MWH_DIM.D_ADMIN_CONSOLE_USER   with(nolock)
                     where ID = @User_ID1
                     ORDER BY ID ASC

                     set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;




IF  @message = 'LIST_ADMIN_CONSOLE_USER_BY_EMAIL'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY

                     IF(@VARCHAR_01  like '%ULTIMATEMEDICAL.EDU%') begin
                           SELECT [ID]
                           ,[INSERT_DTTM]
                           ,[UPDATE_DTTM]
                           ,[LST_MOD_USER]
                           ,[MSTR_LOAD_ID]
                           ,[D_STAFF_ID]
                           ,[EmployeeLastName]
                           ,[EmployeeFirstName]
                           ,[EmployeeEMAIL]
                           ,[EmployeePHONE]
                           ,[EmployeeCELLPHONE]
                           ,[EmployeePassword]
                           ,[RECEIVES_ALERTS]
                           FROM MWH_DIM.D_ADMIN_CONSOLE_USER   with(nolock)
                           where EmployeeEMAIL =  @VARCHAR_01;
                           set @rtn_Insert_Cnt = @@ROWCOUNT;
                     END ELSE BEGIN

                           SET     @ERR = -1;
                           SET     @ErrorSeverity = -1;
                           SET     @ErrorState = 0;
                           SET     @ErrorProcedure =  'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS';
                           SET     @ErrorLine = 0
                           SET     @ErrorMessage = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS invalid email address :  '  +  @message;

                           EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
                           PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
                     END;


       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;



IF  @message = 'LIST_ERROR_RESOLUTIONS'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY
                     SELECT
                           [ID],
                           [INSERT_DTTM],
                           [UPDATE_DTTM],
                           [LST_MOD_USER],
                           [ACTIVE_FLAG],
                           [DESCRIPTION],
                           [FILE_PATH_FILENAME]
                     FROM MWH.ERROR_RESOLUTIONS   with(nolock)
                     ORDER BY ID DESC

                     set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;


IF  @message = 'LIST_ERROR_RESOLUTIONS_BY_ID'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY
                     SET  @PK_ID = CAST(  @VARCHAR_01 as INTEGER);

                     SELECT
                           [ID],
                           [INSERT_DTTM],
                           [UPDATE_DTTM],
                           [LST_MOD_USER],
                           [ACTIVE_FLAG],
                           [DESCRIPTION],
                           [FILE_PATH_FILENAME]
                     FROM MWH.ERROR_RESOLUTIONS   with(nolock)
                     WHERE  ID = @PK_ID;

                     set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;

IF  @message = 'LIST_LAST_ERROR_RESOLUTION'
BEGIN
       SET @MessageValid = 1;
       BEGIN TRY
                     SET  @PK_ID = CAST(  @VARCHAR_01 as INTEGER);

                     SELECT TOP 1
                           [ID],
                           [INSERT_DTTM],
                           [UPDATE_DTTM],
                           [LST_MOD_USER],
                           [ACTIVE_FLAG],
                           [DESCRIPTION],
                           [FILE_PATH_FILENAME]
                     FROM MWH.ERROR_RESOLUTIONS   with(nolock)
                     ORDER BY ID DESC

                     set @rtn_Insert_Cnt = @@ROWCOUNT;
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;
END;




IF  @message = 'LOAD_ETL_SEARCH_CHART'  or  @message = 'LOAD_SEARCH_CHART'
--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_SEARCH_CHART' ,'MWH_FACT.MERGE_F_STUDENT_LEAD',  '', '3', '' , '', '' , '', '' , '';

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_SEARCH_CHART' ,'MWH.MERGE_S_MCS_LDS_CAMPAIGN_AFTERHOURS',  '2018-09-10', '6', '' , '', '' , '', '' , '';

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_SEARCH_CHART' ,'MWH_FACT.MERGE_F_STUDENT_LEAD',  '2018-09-01', '12', '' , '', '' , '', '' , '';


BEGIN
       SET @MessageValid = 1;



       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;

                     SET  @MyStoredProcedureName = @VARCHAR_01 ;
                     SELECT @ROW_CNT =  count(*) from [MWH].[ETL_CONTROL_MANAGER] with(nolock) where [PROCEDURE_NAME] = @MyStoredProcedureName;
                     IF(@ROW_CNT = 0) begin
                           SET    @VALID_INPUT_DATA    = 0;
                     end;


                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_02) < 8 ) begin
                           SET @MyInputDate = getdate();
                       end else begin
                           SET  @MyInputDate = CAST(  @VARCHAR_02 as DATE);  --  DATE IN
                       end;

                       IF (len(@VARCHAR_03) != 0 ) begin
                           SET  @myDateWindowMonths =  CAST(  @VARCHAR_03 as INTEGER); --  # of months back in time, defaults to 3 with a min of 1 and a max of 12
                       end else begin
                         SET  @myDateWindowMonths = 3;
                       end;

                       IF(@myDateWindowMonths not between 1 and 12) begin
                           SET    @myDateWindowMonths  = 3;
                       END;
                     end;

                     IF(@VALID_INPUT_DATA = 1 ) begin
                           SET @myENDDate =  dateadd(day,1,@MyInputDate);

                           SET @mySTARTDate = DATEADD( MONTH,  -1 * @myDateWindowMonths, @myENDDate)
                           declare @CalcMid     integer = datediff(day, @mySTARTDate, @myENDDate) ;

                           SET @MIDPOINT_DATE = dateadd(DAY, datediff(day, @mySTARTDate, @myENDDate) / 2  ,  @mySTARTDate);

                           IF(datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @myENDDate, @CurrentDate))   begin
                                  SET @MIDPOINT_DATE = @MyInputDate;
                                  SET @myENDDate =   dateadd(DAY, @myDateWindowMonths * 15 , @MIDPOINT_DATE);
                                  SET @myENDDate =   dateadd(DAY, 1  , @myENDDate);
                                  SET @mySTARTDate = dateadd(DAY, @myDateWindowMonths * -15 , @MIDPOINT_DATE);
                         end else if (datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @MIDPOINT_DATE, @CurrentDate)) begin


                                  SET @myENDDate =   dateadd(DAY, 1  , @CurrentDate);
                                  SET @mySTARTDate = dateadd(month, -1 * @myDateWindowMonths, @CurrentDate);
                           end;
                     end;





       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

              SELECT
                     cast([START_DTTM] as date)  DATE,
                  count(eh.ID) DAY_COUNT,
                  sum([RUN_TIME_SEC]) TOTAL_RUNTIME,
                  sum(coalesce([INSERT_CNT],0)) TOTAL_INSERTS,
                  sum(coalesce([UPDATE_CNT],0)) TOTAL_UPDATES,
                  case when  count(eh.ID) > 0   then  cast( sum([RUN_TIME_SEC]) * 1.0 / count(eh.ID) * 1.0 as numeric(15,1)) else  cast( 0 as numeric(15,1))   end  AVG_RUNTIME_SEC,
                  case when sum([RUN_TIME_SEC]) > 0 then   cast( (sum([INSERT_CNT] + [UPDATE_CNT]) * 1.0) / (sum([RUN_TIME_SEC]) * 1.0) as numeric(15,1))  else  cast( 0 as numeric(15,1)) end AVG_ROW_P_SEC,
                  case when count(eh.ID) > 0 then cast( (sum([INSERT_CNT] + [UPDATE_CNT]) * 1.0 / count(eh.ID) * 1.0)  as numeric(15,1)) else cast( 0 as numeric(15,1)) end AVG_ROW_P_CYCLE,
                  case when count(eh.ID) > 0 then cast(sum(datediff(second, SP_PARM_1, SP_PARM_2)) / count(eh.ID)  as numeric(15,1))  else  cast(0  as numeric(15,1))   end  ETL_AVG_RT
              from [MWH].[ETL_HISTORY] eh with(nolock)
              where [CALLING_PROC] = @MyStoredProcedureName
       --     and [START_DTTM] between  dateadd(month, @myMonthsBack, @myLastDate)  and @myLastDate
              and [START_DTTM] between @mySTARTDate  and  dateadd(DAY, 1  , @myENDDate)
              and RUN_TIME_SEC is not null
              group by cast([START_DTTM] as date)
              order by cast([START_DTTM] as date) asc
              OPTION(RECOMPILE);

              --set @rtn_Insert_Cnt = @@ROWCOUNT;

END;





IF  @message = 'LOAD_REPORT_SEARCH_CHART'

--   select * from   MWH.REPORT_CONTROL_MANAGER with(nolock) where [PROCEDURE_NAME] =


--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_REPORT_SEARCH_CHART' ,'',  '2018-09-26', '6', '' , '', '' , '', '' , '';

/*
report_name: MWH.MCS_CALL_TEAM_REP_SUMMARY_SP
date: 2018-09-19
months: 6
*/

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_REPORT_SEARCH_CHART' ,'MWH.MERGE_S_MCS_LDS_CAMPAIGN_AFTERHOURS',  '2018-09-10', '6', '' , '', '' , '', '' , '';

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_REPORT_SEARCH_CHART' ,'MWH_FACT.MERGE_F_STUDENT_LEAD',  '2018-09-01', '12', '' , '', '' , '', '' , '';

--  select [CALLING_PROC], case when  count(eh.ID) > 0   then  cast( sum([RUN_TIME_SEC]) * 1.0 / count(eh.ID) * 1.0 as numeric(15,1)) else  cast( 0 as numeric(15,1))   end  AVG_RT  , count(*) RUNS from [MWH].[ETL_HISTORY] eh with(nolock) where [TARGET_SCHEMA_NAME] in  ( 'POWERBI' , 'SSRS')  group by CALLING_PROC

BEGIN
       SET @MessageValid = 1;



       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;

                     SET  @MyStoredProcedureName = @VARCHAR_01 ;
                     SELECT @ROW_CNT =  count(*) from MWH.REPORT_CONTROL_MANAGER with(nolock) where [PROCEDURE_NAME] = @MyStoredProcedureName;
                     IF(@ROW_CNT = 0) begin
                           SET    @VALID_INPUT_DATA    = 0;
                     end;


                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_02) < 8 ) begin
                           SET @MyInputDate = getdate();
                       end else begin
                           SET  @MyInputDate = CAST(  @VARCHAR_02 as DATE);  --  DATE IN
                       end;

                       IF (len(@VARCHAR_03) != 0 ) begin
                           SET  @myDateWindowMonths =  CAST(  @VARCHAR_03 as INTEGER); --  # of months back in time, defaults to 3 with a min of 1 and a max of 12
                       end else begin
                         SET  @myDateWindowMonths = 3;
                       end;

                       IF(@myDateWindowMonths not between 1 and 12) begin
                           SET    @myDateWindowMonths  = 3;
                       END;
                     end;

                     IF(@VALID_INPUT_DATA = 1 ) begin
                           SET @myENDDate =  dateadd(day,1,@MyInputDate);

                           SET @mySTARTDate = DATEADD( MONTH,  -1 * @myDateWindowMonths, @myENDDate);

                           SET @MIDPOINT_DATE = dateadd(DAY, datediff(day, @mySTARTDate, @myENDDate) / 2  ,  @mySTARTDate);

                           IF(datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @myENDDate, @CurrentDate))   begin
                                  SET @MIDPOINT_DATE = @MyInputDate;
                                  SET @myENDDate =   dateadd(DAY, @myDateWindowMonths * 15 , @MIDPOINT_DATE);
                                  SET @myENDDate =   dateadd(DAY, 1  , @myENDDate);
                                  SET @mySTARTDate = dateadd(DAY, @myDateWindowMonths * -15 , @MIDPOINT_DATE);
                         end else if (datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @MIDPOINT_DATE, @CurrentDate)) begin


                                  SET @myENDDate =   dateadd(DAY, 1  , @CurrentDate);
                                  SET @mySTARTDate = dateadd(month, -1 * @myDateWindowMonths, @CurrentDate);
                           end;
                     end;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

              SELECT
                     cast([START_DTTM] as date)  DATE,
                  count(eh.ID) DAY_COUNT,
                  sum([RUN_TIME_SEC]) TOTAL_RUNTIME,
                  sum(coalesce([INSERT_CNT],0)) TOTAL_INSERTS,

                  case when  count(eh.ID) > 0   then  cast( sum([RUN_TIME_SEC]) * 1.0 / count(eh.ID) * 1.0 as numeric(15,1)) else  cast( 0 as numeric(15,1))   end  AVG_RUNTIME_SEC,
                  case when sum([RUN_TIME_SEC]) > 0 then   cast( (sum([INSERT_CNT]) * 1.0) / (sum([RUN_TIME_SEC]) * 1.0) as numeric(15,1))  else  cast( 0 as numeric(15,1)) end AVG_ROW_P_SEC,
                  case when count(eh.ID) > 0 then cast( (sum([INSERT_CNT] ) * 1.0 / count(eh.ID) * 1.0)  as numeric(15,1)) else cast( 0 as numeric(15,1)) end AVG_ROW_P_CYCLE,
                  case when count(eh.ID) > 0 then cast(sum(datediff(second, SP_PARM_1, SP_PARM_2)) / count(eh.ID)  as numeric(15,1))  else  cast(0  as numeric(15,1))   end  ETL_AVG_RT
              from [MWH].[ETL_HISTORY] eh with(nolock)
              where [CALLING_PROC] = @MyStoredProcedureName
              and [START_DTTM] between @mySTARTDate  and  @myENDDate
              and RUN_TIME_SEC is not null
              group by cast([START_DTTM] as date)
              order by cast([START_DTTM] as date) asc
              OPTION(RECOMPILE);

              --set @rtn_Insert_Cnt = @@ROWCOUNT;
END;



IF  @message = 'DISPLAY_TryCatch_Daily_Errors'

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'DISPLAY_TryCatch_Daily_Errors' ,  '2018-06-22', '', '' , '', '' , '', '' , '', '';

BEGIN
       SET @MessageValid = 1;

       BEGIN TRY

              IF (len(@VARCHAR_01) < 8 ) begin
                     SET @MyInputDate = getdate();
              end else begin
                     SET  @MyInputDate = CAST(  @VARCHAR_01 as DATE);  --  DATE IN
              end;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
              SET    @MessageValid = 0;
       END CATCH;

         IF(@MessageValid = 1 ) begin
              SELECT
                     tc.ID as 'ID',
                     tc.[INSERT_DTTM]  as 'ERROR_DATE',
                  tc.[LST_MOD_USER] as 'ERROR_USER',
                     tc.[ERR] as 'ERROR_NUMBER',
                     tc.[ErrorSeverity] as 'ERROR_SEVERITY',
                     tc.[ErrorState] as 'ERROR_STATE',
                     tc.[ErrorProcedure] as 'ERROR_PROCEDURE',
                     tc.[ErrorLine] as 'ERROR_LINE',
                     tc.[ErrorMessage] as 'ERROR_MESSAGE',
                     tc.[ETLProcedureName] as 'PROCEDURE_LOGGING_ERROR',
                     eh.RUN_TIME_SEC  as 'PROCEDURE_RUNTIME',
                     eh.[engine_message] as 'ENGINE_MESSAGE',
                     eh.[EXEC_BY_CONTROL_ENGINE] as 'EXEC_BY_ETL_CONTROL_ENGINE'

              from  [MWH].[ETL_TryCatchError]  tc with(nolock)
              Left join [MWH].[ETL_HISTORY] eh with(nolock) on (eh.TryCatchError_ID = tc.ID)
              where tc.[INSERT_DTTM] between cast(@MyInputDate as datetime)  and  dateadd(hour, 23, dateadd(minute, 59, cast(@MyInputDate as datetime)))
              order by tc.[INSERT_DTTM] desc
              OPTION(RECOMPILE);
       END;
              --set @rtn_Insert_Cnt = @@ROWCOUNT;
END;


IF  @message = 'LOAD_TryCatch_Search_Chart'

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_TryCatch_Search_Chart' ,  '2018-06-14', '3', '' , '', '' , '', '' , '', '';

BEGIN
       SET @MessageValid = 1;



       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;


                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_01) < 8 ) begin
                           SET @MyInputDate = getdate();
                       end else begin
                           SET  @MyInputDate = CAST(  @VARCHAR_01 as DATE);  --  DATE IN
                       end;

                       IF (len(@VARCHAR_02) != 0 ) begin
                           SET  @myDateWindowMonths =  CAST(  @VARCHAR_02 as INTEGER); --  # of months back in time, defaults to 3 with a min of 1 and a max of 12
                       end else begin
                         SET  @myDateWindowMonths = 3;
                       end;

                       IF(@myDateWindowMonths not between 1 and 12) begin
                           SET    @myDateWindowMonths  = 3;
                       END;
                     end;

                     IF(@VALID_INPUT_DATA = 1 ) begin
                           SET @myENDDate =  dateadd(day,1,@MyInputDate);

                           SET @mySTARTDate = DATEADD( MONTH,  -1 * @myDateWindowMonths, @myENDDate);

                           SET @MIDPOINT_DATE = dateadd(DAY, datediff(day, @mySTARTDate, @myENDDate) / 2  ,  @mySTARTDate);

                           IF(datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @myENDDate, @CurrentDate))   begin
                                  SET @MIDPOINT_DATE = @MyInputDate;
                                  SET @myENDDate =   dateadd(DAY, @myDateWindowMonths * 15 , @MIDPOINT_DATE);
                                  SET @myENDDate =   dateadd(DAY, 1  , @myENDDate);
                                  SET @mySTARTDate = dateadd(DAY, @myDateWindowMonths * -15 , @MIDPOINT_DATE);
                         end else if (datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @MIDPOINT_DATE, @CurrentDate)) begin


                                  SET @myENDDate =   dateadd(DAY, 1  , @CurrentDate);
                                  SET @mySTARTDate = dateadd(month, -1 * @myDateWindowMonths, @CurrentDate);
                           end;
                     end;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

         IF(@VALID_INPUT_DATA = 1 ) begin
              SELECT
                     cast(tc.[INSERT_DTTM] as date)  DATE,
                  count(tc.ID) DAY_COUNT

              from  [MWH].[ETL_TryCatchError]  tc with(nolock)
              where tc.[INSERT_DTTM] between cast(@mySTARTDate as datetime)  and dateadd(hour, 23, dateadd(minute, 59, @myENDDate ))

              group by cast(tc.[INSERT_DTTM] as date)
              order by cast(tc.[INSERT_DTTM] as date) asc
              OPTION(RECOMPILE);
       END;
              --set @rtn_Insert_Cnt = @@ROWCOUNT;
END;







IF  @message = 'REPORT_SELECT_BY_DATE'
--  This is used to pupulate a pulldown list of the report page, so we can get a list of report SP run on that date, it sorts on longest running report to the fastest report on the date selected

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'REPORT_SELECT_BY_DATE' ,'2018-09-27',  '', '', '' , '', '' , '', '' , '';

--  SELECT   count(*) from MWH.REPORT_CONTROL_MANAGER with(nolock) where [PROCEDURE_NAME] = 'MWH.REP_COUNT_OUTBOUND_BY_DATE_SP';


--  select *  from MWH.REPORT_CONTROL_MANAGER with(nolock) where [PROCEDURE_NAME] = 'MWH.REP_COUNT_OUTBOUND_BY_DATE_SP';

--  select top 1000 *  from [MWH].[ETL_HISTORY] eh with(nolock) where [TARGET_SCHEMA_NAME] like '%POWER%'

--  select * from MWH.REPORT_CONTROL_MANAGER with(nolock)

BEGIN
       SET @MessageValid = 1;

       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;




                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_01) < 8 ) begin
                           SET @MyInputDateTIME = getdate();
                       end else begin
                           SET  @MyInputDateTIME = CAST(  @VARCHAR_01 as DATETIME);  --  DATE IN
                       end;

                       set @MyInputDateTIME = cast( cast(@MyInputDateTIME as date) as datetime);
                     end;


       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

              SELECT
                     cast([START_DTTM] as date)  DATE,
                  [CALLING_PROC] as CALLING_PROC,
                     [TARGET_TABLE_NAME] as REPORT_NAME,

                  case when  count(eh.ID) > 0   then  cast( sum([RUN_TIME_SEC]) * 1.0 / count(eh.ID) * 1.0 as numeric(15,1)) else  cast( 0 as numeric(15,1))   end  AVG_RUNTIME_SEC
              from [MWH].[ETL_HISTORY] eh with(nolock)
              where [START_DTTM] between @MyInputDateTIME  and  dateadd( minute, 59, dateadd(hour, 23, @MyInputDateTIME))
              and  [TARGET_SCHEMA_NAME] = 'POWERBI'
              and RUN_TIME_SEC is not null
              group by cast([START_DTTM] as date), [CALLING_PROC], [TARGET_TABLE_NAME]
              order by case when  count(eh.ID) > 0   then  cast( sum([RUN_TIME_SEC]) * 1.0 / count(eh.ID) * 1.0 as numeric(15,1)) else  cast( 0 as numeric(15,1))   end   desc
              OPTION(RECOMPILE);

END;


IF  @message = 'LOAD_STATISTICS_Search_Chart'
--  This is used to POPULATE the Srach Chart for STATISTICS,  ONE row per DATE,  with X months of data, via ARG 3

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'LOAD_STATISTICS_Search_Chart' ,'2018-09-25',  '3', 'MWH_DIM', '' , '', '' , '', '' , '';

BEGIN
       SET @MessageValid = 1;

       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;

                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_01) < 8 ) begin
                           SET @MyInputDate = getdate();
                       end else begin
                           SET  @MyInputDate = CAST(  @VARCHAR_01 as DATE);  --  DATE IN
                       end;

                       IF (len(@VARCHAR_02) != 0 ) begin
                           SET  @myDateWindowMonths =  CAST(  @VARCHAR_02 as INTEGER); --  # of months back in time, defaults to 3 with a min of 1 and a max of 12
                       end else begin
                         SET  @myDateWindowMonths = 3;
                       end;

                       IF(@myDateWindowMonths not between 1 and 12) begin
                           SET    @myDateWindowMonths  = 3;
                       END;
                     end;

                     IF(@VALID_INPUT_DATA = 1 ) begin
                           SET @myENDDate =  dateadd(day,1,@MyInputDate);

                           SET @mySTARTDate = DATEADD( MONTH,  -1 * @myDateWindowMonths, @myENDDate);

                           SET @MIDPOINT_DATE = dateadd(DAY, datediff(day, @mySTARTDate, @myENDDate) / 2  ,  @mySTARTDate);

                           IF(datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @myENDDate, @CurrentDate))   begin
                                  SET @MIDPOINT_DATE = @MyInputDate;
                                  SET @myENDDate =   dateadd(DAY, @myDateWindowMonths * 15 , @MIDPOINT_DATE);
                                  SET @myENDDate =   dateadd(DAY, 1  , @myENDDate);
                                  SET @mySTARTDate = dateadd(DAY, @myDateWindowMonths * -15 , @MIDPOINT_DATE);
                         end else if (datediff(day, @MIDPOINT_DATE , @myENDDate) < datediff(day, @MIDPOINT_DATE, @CurrentDate)) begin

                                  SET @myENDDate =   dateadd(DAY, 1  , @CurrentDate);
                                  SET @mySTARTDate = dateadd(month, -1 * @myDateWindowMonths, @CurrentDate);
                           end;
                     end;

                     IF (@VALID_INPUT_DATA = 1) begin
                           IF (len(@VARCHAR_03) >= 1 ) begin
                                  select @rtn_Insert_Cnt = count(*) from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
                                  where  [START_DTTM] between @mySTARTDate  and  @myENDDate
                                  and [TARGET_SCHEMA_NAME] = @VARCHAR_03
                                  option(recompile);

                                  if(@rtn_Insert_Cnt <= 0) begin
                                         SET @VALID_INPUT_DATA = 0;
                                  END
                           END
                     END
                     ELSE BEGIN
                                  SET @VALID_INPUT_DATA = 0;
                     END;

                     IF(@VALID_INPUT_DATA = 0) begin
                           SET  @MyInputDateTIME = CAST(  @VARCHAR_03 as DATETIME);
                           SET @MyInputError = 'Invalid Schema in Date Range ( ' + @VARCHAR_03  + ')';
                     end;

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

       IF (@VALID_INPUT_DATA = 1) begin

              select cast([START_DTTM] as date) as 'DATE',
              MIN([START_DTTM]) 'GROUP_START_TIME',
              MAX([END_DTTM]) as 'GROUP_END_TIME',
              MAX([STATUS]) as 'GROUP_STATUS',
              COUNT(*) as 'TABLE_CNT',
              SUM([RUN_TIME_MS] / 1000.0) as 'TOTAL_RUNTIME',
              cast( SUM([RUN_TIME_MS] / 1000.0)/ (COUNT(*) * 1.0) as DECIMAL(10,2)) 'AVG_RUNTIME'

              from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
              where  [START_DTTM] between @mySTARTDate  and  @myENDDate
              and [TARGET_SCHEMA_NAME] = @VARCHAR_03
              group by cast([START_DTTM] as date)
              option(recompile);

       END
;
END;





IF  @message = 'REPORT_RUN_STATISTICS_SELECT_BY_DATE'
--  This is used to pupulate a pulldown list of the report page, so we can get a list of report SP run on that date, it sorts on longest running report to the fastest report on the date selected

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'REPORT_RUN_STATISTICS_SELECT_BY_DATE' ,'2018-09-25',  '', '', '' , '', '' , '', '' , '';

--    use   RUN_DATE on the X axis, and AVG_RUNTIME on the Y axis


--  Please fix ‘REPORT_RUN_STATISTICS_SELECT_BY_DATE’
--  The code is checking VARCHAR_02  for a schema name but this is wrong because the call to ‘REPORT_RUN_STATISTICS_SELECT_BY_DATE’ should return a list of schemas for a particular date.




BEGIN
       SET @MessageValid = 1;

       BEGIN TRY
                     SET    @VALID_INPUT_DATA    = 1;

                     IF  ( @VALID_INPUT_DATA = 1 ) begin
                       IF (len(@VARCHAR_01) < 8 ) begin
                           SET @MyInputDateTIME = getdate();
                       end else begin
                           SET  @MyInputDateTIME = CAST(  @VARCHAR_01 as DATETIME);  --  DATE IN
                       end;

                       set @MyInputDateTIME = cast( cast(@MyInputDateTIME as date) as datetime);
                     end;

                     IF (@VALID_INPUT_DATA = 1) begin
                           IF (len(@VARCHAR_02) >= 1 ) begin
                                  SET @rtn_Insert_Cnt = 0;

                                  select @rtn_Insert_Cnt = coalesce(count(*),0) from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
                                  where  [START_DTTM] between @mySTARTDate  and  @myENDDate
                                  --and [TARGET_SCHEMA_NAME] = @VARCHAR_02
                                  option(recompile);

                                  if(@rtn_Insert_Cnt = 0) begin
                                         SET @VALID_INPUT_DATA = 0;
                                  END
                           END
                     END
                     ELSE BEGIN
                                  SET @VALID_INPUT_DATA = 0;
                     END;

                     IF(@VALID_INPUT_DATA = 0) begin
                           SET  @MyInputDateTIME = CAST(  @VARCHAR_02 as DATETIME);
                           SET @MyInputError = 'Invalid Schema in Date Range ( ' + @VARCHAR_02  + ')';
                     end;


       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() + ' input error - ' +@MyInputError ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

              select cast([START_DTTM] as date) as RUN_DATE,
              MIN([START_DTTM]) GROUP_START_TIME,
              MAX([END_DTTM]) as GROUP_END_TIME,
              MAX([STATUS]) as GROUP_STATUS,
              COUNT(*) as TABLE_CNT,
              SUM([RUN_TIME_MS] / 1000.0) as TOTAL_RUNTIME,
              sum(case when [TryCatchError_ID] > 1 then 1 else 0 end) ERR_CNT,
              cast( SUM([RUN_TIME_MS] / 1000.0)/ (COUNT(*) * 1.0) as DECIMAL(10,2)) AVG_RUNTIME,
              '[' +[TARGET_SERVER_NAME]+'].['+[TARGET_DB_NAME]+'].['+[TARGET_SCHEMA_NAME]+']' as GROUP_SCHEMA,
              [TARGET_SCHEMA_NAME]
              from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
              where [START_DTTM] between @MyInputDateTIME  and  dateadd( minute, 59, dateadd(hour, 23, @MyInputDateTIME))
              --and  [TARGET_SCHEMA_NAME] = @VARCHAR_02
              group by cast([START_DTTM] as date),  '[' +[TARGET_SERVER_NAME]+'].['+[TARGET_DB_NAME]+'].['+[TARGET_SCHEMA_NAME]+']', [TARGET_SCHEMA_NAME]
              order by sum(case when [TryCatchError_ID] > 1 then 1 else 0 end) desc, cast( SUM([RUN_TIME_MS] * 1.0)/ (COUNT(*) * 1.0) as DECIMAL(10,2)) desc
              OPTION(RECOMPILE);
END;




IF  @message = 'DISPLAY_STATISTICS_DATA_BY_DATE'
--     'DISPLAY_STATISTICS_DATA_BY_DATE'  send  SCHEMA and DATE

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'DISPLAY_STATISTICS_DATA_BY_DATE' ,  '2018-09-25', '', '' , '', '' , '', '' , '', '';

BEGIN
       SET @MessageValid = 1;

       BEGIN TRY

              IF (len(@VARCHAR_01) < 8 ) begin
                     SET @MyInputDate = getdate();
              end else begin
                     SET  @MyInputDate = CAST(  @VARCHAR_01 as DATE);  --  DATE IN
              end;

              IF (@MessageValid = 1) begin
                     IF (len(@VARCHAR_02) >= 1 ) begin
                                  select @rtn_Insert_Cnt = count(*) from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] sm with(nolock)
                                  where  sm.[START_DTTM] between cast(@MyInputDate as datetime)  and  dateadd(hour, 23, dateadd(minute, 59, cast(@MyInputDate as datetime)))
                                  and [TARGET_SCHEMA_NAME] = @VARCHAR_02
                                  option(recompile);

                                  if(@rtn_Insert_Cnt <= 0) begin
                                         SET @MessageValid = 0;
                                  END
                     END
              END
              ELSE BEGIN
                     SET @MessageValid = 0;
              END;

              IF(@MessageValid = 0) begin
              -- force error, so we LOG IT
                     SET  @MyInputDate = CAST(  @VARCHAR_02 as DATE);
                     SET @MyInputError = 'Invalid Schema in Date Range ( ' + @VARCHAR_02  + ')';
              END

       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() + ' input error - ' +@MyInputError ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
              SET    @MessageValid = 0;
       END CATCH;

         IF(@MessageValid = 1 ) begin

              select sm.ID,
              cast(sm.[START_DTTM] as date) as 'START_DTTM',
              sm.[STATUS],
              [MWH].[ConvertMillisecondsToHHMMSS]( sm.[RUN_TIME_MS]) as RUN_TIME_HH_MM_SS_MS,
              '[' +sm.[TARGET_SERVER_NAME]+'].['+sm.[TARGET_DB_NAME]+'].['+sm.[TARGET_SCHEMA_NAME]+']'  as SCHEMA_FULL,
              '[' +sm.[TARGET_SERVER_NAME]+'].['+sm.[TARGET_DB_NAME]+'].['+sm.[TARGET_SCHEMA_NAME]+'].['+sm.[TARGET_TABLE_NAME]+']'  as TABLE_FULL,
               sm.[TARGET_SERVER_NAME] as SERVER,
               sm.[TARGET_DB_NAME] as 'DATABASE',
               sm.[TARGET_SCHEMA_NAME] as 'SCHEMA',
               sm.[TARGET_TABLE_NAME]  as 'TABLE',
               sm.[STATISTICS_METHOD],
               sm.[TryCatchError_ID],
              tc.[ERR]  ,
              tc.[ErrorSeverity]  ,
              tc.[ErrorState]  ,
              tc.[ErrorMessage],
              tc.[ErrorProcedure]

              from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] sm with(nolock)
              left join [MWH].[ETL_TryCatchError] tc with(nolock) on (tc.ID  =  sm.[TryCatchError_ID])
              where sm.[START_DTTM] between cast(@MyInputDate as datetime)  and  dateadd(hour, 23, dateadd(minute, 59, cast(@MyInputDate as datetime)))
              and    sm.[TARGET_SCHEMA_NAME] = @VARCHAR_02
              order by  sm.[TryCatchError_ID]  desc, sm.[TARGET_SERVER_NAME] asc, sm.[TARGET_DB_NAME] asc, sm.[TARGET_SCHEMA_NAME] asc, sm.[TARGET_TABLE_NAME] asc
              OPTION(RECOMPILE);

       END;
              --set @rtn_Insert_Cnt = @@ROWCOUNT;
END;


IF  @message = 'REPORT_RUN_STATISTICS_LAST_DATE'
--  This is used to pupulate a pulldown list of the report page, so we can get a list of report SP run on that date, it sorts on longest running report to the fastest report on the date selected

--   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS 'REPORT_RUN_STATISTICS_LAST_DATE' ,'',  '', '', '' , '', '' , '', '' , '';

--    use   RUN_DATE on the X axis, and AVG_RUNTIME on the Y axis

--  Please fix ‘REPORT_RUN_STATISTICS_SELECT_BY_DATE’
--  The code is checking VARCHAR_02  for a schema name but this is wrong because the call to ‘REPORT_RUN_STATISTICS_SELECT_BY_DATE’ should return a list of schemas for a particular date.




BEGIN
       SET @MessageValid = 1;

       BEGIN TRY
                     SET @DaysSinceLastStats = -1;


/*
                     select @LAST_DATE = max( stats_date (id,indid) )
                     from sys.sysindexes as a
                     inner join sys.tables T ON T.OBJECT_ID = a.ID
                     inner join sys.objects as b   on( a.id = b.object_id)
                     left join sys.schemas as c  on ( a.id = c.schema_id)
                     where b.type = 'U'
                     and stats_date (id,indid) is NOT null;
*/

       select  @LAST_DATE = max(END_DTTM)
       from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
       where TryCatchError_ID = 0;

       SET @DaysSinceLastStats = datediff(day, @LAST_DATE, getdate());


       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()  + ' message : '  + @message
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() + ' input error - ' +@MyInputError ;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

              select @LAST_DATE as 'LAST_DATE',
              case when @DaysSinceLastStats > 20 then -1 else 0 end as 'STALED_STATS'
END;



SET @END_DTTMTIME = sysdatetime();

IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'FINISHED', @END_DTTMTIME, @LOAD_HIST_PKID ,@Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name,  @My_SP_NAME, '', '', @rtn_Insert_Cnt , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
END;

IF( @MessageValid = 0) begin
           SET     @ERR = -1;
        SET     @ErrorSeverity = -1;
        SET     @ErrorState = 0;
        SET     @ErrorProcedure =  'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS';
        SET     @ErrorLine = 0
        SET     @ErrorMessage = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS invalid message :  '  +  @message;

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage

              --  select * from [MWH].[ETL_TryCatchError] with(nolock) where [ETLProcedureName] = 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS'
END

--return @TryCatchError_ID;
go



grant execute on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS to public;
go
