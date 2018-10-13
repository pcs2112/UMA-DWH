-- C8_MWH.MANAGE_STATISTICS_SP.sql


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



drop table [MWH].[TABLE_STATISTICS_RUNS];

CREATE TABLE [MWH].[TABLE_STATISTICS_RUNS](
       [ID]                              [int] IDENTITY(1,1) NOT NULL,
       [INSERT_DTTM]              [datetime] NOT NULL,
       [UPDATE_DTTM]              [datetime] NOT NULL,
       [START_DTTM]               [datetime] NULL,           --  STARTING DTTM for UPDATE STATISTICS, remember that queueing is NOT STARTING STATISTICS
       [END_DTTM]                        [datetime] NULL,           --  update is DONE, with or without an error
       [RUN_TIME_MS]              [BIGINT]  NULL,
       [LST_MOD_USER]                    [varchar](80)  NULL,
       [MESSAGE]                         [varchar](200)  NULL,
       [STATUS]                          [varchar](100) NOT NULL,
       [TARGET_SERVER_NAME] [varchar](60) NOT NULL,
       [TARGET_DB_NAME]           [varchar](60) NOT NULL,
       [TARGET_SCHEMA_NAME] [varchar](60) NOT NULL,
       [TARGET_TABLE_NAME]        [varchar](60) NOT NULL,
       [STATISTICS_METHOD]        [varchar](2000) NOT NULL,
       [TryCatchError_ID]         INTEGER                    NULL

CONSTRAINT [PK_TABLE_STATISTICS_RUNS] PRIMARY KEY NONCLUSTERED
(
       [ID] ASC,
       INSERT_DTTM ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  ON UMA_YEAR_MWH_FACT_I_PS(INSERT_DTTM)
) ON  UMA_YEAR_MWH_FACT_D_PS(INSERT_DTTM);

GO

ALTER TABLE [MWH].[TABLE_STATISTICS_RUNS] ADD  CONSTRAINT [TABLE_STATISTICS_RUNS_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]
GO

ALTER TABLE [MWH].[TABLE_STATISTICS_RUNS] ADD  CONSTRAINT [TABLE_STATISTICS_RUNS_INSERT_DTTM_DF]  DEFAULT (getdate()) FOR [INSERT_DTTM]
GO

ALTER TABLE [MWH].[TABLE_STATISTICS_RUNS] ADD  CONSTRAINT [TABLE_STATISTICS_RUNS_UPDATE_DTTM_DF]  DEFAULT (GETDATE()) FOR [UPDATE_DTTM]
GO

ALTER TABLE [MWH].[TABLE_STATISTICS_RUNS] ADD  CONSTRAINT [TABLE_STATISTICS_RUNS_STATUS_DF]  DEFAULT ('MISSING') FOR [STATUS]
GO


CREATE TRIGGER MWH.TABLE_STATISTICS_RUNS_UD_TRIG
ON MWH.TABLE_STATISTICS_RUNS
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.TABLE_STATISTICS_RUNS
    SET UPDATE_DTTM = GETDATE(),
              RUN_TIME_MS = datediff(ms , START_DTTM, END_DTTM)
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_RUNS_IDX_01] ON [MWH].[TABLE_STATISTICS_RUNS]
(
       INSERT_DTTM  asc,
       [START_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(INSERT_DTTM)
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_RUNS_IDX_02] ON [MWH].[TABLE_STATISTICS_RUNS]
(
       [ID] ASC,
       [START_DTTM] ASC,
       INSERT_DTTM  asc
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(INSERT_DTTM)
GO



CREATE NONCLUSTERED INDEX [TABLE_STATISTICS_RUNS_IDX_03] ON [MWH].[TABLE_STATISTICS_RUNS]
(
       TryCatchError_ID  DESC,
       ID ASC,
       [INSERT_DTTM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)    ON UMA_YEAR_MWH_FACT_I_PS(INSERT_DTTM)
GO





DBCC SHOW_STATISTICS ("[MWH].[F_MCS_CALLS]",[FINAL_DIAL_DTTM]) ;
GO

DBCC SHOW_STATISTICS ("[MWH].[F_MCS_CALLS]",[FINAL_DIAL_DTTM]) WITH HISTOGRAM;
GO
Daily.Rebuld Indexes UMA_DWH

*/

--     message , schema, table_name, Scan Type
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', 'MCS_InteractionSummary', 'FULL SCAN', '', '', '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'GET_STATISTICS_DETAIL',  'S_I3', '', 'FULL SCAN', '', '', '', '', ''


--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'S_I3', '', 'FULL SCAN', '', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'S_LION', '', 'FULL SCAN', '', '', '', '', ''


--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MLK-EDM-D-SQ02', 'MWH_FACT', '', 'FULL SCAN', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MLK-EDM-D-SQ02','MWH_XREF', '', 'FULL SCAN', '', '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  '', '', 'FULL SCAN', '', '', '', ''



--  SELECT * from [MWH].[TABLE_STATISTICS_RUNS] with(nolock) order by ID desc



USE [UMA_DWH];


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MANAGE_STATISTICS_SP' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MANAGE_STATISTICS_SP
GO



CREATE PROCEDURE MWH.MANAGE_STATISTICS_SP
       @VARCHAR_01                varchar(256) = '',   --     @message
       @VARCHAR_02                varchar(256) = '',   --     @SERVER
       @VARCHAR_03                varchar(256) = '',   --     @Database
       @VARCHAR_04                varchar(256) = '',   --     @SCHEMA
       @VARCHAR_05                varchar(256) = '',   --     @TABLE
       @VARCHAR_06                varchar(256) = '',   --     @STATISTICS_METHOD
       @VARCHAR_07                varchar(256) = '',
       @VARCHAR_08                varchar(256) = '',
       @VARCHAR_09                varchar(256) = ''


       with recompile
AS



SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET NOCOUNT ON;

-- exec  MWH.MANAGE_STATISTICS_SP  'QUEUE', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'InteractionSummary', 'FULL SCAN',  '', '', ''

  /*
    DECLARE          @VARCHAR_01                varchar(256) = 'QUEUE';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'S_I3';
    DECLARE          @VARCHAR_05                varchar(256) = 'InteractionSummary';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULL SCAN';
    DECLARE          @VARCHAR_07                varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';
*/

--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'InteractionSummary', 'FULL SCAN',  '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'Intx_Participant', 'FULL SCAN',  '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_MCS_LDS', '', 'FULL SCAN',  '', '', ''



  /*
    DECLARE          @VARCHAR_01                varchar(256) = 'UPDATE STATISTICS';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'S_I3';
    DECLARE          @VARCHAR_05                varchar(256) = 'InteractionSummary';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULL SCAN';
    DECLARE          @VARCHAR_07                varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';
*/


--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'InteractionSummary', '',  '', '', ''

--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', '', '',  '', '', ''
--  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_MCS_LDS', '', '',  '', '', ''

  /*
    DECLARE          @VARCHAR_01                varchar(256) = 'GET STATISTICS DETAIL';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'S_I3';
    DECLARE          @VARCHAR_05                varchar(256) = 'InteractionSummary';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULL SCAN';
    DECLARE          @VARCHAR_07                 varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';
*/





DECLARE             @INPUT_ERROR               INTEGER = 0;


DECLARE             @message             VARCHAR(40);
SET @message = @VARCHAR_01;
  IF (len( @message ) < 5) begin
       SET @INPUT_ERROR = 1;
end;


DECLARE             @SERVER                    VARCHAR(40);
SET   @SERVER = @VARCHAR_02;
IF (len( @SERVER ) < 6) begin
       SET @INPUT_ERROR = 1;
end;


DECLARE             @Database varchar(40);
SET   @Database =  @VARCHAR_03;
  IF (len( @Database ) < 4) begin
       SET @INPUT_ERROR = 1;
end;

DECLARE             @SCHEMA                    VARCHAR(40);
SET   @SCHEMA = @VARCHAR_04;
IF (len( @SCHEMA ) < 3) begin
       SET @INPUT_ERROR = 1;
end;

DECLARE             @TABLE               VARCHAR(40);
SET   @TABLE = @VARCHAR_05;
  IF (len( @TABLE ) < 3) and (@TABLE is NOT NULL) begin
       SET @INPUT_ERROR = 1;
end;


--  UPDATE STATISTICS options
            --             FULLSCAN
            --             SAMPLE number PERCENT
            --             RESAMPLE
DECLARE             @STATISTICS_METHOD   VARCHAR(40);
SET   @STATISTICS_METHOD    = @VARCHAR_06;
IF (@STATISTICS_METHOD IS NULL or LEN(@STATISTICS_METHOD) < 7 ) begin
       SET @STATISTICS_METHOD = 'FULLSCAN';
end;


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
DECLARE             @CURRENT_DTTM              DATETIME;
DECLARE             @START_DTTM                       DATETIME;
 DECLARE             @PK_ID_RTN                        INTEGER;

DECLARE             @My_SP_NAME varchar(50);
SET @My_SP_NAME =  OBJECT_SCHEMA_NAME (@@PROCID) +'.'+ OBJECT_NAME(@@PROCID);

DECLARE             @Source_Server_Name varchar(60);
SET @Source_Server_Name = @@SERVERNAME;

DECLARE             @Source_DB_Name varchar(40);
SET  @Source_DB_Name = DB_NAME();

DECLARE             @MY_STATUS  [varchar](100) = NULL;


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

                     INSERT INTO [MWH].[TABLE_STATISTICS_RUNS] (     [START_DTTM],  [UPDATE_DTTM],  [MESSAGE], [STATUS], [TARGET_SERVER_NAME], [TARGET_DB_NAME], [TARGET_SCHEMA_NAME], [TARGET_TABLE_NAME], [STATISTICS_METHOD], [TryCatchError_ID] )
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

                     UPDATE [MWH].[TABLE_STATISTICS_RUNS]
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


       --  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'InteractionSummary', '',  '', '', ''
              --  exec  MWH.MANAGE_STATISTICS_SP  'GET STATISTICS DETAIL', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', '', '',  '', '', ''

IF( @message = 'GET STATISTICS DETAIL')  BEGIN

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 ) and (   @TABLE is NOT NULL and len(@TABLE) >= 3  ) begin

              WITH LAST_TABLE_STAT_RUN (TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  FIRST_ID, LAST_ID ) as (

              select  top 10 TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,   min(ID), max(ID)
              from [MWH].[TABLE_STATISTICS_RUNS] with(nolock)
              where [TARGET_SCHEMA_NAME] = @SCHEMA
              and [TARGET_TABLE_NAME] = @TABLE
              group by TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME )

              select temp.TARGET_SERVER_NAME , temp.TARGET_DB_NAME, temp.TARGET_SCHEMA_NAME, temp.TARGET_TABLE_NAME , ts.INSERT_DTTM, ts.[LST_MOD_USER], ts.[STATUS],  ts.[START_DTTM],  ts.[END_DTTM], [MWH].[ConvertMillisecondsToHHMMSS] (ts.[RUN_TIME_MS]) as RUN_TIME, ts.[MESSAGE]
              from LAST_TABLE_STAT_RUN temp
              join [MWH].[TABLE_STATISTICS_RUNS]  ts with(nolock) on (ts.ID between temp.FIRST_ID and temp.LAST_ID)
              order by temp.TARGET_SERVER_NAME asc, temp.TARGET_DB_NAME asc, temp.TARGET_SCHEMA_NAME asc, temp.TARGET_TABLE_NAME asc, ts.INSERT_DTTM asc



       end

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 ) and (   @TABLE is  NULL or len(@TABLE) = ''  ) begin

              WITH LAST_TABLE_STAT_RUN (TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,  FIRST_ID, LAST_ID ) as (

              select  top 10 TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,   min(ID), max(ID)
              from [MWH].[TABLE_STATISTICS_RUNS] with(nolock)
              where [TARGET_SCHEMA_NAME] = @SCHEMA
              group by TARGET_SERVER_NAME , TARGET_DB_NAME, TARGET_SCHEMA_NAME, TARGET_TABLE_NAME )

              select temp.TARGET_SERVER_NAME , temp.TARGET_DB_NAME, temp.TARGET_SCHEMA_NAME, temp.TARGET_TABLE_NAME , ts.INSERT_DTTM, ts.[LST_MOD_USER], ts.[STATUS],  ts.[START_DTTM],  ts.[END_DTTM], [MWH].[ConvertMillisecondsToHHMMSS] (ts.[RUN_TIME_MS]) as RUN_TIME, ts.[MESSAGE]
              from LAST_TABLE_STAT_RUN temp
              join [MWH].[TABLE_STATISTICS_RUNS]  ts with(nolock) on (ts.ID between temp.FIRST_ID and temp.LAST_ID)
              order by temp.TARGET_SERVER_NAME asc, temp.TARGET_DB_NAME asc, temp.TARGET_SCHEMA_NAME asc, temp.TARGET_TABLE_NAME asc, ts.INSERT_DTTM asc


       end

END;  --  message  'UPDATE STATISTICS'


--    exec  MWH.MANAGE_STATISTICS_SP  'QUEUE', 'MLK-EDM-D-SQ02', 'UMA_DWH', 'S_I3', 'InteractionSummary', 'FULL SCAN', '', '', ''

IF( @message = 'QUEUE')  BEGIN

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 )  begin

              BEGIN TRY
                     -- use  @Source_Server_Name and @Source_DB_Name for now
                     SET           @MY_STATUS  = 'QUEUED';

                     INSERT INTO [MWH].[TABLE_STATISTICS_RUNS]  (
                           [MESSAGE], [STATUS], [TARGET_SERVER_NAME], [TARGET_DB_NAME], [TARGET_SCHEMA_NAME], [TARGET_TABLE_NAME], [STATISTICS_METHOD]
                     )  values (
                           @message, @MY_STATUS, @Source_Server_Name, @Source_DB_Name, @SCHEMA, @TABLE, @STATISTICS_METHOD
                     );
              END TRY
              BEGIN CATCH
                     SELECT
                      @ERR = ERROR_NUMBER()
                     ,@ErrorSeverity = ERROR_SEVERITY()
                     ,@ErrorState = ERROR_STATE()
                     ,@ErrorProcedure = ERROR_PROCEDURE()
                     ,@ErrorLine = ERROR_LINE()
                     ,@ErrorMessage =  ERROR_MESSAGE();

                     SET @My_SP_NAME = @My_SP_NAME + ' : ' +  @message;
                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage,  @My_SP_NAME  , @TryCatchError_ID       OUTPUT;

              END CATCH
       END ELSE BEGIN

            SELECT
         @ERR = ERROR_NUMBER()
        ,@ErrorSeverity = ERROR_SEVERITY()
        ,@ErrorState = ERROR_STATE()
        ,@ErrorProcedure = ERROR_PROCEDURE()
        ,@ErrorLine = ERROR_LINE()
        ,@ErrorMessage =  @SCHEMA  + ' is  NULL or  len(' + len(@SCHEMA) + ') < 3';

              SET @My_SP_NAME = @My_SP_NAME + ' : ' +  @message;
              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage,  @My_SP_NAME  , @TryCatchError_ID     OUTPUT;
       end

END;  --  message  'UPDATE STATISTICS'
