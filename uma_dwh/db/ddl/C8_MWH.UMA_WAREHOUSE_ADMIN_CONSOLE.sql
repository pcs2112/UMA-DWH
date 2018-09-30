-- C8_MWH.UMA_WAREHOUSE_ADMIN_CONSOLE.sql

-- sqlcmd -S localhost -U [srv_mlkpythdap01_DB] -P 1F0rg0t1 -i  C8_MWH.UMA_WAREHOUSE_ADMIN_CONSOLE.sql
--[srv_mlkpythdap01_DB]





/*    MESSAGE SUPPORTED BY THIS SP
USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE LOGIN 'test_login' WITH PASSWORD '1F0rg0t1'

ALTER USER [ULTIMATEMEDICAL\srv_mlkpythdap01_DB] with LOGIN = srv_mlkpythdap01_DB

grant connect to [ULTIMATEMEDICAL\srv_mlkpythdap01_DB]

grant exec on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE to [ULTIMATEMEDICAL\srv_mlkpythdap01_DB]

revoke exec on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE from public




  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'CHECK_ETL_STATUS' , '0', '9', '' , '', '' , '', '' , '', ''

  exec MWH.GET_CURRENT_ETL_CYCLE_STATUS 'I3_MCS'

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'RUN_CHECK' , 'S_LION.MERGE_MCS_DATA_POINT_SUMMARY', '1';


  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET_ERROR_TEXT' , '24991', '';


  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET_ETL_PROCEDURE_HISTORY' , 'S_I3.MERGE_MCS_INTERACTIVE_SUMMARY', '' , '', '' , '', '' , '', '', '';


  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOGIN' , 'cmatula@ultimatemedical.edu' , 'resetasap' , '8454718505', '8453372852';

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'PASSWORD RESET' , 'cmatula@ultimatemedical.edu' , 'resetasap' , 'newpass123';

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET POWER BI REPORT HISTORY'  , '' , '', '' , '', '' , '', '' , '', ''


    exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'GET POWER BI REPORT HISTORY'  , '2018-06-14 00:00' , '2018-06-30 23:00', '' , '', '' , '', '' , '', ''

    exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET POWER BI REPORT STATISTICS' , 'MWH.F_I3_CALLS_V3_SP', '' , '', '' , '', '' , '', '' , ''

       exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE     'GET POWER BI REPORT STATISTICS' , 'all', '' , '', '' , '', '' , '', '' , ''


       exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE     'LIST REPORT RUNS' , 'MWH.REPORT_MCS_STAGE_SUMMARY_HR_V2', '0', '100' , '', '' , '', '' , '', ''




   exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'CHECK_ETL_STATUS', '' ,''  ,'','','','','','',''




       exec   MWH.GET_CURRENT_ETL_CYCLE_STATUS  'I3_NON-MCS';

       exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LIST REPORT RUNS' , '' ,''  ,'','','','','','',''

       exec mwh.get_current_etl_cycle_status  'I3_MCS'


       grant execute on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE to public
       go


       revoke execute on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE from public
       go


SELECT * FROM MWH.ETL_CONTROL_MANAGER_view ORDER BY DATA_MART_NAME ASC, PRIORITY DESC


grant select on MWH.ETL_CONTROL_MANAGER_view to public
go



select * from  [MWH].[ETL_HISTORY] eh with(nolock)   where   [CALLING_PROC] = @My_SP_NAME


MLK-TEL-P-SQ02       MCS_LDS
MLK-TEL-P-SQ02       I3_IC_FLM
MLK-TEL-P-SQ01       I3_IC_40
MLK-SQL-P-sq03       i3Leads
MLK-INF-P-SQ02       LION
MLK-EDM-D-SQ02       UMA_DWH
MLK-EDM-D-SQ02       IMPORT
MLK-DWH-P-SQ02       FREEDOM
MLK-DWH-P-SQ02       CV_Prod


  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET TABLES AND STORED PROCEDURES' , 'MLK-TEL-P-SQ02' , 'I3_IC_FLM';

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET TABLES AND STORED PROCEDURES' , 'MLK-TEL-P-SQ02' , 'I3_IC_FLM';

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET TABLES AND STORED PROCEDURES' , 'MLK-TEL-P-SQ01' , 'I3_IC_40';

  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET TABLES AND STORED PROCEDURES' , 'MLK-TEL-P-SQ01' , 'I3_IC_40';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'SAVE ADMIN CONSOLE USER' , '' , '';


exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'SAVE ADMIN CONSOLE USER' , '',  'matula' , 'april' , 'amatula@ultimatemedical.edu', '8454718505', '8453372852', 'resetasap' ,''  ;

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET_ETL_PROCEDURE_HISTORY' , 'UMA_DWH', 'S_I3.MERGE_MCS_INTERACTIVE_SUMMARY', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'GET_ETL_PROCEDURE_HISTORY' , 'UMA_DWH', 'S_I3.MERGE_QUEUE_NAME_LOOKUP', '' , '', '' , '', '' , '', '';


   see the data saved from SP call
select top 100 * from [MWH].[ETL_HISTORY] with(nolock) where [CALLING_PROC]  =  @My_SP_NAME  order by ID desc

delete from  [MWH].[ETL_HISTORY]   where  [TARGET_SCHEMA_NAME] = 'BROWSER'  and ID >= 1858000

select count(*) from [MWH].[ETL_HISTORY] with(nolock)


UPDATE STATISTICS [MWH].[ETL_HISTORY]  with FULLSCAN


DBCC show_statistics ( "MWH.ETL_HISTORY", PK_ETL_HISTORY ) WITH STAT_HEADER

DBCC show_statistics ( "MWH.ETL_HISTORY", PK_ETL_HISTORY )  WITH HISTOGRAM

DBCC show_statistics ( "MWH.ETL_HISTORY", PK_ETL_HISTORY )  WITH DENSITY_VECTOR

DBCC show_statistics ( "MWH.ETL_HISTORY", PK_ETL_HISTORY )  WITH STATS_STREAM


exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOAD_ETL_HISTORY', '0' ,'9'  ,'','','','','','','';

NOTE : if the 4th argument is NULL, I use the current date, otherwise is use the VALID date as the starting point
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOAD_ETL_HISTORY', 0 ,9  ,'2018-04-14','','','','','','';


exec   MWH.GET_CURRENT_ETL_CYCLE_STATUS  'I3_NON-MCS';


exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'DISPLAY_CURRENT_STATUS' , '0', '0', '' , '', '' , '', '' , '', '';


exec   MWH.GET_CURRENT_ETL_CYCLE_STATUS  'I3_NON-MCS';

user does not exists
exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOGIN' , 'cmatula@ultimateme', '$pbkdf2-sha256$29000$03ovqX5FKUp77KoITbqx96ADofJRSK5XxA4VNQPzvaBeqQ', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOGIN' , 'cmatula@ultimatemedical.edu', '$pbkdf2-sha256$29000$03ovqX5FKUp77KoITbqx96ADo', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOGIN' , 'cmatula@ultimatemedical.edu', '$pbkdf2-sha256$29000$03ovqX5FKUp77KoITbqx96ADofJRSK5XxA4VNQPzvaBeqQ', '' , '', '' , '', '' , '', '';

exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE 'LOGIN' , 'cmatula@ultimatemedical.edu', '$pbkdf2-sha256$29000$03ovqX5FKUp77KoITbqx96ADofJRSK5XxA4VNQPzvaBeqQ', '' , '', '' , '', '' , '', '';


select * from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where [EmployeeEMAIL] = 'cmatula@ultimatemedical.edu'


*/






USE [UMA_DWH]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'UMA_WAREHOUSE_ADMIN_CONSOLE' and ss.name = 'MWH')
       DROP PROCEDURE MWH.UMA_WAREHOUSE_ADMIN_CONSOLE
GO


CREATE PROCEDURE [MWH].[UMA_WAREHOUSE_ADMIN_CONSOLE]
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

  with recompile  , EXECUTE as OWNER
 AS

  SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


-- 'GET_ETL_PROCEDURE_HISTORY' , 'UMA_DWH', 'MWH_FACT.MERGE_F_STUDENT_ENROLL_CALLS', '2018-08-12'

/*
DECLARE               @message VARCHAR(256)  = 'GET_ETL_PROCEDURE_HISTORY';
-- DECLARE             @message VARCHAR(256)  = 'LOAD_ETL_HISTORY';
--DECLARE             @message VARCHAR(256)  = 'DISPLAY_CURRENT_STATUS';
--DECLARE             @VARCHAR_01 varchar(256) = '0';
-- DECLARE            @VARCHAR_02 varchar(256) = '9';

-- DECLARE             @VARCHAR_02 varchar(256) = 'MWH_FACT.MERGE_F_STUDENT_ENROLL_CALLS';

DECLARE               @VARCHAR_01 varchar(256) = 'UMA_DWH';
DECLARE               @VARCHAR_02 varchar(256) = 'S_I3.MERGE_MCS_INTERACTIVE_SUMMARY';
DECLARE               @VARCHAR_03 varchar(256) = '2018-09-14';
DECLARE               @VARCHAR_04 varchar(256) = 'cmatula@ultimatemedical.edu';
DECLARE               @VARCHAR_05 varchar(256) = '8454718505';
DECLARE               @VARCHAR_06 varchar(256) = '8453372852';
DECLARE               @VARCHAR_07 varchar(256) = 'resetasap';
DECLARE               @VARCHAR_08 varchar(256) = '1f0rg0t';
DECLARE               @VARCHAR_09 varchar(256) = '';

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

DECLARE  @SP_RUN_CHECK_NAME   varchar(80) = '';
DECLARE  @PERIOD_POSITION        INTEGER = -1;

DECLARE  @ERROR_ID                      INTEGER = -1;
DECLARE             @SOURCE_SERVER             varchar(80) = '';
DECLARE             @SOURCE_DB                 varchar(80) = '';

DECLARE             @USER_EMAIL                varchar(80) = '';
DECLARE             @USER_PW                   varchar(256) = '';
 DECLARE             @NEW_PASSWORD        varchar(256) = '';
 DECLARE             @USER_UPDATE_PHONE   varchar(80) = '';
DECLARE             @USER_UPDATE_CELLPHONE     varchar(80) = '';

DECLARE             @REPORT_NAME               varchar(80) ;
DECLARE             @SP_NAME                          varchar(80) ;
 DECLARE             @REPORT_FROM_NUM           INTEGER;
DECLARE             @REPORT_TO_NUM                    INTEGER;
DECLARE             @FROM_TO_RANGE                    INTEGER;
DECLARE             @STARTING_DTTM                    DATETIME;

DECLARE             @VALID_LOGIN_ID            SMALLINT = 0;
DECLARE             @UserExists                INTEGER = -1;

DECLARE             @D_ADMIN_CONSOLE_USER_ID   INTEGER;
DECLARE             @EmployeeLastName                 [varchar](80);
DECLARE             @EmployeeFirstName                [varchar](80);
DECLARE             @EmployeeEMAIL                           [varchar](80);
DECLARE             @EmployeePHONE                           [varchar](80);
DECLARE             @EmployeeCELLPHONE                [varchar](80);
DECLARE             @EmployeePassword                 [varchar](256);
DECLARE             @exist_password                          [varchar](256);
DECLARE             @ReceiveAlerts                           integer;

DECLARE             @MAX_START_DTTM                          DATETIME;
DECLARE             @MAX_END_DTTM                     DATETIME;
DECLARE             @START_DTTM                              DATETIME;
DECLARE             @END_DTTM                                DATETIME;
 DECLARE             @REPORT_DATE                      DATETIME;
  DECLARE            @REPORT_DATE2                     DATE;

DECLARE             @User_ID1                                INTEGER;
DECLARE             @User_ID2                                INTEGER;
DECLARE             @User_ID3                                INTEGER;

DECLARE @END_DATETIME                                                     DATETIME2;
DECLARE @START_DATETIME                                             DATETIME2;
SET @START_DATETIME = sysdatetime();

DECLARE  @rtn_Insert_Cnt                                            INTEGER = -1;
 DECLARE  @rtn_Update_Cnt                                            INTEGER = -1;
DECLARE  @rtn_Delete_Cnt                                            INTEGER = -1;
DECLARE  @ADD_MINUTES_START                                         INTEGER;
DECLARE  @ADD_MINUTES_END                                           INTEGER;
DECLARE  @LOAD_HIST_PKID                                            INTEGER;
DECLARE  @DATE_START_HOUR                                           INTEGER =  6;


DECLARE             @My_SP_NAME varchar(50);
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







IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0 , @Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME, '', '', 0 , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
end;

IF  @message = 'LOAD_ETL_HISTORY'
BEGIN

       BEGIN TRY

              SET @REPORT_FROM_NUM                            = case when len(rtrim(@VARCHAR_01)) > 0 then cast (rtrim(@VARCHAR_01) as INTEGER) else 0 end;                      --  usually 0, but new when jumping to a NEW range can be 10, 20   etc.
              SET @REPORT_TO_NUM                                     = case when len(rtrim(@VARCHAR_02)) > 0 then cast (rtrim(@VARCHAR_02) as INTEGER) else 9 end;                      --  usually 0, but new

              SET @FROM_TO_RANGE                                     = @REPORT_TO_NUM - @REPORT_FROM_NUM ;  --  inclusive

              IF(len(rtrim(@VARCHAR_03))) > 0  begin
                     select @DATE_START_HOUR = datepart(hour, min([INSERT_DTTM])) from [MWH].[ETL_ENGINE_HISTORY] where [INSERT_DTTM] >=  cast(@VARCHAR_03 as datetime)   and DONE_DTTM is not NULL;
              end else begin
                     select @DATE_START_HOUR = datepart(hour, min([INSERT_DTTM])) from [MWH].[ETL_ENGINE_HISTORY] where [INSERT_DTTM] >=  getdate()   and DONE_DTTM is not NULL;
              end;

              SET @ADD_MINUTES_START = @DATE_START_HOUR * 60;  --  Assume start is at 6am
              SET @ADD_MINUTES_END = (@FROM_TO_RANGE * 15) + (@DATE_START_HOUR * 60);  --  The last time for the day is the number of 15 minute cycles, times 15 minutes after 6am,  this is only needed for picking a date in the past

              IF(len(rtrim(@VARCHAR_03))) > 0  begin
                     SET @MAX_START_DTTM =  dateadd(minute, @ADD_MINUTES_START, cast(@VARCHAR_03 as datetime));
                     SET @MAX_END_DTTM = dateadd(minute, @ADD_MINUTES_END, cast(@VARCHAR_03 as datetime));
              end else begin
                     SET @MAX_START_DTTM = dateadd(minute, -1 * @ADD_MINUTES_START, getdate());
                     SET @MAX_END_DTTM = getdate();
              end;


              with unique_dm ( DATA_MART_NAME ) as (
              select  DATA_MART_NAME
              from [MWH].[ETL_CONTROL_MANAGER]
              where [DATA_MART_NAME] not like '%TEST%'
              --and ACTIVE = 1
              group by [DATA_MART_NAME])
              select @DATAMARTS_IN_CYCLE = count(*) from unique_dm;

              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW;

              CREATE TABLE #CURRENT_ETL_WINDOW
              (
              WINDOW               CHAR(1),
              FROM_DTTM            DATETIME,
              TO_DTTM                    DATETIME
              );


              with CURRENT_WINDOW_PARTS ( WINDOW_DATE, HR, WINDOW, WINDOW_START_MIN_SEC , WINDOW_END_MIN_SEC) as (
              select
              cast([INSERT_DTTM] as date) as WINDOW_DATE,
              substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 1,2) as HR,
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then 'A' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then 'B' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then 'C' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then 'D' else (
              '-')  end )  end )  end )  end   as WINDOW,

              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '00:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '15:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '30:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '45:00' else (
              '-')  end )  end )  end )  end   as WINDOW_START_MIN_SEC,

              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '14:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '29:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '44:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '59:59' else (
              '-')  end )  end )  end )  end   as WINDOW_END_MIN_SEC
              from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock) where ID = (select MAX(ID) from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock) WHERE [INSERT_DTTM] <= @MAX_END_DTTM  and DONE_DTTM is not NULL ) ),

              CURRENT_WINDOW (WINDOW,  FROM_DTTM, TO_DTTM) as (
              select WINDOW, cast(cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_START_MIN_SEC as datetime),  dateadd(MILLISECOND,998 , cast( cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_END_MIN_SEC as datetime))  from CURRENT_WINDOW_PARTS
              )

              INSERT into #CURRENT_ETL_WINDOW (WINDOW,  FROM_DTTM, TO_DTTM)
              select WINDOW,  FROM_DTTM, TO_DTTM
              from CURRENT_WINDOW;

       --     SELECT  dateadd(minute, -15 * @FROM_TO_RANGE , FROM_DTTM), WINDOW,   FROM_DTTM, TO_DTTM from #CURRENT_ETL_WINDOW;


              IF (@START_DTTM is NULL ) begin
                     SELECT @START_DTTM = dateadd(minute, -15 * (@FROM_TO_RANGE -1) , FROM_DTTM) from #CURRENT_ETL_WINDOW;
              END;

              --  the FIRST cycle ID in this group
              SELECT @CYCLE_HISTORY_START_ID = min(ID) from [MWH].[ETL_ENGINE_HISTORY] where [INSERT_DTTM] >= @MAX_START_DTTM;

                           --  the CURRENT (or last) cycle ID in this group
              SELECT @CYCLE_HISTORY_END_ID = max(ID) from [MWH].[ETL_ENGINE_HISTORY] where [INSERT_DTTM] <= @MAX_END_DTTM;


              -- I need MIN_DTTM and MAX_DDTM to run against the ETL_HISORY table to then get  CYCLE#, GROUP # and all the unique ETL jobs in each CYCLE  from MIN_DTTM to MAX_DTTM

              SET @ETL_CYCLE_START = @REPORT_FROM_NUM;

              DECLARE              @WINDOW_GROUP_ID                         integer  = 0;
              DECLARE              @WINDOW_GROUP_START_DTTM          DATETIME  ;
              DECLARE              @WINDOW_GROUP_END_DTTM                   DATETIME  ;

              select        @WINDOW_GROUP_START_DTTM = FROM_DTTM  from #CURRENT_ETL_WINDOW;
              select        @WINDOW_GROUP_END_DTTM = TO_DTTM  from #CURRENT_ETL_WINDOW;


              IF OBJECT_ID('tempdb..#ALL_REPORT_ETL_WINDOWS') IS NOT NULL
              DROP TABLE #ALL_REPORT_ETL_WINDOWS;

              CREATE TABLE #ALL_REPORT_ETL_WINDOWS
              (
              WINDOW               INTEGER,
              FROM_DTTM            DATETIME,
              TO_DTTM                    DATETIME
              );


              WHILE (@WINDOW_GROUP_ID < @FROM_TO_RANGE) begin
                     INSERT into #ALL_REPORT_ETL_WINDOWS (WINDOW, FROM_DTTM, TO_DTTM) values (@WINDOW_GROUP_ID,  @WINDOW_GROUP_START_DTTM, @WINDOW_GROUP_END_DTTM);

                     SET @WINDOW_GROUP_ID = @WINDOW_GROUP_ID + 1;
                     SET @WINDOW_GROUP_START_DTTM = dateadd(minute , -15, @WINDOW_GROUP_START_DTTM );
                     SET @WINDOW_GROUP_END_DTTM = dateadd(minute , -15, @WINDOW_GROUP_END_DTTM );
              END

--            select * from #ALL_REPORT_ETL_WINDOWS;




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



              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW_DATA') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW_DATA;

              CREATE TABLE #CURRENT_ETL_WINDOW_DATA
              (
                     CYCLE_GROUP                       INT,
                     DATA_MART_GROUP                   INT,
                     DATA_MART_NAME                    VARCHAR(80),
                     ID                                       INT,
                     TARGET_TABLE_RUNTIME VARCHAR(80),
                     START_DTTM                        datetime,
                     END_DTTM                          datetime,
                     TABLE_STATUS               VARCHAR(80),
                     SOURCE_SERVER_NAME         VARCHAR(80),
                     SOURCE_DB_NAME                    VARCHAR(80),
                     SOURCE_SCHEMA_NAME         VARCHAR(80),
                     SOURCE_TABLE_NAME          VARCHAR(80),
                     TARGET_SCHEMA_NAME         VARCHAR(80),
                     TARGET_TABLE_NAME          VARCHAR(80),
                     CALLING_PROC               VARCHAR(80),
                     SP_PARM_1                         VARCHAR(80),
                     SP_PARM_2                         VARCHAR(80),
                     INSERT_CNT                        INT,
                     UPDATE_CNT                        INT,
                     RUN_TIME_SEC               INT,
                     TRANS_PER_SEC              INT,
                     LST_MOD_USER               VARCHAR(80),
                     INSERT_DTTM                       datetime,
                     UPDATE_DTTM                       datetime,
                     engine_message                    VARCHAR(800),
                     ERR_NUM                                  INT,
                     DELETE_CNT                        INT,
                     EXEC_BY_CONTROL_ENGINE     INT,
                     ACTIVE                            SMALLINT,
                     TryCatchError_ID           INT,
                     ErrorMessage               VARCHAR(4000)

              );




       with ETL_ENGINE_HISTORY (ID, DATA_MART_NAME, ENGINE_STATUS, MIN_DTTM, MAX_DTTM) as (

       select ID, DATA_MART_NAME, [ENGINE_STATUS], [INSERT_DTTM] ,UPDATE_DTTM
       from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] eh with(nolock) ,   #CURRENT_ETL_WINDOW cw
       where [DATA_MART_NAME] NOT LIKE '%TESTING%'
       and eh.[INSERT_DTTM] between @START_DTTM  and cw.TO_DTTM )



       INSERT into #CURRENT_ETL_WINDOW_DATA  (
                     CYCLE_GROUP                       ,
                     DATA_MART_GROUP                   ,
                     DATA_MART_NAME                    ,
                     ID                                       ,
                     TARGET_TABLE_RUNTIME ,
                     START_DTTM                        ,
                     END_DTTM                          ,
                     TABLE_STATUS               ,
                     SOURCE_SERVER_NAME         ,
                     SOURCE_DB_NAME                    ,
                     SOURCE_SCHEMA_NAME         ,
                     SOURCE_TABLE_NAME          ,
                     TARGET_SCHEMA_NAME         ,
                     TARGET_TABLE_NAME          ,
                     CALLING_PROC               ,
                     SP_PARM_1                         ,
                     SP_PARM_2                         ,
                     INSERT_CNT                        ,
                     UPDATE_CNT                        ,
                     RUN_TIME_SEC               ,
                     TRANS_PER_SEC              ,
                     LST_MOD_USER               ,
                     INSERT_DTTM                       ,
                     UPDATE_DTTM                       ,
                     engine_message                    ,
                     ERR_NUM                                  ,
                     DELETE_CNT                        ,
                     EXEC_BY_CONTROL_ENGINE     ,
                     ACTIVE                            ,
                     TryCatchError_ID           ,
                     ErrorMessage
                     )

       SELECT TOP (20000)

      -- (((@CYCLE_HISTORY_END_ID - eh.[ID]) / @DATAMARTS_IN_CYCLE) + @ETL_CYCLE_START) as CYCLE_GROUP
          t.WINDOW as CYCLE_GROUP
          ,((@CYCLE_HISTORY_END_ID - eh.[ID]) % @DATAMARTS_IN_CYCLE) as DATA_MART_GROUP
       --  ,eh.MAX_DTTM
         ,eh.[DATA_MART_NAME]
       --  ,[MWH].[ConvertTimeToHHMMSS] (datediff(second, eh.MIN_DTTM, eh.MAX_DTTM))  FULL_DATA_MART_RUNTIME
       --  ,eh.[ENGINE_STATUS]  CYCLE_STATUS


         ,h.[ID]
         ,[MWH].[ConvertTimeToHHMMSS] ([RUN_TIME_SEC] )  TARGET_TABLE_RUNTIME
      ,[START_DTTM]
      ,[END_DTTM]
      ,[STATUS] TABLE_STATUS
      ,case when [SOURCE_SERVER_NAME] is not null then [SOURCE_SERVER_NAME] else (select max([SOURCE_SERVER_NAME]) from  [UMA_DWH].[MWH].[ETL_HISTORY] h2  with(nolock) where h2.CALLING_PROC = h.CALLING_PROC  and h2.INSERT_DTTM > dateadd(day, -7, getdate())) end
         ,case when [SOURCE_DB_NAME] is not null then [SOURCE_DB_NAME] else (select max([SOURCE_DB_NAME]) from  [UMA_DWH].[MWH].[ETL_HISTORY] h2  with(nolock) where h2.CALLING_PROC = h.CALLING_PROC  and h2.INSERT_DTTM > dateadd(day, -7, getdate())) end
      ,[SOURCE_SCHEMA_NAME]
      ,[SOURCE_TABLE_NAME]
      ,[TARGET_SCHEMA_NAME]
      ,[TARGET_TABLE_NAME]
      ,[CALLING_PROC]
      ,[SP_PARM_1]
      ,[SP_PARM_2]
     ,[INSERT_CNT]
      ,[UPDATE_CNT]
      ,[RUN_TIME_SEC]
         ,   cast( round (( case when ([RUN_TIME_SEC] = 0 ) then ([INSERT_CNT] + [UPDATE_CNT]) else  ( (([INSERT_CNT] + [UPDATE_CNT])  * 1.0) / [RUN_TIME_SEC]) end ), 2) as decimal (8,2))  TRANS_PER_SEC
      ,h.[LST_MOD_USER]
      ,h.[INSERT_DTTM]
      ,h.[UPDATE_DTTM]
      ,h.[engine_message]
      ,[ERR_NUM]
      ,[DELETE_CNT]
      ,[EXEC_BY_CONTROL_ENGINE]
         , CM.active
         , coalesce(h.TryCatchError_ID, 0)
         , coalesce(TR.ErrorMessage, '')
       FROM [UMA_DWH].[MWH].[ETL_HISTORY] h  with(nolock)
       JOIN [MWH].[ETL_CONTROL_MANAGER] cm with(nolock) on (cm.[PROCEDURE_NAME] = h.CALLING_PROC)
       JOIN ETL_ENGINE_HISTORY eh  with(nolock)  on (h.ETL_ENGINE_HISTORY_ID = eh.ID    )
       JOIN  #ALL_REPORT_ETL_WINDOWS t on (t.FROM_DTTM <= [START_DTTM]   and  t.TO_DTTM >= [START_DTTM])
       LEFT JOIN [MWH].[ETL_TryCatchError] TR  with(nolock)  on (h.TryCatchError_ID = TR.ID)
       -- where CM.active = 1   --  send back all
       order by
              t.WINDOW asc
          ,((@CYCLE_HISTORY_END_ID - eh.[ID]) % @DATAMARTS_IN_CYCLE)  desc

       END;

                     SELECT
                     ID                                       ,
                     CYCLE_GROUP                       ,
                     DATA_MART_GROUP                   ,
                     DATA_MART_NAME                    ,
                     TARGET_TABLE_RUNTIME ,
                     START_DTTM                        ,
                     END_DTTM                          ,
                     TABLE_STATUS               ,
                     upper(SOURCE_SERVER_NAME)  as  'SOURCE_SERVER_NAME',
                     upper(SOURCE_DB_NAME)  as  'SOURCE_DB_NAME',
                     upper(SOURCE_SCHEMA_NAME)  as  'SOURCE_SCHEMA_NAME',
                     upper(SOURCE_TABLE_NAME)  as  'SOURCE_TABLE_NAME',
                     upper(TARGET_SCHEMA_NAME)  as  'TARGET_SCHEMA_NAME',
                     upper(TARGET_TABLE_NAME)  as  'TARGET_TABLE_NAME',
                     upper(CALLING_PROC),
                     SP_PARM_1                         ,
                     SP_PARM_2                         ,
                     INSERT_CNT                        ,
                     UPDATE_CNT                        ,
                     RUN_TIME_SEC               ,
                     TRANS_PER_SEC              ,
                     LST_MOD_USER               ,
                     INSERT_DTTM                       ,
                     UPDATE_DTTM                       ,
                     engine_message                    ,
                     ERR_NUM                                  ,
                     DELETE_CNT                        ,
                     EXEC_BY_CONTROL_ENGINE  ,
                     ACTIVE                            ,
                     TryCatchError_ID     as 'TRY_CATCH_ERR_ID'      ,
                     ErrorMessage                      as 'TRY_CATCH_ERR_MESSAGE'
                     FROM #CURRENT_ETL_WINDOW_DATA
                     ORDER BY CYCLE_GROUP ASC    ,
                     DATA_MART_GROUP  DESC ;

                     set @rtn_Insert_Cnt = @@ROWCOUNT;


END;


IF  @message = 'DISPLAY_CURRENT_STATUS'
BEGIN

       BEGIN TRY

              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW_2') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW_2;

              CREATE TABLE #CURRENT_ETL_WINDOW_2
              (
              WINDOW               CHAR(1),
              FROM_DTTM            DATETIME,
              TO_DTTM                    DATETIME
              );


              with CURRENT_WINDOW_PARTS ( WINDOW_DATE, HR, WINDOW, WINDOW_START_MIN_SEC , WINDOW_END_MIN_SEC) as (
              select
              cast([INSERT_DTTM] as date) as WINDOW_DATE,
              substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 1,2) as HR,
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then 'A' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then 'B' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then 'C' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then 'D' else (
              '-')  end )  end )  end )  end   as WINDOW,

              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '00:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '15:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '30:00' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '45:00' else (
              '-')  end )  end )  end )  end   as WINDOW_START_MIN_SEC,

              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '14:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '29:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '44:59' else (
              case when cast('00:'+ substring(cast(cast([INSERT_DTTM] as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '59:59' else (
              '-')  end )  end )  end )  end   as WINDOW_END_MIN_SEC
              from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock) where ID = (select MAX(ID) from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock)) ),

              CURRENT_WINDOW (WINDOW,  FROM_DTTM, TO_DTTM) as (
              select WINDOW, cast(cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_START_MIN_SEC as datetime),  dateadd(MILLISECOND,998 , cast( cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_END_MIN_SEC as datetime))  from CURRENT_WINDOW_PARTS
              )

              INSERT into #CURRENT_ETL_WINDOW_2 (WINDOW,  FROM_DTTM, TO_DTTM)
              select WINDOW,  FROM_DTTM, TO_DTTM
              from CURRENT_WINDOW;


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

              with ETL_ENGINE_HISTORY_TOP ( DATA_MART_NAME, MAX_ID) as (
              select  DATA_MART_NAME,  max(ID)
              from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] eh with(nolock),   #CURRENT_ETL_WINDOW_2 cw
              where [DATA_MART_NAME] NOT LIKE '%TESTING%'
              and eh.[INSERT_DTTM] between FROM_DTTM  and TO_DTTM
--     and eh.[INSERT_DTTM] between '2018-08-14 11:00:00.000'  and   '2018-08-14 11:14:59.997'
              group by DATA_MART_NAME
       )

              select
              t.DATA_MART_NAME,
              eh.ENGINE_STATUS,
              eh.INSERT_DTTM  START_DTTM,
              eh.UPDATE_DTTM END_DTTM,
              [MWH].[ConvertTimeToHHMMSS] (datediff(SECOND, eh.INSERT_DTTM, eh.UPDATE_DTTM))  FULL_DATA_MART_RUNTIME
              from ETL_ENGINE_HISTORY_TOP t
              JOIN [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] eh with(nolock) on (eh.ID = t.MAX_ID)
              order by t.MAX_ID desc;

              set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;
END;



--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'RUN_CHECK' , 'S_LION.MERGE_MCS_DATA_POINT_SUMMARY', '1';
IF  @message = 'RUN_CHECK'
BEGIN

       BEGIN TRY

      SET  @SP_RUN_CHECK_NAME   =  @VARCHAR_01;

         SET @PERIOD_POSITION = (select CHARINDEX('.', @VARCHAR_01));

         IF(@PERIOD_POSITION > 0) begin
              SET @SP_RUN_CHECK_NAME = SUBSTRING(@VARCHAR_01,1,@PERIOD_POSITION)+'CHECK_'+SUBSTRING(@VARCHAR_01,@PERIOD_POSITION + 1,len(@VARCHAR_01));
         end

       --  exec @SP_RUN_CHECK_NAME  '2018-04-10 02:45:00.7133333'  , '2018-04-10 11:00:00.8133333'

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

       with SP_RUN_TEST_ID (ID) as ( select MAX(ID)
       from [MWH].[ETL_HISTORY] with(nolock)
       where [CALLING_PROC] = @SP_RUN_CHECK_NAME)

       select eh.* from [MWH].[ETL_HISTORY] eh with(nolock) join SP_RUN_TEST_ID on (SP_RUN_TEST_ID.ID = eh.ID)
       ;

       set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;
END;



IF  @message = 'GET_ERROR_TEXT'
BEGIN

       BEGIN TRY
              SET @ERROR_ID = cast(@VARCHAR_01 as INTEGER);

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
              select
              ID,
              cast([INSERT_DTTM] as varchar(20))  as  'INSERT_DTTM',
              [LST_MOD_USER],
              cast([ERR] as varchar(20))  as 'ERR',
              cast([ErrorSeverity] as varchar(20))  as 'Error_Severity',
              cast([ErrorState] as varchar(20))  as 'Error_State',
              [ErrorProcedure] as 'Error_Procedure',
              cast([ErrorLine] as varchar(20))  as 'Error_Line',
              [ErrorMessage]  as  'Error_Message',
              [ETLProcedureName]  as 'ETL_PROCEDURE_NAME'
              from [MWH].[ETL_TryCatchError] with(nolock)
              where ID = @ERROR_ID;

              set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;
END;



IF  @message = 'GET_ETL_PROCEDURE_HISTORY'
BEGIN

       BEGIN TRY

              IF(len(rtrim(@VARCHAR_03))) > 8  begin
                     SET @REPORT_DATE =  cast(@VARCHAR_03 as datetime);
                     SET @VALID_DB_SP = (select count(*) FROM [UMA_DWH].[MWH].[ETL_HISTORY] where [SOURCE_DB_NAME] = @VARCHAR_01  and  [CALLING_PROC] = @VARCHAR_02  and INSERT_DTTM between @REPORT_DATE  and  dateadd(hour, 23, dateadd(minute, 59,@REPORT_DATE)));
              end else begin
                     SET @REPORT_DATE =  getdate();
                     SET @VALID_DB_SP = (select count(*) FROM [UMA_DWH].[MWH].[ETL_HISTORY] where [SOURCE_DB_NAME] = @VARCHAR_01  and  [CALLING_PROC] = @VARCHAR_02  and INSERT_DTTM > dateadd(day, -30, getdate()));
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

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

       IF( @ERR = 0   and  @VALID_DB_SP > 0) BEGIN

              IF(len(rtrim(@VARCHAR_03))) > 8  begin

                     SELECT
                      eh.ID
                     ,eh.[START_DTTM] as 'START_DTTM'
                     ,eh.[END_DTTM]  as 'END_DTTM'
                     ,eh.[STATUS]
                     ,upper(eh.[SOURCE_DB_NAME]) as 'SOURCE_DB'
                     ,upper(eh.[SOURCE_TABLE_NAME]) as 'SOURCE_TABLE'
                     ,upper(eh.[TARGET_SCHEMA_NAME]) as 'TARGET_SCHEMA'
                     ,upper(eh.[TARGET_TABLE_NAME]) as 'TARGET_TABLE'
                     ,upper(eh.[CALLING_PROC]) as 'PROCEDURE_NAME'
                     ,eh.[SP_PARM_1] as 'ETL_FROM_DTTM'
                     ,eh.[SP_PARM_2] as 'ETL_TO_DTTM'
                     ,eh.[INSERT_CNT] as 'INSERT_COUNT'
                     ,eh.[UPDATE_CNT] as 'UPDATE_COUNT'
                     ,eh.[DELETE_CNT] as 'DELETE_COUNT'
                     ,eh.[RUN_TIME_SEC] as 'RUN_TIME'
                     ,  cast( round (( case when (eh.[RUN_TIME_SEC] = 0 ) then (eh.[INSERT_CNT] + eh.[UPDATE_CNT] + eh.[DELETE_CNT]) else  ( ((eh.[INSERT_CNT] + eh.[UPDATE_CNT] + eh.[DELETE_CNT])  * 1.0) / eh.[RUN_TIME_SEC]) end ), 2) as decimal (8,2))  'TRANS_PER_SEC'
                     ,eh.[LST_MOD_USER] as 'USER'
                     ,eh.[engine_message] as 'engine_message'
                     ,eh.[ERR_NUM] as 'ERROR_NUMBER'
                     ,coalesce(TR.ID, 0)  as 'TRY_CATCH_ERR_ID'
                     ,TR.ErrorMessage   as 'Try_Catch_Err_Message'
                     FROM [UMA_DWH].[MWH].[ETL_HISTORY] eh  with(nolock)
                     left join [MWH].[ETL_TryCatchError] TR with(nolock) on (eh.TryCatchError_ID = TR.ID)
                     where eh.[SOURCE_DB_NAME] = @VARCHAR_01
                     and   eh.[CALLING_PROC] = @VARCHAR_02
                     and   eh.INSERT_DTTM between @REPORT_DATE  and  dateadd(hour, 23, dateadd(minute, 59,@REPORT_DATE))
                     order by [START_DTTM] desc;

              end else begin
                     SELECT TOP (500)
                      eh.ID
                     ,eh.[START_DTTM] as 'START_DTTM'
                     ,eh.[END_DTTM]  as 'END_DTTM'
                     ,eh.[STATUS]
                     ,upper(eh.[SOURCE_DB_NAME]) as 'SOURCE_DB'
                     ,upper(eh.[SOURCE_TABLE_NAME]) as 'SOURCE_TABLE'
                     ,upper(eh.[TARGET_SCHEMA_NAME]) as 'TARGET_SCHEMA'
                     ,upper(eh.[TARGET_TABLE_NAME]) as 'TARGET_TABLE'
                     ,upper(eh.[CALLING_PROC]) as 'PROCEDURE_NAME'
                     ,eh.[SP_PARM_1] as 'ETL_FROM_DTTM'
                     ,eh.[SP_PARM_2] as 'ETL_TO_DTTM'
                     ,eh.[INSERT_CNT] as 'INSERT_COUNT'
                     ,eh.[UPDATE_CNT] as 'UPDATE_COUNT'
                     ,eh.[DELETE_CNT] as 'DELETE_COUNT'
                     ,eh.[RUN_TIME_SEC] as 'RUN_TIME'
                     ,  cast( round (( case when (eh.[RUN_TIME_SEC] = 0 ) then (eh.[INSERT_CNT] + eh.[UPDATE_CNT] + eh.[DELETE_CNT]) else  ( ((eh.[INSERT_CNT] + eh.[UPDATE_CNT] + eh.[DELETE_CNT])  * 1.0) / eh.[RUN_TIME_SEC]) end ), 2) as decimal (8,2))  'TRANS_PER_SEC'
                     ,eh.[LST_MOD_USER] as 'USER'
                     ,eh.[engine_message] as 'engine_message'
                     ,eh.[ERR_NUM] as 'ERROR_NUMBER'
                     ,coalesce(TR.ID, 0)  as 'TRY_CATCH_ERR_ID'
                     ,TR.ErrorMessage   as 'TRY_CATCH_ERR_MESSAGE'
                     FROM [UMA_DWH].[MWH].[ETL_HISTORY] eh  with(nolock)
                     left join [MWH].[ETL_TryCatchError] TR with(nolock) on (eh.TryCatchError_ID = TR.ID)
                     where eh.[SOURCE_DB_NAME] = @VARCHAR_01
                     and  eh.[CALLING_PROC] = @VARCHAR_02
                     order by eh.[START_DTTM] desc;
              end;

       set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;
END;




IF  @message = 'GET SERVER DB LIST'
BEGIN


       select   distinct   upper([SOURCE_SERVER_NAME])  as  'SOURCE_SERVER_NAME',
        upper([SOURCE_DB_NAME]) as  'SOURCE_DB_NAME'
       FROM [UMA_DWH].[MWH].[ETL_HISTORY]   with(nolock)
        where [START_DTTM]  > dateadd(day,-30, getdate())
       order by upper([SOURCE_SERVER_NAME])  desc,  upper([SOURCE_DB_NAME])  desc;

       set @rtn_Insert_Cnt = @@ROWCOUNT;

END;



IF  @message = 'GET TABLES AND STORED PROCEDURES'
BEGIN

       BEGIN TRY
              SET @SOURCE_SERVER = rtrim(@VARCHAR_01 );
              SET @SOURCE_DB = rtrim(@VARCHAR_02 );
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

              select   distinct
                     upper([SOURCE_SCHEMA_NAME]) as 'SOURCE_SCHEMA',
                     upper([SOURCE_TABLE_NAME])  as 'SOURCE_TABLE',
                     upper([CALLING_PROC]) as 'ETL_STORED_PROCEDURE',
                     [TARGET_SCHEMA_NAME] as 'TARGET_SCHEMA' ,
                     [TARGET_TABLE_NAME] as 'TARGET_TABLE'

              from   [MWH].[ETL_HISTORY]  with(nolock)
              where  [SOURCE_SERVER_NAME] = @SOURCE_SERVER
              and    [SOURCE_DB_NAME] = @SOURCE_DB
              and    [START_DTTM] >=  dateadd(day, -30, getdate())
              ORDER BY      upper([SOURCE_SCHEMA_NAME])  asc,
                                  upper([SOURCE_TABLE_NAME]) asc,
                                  upper([CALLING_PROC]) asc;
              set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;

END;




IF  @message = 'LOGIN'
BEGIN

       BEGIN TRY

              SET @USER_EMAIL                   = rtrim(@VARCHAR_01 );
              SET @USER_PW               = rtrim(@VARCHAR_02 );
              SET @USER_UPDATE_PHONE     = rtrim(@VARCHAR_03 );
              SET @USER_UPDATE_CELLPHONE = rtrim(@VARCHAR_04 );
              set  @VALID_LOGIN_ID = -1;
              set @UserExists = -1;

              SET @UserExists = coalesce((select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where [EmployeeEMAIL] = @USER_EMAIL  ), -1);

              set  @VALID_LOGIN_ID = coalesce((select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where [EmployeeEMAIL] = @USER_EMAIL  and [EmployeePassword] = @USER_PW), -1);

--            set  @VALID_LOGIN_ID = (select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where [EmployeeEMAIL] = @USER_EMAIL  );
--            select * from [MWH_DIM].[D_ADMIN_CONSOLE_USER]


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

       IF( @ERR = 0  and @VALID_LOGIN_ID >= 1) BEGIN
              IF (len(@USER_UPDATE_PHONE) >= 7) BEGIN
                     UPDATE [MWH_DIM].[D_ADMIN_CONSOLE_USER]
                     SET [EmployeePHONE] = @USER_UPDATE_PHONE
                     where  ID = @VALID_LOGIN_ID;
              end;

              IF (len(@USER_UPDATE_CELLPHONE) >= 7) BEGIN
                     UPDATE [MWH_DIM].[D_ADMIN_CONSOLE_USER]
                     SET [EmployeeCELLPHONE] = @USER_UPDATE_CELLPHONE
                     where  ID = @VALID_LOGIN_ID;
              end;
       END;
       IF( @ERR = 0  and @VALID_LOGIN_ID >= 1 ) BEGIN
              set @TryCatchError_ID = 1
              end
       else begin
              set @TryCatchError_ID = @ERR
       END;


       IF @UserExists <= 0 begin
              select -2;
       end ELSE IF @VALID_LOGIN_ID <= 0 begin
              select -1
       end else IF @TryCatchError_ID != 1  begin
              select -3
       end else begin
              select @VALID_LOGIN_ID
       end


       --set @rtn_Insert_Cnt = @TryCatchError_ID;

END;




IF  @message = 'PASSWORD RESET'
BEGIN

       BEGIN TRY

              SET @USER_EMAIL                   = rtrim(@VARCHAR_01 );
              SET @USER_PW               = rtrim(@VARCHAR_02 );
              SET @NEW_PASSWORD    = rtrim(@VARCHAR_03 );

              set  @VALID_LOGIN_ID = -1;

              set  @VALID_LOGIN_ID = (select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where [EmployeeEMAIL] = @USER_EMAIL  and [EmployeePassword] = @USER_PW);

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

       IF( @ERR = 0  and @VALID_LOGIN_ID >= 1) BEGIN
              IF (len(@NEW_PASSWORD) >= 6) BEGIN
                     UPDATE [MWH_DIM].[D_ADMIN_CONSOLE_USER]
                     SET [EmployeePassword] = @NEW_PASSWORD
                     where  ID = @VALID_LOGIN_ID;
              end;
       END;
       IF( @ERR = 0  and @VALID_LOGIN_ID >= 1 ) BEGIN
              set @TryCatchError_ID = 1
              end
       else begin
              set @TryCatchError_ID = @ERR
       END;

       set @rtn_Insert_Cnt = @TryCatchError_ID;

       select @TryCatchError_ID;
END;


IF  @message = 'SAVE ADMIN CONSOLE USER'
BEGIN

       BEGIN TRY

--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'SAVE ADMIN CONSOLE USER' , '',  'matula' , 'charles' , 'cmatula@ultimatemedical.edu', '8454718505', '8453372852', 'resetasap' ,'1f0rg0t'  ;
--    select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where EmployeePassword = 'resetasap'
-- select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where  EmployeeEMAIL = 'cmatula@ultimatemedical.edu'
--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'SAVE ADMIN CONSOLE USER' , '' , '';

--  select * from [MWH].[ETL_HISTORY] with(nolock) where [CALLING_PROC] = 'MWH.REP_COUNT_OUTBOUND_BY_DATE_SP' order by ID desc



              DECLARE @generated_keys table([Id] integer)


              SET @D_ADMIN_CONSOLE_USER_ID                    = case when len(rtrim(@VARCHAR_01)) > 0 then cast (rtrim(@VARCHAR_01) as INTEGER) else -1 end;
              SET @EmployeeLastName                                  = rtrim(@VARCHAR_02 );
              SET @EmployeeFirstName                                 = rtrim(@VARCHAR_03 );
              SET @EmployeeEMAIL                                     = rtrim(@VARCHAR_04 );
              SET @EmployeePHONE                                     = rtrim(@VARCHAR_05 );
              SET @EmployeeCELLPHONE                                 = rtrim(@VARCHAR_06 );
              SET @exist_password                                    = @VARCHAR_07;
              SET @EmployeePassword                                  = case when len(@VARCHAR_08) > 0 then @VARCHAR_08 else @VARCHAR_07 end;
              SET @ReceiveAlerts                                     = case when len(rtrim(@VARCHAR_09)) > 0 then cast (rtrim(@VARCHAR_09) as INTEGER) else 0 end;
              SET @User_ID1 = -1;
              SET @User_ID2 = -2;
              SET @User_ID3 = -3;

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

   IF( @ERR = 0  ) BEGIN

       IF (@D_ADMIN_CONSOLE_USER_ID > 0) begin
              SET @User_ID1 = coalesce  ((select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where ID = @D_ADMIN_CONSOLE_USER_ID), -1);
       end

       IF (LEN(@EmployeePassword) > 0) begin
              SET @User_ID2 = coalesce ((select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where EmployeePassword = @exist_password ), -2);
       end

       IF (LEN(@EmployeeEMAIL) > 10) begin
              SET @User_ID3 = coalesce ((select ID from [MWH_DIM].[D_ADMIN_CONSOLE_USER] where  EmployeeEMAIL = @EmployeeEMAIL), -3);
       end

       IF  ((@User_ID1 = @User_ID2 and   @User_ID2 = @User_ID3) or (@User_ID1 = -1 and @User_ID2  = @User_ID3 )) begin

              update [MWH_DIM].[D_ADMIN_CONSOLE_USER]
              set EmployeeLastName = case when len(@EmployeeLastName) >= 3 then @EmployeeLastName else EmployeeLastName end ,
                     EmployeeFirstName = case when len(@EmployeeFirstName) >= 3 then @EmployeeFirstName else EmployeeFirstName end ,
                     EmployeePHONE = case when len(@EmployeePHONE) >= 7 then @EmployeePHONE else EmployeePHONE end ,
                     EmployeeCELLPHONE = case when len(@EmployeeCELLPHONE) >= 7 then @EmployeeCELLPHONE else EmployeeCELLPHONE end ,
                     EmployeePassword = case when len(@EmployeePassword) > 64 then @EmployeePassword else EmployeePassword end ,
                     RECEIVES_ALERTS = @ReceiveAlerts
              WHERE ID = @User_ID2;
       end

       IF(@User_ID1 = -1  and  @User_ID2 = -2  and  @User_ID3 = -3) begin
              INSERT INTO [MWH_DIM].[D_ADMIN_CONSOLE_USER] ( EmployeeLastName, EmployeeFirstName, EmployeeEMAIL,  EmployeePHONE, EmployeeCELLPHONE, EmployeePassword, RECEIVES_ALERTS  )
              OUTPUT inserted.ID INTO @generated_keys
              values (@EmployeeLastName, @EmployeeFirstName, @EmployeeEMAIL,  @EmployeePHONE, @EmployeeCELLPHONE, @EmployeePassword, @ReceiveAlerts)
              ;


              SELECT t.ID, t.EmployeeLastName, t.EmployeeFirstName, t.EmployeeEMAIL,  t.EmployeePHONE, t.EmployeeCELLPHONE, t.EmployeePassword
              FROM @generated_keys AS g
              JOIN [MWH_DIM].[D_ADMIN_CONSOLE_USER] AS t with(nolock) ON g.ID = t.ID;

       end

   end

       IF( @ERR != 0   ) BEGIN
              set @TryCatchError_ID = @ERR
       END
       set @rtn_Insert_Cnt = @TryCatchError_ID;
       select @TryCatchError_ID;
END;


IF  @message in ('GET POWER BI REPORT HISTORY'  ,  'GET REPORT HISTORY')
BEGIN

       BEGIN TRY
              IF(@VARCHAR_01 is NULL  or  len(@VARCHAR_01) < 8)  begin
                SET @START_DTTM = dateadd(day,-7, getdate());
                SET @END_DTTM =   getdate();
                end
              else begin
                SET @START_DTTM = cast( rtrim(@VARCHAR_01 ) as datetime);
                SET @END_DTTM =   cast( rtrim(@VARCHAR_02 ) as datetime);
              end
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


  SELECT eh.[ID]
      , eh.[CALLING_PROC]  as 'STORED PROCEDURE'
         ,eh.[SP_PARM_1]  as 'FROM DTTM'
      ,eh.[SP_PARM_2] as 'TO DTTM'
         ,eh.[START_DTTM] as 'STARTED'
      ,eh.[END_DTTM] as 'FINISHED'
      ,eh.[RUN_TIME_SEC] as 'RUN TIME'
         ,eh.[UPDATE_CNT] as 'ROWS RETURNED'
         ,ce.[ErrorMessage] as 'ERROR MESSAGE'
         ,eh.SOURCE_TABLE_NAME as 'SOURCE TABLE NAME'
         ,eh.TARGET_TABLE_NAME as 'REPORT NAME'
         ,eh.LST_MOD_USER as 'REPORT REQUEST USER'
         ,coalesce(eh.TryCatchError_ID , 0) 'TryCatchError_ID'
         ,coalesce(ce.ErrorMessage, '')   'ErrorMessage'
  FROM [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock)
  left join [MWH].[ETL_TryCatchError]  ce with(nolock) on (eh.[TryCatchError_ID] = ce.ID)
  where [TARGET_SCHEMA_NAME] = 'POWERBI'
  and [START_DTTM] between @START_DTTM  and  @END_DTTM

  ORDER BY    [START_DTTM]  desc

  set @rtn_Insert_Cnt = @@ROWCOUNT;


       END;

END;





IF  @message in ('GET POWER BI REPORT STATISTICS' , 'GET REPORT STATISTICS')
BEGIN

       BEGIN TRY
              IF(@VARCHAR_01 is  NULL  or  len(@VARCHAR_01) < 4)  begin
                     SET  @REPORT_NAME = 'ALL';
                     end
              ELSE  begin
                     SET @REPORT_NAME                                       =  rtrim(@VARCHAR_01);

              end

              SET @START_DTTM = dateadd(day,-31, getdate());
              SET @END_DTTM =   getdate();

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


  SELECT eh.[CALLING_PROC]  as 'REPORT NAME',
       sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then 1  else 0 end)  as 'DAY COUNT',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then  [RUN_TIME_SEC]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then 1  else 0 end) else 0 end as 'DAY AVG RUN TIME',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then  [UPDATE_CNT]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) = 0 then 1  else 0 end) else 0 end as 'DAY AVG ROWS RETURNED',


       sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then 1  else 0 end) as 'WEEK COUNT',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then  [RUN_TIME_SEC]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then 1  else 0 end) else 0 end as 'WEEK AVG RUN TIME',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then  [UPDATE_CNT]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) < 7 then 1  else 0 end) else 0 end as 'WEEK AVG ROWS RETURNED',


       sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then 1  else 0 end)as 'LAST 30 DAY COUNT',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then  [RUN_TIME_SEC]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then 1  else 0 end) else 0 end as 'LAST 30 DAY AVG RUN TIME',

       case when  sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then 1  else 0 end) > 0 then sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then  [UPDATE_CNT]  else 0 end) / sum(case when  datediff(day, [START_DTTM], getdate()) < 31 then 1  else 0 end) else 0 end as 'LAST 30 DAY AVG ROWS RETURNED',

       min(coalesce(ce.ID, 0)) TryCatchError_ID,
       min ( coalesce(ce.ErrorMessage, ''))  ErrorMessage



  FROM [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock)
  left join [MWH].[ETL_TryCatchError]  ce with(nolock) on (eh.[TryCatchError_ID] = ce.ID)
  where [TARGET_SCHEMA_NAME] = 'POWERBI'
  and ( eh.[TARGET_TABLE_NAME]  = @REPORT_NAME  or  @REPORT_NAME = 'ALL')
  and [START_DTTM] between @START_DTTM  and  @END_DTTM
  group by eh.[CALLING_PROC];

  set @rtn_Insert_Cnt = @@ROWCOUNT;

       END;

END;





IF  @message = 'LIST REPORT RUNS'
BEGIN

       BEGIN TRY

              SET @REPORT_NAME                                       =  rtrim(@VARCHAR_01);
              SET @REPORT_FROM_NUM                            = case when len(rtrim(@VARCHAR_02)) > 0 then cast (rtrim(@VARCHAR_02) as INTEGER) else 1 end;
              SET @REPORT_TO_NUM                                     = case when len(rtrim(@VARCHAR_03)) > 0 then cast (rtrim(@VARCHAR_03) as INTEGER) else 100 end;

              SET @FROM_TO_RANGE                                     = @REPORT_TO_NUM - @REPORT_FROM_NUM;



       END TRY

       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              set @ErrorProcedure = @ErrorProcedure + ' : LIST REPORT RUNS';

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

   IF( @ERR = 0  ) BEGIN



              with RANKED_LIST (PK_ID, RANK_VALUE) as (
              select  ID, RANK() OVER  (PARTITION BY eh.[CALLING_PROC] ORDER BY eh.[START_DTTM]  DESC) AS Rank
              from [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock)
              where [TARGET_SCHEMA_NAME] = 'POWERBI'
              and  [TARGET_TABLE_NAME] = @REPORT_NAME
              and START_DTTM > dateadd( day, -180, getdate())
              and eh.END_DTTM is not null
              )

              SELECT eh.[ID]
              ,DENSE_RANK() OVER  (PARTITION BY eh.[CALLING_PROC] ORDER BY eh.[START_DTTM]  DESC) AS Rank
              ,eh.[CALLING_PROC]  as 'STORED PROCEDURE'
              ,eh.[SP_PARM_1]  as 'FROM DTTM'
              ,eh.[SP_PARM_2] as 'TO DTTM'
              ,eh.[START_DTTM] as 'STARTED'
              ,eh.[END_DTTM] as 'FINISHED'
              ,eh.[RUN_TIME_SEC] as 'RUN TIME'
              ,eh.[UPDATE_CNT] as 'ROWS RETURNED'

              ,eh.SOURCE_TABLE_NAME as 'SOURCE TABLE NAME'
              ,eh.TARGET_TABLE_NAME as 'REPORT NAME'
              ,ce.ID  as 'TryCatchError_ID'
              ,ce.ErrorMessage as 'ErrorMessage'

              FROM RANKED_LIST
              JOIN [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock) on (RANKED_LIST.PK_ID = eh.ID)
              LEFT JOIN [MWH].[ETL_TryCatchError] ce with(nolock) on (eh.TryCatchError_ID = ce.ID)
              where RANKED_LIST.RANK_VALUE between @REPORT_FROM_NUM and @REPORT_TO_NUM
              order by ID desc;

              set @rtn_Insert_Cnt = @@ROWCOUNT;


   end

       IF( @ERR != 0   ) BEGIN
              set @TryCatchError_ID = @ERR
       END

--     select @TryCatchError_ID;
END;



IF  @message = 'CHECK_ETL_STATUS'
BEGIN

       with last_run_data(calling_proc,  DATA_MART_NAME, current_dttm, lastrun_dttm) as (
              select [CALLING_PROC], cm.DATA_MART_NAME, getdate() current_dttm, max([START_DTTM]) lastrun_dttm
              from [MWH].[ETL_HISTORY] eh with(nolock)
              join [MWH].[ETL_CONTROL_MANAGER] cm with(nolock) on (cm.[PROCEDURE_NAME] = eh.CALLING_PROC)
              where [START_DTTM] > dateadd(day, -5, getdate())
              and [TARGET_SCHEMA_NAME] != 'POWERBI'
              and [ACTIVE] = 1
              group by [CALLING_PROC], cm.DATA_MART_NAME
              )

       select  lrd.calling_proc as ETL_PROCEDURE, lrd.DATA_MART_NAME as DATA_MART , lrd.current_dttm as NOW, lrd.lastrun_dttm as LASTRUN, datediff(minute,lastrun_dttm, coalesce( eh.END_DTTM ,getdate()))  as RUNTIME, case when eh.[END_DTTM] is NULL then 'RUNNING'  else  'COMPLETE' end ETL_STATUS
       from last_run_data lrd
       join [MWH].[ETL_HISTORY] eh with(nolock) on (eh.CALLING_PROC = lrd.calling_proc  and eh.START_DTTM = lrd.lastrun_dttm)
       order by datediff(minute,lastrun_dttm, coalesce( eh.END_DTTM ,getdate()))  desc;

       set @rtn_Insert_Cnt = @@ROWCOUNT;

END;



IF  @message = 'DISPLAY_REPORT_BY_DATE'

--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'DISPLAY_REPORT_BY_DATE' , 'MWH.F_MCS_LEADS_NOT_CALLED_SP',  '' , '' , '', '', '', '' ,'',''  ;
--  exec MWH.UMA_WAREHOUSE_ADMIN_CONSOLE  'DISPLAY_REPORT_BY_DATE' , 'MWH.F_MCS_LEADS_NOT_CALLED_SP',  '2018-09-18' , '' , '', '', '', '' ,'',''  ;

--     select cast(cast( getdate() as date) as datetime)  ,   dateadd( minute, 59, dateadd( hour, 23, cast(cast( getdate() as date) as datetime)))


BEGIN

       BEGIN TRY
              SET @SP_NAME  =  rtrim(@VARCHAR_01);

              IF(@VARCHAR_02 is NULL  or  len(@VARCHAR_02) < 8)  begin
                SET @REPORT_DATE =  cast(cast( getdate() as date) as datetime);
              end
              else begin
                SET @REPORT_DATE = cast( rtrim(@VARCHAR_02 ) as datetime);
              end
       END TRY
       BEGIN CATCH
              SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage = ERROR_MESSAGE() ;

              set @ErrorProcedure = @ErrorProcedure + ' : DISPLAY_REPORT_BY_DATE';

              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @My_SP_NAME,   @TryCatchError_ID  OUTPUT ;
              PRINT 'ERROR : (' + cast(@TryCatchError_ID as varchar(12))  + ')   ' + @ErrorMessage
       END CATCH;

   IF( @ERR = 0  ) BEGIN



              with RANKED_LIST (PK_ID, RANK_VALUE) as (
              select  ID, RANK() OVER  (PARTITION BY eh.[CALLING_PROC] ORDER BY eh.[START_DTTM]  DESC) AS Rank
              from [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock)
              where [CALLING_PROC] = @SP_NAME
              and START_DTTM between  @REPORT_DATE   and   dateadd( minute, 59, dateadd( hour, 23, @REPORT_DATE))
              and eh.END_DTTM is not null
              )

              SELECT eh.[ID]
              ,DENSE_RANK() OVER  (PARTITION BY eh.[CALLING_PROC] ORDER BY eh.[START_DTTM]  DESC) AS Rank
              ,eh.[CALLING_PROC]  as 'STORED_PROCEDURE'
              ,eh.[SP_PARM_1]  as 'FROM_DTTM'
              ,eh.[SP_PARM_2] as 'TO_DTTM'
              ,eh.[START_DTTM] as 'STARTED'
              ,eh.[END_DTTM] as 'FINISHED'
              ,eh.[RUN_TIME_SEC] as 'RUN_TIME'
              ,eh.[UPDATE_CNT] as 'ROWS_RETURNED'
              , case when [RUN_TIME_SEC] > 0 then cast(( ([UPDATE_CNT]* 1.0) / ([RUN_TIME_SEC] * 1.0) ) as decimal (8,2))  else 0  end  as 'TRANS_PER_SEC'

              ,eh.SOURCE_TABLE_NAME as 'SOURCE_TABLE_NAME'
              ,eh.TARGET_TABLE_NAME as 'REPORT_NAME'
              ,ce.ID  as 'TRY_CATCH_ERR_ID'
              ,ce.ErrorMessage as 'TRY_CATCH_ERR_MESSAGE'

              FROM RANKED_LIST
              JOIN [UMA_DWH].[MWH].[ETL_HISTORY]   eh  with(nolock) on (RANKED_LIST.PK_ID = eh.ID)
              LEFT JOIN [MWH].[ETL_TryCatchError] ce with(nolock) on (eh.TryCatchError_ID = ce.ID)
              order by eh.[START_DTTM] desc;

              set @rtn_Insert_Cnt = @@ROWCOUNT;


   end

       IF( @ERR != 0   ) BEGIN
              set @TryCatchError_ID = @ERR
       END

--     select @TryCatchError_ID;
END;



--  return @TryCatchError_ID

  SET @END_DATETIME = sysdatetime();


IF (@LOG_HISTORY = 1) begin
       EXEC  MWH.MNG_LOAD_HISTORY   'FINISHED', @END_DATETIME, @LOAD_HIST_PKID ,  @Source_Server_Name,  @Source_DB_Name,  @Source_Schema_Name,  @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME, '', '', @rtn_Insert_Cnt , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
END;

--  do a tempdb cleanup

              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW;

              IF OBJECT_ID('tempdb..#ALL_REPORT_ETL_WINDOWS') IS NOT NULL
              DROP TABLE #ALL_REPORT_ETL_WINDOWS;

              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW_DATA') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW_DATA;

              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW_2') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW_2;



GO





grant select on [MWH].[ETL_CONTROL_MANAGER] to public;

grant select on [MWH].[ETL_HISTORY] to public;




grant select on [MWH].[ETL_ENGINE_HISTORY] to public;
grant select on [MWH].[ETL_CONTROL_MANAGER] to public;
grant select on [MWH].[ETL_HISTORY] to public;
grant select on [MWH_DIM].[D_ADMIN_CONSOLE_USER] to public;
grant select on [MWH].[ETL_TryCatchError] to public;



grant execute on MWH.UMA_WAREHOUSE_ADMIN_CONSOLE to public

grant execute on MWH.MNG_LOAD_HISTORY to public

grant execute on  MWH.MERGE_ETL_TryCatchError_wRtn to public
go
