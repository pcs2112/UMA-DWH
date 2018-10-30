--  C8_MWH.STATISTICS_CONTROL_ENGINE.sql

--  AAA_STATISTICS_UPDATE_NOTES_OCT_17_2018


--   C8_MWH.STATISTICS_ENGINE_HISTORY.sql,   table containing one row for each HISTORY call
--   C8_MWH.STATISTICS_ENGINE_TABLE_HISTORY.sql,   table containing one row for each HISTORY TABLE call,  with a FK back to STATISTICS_ENGINE_HISTORY

USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/*

update statistics [MWH_FACT].[F_STUDENT] with FULLSCAN, ALL



1)     List all the tables in UMA_DWH

2)     Get the last update statistics DTTM for each table, note the RUN-TIME

3)     Sort the FULL list of tables by the LAST DTTM, NULL then OLDEST.

       For each table,  if enough time exists before the Maintenance Window end then :

                     exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS'

with UMA_DWH_TABLES ( schema_name,  table_name, SCH_TAB_TXT) as (
       SELECT table_schema, table_name, concat('[' , table_schema , '].[' , table_name , ']')
       FROM information_schema.tables   with(nolock)
       WHERE table_type = 'base table'  )

select udt.schema_name,  udt.table_name, sp.stats_id, name, filter_definition, last_updated, rows, rows_sampled, steps, unfiltered_rows, modification_counter
from UMA_DWH_TABLES udt

left join sys.stats AS stat  with(nolock) on (stat.object_id = object_id(udt.SCH_TAB_TXT))
CROSS APPLY sys.dm_db_stats_properties(stat.object_id, stat.stats_id) AS sp




with UMA_DWH_TABLES ( schema_name,  table_name, SCH_TAB_TXT) as (
       SELECT table_schema, table_name, concat('[' , table_schema , '].[' , table_name , ']')
       FROM information_schema.tables   with(nolock)
       WHERE table_type = 'base table'  )

select   udt.schema_name,  udt.table_name,    max(last_updated) as LAST_DTTM, min(rows) as MIN_ROWS, min(rows_sampled) as MIN_SAMPLED, max(rows_sampled)as MAX_SAMPLED,   min(modification_counter) as MIN_MODIFIED_CNT,   max(modification_counter) as MAX_MODIFIED_CNT
from UMA_DWH_TABLES udt

left join sys.stats AS stat  with(nolock) on (stat.object_id = object_id(udt.SCH_TAB_TXT))
CROSS APPLY sys.dm_db_stats_properties(stat.object_id, stat.stats_id) AS sp
group by udt.schema_name,  udt.table_name
order by max(last_updated) asc





UMA_DWH_TABLES_LAST_RS ( schema,  name, LAST_RUNSTAT_DTTM) as (


SELECT sp.stats_id, name, filter_definition, last_updated, rows, rows_sampled, steps, unfiltered_rows, modification_counter
FROM sys.stats AS stat
CROSS APPLY sys.dm_db_stats_properties(stat.object_id, stat.stats_id) AS sp
WHERE stat.object_id = object_id('[MWH].[ETL_HISTORY]')
order by last_updated desc;


exec  MWH.STATISTICS_CONTROL_ENGINE 'RUN', '2018-10-23 11:55'

select * from  [MWH].[TABLE_STATISTICS_QUEUE]


*/

/*   TESTING RESULTS
  select * from [MWH].[STATISTICS_ENGINE_HISTORY] with(nolock) order by ID desc;
  select * from [MWH].[STATISTICS_ENGINE_HISTORY_V] with(nolock) order by [ENGINE START DTTM] desc;
  select * from [MWH].[STATISTICS_ENGINE_TABLE_HISTORY] with(nolock) order by ID desc;
*/



--   TEST RUN
--   exec  MWH.STATISTICS_CONTROL_ENGINE 'RUN', '2018-10-25 13:00'



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'STATISTICS_CONTROL_ENGINE' and ss.name = 'MWH')
       DROP PROCEDURE MWH.STATISTICS_CONTROL_ENGINE
GO



CREATE PROCEDURE [MWH].[STATISTICS_CONTROL_ENGINE]
  @message VARCHAR(20),   --  valid meaages :   RUN
  @End_DTTM          datetime

AS

 --DECLARE @message               VARCHAR(20)  =  'RUN';   --  valid meaages :   RUN
--DECLARE @End_DTTM              datetime = '2018-10-22 17:30';


SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET NOCOUNT ON;

DECLARE @InsertedRows AS TABLE (Id int);
DECLARE @STATISTICS_ENGINE_HISTORY_Id INTEGER = -1;

DECLARE @STATISTICS_ENGINE_HISTORY_Id_TXT      varchar(20) = '';

DECLARE @SP_NAME              varchar(80);
DECLARE @CHECK_ETL_IN_REALTIME   SMALLINT;
DECLARE @PERIOD_START_DTTM       DATETIME2;
DECLARE @PERIOD_END_DTTM         DATETIME2;
DECLARE @EngineMessage                  VARCHAR(80);
DECLARE @ETL_HISTORY_ID          INTEGER;
DECLARE @SP_END_DTTM                    DATETIME2;
DECLARE @SP_MAX_DTTM                    DATETIME2;

DECLARE @SP_START_DTTM                  DATETIME2;
DECLARE @CHECK_MERGE_ALL         SMALLINT = 0;

DECLARE             @ERR                 INTEGER  = 0 ;
DECLARE             @ErrorSeverity       INTEGER;
DECLARE             @ErrorState          INTEGER;
DECLARE             @ErrorProcedure      nvarchar(128) ;
DECLARE             @ErrorLine           INTEGER;
DECLARE             @ErrorMessage nvarchar(4000);

DECLARE             @SP_NAME_CALLED      nvarchar(128) =  '';

DECLARE             @TryCatchError_ID    INTEGER;

DECLARE             @COUNTS                           INTEGER;
DECLARE             @TOTAL_SEC                 INTEGER;
DECLARE             @INSERT_CNT                INTEGER;
DECLARE             @UPDATE_CNT                INTEGER;
DECLARE             @AVG_RUNTIME_SEC     NUMERIC(7,3);
DECLARE             @AVG_ROW_P_SEC             NUMERIC(7,3);

DECLARE             @ETL_TIME_OVERRUN                        INTEGER = 0;
DECLARE             @ETL_LOW_INSERT_Count                    INTEGER = 0;
DECLARE             @ETL_LOW_UPDATE_Count                    INTEGER = 0;
DECLARE             @QUALITY_ERROR_MESSAGE                   VARCHAR(400);
 DECLARE             @ETL_START                                      DATETIME;
DECLARE             @ETL_FINISH                              DATETIME;



DECLARE             @table_schema                            varchar(80);
DECLARE             @table_name                                     varchar(80);


DECLARE             @Target_Server_Name varchar(60);
SET @Target_Server_Name = @@SERVERNAME;

DECLARE             @Target_DB_Name varchar(40);
SET  @Target_DB_Name = DB_NAME();

declare  @Mycurrent_DTTM  datetime;
set    @Mycurrent_DTTM = getdate();


IF  ( case when datepart(hour, @Mycurrent_DTTM) between 6 and 10 then 0 else 1 end ) = 0 begin
--  stop run stats from running in automatic mode, because its IN the WORKDAY
       set @End_DTTM = null;
end else begin

IF (@End_DTTM is null) or ( datediff(hour, @Mycurrent_DTTM, @End_DTTM) > 12 ) begin
--  set to 5am the next day, if the current time is after 8PM
 IF( datepart(hour, @Mycurrent_DTTM) >= 10 ) begin
       select @End_DTTM =  DATEADD(HOUR,5,CONVERT(VARCHAR(10), @Mycurrent_DTTM+1,110))
end else if (datepart(hour, @Mycurrent_DTTM) < 4) begin
       select @End_DTTM =  DATEADD(HOUR,5,CONVERT(VARCHAR(10), @Mycurrent_DTTM,110))
end else begin
       set @End_DTTM = null;
end
end;
end;






DECLARE                    @CUR_schema_name           varchar(80);
DECLARE                    @CUR_table_name                   varchar(80);
DECLARE                    @CUR_SCH_TAB_TXT           varchar(160);

DECLARE                    @CUR_LAST_DTTM                    datetime;
DECLARE                    @CUR_MIN_ROWS              INTEGER;
DECLARE                    @CUR_MIN_SAMPLED           INTEGER;
DECLARE                    @CUR_MAX_SAMPLED           INTEGER;
DECLARE                    @CUR_MIN_MODIFIED_CNT      INTEGER;
DECLARE                    @CUR_MAX_MODIFIED_CNT      INTEGER;
DECLARE                    @Current_DTTM              DATETIME;
DECLARE                    @QUEUED_DTTM               DATETIME;


IF  @message = 'RUN'  and  @End_DTTM is NOT null
       BEGIN


       INSERT INTO MWH.STATISTICS_ENGINE_HISTORY  (ENGINE_STATUS, ENGINE_MESSAGE, TARGET_SERVER_NAME, TARGET_DB_NAME,  SCHEDULED_END_DTTM  )
       VALUES ('STARTED',   UPPER(@message), @Target_Server_Name, @Target_DB_Name,  @End_DTTM );
       SELECT @STATISTICS_ENGINE_HISTORY_Id = @@IDENTITY ;


       SET @SP_START_DTTM = sysdatetime();


       DECLARE db_cursor_statistics_engine CURSOR FOR
       with UMA_DWH_TABLES ( schema_name,  table_name, SCH_TAB_TXT, queued_dttm) as (
       SELECT st.table_schema, st.table_name, concat('[' , st.table_schema , '].[' , st.table_name , ']'), qt.INSERT_DTTM
       FROM information_schema.tables st  with(nolock)
       left join [MWH].[TABLE_STATISTICS_QUEUE] qt with(nolock) on (qt.TARGET_SCHEMA_NAME = st.table_schema and qt.TARGET_TABLE_NAME = st.table_name and qt.STATUS = 'QUEUED')
       WHERE st.table_type = 'base table'  )

       select   udt.schema_name,  udt.table_name, udt.SCH_TAB_TXT,   max(last_updated) as LAST_DTTM, coalesce(min(rows),0) as MIN_ROWS, coalesce(min(rows_sampled),0) as MIN_SAMPLED, coalesce(max(rows_sampled),0) as MAX_SAMPLED,   coalesce(min(modification_counter),0) as MIN_MODIFIED_CNT,   coalesce(max(modification_counter),0) as MAX_MODIFIED_CNT, coalesce(min(queued_dttm),'2100-10-21') as QUEUED_DTTM
       from UMA_DWH_TABLES udt
       left join sys.stats AS stat  with(nolock) on (stat.object_id = object_id(udt.SCH_TAB_TXT))
       CROSS APPLY sys.dm_db_stats_properties(stat.object_id, stat.stats_id) AS sp
       group by udt.schema_name,  udt.table_name, udt.SCH_TAB_TXT
       order by min(queued_dttm) desc, max(last_updated) asc;

       OPEN db_cursor_statistics_engine
       FETCH NEXT FROM db_cursor_statistics_engine INTO  @CUR_schema_name, @CUR_table_name, @CUR_SCH_TAB_TXT, @CUR_LAST_DTTM, @CUR_MIN_ROWS, @CUR_MIN_SAMPLED, @CUR_MAX_SAMPLED, @CUR_MIN_MODIFIED_CNT, @CUR_MAX_MODIFIED_CNT, @QUEUED_DTTM

       SET    @Current_DTTM = getdate();
       SET @TryCatchError_ID = 0;

       WHILE @@FETCH_STATUS = 0  and  @TryCatchError_ID = 0   and  @Current_DTTM  < @End_DTTM
       BEGIN
              set @ERR = null;
              set @EngineMessage = null;
              set @TryCatchError_ID = 0;

              BEGIN TRY

                     UPDATE MWH.STATISTICS_ENGINE_HISTORY
                     SET ENGINE_STATUS = concat('RUNNING : ' , @CUR_SCH_TAB_TXT )
                     WHERE ID = @STATISTICS_ENGINE_HISTORY_Id;

                     SET  @STATISTICS_ENGINE_HISTORY_Id_TXT  =  cast( @STATISTICS_ENGINE_HISTORY_Id as varchar(20))

                     exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MLK-EDM-D-SQ02', 'UMA_DWH',  @CUR_schema_name,  @CUR_table_name, 'FULLSCAN', '', @CUR_SCH_TAB_TXT, @STATISTICS_ENGINE_HISTORY_Id_TXT, @CUR_LAST_DTTM, @CUR_MIN_ROWS, @CUR_MIN_SAMPLED, @CUR_MAX_SAMPLED, @CUR_MIN_MODIFIED_CNT, @CUR_MAX_MODIFIED_CNT, @QUEUED_DTTM


              END TRY
              BEGIN CATCH
                     SELECT
                      @ERR = ERROR_NUMBER()
                     ,@ErrorSeverity = ERROR_SEVERITY()
                     ,@ErrorState = ERROR_STATE()
                     ,@ErrorProcedure = ERROR_PROCEDURE()
                     ,@ErrorLine = ERROR_LINE()
                     ,@ErrorMessage = ERROR_MESSAGE() ;

                      SET @SP_NAME_CALLED = 'MWH.ETL_CONTROL_ENGINE calling ' + @SP_NAME;

                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @SP_NAME_CALLED, @TryCatchError_ID   OUTPUT;

              END CATCH;

              SET    @Current_DTTM = getdate();

              FETCH NEXT FROM db_cursor_statistics_engine INTO  @CUR_schema_name, @CUR_table_name, @CUR_SCH_TAB_TXT, @CUR_LAST_DTTM, @CUR_MIN_ROWS, @CUR_MIN_SAMPLED, @CUR_MAX_SAMPLED, @CUR_MIN_MODIFIED_CNT, @CUR_MAX_MODIFIED_CNT, @QUEUED_DTTM
       END

       CLOSE db_cursor_statistics_engine
       DEALLOCATE db_cursor_statistics_engine

       UPDATE MWH.STATISTICS_ENGINE_HISTORY
       SET ENGINE_STATUS = 'FINISHED', DONE_DTTM = SYSDATETIME(), [TryCatchError_ID] = @TryCatchError_ID
       WHERE ID = @STATISTICS_ENGINE_HISTORY_Id;



END



ELSE
      BEGIN
                     INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                     VALUES (  concat(' MWH.STATISTICS_ENGINE_HISTORY  message error, invalid message : ', @message )  , 'MWH.STATISTICS_ENGINE_HISTORY' , 0  );
       END

--     return ( 0 )

GO






--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'MWH', 'ETL_HISTORY', 'FULL SCAN', '', '', '', ''


--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02', 'UMA_DWH',  'MWH', 'ETL_HISTORY', 'FULL SCAN', '', '', ''
