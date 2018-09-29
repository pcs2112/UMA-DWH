USE [UMA_DWH]
GO
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MNG_LOAD_HISTORY' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MNG_LOAD_HISTORY
GO
 
 
 
SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO
 
 
CREATE PROCEDURE [MWH].[MNG_LOAD_HISTORY]
@message VARCHAR(10),   --  valid meaages :  START,  FINISHED, ERROR
@MY_DATETIME  DATETIME2,
@ID INTEGER,
@SOURCE_SERVER_NAME varchar (60) ,
@SOURCE_DB_NAME varchar(40) ,
@SOURCE_SCHEMA_NAME varchar(40) ,
@SOURCE_TABLE_NAME varchar(60) ,
@schema VARCHAR(40),
@table VARCHAR(60),
@loading_proc VARCHAR(120),
@SP_PARM_1  VARCHAR(30) = '' ,
@SP_PARM_2  VARCHAR(30) = '' ,
 
@INSERT_CNT  INT = -1 ,
@UPDATE_CNT  INT  = -1 ,
@DELETE_CNT  INT  = -1 ,
-- @ERR_NUM   INT = 0,  replaced with pointer to pointer to TryCatchError_ID, whch has the err Number
@TryCatchError_ID  INT= 0,
@RUN_TIME_SEC  INT = -1 ,
@err_mess VARCHAR(400) = '',
 
@LOAD_HIST_ID  INTEGER OUTPUT 
 
 AS
 
SET NOCOUNT ON;
DECLARE @FND_ID                  INTEGER = -1;
DECLARE @ERR_DESC                VARCHAR(400);
 
DECLARE  @ERR_NUM   INT = 0;
 
--   EXEC  S_MST.MNG_STAGE_LOAD_HISTORY   'START', 0, 'S_I3', 'InteractionSummary', 'S_I3.MERGE_INTERACTIVE_SUMMARY'   , '',  '' ;
 
IF  @message = 'START'
       BEGIN
      
       DECLARE @InsertedRows AS TABLE (Id int)
       DECLARE @NewId AS INT
 
 
                     INSERT INTO MWH.ETL_HISTORY ( STATUS,  START_DTTM,  SOURCE_SERVER_NAME,  SOURCE_DB_NAME,  SOURCE_SCHEMA_NAME,  SOURCE_TABLE_NAME,  TARGET_SCHEMA_NAME, TARGET_TABLE_NAME,   CALLING_PROC,   SP_PARM_1,  SP_PARM_2  ) OUTPUT Inserted.Id INTO @InsertedRows
                                                                       VALUES ( 'RUNNING',  @MY_DATETIME,   @SOURCE_SERVER_NAME,  @SOURCE_DB_NAME,  @SOURCE_SCHEMA_NAME,  @SOURCE_TABLE_NAME, @schema,  @table,  @loading_proc,  @SP_PARM_1, @SP_PARM_2  )
                  SELECT @LOAD_HIST_ID = Id FROM @InsertedRows;
 
  --  DEBUGGING
  --          INSERT into TEST_DATA.RECORD_TEST_DATA (DATA_NAME, INEGER_VALUE, VARCHAR_VALUE, DATETIME_VALUE, DATETIME2_VALUE)  values ('LOAD_HIST_ID', @LOAD_HIST_ID , 'xxx', getdate(),  sysdatetime())
 
 
       END
ELSE IF @message = 'FINISHED'
      BEGIN
 
--  DEBUGGING
--            INSERT into TEST_DATA.RECORD_TEST_DATA (DATA_NAME, INEGER_VALUE, VARCHAR_VALUE, DATETIME_VALUE, DATETIME2_VALUE)  values ('PASS ID INTO MNG_STAGE_LOAD_HISTORY', @ID , 'xxx', getdate(),  sysdatetime());
 
                     SET @FND_ID = ( SELECT COALESCE(ID, -1)  FROM MWH.ETL_HISTORY where ID = @ID and STATUS = 'RUNNING');
 
                     IF @FND_ID = @ID
                     IF @TryCatchError_ID = 0 
                    
                       BEGIN
                           UPDATE MWH.ETL_HISTORY
                           SET STATUS = 'FINISHED',
                               END_DTTM = @MY_DATETIME,
                                  INSERT_CNT = @INSERT_CNT,
                               UPDATE_CNT = @UPDATE_CNT,
                                  DELETE_CNT = @DELETE_CNT,
                                  TryCatchError_ID = @TryCatchError_ID,
                                  engine_message = @err_mess ,
                                  RUN_TIME_SEC =  DATEDIFF(ss, START_DTTM, @MY_DATETIME )
                           WHERE ID = @ID;
                       END
                     ELSE
                       BEGIN
 
 
                       select  @ERR_NUM =   ERR  from [MWH].[ETL_TryCatchError] where ID = @TryCatchError_ID;
 
                       SELECT @ERR_DESC = substring(text,1,200) FROM SYS.MESSAGES where language_id = 1033 and message_id =  @ERR_NUM;
 
                         UPDATE MWH.ETL_HISTORY
                           SET STATUS = 'ERROR',
                               END_DTTM = @MY_DATETIME,
                                  TryCatchError_ID = @TryCatchError_ID,
                                  INSERT_CNT = @INSERT_CNT,
                               UPDATE_CNT = @UPDATE_CNT,
                                  DELETE_CNT = @DELETE_CNT,
                                  engine_message = @ERR_DESC,
                                  RUN_TIME_SEC =  DATEDIFF(ss, START_DTTM, @MY_DATETIME )
                           WHERE ID = @ID;
                       END
                     ELSE
                     BEGIN
                        INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                        VALUES (  CONCAT('LOAD STAGE HISTORY phase error, no RUNNING process for ID : ' , CAST(@ID AS int) ) , 'STAGE_LOAD_HISTORY', @ID  );
                     END
 
       END
ELSE IF @message = 'ERROR'
      BEGIN
                     SET @FND_ID = ( SELECT COALESCE(ID, -1)  FROM MWH.ETL_HISTORY where ID = @ID and STATUS = 'RUNNING');
 
                     IF @FND_ID = @ID
                       BEGIN
 
                           select  @ERR_NUM =   ERR  from [MWH].[ETL_TryCatchError] where ID = @TryCatchError_ID;
 
                         SELECT @ERR_DESC = substring(text,1,200) FROM SYS.MESSAGES where language_id = 1033 and message_id =  @ERR_NUM;
 
 
                           UPDATE MWH.ETL_HISTORY
                           SET STATUS = 'ERROR',
                               TryCatchError_ID = @TryCatchError_ID,
                                  INSERT_CNT = @INSERT_CNT,
                               UPDATE_CNT = @UPDATE_CNT,
                                  DELETE_CNT = @DELETE_CNT,
                                  engine_message = @err_mess + '  :  ' + @ERR_DESC,
                                  RUN_TIME_SEC =  @RUN_TIME_SEC
                           WHERE ID = @ID;
 
                            INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                           VALUES (  CONCAT('LOAD STAGE HISTORY error for a RUNNING process for ID : ' , CAST(@ID AS int) ) , 'STAGE_LOAD_HISTORY', @ID  );
                       END
                     ELSE
                     BEGIN
                        INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                        VALUES (  CONCAT('LOAD STAGE HISTORY phase error, no RUNNING process for ID : ' , CAST(@ID AS int) ) , 'STAGE_LOAD_HISTORY', @ID  );
                     END
       END
ELSE
      BEGIN
                     INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                     VALUES (  CONCAT('LOAD STAGE HISTORY phase error, no RUNNING process for ID : ' , CAST(@ID AS int) ) , 'STAGE_LOAD_HISTORY', @ID  );
       END
 
RETURN
 
GO