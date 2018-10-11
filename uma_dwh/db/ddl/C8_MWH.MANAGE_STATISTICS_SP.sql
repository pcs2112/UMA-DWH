-- C8_MWH.MANAGE_STATISTICS_SP.sql

--  new examples
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', 'MCS_InteractionSummary', '', '', '', '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', '', '', '', '', '', '', ''




/*

DECLARE @MYDATE   DATETIME;
DECLARE @MYDATETO   DATETIME;

SET @MYDATE = '2018-09-22'

--WHILE @MYDATE < '2018-09-23' begin
       --select  @MYDATE , dateadd(day,1,@MYDATE);
       SET  @MYDATETO =  dateadd(day,1,@MYDATE);

       exec S_I3.MERGE_MCS_INTX_PARTICIPANT @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_INTXSEGMENT @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_INTX_PARTICIPANT @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_UMALEADCALLDETAIL @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_AGENTACTIVITYLOG @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_EE_TRANSFEREVENTS @MYDATE , @MYDATETO;

       exec S_I3.MERGE_MCS_INTERACTIONCUSTOMATTRIBUTES @MYDATE , @MYDATETO;



       set @MYDATE = dateadd(day,1,@MYDATE);
end;



drop table [MWH].[TABLE_STATISTICS_MANUAL_RUNS];

CREATE TABLE [MWH].[TABLE_STATISTICS_MANUAL_RUNS](
       [ID]                              [int] IDENTITY(1,1) NOT NULL,
       [START_DTTM]               [datetime] NOT NULL,
       [END_DTTM]                        [datetime] NULL,
       [RUN_TIME_MS]              [BIGINT]  NULL,
       [UPDATE_DTTM]              [datetime] NOT NULL,
       [LST_MOD_USER]                    [varchar](80)  NULL,
       [MESSAGE]                         [varchar](200) NOT NULL,
       [STATUS]                          [varchar](100) NOT NULL,
       [TARGET_SERVER_NAME] [varchar](60) NOT NULL,
       [TARGET_DB_NAME]           [varchar](60) NOT NULL,
       [TARGET_SCHEMA_NAME] [varchar](60) NOT NULL,
       [TARGET_TABLE_NAME]        [varchar](60) NOT NULL,
       [STATISTICS_METHOD]        [varchar](2000) NOT NULL,
       [TryCatchError_ID]         INTEGER                    NULL

CONSTRAINT [PK_TABLE_STATISTICS_MANUAL_RUNS] PRIMARY KEY NONCLUSTERED
(
       [ID] ASC,
       [START_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  ON UMA_YEAR_MWH_FACT_I_PS(START_DTTM)
) ON  UMA_YEAR_MWH_FACT_D_PS(START_DTTM);

GO

ALTER TABLE [MWH].[TABLE_STATISTICS_MANUAL_RUNS] ADD  CONSTRAINT [TABLE_STATISTICS_MANUAL_RUNS_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]
GO

CREATE TRIGGER MWH.TABLE_STATISTICS_MANUAL_RUNS_UD_TRIG
ON MWH.TABLE_STATISTICS_MANUAL_RUNS
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.TABLE_STATISTICS_MANUAL_RUNS
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_MANUAL_IDX_01] ON [MWH].[TABLE_STATISTICS_MANUAL_RUNS]
(
       [START_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(START_DTTM)
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_MANUAL_IDX_02] ON [MWH].[TABLE_STATISTICS_MANUAL_RUNS]
(
       [ID] ASC,
       [START_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(START_DTTM)
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_MANUAL_IDX_03] ON [MWH].[TABLE_STATISTICS_MANUAL_RUNS]
(
       TryCatchError_ID  DESC,
       ID ASC,
       [START_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(START_DTTM)
GO





DBCC SHOW_STATISTICS ("[MWH].[F_MCS_CALLS]",[FINAL_DIAL_DTTM]) ;
GO

DBCC SHOW_STATISTICS ("[MWH].[F_MCS_CALLS]",[FINAL_DIAL_DTTM]) WITH HISTOGRAM;
GO
Daily.Rebuld Indexes UMA_DWH

*/

--     message , schema, table_name, Scan Type
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', 'MCS_InteractionSummary', '', '', '', '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', '', '', '', '', '', '', ''


--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'S_I3', '', 'FULL SCAN', '', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'S_LION', '', 'FULL SCAN', '', '', '', '', ''


--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MWH_FACT', '', 'FULL SCAN', '', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MWH_XREF', '', 'FULL SCAN', '', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  ''GET STATISTICS DETAIL'',  'S_CVPROD', '', 'FULL SCAN', '', '', '', '', ''







--  SELECT * from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock) order by ID desc



USE [UMA_DWH];


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MANAGE_STATISTICS_SP' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MANAGE_STATISTICS_SP
GO



CREATE PROCEDURE MWH.MANAGE_STATISTICS_SP
       @VARCHAR_01                varchar(256) = '',
       @VARCHAR_02                varchar(256),
       @VARCHAR_03                varchar(256),
       @VARCHAR_04                varchar(256),
       @VARCHAR_05                varchar(256),
       @VARCHAR_06                varchar(256),
       @VARCHAR_07                varchar(256),
       @VARCHAR_08                 varchar(256),
       @VARCHAR_09                varchar(256)


       with recompile
AS


--  DECLARE         @VARCHAR_01                varchar(256) = 'UPDATE STATISTICS';
--  DECLARE         @VARCHAR_02                varchar(256) = 'S_I3';
--  DECLARE         @VARCHAR_03                varchar(256) = 'MCS_InteractionSummary';
--  DECLARE         @VARCHAR_04                varchar(256) = 'FULL SCAN';



DECLARE             @message             VARCHAR(40);
SET @message = @VARCHAR_01;

DECLARE             @SCHEMA                    VARCHAR(40);
SET   @SCHEMA = @VARCHAR_02;

  DECLARE            @TABLE               VARCHAR(40);
SET   @TABLE = @VARCHAR_03;

DECLARE             @STATISTICS_METHOD   VARCHAR(40);
SET   @STATISTICS_METHOD    = @VARCHAR_04;

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET NOCOUNT ON;

DECLARE             @ERR                       INTEGER  = 0 ;
DECLARE             @ErrorSeverity             INTEGER;
DECLARE             @ErrorState                INTEGER;
DECLARE             @ErrorProcedure            nvarchar(128) ;
DECLARE             @ErrorLine                 INTEGER;
DECLARE             @ErrorMessage        nvarchar(4000);
DECLARE             @TryCatchError_ID    INTEGER  = 0 ;


DECLARE             @InsertedRows table([Id] INTEGER);
DECLARE             @STATUS_MESSAGE            VARCHAR(100);


DECLARE             @TAB_SCHEMA_N_TAB_NAME  varchar(80);
DECLARE             @TABLE_SCHEMA              varchar(80);
 DECLARE             @TABLE_NAME                       varchar(80);



DECLARE             @sql VARCHAR(MAX);

DECLARE             @RUNSTAT_START_DTTM        DATETIME;
DECLARE             @RUNSTAT_DONE_DTTM         DATETIME;
DECLARE             @CURRENT_DTTM               DATETIME;
DECLARE             @START_DTTM                       DATETIME;

DECLARE             @PK_ID_RTN                        INTEGER;

DECLARE             @Source_Server_Name varchar(60);
SET @Source_Server_Name = @@SERVERNAME;

DECLARE              @Source_DB_Name varchar(40);
SET  @Source_DB_Name = DB_NAME();



IF( @message = 'UPDATE STATISTICS')  BEGIN

SELECT '[' + TABLE_SCHEMA + '].[' + TABLE_NAME + ']' FROM information_schema.tables  where TABLE_TYPE = 'BASE TABLE'  and ( TABLE_SCHEMA = @SCHEMA  or  @SCHEMA is NULL or @SCHEMA = '') and  ( TABLE_NAME = @TABLE  or  @TABLE is NULL or @TABLE = ''  );


       DECLARE db_cursor_run_stats CURSOR FOR
       SELECT '[' + TABLE_SCHEMA + '].[' + TABLE_NAME + ']',  TABLE_SCHEMA ,  TABLE_NAME FROM information_schema.tables  where TABLE_TYPE = 'BASE TABLE'  and ( TABLE_SCHEMA = @SCHEMA  or  @SCHEMA is NULL or @SCHEMA = '') and  ( TABLE_NAME = @TABLE  or  @TABLE is NULL or @TABLE = ''  );

       OPEN db_cursor_run_stats
       FETCH NEXT FROM db_cursor_run_stats INTO @TAB_SCHEMA_N_TAB_NAME ,  @TABLE_SCHEMA,  @TABLE_NAME

       WHILE @@FETCH_STATUS = 0
       BEGIN

              BEGIN TRY
                     SET @START_DTTM = GETDATE();
                     SET @TryCatchError_ID = 0;
                     SET @STATUS_MESSAGE = 'RUNNING';

                     INSERT INTO [MWH].[TABLE_STATISTICS_MANUAL_RUNS] (     [START_DTTM],  [UPDATE_DTTM],  [MESSAGE], [STATUS], [TARGET_SERVER_NAME], [TARGET_DB_NAME], [TARGET_SCHEMA_NAME], [TARGET_TABLE_NAME], [STATISTICS_METHOD], [TryCatchError_ID] )
                     OUTPUT inserted.ID INTO @InsertedRows
                     VALUES ( @START_DTTM, @START_DTTM, @message, 'RUNNING',  @Source_Server_Name,  @Source_DB_Name, @TABLE_SCHEMA,  @TABLE_NAME, @STATISTICS_METHOD, @TryCatchError_ID );

                     SELECT @PK_ID_RTN = ID FROM @InsertedRows;

                     SET @sql = 'UPDATE STATISTICS ' + @TAB_SCHEMA_N_TAB_NAME + ' ;';

                     EXEC (@sql);

                     SET @STATUS_MESSAGE = 'FINISHED';

              END TRY
              BEGIN CATCH
                           SELECT
                            @ERR = ERROR_NUMBER()
                           ,@ErrorSeverity = ERROR_SEVERITY()
                           ,@ErrorState = ERROR_STATE()
                           ,@ErrorProcedure = ERROR_PROCEDURE()
                           ,@ErrorLine = ERROR_LINE()
                           ,@ErrorMessage = ERROR_MESSAGE() ;

                           SET @ErrorProcedure = @ErrorProcedure + ' :   message:' + @message + ',  schame:' + @SCHEMA;
                           SET @STATUS_MESSAGE = @ErrorMessage;
                           EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql, @TryCatchError_ID;
                           select  @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql;
              END CATCH;



              BEGIN TRY
                     SET @CURRENT_DTTM = GETDATE();

                     UPDATE [MWH].[TABLE_STATISTICS_MANUAL_RUNS]
                           SET END_DTTM = @CURRENT_DTTM ,
                                  RUN_TIME_MS =  cast(datediff(ms, @START_DTTM, @CURRENT_DTTM) as bigint),
                                  [STATUS] = @STATUS_MESSAGE,
                                  TryCatchError_ID = @TryCatchError_ID
                     WHERE  ID = @PK_ID_RTN;


              END TRY
              BEGIN CATCH
                           SELECT
                            @ERR = ERROR_NUMBER()
                           ,@ErrorSeverity = ERROR_SEVERITY()
                           ,@ErrorState = ERROR_STATE()
                           ,@ErrorProcedure = ERROR_PROCEDURE()
                           ,@ErrorLine = ERROR_LINE()
                           ,@ErrorMessage = ERROR_MESSAGE() ;

                           SET @ErrorProcedure = @ErrorProcedure + ' :   message:' + @message + ',  schame:' + @SCHEMA +  '  UPDATING TABLE_STATISTICS_MANUAL_RUNS with ID ' + cast(@PK_ID_RTN as varchar(10));

                           EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql, @TryCatchError_ID;

                           select  @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql;
              END CATCH;






              FETCH NEXT FROM db_cursor_run_stats INTO @TAB_SCHEMA_N_TAB_NAME ,  @TABLE_SCHEMA,  @TABLE_NAME;
       END

       CLOSE db_cursor_run_stats
       DEALLOCATE db_cursor_run_stats

       END;  --  message  'UPDATE STATISTICS'





IF( @message = 'GET_STATISTICS_DETAIL')  BEGIN

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 ) and (   @TABLE is NOT NULL and len(@TABLE) >= 3  ) begin
              WITH LAST_TABLE_STAT_RUN (TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  LAST_ID ) as (
              select  TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  max(ID)
              from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
              where [TARGET_SCHEMA_NAME] = @SCHEMA
              and [TARGET_TABLE_NAME] = @TABLE
              group by TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME )

              select temp.TARGET_SERVER_NAME , temp.TARGET_DB_NAME, temp.TARGET_SCHEMA_NAME, temp.TARGET_TABLE_NAME , ts.[STATUS], ts.[RUN_TIME_MS]
              from LAST_TABLE_STAT_RUN temp
              join [MWH].[TABLE_STATISTICS_MANUAL_RUNS]  ts with(nolock) on (ts.ID = temp.LAST_ID)
       end

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 ) and (   @TABLE is  NULL or len(@TABLE) = ''  ) begin
              WITH LAST_TABLE_STAT_RUN (TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  LAST_ID ) as (
              select  TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  max(ID)
              from [MWH].[TABLE_STATISTICS_MANUAL_RUNS] with(nolock)
              where [TARGET_SCHEMA_NAME] = @SCHEMA

              group by TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME )

              select temp.TARGET_SERVER_NAME , temp.TARGET_DB_NAME, temp.TARGET_SCHEMA_NAME, temp.TARGET_TABLE_NAME , ts.[STATUS],  [MWH].[ConvertMillisecondsToHHMMSS] (ts.[RUN_TIME_MS]) as RUN_TIME
              from LAST_TABLE_STAT_RUN temp
              join [MWH].[TABLE_STATISTICS_MANUAL_RUNS]  ts with(nolock) on (ts.ID = temp.LAST_ID)
              order by TARGET_SERVER_NAME asc, TARGET_DB_NAME  asc, TARGET_SCHEMA_NAME  asc, TARGET_TABLE_NAME  asc
       end

END;  --  message  'UPDATE STATISTICS'
