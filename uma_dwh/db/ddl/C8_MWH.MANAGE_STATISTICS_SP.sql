-- C8_MWH.MANAGE_STATISTICS_SP.sql






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
       @VARCHAR_07                varchar(256) = '',  --  future parameter
       @VARCHAR_08                varchar(256) = '',  --  @CUR_SCH_TAB_TXT
       @VARCHAR_09                varchar(256) = '',   --  cast( @STATISTICS_ENGINE_HISTORY_Id as varchar(20))

       @VARCHAR_10                varchar(256) = '',   --  @CUR_LAST_DTTM
       @VARCHAR_11                varchar(256) = '',   --  @CUR_MIN_ROWS
       @VARCHAR_12                varchar(256) = '',   --  @CUR_MIN_SAMPLED
       @VARCHAR_13                varchar(256) = '',   --  @CUR_MAX_SAMPLED
       @VARCHAR_14                varchar(256) = '',   --  @CUR_MIN_MODIFIED_CNT
       @VARCHAR_15                varchar(256) = '',   --  @CUR_MAX_MODIFIED_CNT
       @VARCHAR_16                varchar(256) = ''    --  @QUEUED_DTTM


       with recompile
AS



SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET NOCOUNT ON;



  --  exec  MWH.MANAGE_STATISTICS_SP  'UPDATE STATISTICS',  'MLK-EDM-D-SQ02', 'UMA_DWH',  'MWH', 'ETL_HISTORY', 'FULL SCAN', '', '[MWH].[ETL_HISTORY]', '1', '', '', '', '', '', ''

  /*
    DECLARE          @VARCHAR_01                varchar(256) = 'UPDATE STATISTICS';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'MWH';
    DECLARE          @VARCHAR_05                varchar(256) = 'REPORT_MCS_DAILY_IDLE_CALL_DETAILS';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULL SCAN';
    DECLARE          @VARCHAR_07                varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';

    DECLARE          @VARCHAR_10                varchar(256) = '2018-09-25 09:38:01.2233333';   --  @CUR_LAST_DTTM
    DECLARE          @VARCHAR_11                varchar(256) = '118471759';       --  @CUR_MIN_ROWS
    DECLARE          @VARCHAR_12                varchar(256) = '118471759';       --  @CUR_MIN_SAMPLED
    DECLARE          @VARCHAR_13                varchar(256) = '118471759';       --  @CUR_MAX_SAMPLED
    DECLARE          @VARCHAR_14                varchar(256) = '0';                      --  @CUR_MIN_MODIFIED_CNT
    DECLARE          @VARCHAR_15                varchar(256) = '0';                      --  @CUR_MAX_MODIFIED_CNT
    DECLARE          @VARCHAR_16                varchar(256) = '';                       --  @QUEUED_DTTM


*/


-- exec  MWH.MANAGE_STATISTICS_SP  'QUEUE', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'S_I3', 'LOG_CALL_DATA', 'FULLSCAN',  '', '', '', '', '', '', '', '', ''
-- exec  MWH.MANAGE_STATISTICS_SP  'QUEUE', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'MWH_DIM', 'D_AmApplicantType', 'FULLSCAN',  '', '', '', '', '', '', '', '', ''

-- exec  MWH.MANAGE_STATISTICS_SP  'QUEUE', 'MLK-EDM-D-SQ02',  'UMA_DWH', 'MWH_DIM', 'D_AmMarital', 'FULLSCAN',  '', '', '', '', '', '', '', '', ''




  /*
    DECLARE          @VARCHAR_01                varchar(256) = 'QUEUE';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'S_I3';
    DECLARE          @VARCHAR_05                varchar(256) = 'InteractionSummary';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULLSCAN';
    DECLARE          @VARCHAR_07                varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';
       DECLARE              @VARCHAR_10                varchar(256) = '';
    DECLARE          @VARCHAR_11                varchar(256) = '';
    DECLARE          @VARCHAR_12                varchar(256) = '';
    DECLARE          @VARCHAR_13                varchar(256) = '';
    DECLARE          @VARCHAR_14                varchar(256) = '';
    DECLARE          @VARCHAR_15                varchar(256) = '';
       DECLARE              @VARCHAR_16                varchar(256) = '';
*/

--  [S_LION].[MCS_TEST_DATA_SUMMARY]

--  SELECT * from [MWH].[TABLE_STATISTICS_QUEUE]  with(nolock) order by ID desc

/*
    DECLARE          @VARCHAR_01                varchar(256) = 'DEQUEUE';
    DECLARE          @VARCHAR_02                varchar(256) = 'MLK-EDM-D-SQ02';
    DECLARE          @VARCHAR_03                varchar(256) = 'UMA_DWH';
    DECLARE          @VARCHAR_04                varchar(256) = 'S_I3';
    DECLARE          @VARCHAR_05                varchar(256) = 'MCS_UMALeadCallDetail';
    DECLARE          @VARCHAR_06                varchar(256) = 'FULLSCAN';
    DECLARE          @VARCHAR_07                varchar(256) = '';
    DECLARE          @VARCHAR_08                varchar(256) = '';
    DECLARE          @VARCHAR_09                varchar(256) = '';
       DECLARE              @VARCHAR_10                varchar(256) = '';
    DECLARE          @VARCHAR_11                varchar(256) = '';
    DECLARE          @VARCHAR_12                varchar(256) = '';
    DECLARE          @VARCHAR_13                varchar(256) = '';
    DECLARE          @VARCHAR_14                varchar(256) = '';
    DECLARE          @VARCHAR_15                varchar(256) = '';
       DECLARE              @VARCHAR_16                varchar(256) = '';
*/


DECLARE             @INPUT_ERROR               INTEGER = 0;

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

DECLARE             @sql                 VARCHAR(MAX);
DECLARE             @runstat_sql  nvarchar(2000);

DECLARE             @RUNSTAT_START_DTTM        DATETIME;
DECLARE             @RUNSTAT_DONE_DTTM         DATETIME;
DECLARE             @CURRENT_DTTM              DATETIME;
DECLARE             @START_DTTM                       DATETIME;
 DECLARE             @PK_ID_RTN                        INTEGER;
DECLARE             @STATISTICS_ENGINE_TABLE_HISTORY_Id                           INTEGER;
DECLARE             @START_STATISTICS_DTTM                                               DATETIME;
DECLARE             @END_STATISTICS_DTTM                                          DATETIME;

DECLARE             @TABLE_STATISTICS_QUEUE_Id                             INTEGER;
DECLARE             @MySelectCnt                                                  INTEGER;


DECLARE             @My_SP_NAME varchar(50);
SET @My_SP_NAME =  OBJECT_SCHEMA_NAME (@@PROCID) +'.'+ OBJECT_NAME(@@PROCID);

DECLARE             @Source_Server_Name varchar(60);
SET @Source_Server_Name = @@SERVERNAME;

DECLARE             @Source_DB_Name varchar(40);
SET  @Source_DB_Name = DB_NAME();

DECLARE             @MY_STATUS  [varchar](100) = NULL;


BEGIN TRY

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
IF (@STATISTICS_METHOD IS NULL or LEN(@STATISTICS_METHOD) < 3 ) begin
       SET @STATISTICS_METHOD = 'FULLSCAN';
end;


DECLARE             @CUR_SCH_TAB_TXT                  VARCHAR(160);
SET   @CUR_SCH_TAB_TXT  = @VARCHAR_08;

DECLARE             @STATISTICS_ENGINE_HISTORY_Id                   INTEGER;
SET   @STATISTICS_ENGINE_HISTORY_Id = cast( @VARCHAR_09  as  INTEGER);

DECLARE             @CUR_LAST_DTTM                                                DATETIME;
SET   @CUR_LAST_DTTM = cast(@VARCHAR_10 as datetime);


DECLARE             @CUR_MIN_ROWS              INTEGER;
SET   @CUR_MIN_ROWS = cast( @VARCHAR_11  as  INTEGER);

DECLARE             @CUR_MIN_SAMPLED                  INTEGER;
SET   @CUR_MIN_SAMPLED = cast( @VARCHAR_12  as  INTEGER);

DECLARE             @CUR_MAX_SAMPLED                  INTEGER;
SET   @CUR_MAX_SAMPLED = cast( @VARCHAR_13  as  INTEGER);

DECLARE             @CUR_MIN_MODIFIED_CNT                    INTEGER;
SET   @CUR_MIN_MODIFIED_CNT = cast( @VARCHAR_14  as  INTEGER);

DECLARE             @CUR_MAX_MODIFIED_CNT                    INTEGER;
SET   @CUR_MAX_MODIFIED_CNT = cast( @VARCHAR_15  as  INTEGER);

DECLARE             @QUEUED_DTTM                             DATETIME;
IF( @VARCHAR_16 is NOT NULL) and (len(@VARCHAR_16) > 10) begin
       SET   @QUEUED_DTTM              = cast( @VARCHAR_16  as  DATETIME);
end else begin
       SET   @QUEUED_DTTM = null;
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

                           SET @ErrorProcedure = @ErrorProcedure + ' :   message:' + @message + ',  ERROR casting strings ';

                           EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql, @TryCatchError_ID;
                           select  @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, @sql;
END CATCH;






IF( @message = 'UPDATE STATISTICS')  BEGIN


       BEGIN TRY

              SET    @START_STATISTICS_DTTM = getdate();


              INSERT into [MWH].[STATISTICS_ENGINE_TABLE_HISTORY] (
                     [STATISTICS_ENGINE_HISTORY_ID], [START_DTTM], [SCHEMA_NAME], [TABLE_NAME], [CURRENT_STATUS], SCHEMA_TABLE_NAME,  [CUR_LAST_DTTM], [CUR_MIN_ROWS], [CUR_MIN_SAMPLED], [CUR_MAX_SAMPLED], [CUR_MIN_MODIFIED_CNT], [CUR_MAX_MODIFIED_CNT]
              ) values(
                     @STATISTICS_ENGINE_HISTORY_Id,  @START_STATISTICS_DTTM  ,@SCHEMA, @TABLE, 'UPDATING STATISTICS'  ,  @CUR_SCH_TAB_TXT, @CUR_LAST_DTTM, @CUR_MIN_ROWS, @CUR_MIN_SAMPLED, @CUR_MAX_SAMPLED,  @CUR_MIN_MODIFIED_CNT,  @CUR_MAX_MODIFIED_CNT
              )
              SELECT @STATISTICS_ENGINE_TABLE_HISTORY_Id = @@IDENTITY ;

              --  example   UPDATE STATISTICS  [MWH].[ETL_TryCatchError]  with FULLSCAN
              SET @runstat_sql  = 'UPDATE STATISTICS ' + @CUR_SCH_TAB_TXT + ' with FULLSCAN';

              EXECUTE  sp_executesql @runstat_sql;

              SET    @END_STATISTICS_DTTM = getdate();


              UPDATE [MWH].[STATISTICS_ENGINE_TABLE_HISTORY]
              SET           [FINISHED_DTTM] = @END_STATISTICS_DTTM,
                           [CURRENT_STATUS] = 'STATISTICS UPDATED',
                           STATISTICS_RUNTIME_SEC = datediff(second, @START_STATISTICS_DTTM, @END_STATISTICS_DTTM)
              WHERE ID = @STATISTICS_ENGINE_TABLE_HISTORY_Id;

              IF (@QUEUED_DTTM is NOT null) begin
                     update [MWH].[TABLE_STATISTICS_QUEUE]
                     set [STATUS] = 'Finished',
                           [STATISTICS_ENGINE_TABLE_HISTORY_ID] = @STATISTICS_ENGINE_TABLE_HISTORY_Id,
                           [START_DTTM] = @START_STATISTICS_DTTM,
                           [END_DTTM]  = @END_STATISTICS_DTTM,
                           [RUN_TIME_SEC]= datediff(second, @START_STATISTICS_DTTM, @END_STATISTICS_DTTM)
                     where   [TARGET_SERVER_NAME] = @SERVER
                     and           [TARGET_DB_NAME]     = @Database
                     and           [TARGET_SCHEMA_NAME] = @SCHEMA
                     and           [TARGET_TABLE_NAME]  = @TABLE;
              end;




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

end


--  select * from [MWH].[TABLE_STATISTICS_QUEUE]

IF( @message = 'QUEUE')  BEGIN

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 )  begin

              BEGIN TRY
                     -- use  @Source_Server_Name and @Source_DB_Name for now
                     SET           @MY_STATUS  = 'QUEUED';
                     SET    @TABLE_STATISTICS_QUEUE_Id = -1;

                     SELECT  @TABLE_STATISTICS_QUEUE_Id = coalesce(MAX(ID), -1)
                     FROM [MWH].[TABLE_STATISTICS_QUEUE]
                     where  [STATUS] = 'QUEUE'
                     and [TARGET_SERVER_NAME] = @SERVER
                     and [TARGET_DB_NAME] = @Database
                     and [TARGET_SCHEMA_NAME] = @SCHEMA
                     and [TARGET_TABLE_NAME] = @TABLE;

                     IF(@TABLE_STATISTICS_QUEUE_Id IS NULL  or @TABLE_STATISTICS_QUEUE_Id = -1) begin
                           INSERT INTO [MWH].[TABLE_STATISTICS_QUEUE] (  [STATUS], [TARGET_SERVER_NAME], [TARGET_DB_NAME], [TARGET_SCHEMA_NAME], [TARGET_TABLE_NAME], [STATISTICS_METHOD])
                           VALUES ( @MY_STATUS, @SERVER,  @Database, @SCHEMA, @TABLE, @STATISTICS_METHOD );

                           SELECT @TABLE_STATISTICS_QUEUE_Id = @@IDENTITY ;
                     END ELSE BEGIN
                           SET  @ERR = 911;
                           SET  @ErrorSeverity =  911;
                           SET  @ErrorState = 911;
                           SET  @ErrorProcedure = @My_SP_NAME;
                           SET  @ErrorLine = 477;
                           SET  @ErrorMessage =  @message + ' :  NOTHING TO DEQUEUE' ;


                           SET @My_SP_NAME = @My_SP_NAME + ' : ' +  @message;
                           EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage,  @My_SP_NAME  , @TryCatchError_ID    OUTPUT;

                     END



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

                     SET  @ERR = 911;
                     SET  @ErrorSeverity =  911;
                     SET  @ErrorState = 911;
                     SET  @ErrorProcedure = @My_SP_NAME;
                     SET  @ErrorLine = 477;
                     SET  @ErrorMessage =  @message;
                     SET  @ErrorMessage =  @SCHEMA  + ' is  NULL or  len(' + len(@SCHEMA) + ') < 3';

              SET @My_SP_NAME = @My_SP_NAME + ' : ' +  @message;
              EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage,  @My_SP_NAME  , @TryCatchError_ID     OUTPUT;

       end
END  --  message  'QUEUE'


IF( @message = 'DEQUEUE')  BEGIN

       IF ( @SCHEMA  is NOT NULL and  len(@SCHEMA) >= 3 )  begin

              BEGIN TRY
                     -- use  @Source_Server_Name and @Source_DB_Name for now
                     SET           @MY_STATUS  = 'DEQUEUED';
                     set @STATISTICS_METHOD = '';
                     SET    @TABLE_STATISTICS_QUEUE_Id = -1;


                     SELECT  @TABLE_STATISTICS_QUEUE_Id = coalesce(MAX(ID), -1)
                     FROM [MWH].[TABLE_STATISTICS_QUEUE]
                     where  [STATUS] = 'QUEUED'
                     and [TARGET_SERVER_NAME] = @SERVER
                     and [TARGET_DB_NAME] = @Database
                     and [TARGET_SCHEMA_NAME] = @SCHEMA
                     and [TARGET_TABLE_NAME] = @TABLE
                     and [STATISTICS_ENGINE_TABLE_HISTORY_ID] is null;

                     SET @MySelectCnt = @@ROWCOUNT;



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

                IF ( @TABLE_STATISTICS_QUEUE_Id != -1  and  @TABLE_STATISTICS_QUEUE_Id is NOT NULL) BEGIN
                     UPDATE [MWH].[TABLE_STATISTICS_QUEUE]
                     set [STATUS] = 'DEQUEUED',
                           [STATISTICS_METHOD] = 'DEQUEUED'
                     where ID =  @TABLE_STATISTICS_QUEUE_Id;
                END else BEGIN


                     SET  @ERR = 911;
                     SET  @ErrorSeverity =  911;
                     SET  @ErrorState = 911;
                     SET  @ErrorProcedure = @My_SP_NAME;
                     SET  @ErrorLine = 477;
                     SET  @ErrorMessage =  @message;


                     SET @My_SP_NAME = @My_SP_NAME + ' : ' +  @message;
                     EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error' , @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage,  @My_SP_NAME  , @TryCatchError_ID       OUTPUT;

                END;


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
END  --  message  'DEQUEUE'

go



grant execute on MWH.MANAGE_STATISTICS_SP to public;
go
