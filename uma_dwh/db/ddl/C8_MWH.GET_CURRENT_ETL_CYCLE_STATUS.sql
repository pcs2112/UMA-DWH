 
-- C8_MWH.GET_CURRENT_ETL_CYCLE_STATUS.sql
 
USE [UMA_DWH]
GO
 
 
-- select * from [MWH].[ETL_HISTORY] with(nolock) where START_DTTM >= dateadd(minute, -90, getdate())  and END_DTTM is null   --- check if a ETL is running
 
--   exec   MWH.GET_CURRENT_ETL_CYCLE_STATUS  'I3_NON-MCS';
 
-- select sysdatetime()
 
--  grant execute on MWH.GET_CURRENT_ETL_CYCLE_STATUS to public
 
 
--   select top 1000 * from [MWH].[ETL_HISTORY] with(nolock) where [CALLING_PROC]  in (  'MWH.GET_CURRENT_ETL_CYCLE_STATUS', 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE')  order by ID desc
 
--      select top 1000 cm.DATA_MART_NAME,   eh.* from [MWH].[ETL_HISTORY] eh with(nolock) join [MWH].[ETL_CONTROL_MANAGER]  cm  with(nolock)  on (cm.PROCEDURE_NAME = eh.CALLING_PROC)  where  cm.DATA_MART_NAME  = 'LION_OUTGOING'  order by eh.ID desc
--  select sysdatetime()
 
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'GET_CURRENT_ETL_CYCLE_STATUS' and ss.name = 'MWH')
       DROP PROCEDURE MWH.GET_CURRENT_ETL_CYCLE_STATUS
GO
 
SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO
 
 
CREATE PROCEDURE MWH.GET_CURRENT_ETL_CYCLE_STATUS
 @FirstDataMartInCycle     varchar(80)
AS
 
 
 
--  DECLARE  @FirstDataMartInCycle      varchar(80);
 
SET          @FirstDataMartInCycle =  'I3_NON-MCS';
 
DECLARE  @rtn_Insert_Cnt                              INTEGER = -1;
 DECLARE  @rtn_Update_Cnt                              INTEGER = -1;
DECLARE  @rtn_Delete_Cnt                              INTEGER = -1;
 
DECLARE                   @LOAD_HIST_PKID                   INTEGER;
DECLARE @END_DATETIME                                        DATETIME2;
DECLARE @START_DATETIME                               DATETIME2;
SET @START_DATETIME = sysdatetime();
 
DECLARE             @START_DTTM                              DATETIME;
DECLARE             @FROM_TO_RANGE                           INTEGER;
DECLARE             @CYCLE_HISTORY_START_ID           INTEGER;
DECLARE             @CYCLE_HISTORY_END_ID             INTEGER;
DECLARE             @ETL_CYCLE_START                  INTEGER;
DECLARE             @ETL_CYCLE_END                           INTEGER;
DECLARE             @REPORT_NAME                      VARCHAR(80) ;
DECLARE             @REPORT_FROM_NUM                  INTEGER;
DECLARE             @REPORT_TO_NUM                           INTEGER;
DECLARE             @TotalETL_JOBS_IN_CYCLE           INTEGER;
DECLARE             @FirstPROCInCycle                 varchar(80);
DECLARE             @SELECT_CNT                              INTEGER;
DECLARE             @START_WINDOW_DTTM DATETIME;
DECLARE             @END_WINDOW_DTTM DATETIME;
DECLARE             @MIN_CYCLE_EH_ID                         INTEGER;
DECLARE             @MAX_CYCLE_EH_ID                         INTEGER;
DECLARE             @IN_8AM_TO_8PM                                  INTEGER = 0;
 
 
DECLARE             @UMA_DWH_STATUS_IN_CYCLE   VARCHAR(30);
 
DECLARE             @WORK_DAY_START                          DATETIME;    
DECLARE             @WORK_DAY_END                     DATETIME;
DECLARE             @CHECK_ALL                               INTEGER  = 0;
DECLARE             @JOBS_RUNNING_OR_DONE             INTEGER = 0;
DECLARE             @CURRENT_WINDOW_JOBS_STATUS varchar(20) = NULL;
SET                 @WORK_DAY_START  = GETDATE();
 
DECLARE      @DATAMART_STATUS           VARCHAR(30)  =  '';
DECLARE      @JOB_FINISHED_CNT          INTEGER =  0;
DECLARE      @MIN_H_DTTM                       DATETIME    ;
DECLARE      @MAX_H_DTTM                       DATETIME  ;
DECLARE      @DIFF_TIME                        TIME  ;
DECLARE      @DATAMART_TRAN_RATE        DECIMAL(8,2) ;
 
  -- EXEC  MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0 ,'MLK-EDM-D-sq02','UMA_DWH','MWH','ETL_CONTROL_MANAGER ETC...', 'BROWSER', 'RUN', 'MWH.GET_CURRENT_ETL_CYCLE_STATUS', '', '', 0 , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
 
 
--   FLAG in workday  (  8am to 8pm ), to 1, else 0 ...  This will be used to check if any jobs are running, if not 'STOPPED!'  and if not in work day and not running  'STOPPED'
--   the webapp will show the error and send back
SELECT @IN_8AM_TO_8PM =   case when  CONVERT(VARCHAR(8),@WORK_DAY_START,108) between '08:00:00'  and '20:00:00' then 1 else 0  end;
 
              IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW;
 
              CREATE TABLE #CURRENT_ETL_WINDOW
              (
              WINDOW               CHAR(1), 
              FROM_DTTM            DATETIME,
              TO_DTTM                    DATETIME,
              CHECK_NOW            INTEGER
              );
 
             
              with CURRENT_WINDOW_PARTS ( WINDOW_DATE, HR, WINDOW, WINDOW_START_MIN_SEC , WINDOW_END_MIN_SEC,  CHECK_IF_RUNNING) as (
              select  
              cast(@START_DATETIME as date) as WINDOW_DATE,
              substring(cast(cast(@START_DATETIME as time) as varchar(20)), 1,2) as HR,
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then 'A' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then 'B' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then 'C' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then 'D' else (
              '-')  end )  end )  end )  end   as WINDOW,
 
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '00:00' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '15:00' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '30:00' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '45:00' else (
              '-')  end )  end )  end )  end   as WINDOW_START_MIN_SEC,
 
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:00:00' as time) and cast('00:14:59' as time)  then '14:59' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:15:00' as time) and cast('00:29:59' as time)  then '29:59' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:30:00' as time) and cast('00:44:59' as time)  then '44:59' else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:45:00' as time) and cast('00:59:59' as time)  then '59:59' else (
              '-')  end )  end )  end )  end   as WINDOW_END_MIN_SEC,
 
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:03:00' as time) and cast('00:04:59' as time)  then 1 else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:18:00' as time) and cast('00:19:59' as time)  then 1 else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:33:00' as time) and cast('00:34:59' as time)  then 1 else (
              case when cast('00:'+ substring(cast(cast(@START_DATETIME as time) as varchar(20)), 4,5) as time) between cast('00:48:00' as time) and cast('00:49:59' as time)  then 1 else (
              0)  end )  end )  end )  end   as CHECK_IF_RUNNING
 
              --from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock) where ID = (select MAX(ID) from [UMA_DWH].[MWH].[ETL_ENGINE_HISTORY] with(nolock))
              ),
 
              CURRENT_WINDOW (WINDOW,  FROM_DTTM, TO_DTTM, CHECK_IF_RUNNING) as (
              select WINDOW, cast(cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_START_MIN_SEC as datetime),  dateadd(MILLISECOND,998 , cast( cast (WINDOW_DATE as varchar(20)) + ' ' + HR + ':' + WINDOW_END_MIN_SEC as datetime)) , CHECK_IF_RUNNING
              from CURRENT_WINDOW_PARTS
              )
 
              INSERT into #CURRENT_ETL_WINDOW (WINDOW,  FROM_DTTM, TO_DTTM, CHECK_NOW)
              select WINDOW,  FROM_DTTM, TO_DTTM,  CHECK_IF_RUNNING
              from CURRENT_WINDOW;
              SET @SELECT_CNT = @@ROWCOUNT;
 
 
 
              SELECT @START_WINDOW_DTTM = FROM_DTTM from #CURRENT_ETL_WINDOW;
              SET @SELECT_CNT = @@ROWCOUNT;
 
              SELECT @END_WINDOW_DTTM = TO_DTTM from #CURRENT_ETL_WINDOW;
              SET @SELECT_CNT = @@ROWCOUNT;
 
              --  the FIRST cycle ID in this group
              SELECT @CYCLE_HISTORY_START_ID = min(ID) from [MWH].[ETL_ENGINE_HISTORY] with(nolock) where [INSERT_DTTM] >= @START_WINDOW_DTTM   OPTION (RECOMPILE) ;
 
              --  the CURRENT (or last) cycle ID in this group
              SELECT @CYCLE_HISTORY_END_ID = max(ID) from [MWH].[ETL_ENGINE_HISTORY] with(nolock) where [INSERT_DTTM] <= @END_WINDOW_DTTM   OPTION (RECOMPILE) ;
 
              -- the FIRST ETL_HISTORY id in the cycle window
              select @MIN_CYCLE_EH_ID = min(ID) from [MWH].[ETL_HISTORY] with(nolock) where [INSERT_DTTM] >= @START_WINDOW_DTTM   OPTION (RECOMPILE) ;
 
              select @MAX_CYCLE_EH_ID = max(ID) from [MWH].[ETL_HISTORY] with(nolock) where [INSERT_DTTM] <= @END_WINDOW_DTTM   OPTION (RECOMPILE) ;
 
              -- I need MIN_DTTM and MAX_DDTM to run against the ETL_HISORY table to then get  CYCLE#, GROUP # and all the unique ETL jobs in each CYCLE  from MIN_DTTM to MAX_DTTM
 
              SET @ETL_CYCLE_START = @REPORT_FROM_NUM;
 
              SELECT @CHECK_ALL = CHECK_NOW   from  #CURRENT_ETL_WINDOW ;
 
              set @CHECK_ALL = 1;
 
              SET    @MIN_H_DTTM                         =   NULL  ;
              SET    @MAX_H_DTTM                         =   NULL;
              SET    @DIFF_TIME                          =  NULL;
              SET    @DATAMART_TRAN_RATE          = 0.00;
 
 
 
              --select * from #CURRENT_ETL_WINDOW;
 
       IF OBJECT_ID('tempdb..#DATA_MART_NAME')  IS NOT NULL
              DROP TABLE #DATA_MART_NAME;
 
       CREATE TABLE #DATA_MART_NAME (
       [ID]                       [int] IDENTITY(1,1) NOT NULL,
       [DATA_MART_NAME]     [varchar](80) ,
       JOB_COUNT                  SMALLINT ,
       DATAMART_STATUS            varchar(40),
       JOBS_FINISHED        SMALLINT,
       DATAMART_START_DTTM  DATETIME,
       DATAMART_END_DTTM    DATETIME,
       RUN_TIME_TO_CURRENT_DATAMART_STATUS      VARCHAR(20),
       DATAMART_trans_rate               DECIMAL(8,2)
       );
      
 
       INSERT INTO #DATA_MART_NAME (DATA_MART_NAME, DATAMART_STATUS, RUN_TIME_TO_CURRENT_DATAMART_STATUS, JOBS_FINISHED, DATAMART_trans_rate, JOB_COUNT)
       select  DATA_MART_NAME, 'NOT STARTED', '0.00:00:000', 0, 0, count( ID )
       from [MWH].[ETL_CONTROL_MANAGER]  with(nolock)
       where [DATA_MART_NAME] not like '%TEST%'
       and [ACTIVE] = 1
       group by DATA_MART_NAME;
 
       set @TotalETL_JOBS_IN_CYCLE = (select sum(JOB_COUNT) from #DATA_MART_NAME);
 
 
       IF OBJECT_ID('tempdb..#DATA_MART_PROCS')  IS NOT NULL
              DROP TABLE #DATA_MART_PROCS;
 
       CREATE TABLE #DATA_MART_PROCS (
       [DATA_MART_NAME] [varchar](80) ,
       [PROCEDURE_NAME] [varchar](80) ,
       [PRIORITY] [smallint]
       );
 
       INSERT INTO #DATA_MART_PROCS (DATA_MART_NAME, [PROCEDURE_NAME], [PRIORITY])
       select  DATA_MART_NAME, [PROCEDURE_NAME], [PRIORITY]
       from [MWH].[ETL_CONTROL_MANAGER]  with(nolock)
       where [PROCEDURE_NAME] not like '%TEST%'
       and [ACTIVE] = 1;
 
 
       IF OBJECT_ID('tempdb..#CDATA_MART_NAME')  IS NOT NULL
              DROP TABLE #CDATA_MART_NAME;
 
       CREATE TABLE #CDATA_MART_NAME (
       [DATA_MART_NAME]     [varchar](80) ,
--     ETL_COUNT                  SMALLINT ,
       DATAMART_STATUS            varchar(40),
       JOBS_FINISHED        SMALLINT,
       DATAMART_START_DTTM  DATETIME,
       DATAMART_END_DTTM    DATETIME,
       RUN_TIME_TO_CURRENT_DATAMART_STATUS      VARCHAR(20),
       DATAMART_trans_rate               DECIMAL(8,2)
       );
 
 
INSERT INTO #CDATA_MART_NAME ([DATA_MART_NAME], DATAMART_STATUS, JOBS_FINISHED, DATAMART_START_DTTM, DATAMART_END_DTTM, RUN_TIME_TO_CURRENT_DATAMART_STATUS, DATAMART_trans_rate)
 
select
CM.DATA_MART_NAME,
  case when (SUM(case when H.[END_DTTM] is  null then 1 else 0 end)) != 0 then 'RUNNING' else 'FINISHED' END DATAMART_STATUS,
SUM(case when H.[END_DTTM] is  not null then 1 else 0 end) JOBS_FINISHED,
min( H.[INSERT_DTTM]) DATAMART_START_DTTM,
max( H.[INSERT_DTTM]) DATAMART_END_DTTM,
 [MWH].[ConvertTimeToHHMMSS](datediff(second,min( H.[INSERT_DTTM]) , max( H.[INSERT_DTTM]))) RUN_TIME_TO_CURRENT_DATAMART_STATUS,
case when  sum( datediff(second, H.[INSERT_DTTM],H.[UPDATE_DTTM])) > 0  then cast((sum( H.[INSERT_CNT]+ H.[UPDATE_CNT]) * 1.0) / sum( datediff(second, H.[INSERT_DTTM],H.[UPDATE_DTTM]) ) as DECIMAL(8,2)) else 0  end as DATAMART_trans_rate
--,  max(getdate()) CURRENT_DTTM
 
FROM   [UMA_DWH].[MWH].[ETL_HISTORY]  H  with(nolock)
JOIN [UMA_DWH].[MWH].[ETL_CONTROL_MANAGER]  CM with(nolock) on (CM.PROCEDURE_NAME = H.CALLING_PROC)
WHERE  h.ID between @MIN_CYCLE_EH_ID  and @MAX_CYCLE_EH_ID
and h.TARGET_SCHEMA_NAME != 'BROWSER'
--where H.[ID] >=  (select MAX(h2.ID) from [UMA_DWH].[MWH].[ETL_HISTORY]  H2  with(nolock) where H2.[CALLING_PROC] = @FirstPROCInCycle and H2.[END_DTTM] is NOT null and H2.[STATUS] = 'FINISHED')
group by CM.DATA_MART_NAME ;
SET @SELECT_CNT = @@ROWCOUNT;
 
 
 
       UPDATE  t1
       SET t1.DATAMART_STATUS = t2.DATAMART_STATUS
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME);
 
 
       UPDATE  t1
       SET t1.JOBS_FINISHED = t2.JOBS_FINISHED
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME)
 
       UPDATE  t1
       SET t1.DATAMART_START_DTTM = t2.DATAMART_START_DTTM
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME)
 
 
       UPDATE  t1
              SET t1.DATAMART_END_DTTM = t2.DATAMART_END_DTTM
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME)
 
 
       UPDATE  t1
       SET t1.RUN_TIME_TO_CURRENT_DATAMART_STATUS = t2.RUN_TIME_TO_CURRENT_DATAMART_STATUS
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME)
 
       UPDATE  t1
       SET t1.DATAMART_trans_rate = t2.DATAMART_trans_rate
       FROM #DATA_MART_NAME t1
       JOIN  #CDATA_MART_NAME t2 on (t1.DATA_MART_NAME = t2.DATA_MART_NAME)
 
       SELECT @JOBS_RUNNING_OR_DONE = count(*) from #DATA_MART_NAME where DATAMART_START_DTTM is NOT NULL;
 
 
       IF ( @CHECK_ALL = 1 and @JOBS_RUNNING_OR_DONE = 0) BEGIN
              IF ( @IN_8AM_TO_8PM = 1 ) begin
                     SET @CURRENT_WINDOW_JOBS_STATUS = 'STOPPED!';
              END ELSE BEGIN
                     SET @CURRENT_WINDOW_JOBS_STATUS = 'STOPPED';
              END
       END
 
 
--  *******************************************************************   INSERT THE SUMMARY ROW FOR ALL THE ETL DATA_MARTS  *********************************************************************
--   exec   MWH.GET_CURRENT_ETL_CYCLE_STATUS  'I3_NON-MCS';
 
select
@DATAMART_STATUS =  case when @CURRENT_WINDOW_JOBS_STATUS is NULL  then  (case when (select count(*) from [UMA_DWH].[MWH].[ETL_HISTORY]  H3  with(nolock) where   H3.[END_DTTM] is  null  and ID >= @MIN_CYCLE_EH_ID ) != 0  then 'RUNNING' else 'CYCLE FINISHED' end) else  @CURRENT_WINDOW_JOBS_STATUS end  ,
@JOB_FINISHED_CNT = count(*),
@MIN_H_DTTM  =  coalesce(min( H.[INSERT_DTTM]) , cast('1990-01-01'  as date) ),
@MAX_H_DTTM  =  coalesce(max( H.[INSERT_DTTM]) , cast('1990-01-01'  as date) ),
@DIFF_TIME   =  coalesce( [MWH].[ConvertTimeToHHMMSS](datediff(second,min( H.[INSERT_DTTM]) , max( H.[INSERT_DTTM]))),cast('00:00:00'  as time) ) ,
@DATAMART_TRAN_RATE  =  case when  sum( datediff(second, H.[INSERT_DTTM],H.[UPDATE_DTTM])) > 0  then cast((sum( H.[INSERT_CNT]+ H.[UPDATE_CNT]) * 1.0) / sum( datediff(second, H.[INSERT_DTTM],H.[UPDATE_DTTM]) ) as DECIMAL(8,2)) else 0  end
  FROM [UMA_DWH].[MWH].[ETL_HISTORY]  H  with(nolock)
  JOIN [UMA_DWH].[MWH].[ETL_CONTROL_MANAGER]  CM with(nolock) on (CM.PROCEDURE_NAME = H.CALLING_PROC)
where H.[ID] >= @MIN_CYCLE_EH_ID
having count(*) > 0
OPTION (RECOMPILE);
 
 
 
 
 
INSERT INTO #DATA_MART_NAME ( DATA_MART_NAME, JOB_COUNT, DATAMART_STATUS, JOBS_FINISHED, DATAMART_START_DTTM, DATAMART_END_DTTM, RUN_TIME_TO_CURRENT_DATAMART_STATUS, DATAMART_trans_rate )
VALUES ( 
       'UMA_DWH TOTAL',
       @TotalETL_JOBS_IN_CYCLE  ,
       @DATAMART_STATUS,
       @JOB_FINISHED_CNT,
       @MIN_H_DTTM,
       @MAX_H_DTTM,
       @DIFF_TIME,
       @DATAMART_TRAN_RATE
);
 

select [DATA_MART_NAME]    ,
coalesce(  @CURRENT_WINDOW_JOBS_STATUS , case when JOB_COUNT = JOBS_FINISHED then DATAMART_STATUS else(case when JOBS_FINISHED = 0 then 'NOT STARTED' else 'RUNNING' end) end) as DATA_MART_STATUS, 
JOB_COUNT,
JOBS_FINISHED,
DATAMART_START_DTTM  AS 'DATA_MART_START_DTTM',
DATAMART_END_DTTM AS 'DATA_MART_END_DTTM',
RUN_TIME_TO_CURRENT_DATAMART_STATUS  AS 'RUN_TIME_TO_CURRENT_DATA_MART_STATUS' ,
DATAMART_trans_rate AS 'DATA_MART_TRANS_RATE'
from #DATA_MART_NAME  order by ID asc;
 
 
 
set @rtn_Insert_Cnt = @@ROWCOUNT;
 
 
IF OBJECT_ID('tempdb..#CURRENT_ETL_WINDOW') IS NOT NULL
              DROP TABLE #CURRENT_ETL_WINDOW;
 
IF OBJECT_ID('tempdb..#DATA_MART_NAME')  IS NOT NULL
              DROP TABLE #DATA_MART_NAME;
 
IF OBJECT_ID('tempdb..#CDATA_MART_NAME')  IS NOT NULL
              DROP TABLE #CDATA_MART_NAME;
 
IF OBJECT_ID('tempdb..#DATA_MART_PROCS')  IS NOT NULL
              DROP TABLE #DATA_MART_PROCS;
 
 
 
 
SET @END_DATETIME = sysdatetime();
 
-- EXEC  MWH.MNG_LOAD_HISTORY   'FINISHED', @END_DATETIME, @LOAD_HIST_PKID ,'MLK-EDM-D-sq02','UMA_DWH','MWH','ETL_HISTORY ETC...', 'BROWSER', 'RUN', 'MWH.GET_CURRENT_ETL_CYCLE_STATUS', '', '', @rtn_Insert_Cnt , 0 , 0, 0 , 0, '',   @LOAD_HIST_PKID  OUTPUT;
 
 
RETURN
 
GO
 
 
grant execute on MWH.GET_CURRENT_ETL_CYCLE_STATUS to public
 
go