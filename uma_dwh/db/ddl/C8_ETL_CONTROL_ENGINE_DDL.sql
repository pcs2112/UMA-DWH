-- C8_ETL_CONTROL_ENGINE_DDL.sql

 -- sqlcmd -S localhost -U sa -P 1F0rg0t1 -i  C8_ETL_CONTROL_ENGINE_DDL.sql

 

USE [UMA_DWH]

GO

 

/****** Object:  Table [MWH].[ETL_CONTROL_MANAGER]    Script Date: 4/2/2017 1:22:57 PM ******/

SET ANSI_NULLS ON

GO

 

SET QUOTED_IDENTIFIER ON

GO

 

/*

IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'ETL_ENGINE_HISTORY' and ss.name = 'MWH')

       DROP TABLE MWH.ETL_ENGINE_HISTORY

GO

 

CREATE TABLE [MWH].[ETL_ENGINE_HISTORY](

       [ID] [int] IDENTITY(1,1) NOT NULL,

       [INSERT_DTTM] [datetime] NOT NULL,

       [UPDATE_DTTM] [datetime] NOT NULL,

       [DONE_DTTM] [datetime]  NULL,

       [LST_MOD_USER] [varchar](80) NOT NULL,

       [ENGINE_STATUS] [varchar](200)  NULL,

       [ENGINE_MESSAGE]  [varchar](80)  NULL,

       [PROCEDURE_NAME] [varchar](80)  NULL,

       [DATA_MART_NAME] [varchar](80)  NULL,

       [PRIORITY] [smallint]  NULL,

CONSTRAINT [PK_ETL_ENGINE_HISTORY] PRIMARY KEY NONCLUSTERED

(

       [ID] ASC

)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON [PRIMARY]

) ON [PRIMARY]

 

GO

 

ALTER TABLE [MWH].[ETL_ENGINE_HISTORY] ADD  CONSTRAINT [ETL_ENGINE_HISTORY_INSERT_DTTM_DF]  DEFAULT (getdate()) FOR [INSERT_DTTM]

GO

 

ALTER TABLE [MWH].[ETL_ENGINE_HISTORY] ADD  CONSTRAINT [ETL_ENGINE_HISTORY_UPDATE_DTTM_DF]  DEFAULT (getdate()) FOR [UPDATE_DTTM]

GO

 

ALTER TABLE [MWH].[ETL_ENGINE_HISTORY] ADD  CONSTRAINT [ETL_ENGINE_HISTORY_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]

GO

 

 

CREATE TRIGGER MWH.ETL_ENGINE_HISTORY_UD_TRIG

ON MWH.ETL_ENGINE_HISTORY

AFTER UPDATE

AS  BEGIN

    UPDATE MWH.ETL_ENGINE_HISTORY

    SET UPDATE_DTTM = GETDATE()

    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)

END

GO

 

*/

 

 

 

IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'ETL_CONTROL_ENGINE' and ss.name = 'MWH')

       DROP PROCEDURE MWH.ETL_CONTROL_ENGINE

GO

 

 

USE [UMA_DWH]

GO

 

/****** Object:  StoredProcedure [MWH].[ETL_CONTROL_ENGINE]    Script Date: 6/29/2017 6:05:12 PM ******/

SET ANSI_NULLS ON

GO

 

SET QUOTED_IDENTIFIER ON

GO

 

 

--  exec  MWH.ETL_CONTROL_ENGINE 'RUN', 'MARKETING', '', -1

--  exec  MWH.ETL_CONTROL_ENGINE 'RUN', 'LION', '', -1

 

--  alter table [MWH].[ETL_HISTORY] add engine_message  varchar(80) null

 

 

CREATE PROCEDURE [MWH].[ETL_CONTROL_ENGINE]

  @message VARCHAR(20),   --  valid meaages :   RUN

  @DATA_MART_NAME VARCHAR(80) ,

  @PROCEDURE_NAME VARCHAR(80) ,

  @PRIORITY SMALLINT

AS

 

SET NOCOUNT ON;

 

DECLARE @InsertedRows AS TABLE (Id int);

DECLARE @ETL_ENGINE_HISTORY_Id INTEGER = -1;

DECLARE @SP_NAME              varchar(80);

DECLARE @PERIOD_START_DTTM       DATETIME2;

DECLARE @PERIOD_END_DTTM         DATETIME2;

DECLARE @EngineMessage                  VARCHAR(80);

DECLARE @ETL_HISTORY_ID          INTEGER;

DECLARE @SP_END_DTTM                    DATETIME;

 

 

 

--  select * from MWH.ETL_ENGINE_HISTORY

 

INSERT INTO MWH.ETL_ENGINE_HISTORY  (ENGINE_STATUS, ENGINE_MESSAGE, PROCEDURE_NAME, DATA_MART_NAME,  PRIORITY )  

 VALUES ('STARTED',   UPPER(@message), UPPER(@PROCEDURE_NAME),UPPER(@DATA_MART_NAME), @PRIORITY);

SELECT @ETL_ENGINE_HISTORY_Id = @@IDENTITY ;

 

 

 

IF  @message = 'RUN'

       BEGIN

 

       DECLARE db_cursor_etl_engine CURSOR FOR 

       SELECT PROCEDURE_NAME

       FROM [UMA_DWH].[MWH].[ETL_CONTROL_MANAGER]

       WHERE ( DATA_MART_NAME = @DATA_MART_NAME  or  @DATA_MART_NAME = '' )

       AND   ( PROCEDURE_NAME = @PROCEDURE_NAME  or  @PROCEDURE_NAME = '' )

       AND   ( PRIORITY =  @PRIORITY   or  @PRIORITY = -1)

       and ACTIVE = 1

       order by PRIORITY asc, PROCEDURE_NAME asc;

 

       set @PERIOD_END_DTTM =  getdate();

 

       OPEN db_cursor_etl_engine  

       FETCH NEXT FROM db_cursor_etl_engine INTO @SP_NAME  

 

       WHILE @@FETCH_STATUS = 0  

       BEGIN  

 

              set @EngineMessage = null;

          

              UPDATE MWH.ETL_ENGINE_HISTORY

              SET ENGINE_STATUS = concat('RUNNING : ' ,@SP_NAME )

              WHERE ID = @ETL_ENGINE_HISTORY_Id;

 

              SET @PERIOD_START_DTTM = NULL;

 

 

              --   get start and end time

              select   @PERIOD_START_DTTM = CAST(STUFF(REPLACE( STUFF(SP_PARM_2,11,1,'T') ,'.',':') ,20,1,'.')  AS DATETIME2)

              FROM [MWH].[ETL_HISTORY]

              where ID =   (select max(ID) from [MWH].[ETL_HISTORY] where [CALLING_PROC] = @SP_NAME  and [STATUS] = 'FINISHED' AND SP_PARM_2 IS NOT NULL);

 

              IF (@PERIOD_START_DTTM is NULL) Begin

                           --  if no prior ETL history found, go back 7 days

                           SET @PERIOD_START_DTTM = DATEADD (dd , -7 , getdate())  

                           SET @EngineMessage = 'Failed to find a prior ETL History for Date, so pushed it back 7 days';

              end

--            else begin

--                   SET @EngineMessage = 'prior sp ' + @SP_NAME +   ' exec timestamp found';

--            end

 

 

              --********************************************************************************************************************************************************************************************

              --  calling the SP will add a row to the [MWH].[ETL_HISTORY] table, so if need be we can update the engine_message column when we need to message we modified the START_DTTM

              exec @SP_NAME @PERIOD_START_DTTM, @PERIOD_END_DTTM

 

 

 

              IF(@EngineMessage is NOT NULL) begin

                     set @ETL_HISTORY_ID = null;

                     select @ETL_HISTORY_ID = ID,  @SP_END_DTTM = [END_DTTM] from [MWH].[ETL_HISTORY] where [CALLING_PROC] = @SP_NAME and [SP_PARM_1] = @PERIOD_START_DTTM and [SP_PARM_2] = @PERIOD_END_DTTM;

 

                     if( @ETL_HISTORY_ID is NOT NULL) and ( DATEDIFF(ss,  @SP_END_DTTM , getdate()) < 2 ) begin

                           -- if we found ETL_HISTORY from the past 2 seconds, updated it

                           UPDATE [MWH].[ETL_HISTORY] set [engine_message] = @EngineMessage where ID = @ETL_HISTORY_ID;

                     end   

              END

 

              FETCH NEXT FROM db_cursor_etl_engine INTO @SP_NAME

       END  

 

       CLOSE db_cursor_etl_engine  

       DEALLOCATE db_cursor_etl_engine

 

       UPDATE MWH.ETL_ENGINE_HISTORY

       SET ENGINE_STATUS = 'FINISHED', DONE_DTTM = getdate()

       WHERE ID = @ETL_ENGINE_HISTORY_Id;

 

END

 

 

ELSE

      BEGIN

                     INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )

                     VALUES (  concat(' MWH.ETL_CONTROL_ENGINE  message error, invalid message : ', @message )  , 'MWH.ETL_ENGINE_HISTORY' , 0  );

       END

 

       return ( 0 )

GO

 

 

 

 

 

 

 

 

 

 

 

 

