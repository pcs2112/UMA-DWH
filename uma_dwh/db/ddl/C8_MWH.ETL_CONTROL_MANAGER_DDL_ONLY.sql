-- C8_MWH.ETL_CONTROL_MANAGER_DDL_ONLY.sql

-- sqlcmd -S localhost -U sa -P 1F0rg0t1 -i  C8_MWH.ETL_CONTROL_MANAGER_DDL_ONLY.sql

use UMA_DWH
GO


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'ETL_CONTROL_MANAGER' and ss.name = 'MWH')
       DROP TABLE MWH.ETL_CONTROL_MANAGER
GO


CREATE TABLE MWH.ETL_CONTROL_MANAGER (
              ID INT NOT NULL IDENTITY (1,1),
              INSERT_DTTM DATETIME CONSTRAINT ETL_CONTROL_MANAGER_1_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
              UPDATE_DTTM DATETIME CONSTRAINT ETL_CONTROL_MANAGER_1_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
              LST_MOD_USER VARCHAR(80) CONSTRAINT ETL_CONTROL_MANAGER_1_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
              PROCEDURE_NAME VARCHAR(80) NOT NULL,
              DATA_MART_NAME VARCHAR(80) NOT NULL,
              MIN_CALL_DURATION_MINUTES INT CONSTRAINT ETL_CONTROL_MANAGER_1_MIN_CALL_DURATION_MINUTES_DF DEFAULT 1440 NOT NULL,
              MAX_CALL_DURATION_MINUTES INT CONSTRAINT ETL_CONTROL_MANAGER_1_MAX_CALL_DURATION_MINUTES_DF DEFAULT 15 NOT NULL,
              PRIORITY SMALLINT CONSTRAINT ETL_CONTROL_MANAGER_1_PRIORITY_DF DEFAULT 0 NOT NULL,
CONSTRAINT PK_ETL_CONTROL_MANAGER_1       PRIMARY KEY NONCLUSTERED
( ID            ASC  )  WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON [PRIMARY] ) ON [PRIMARY]
GO


CREATE UNIQUE INDEX ETL_CONTROL_MANAGER_IDX01
       ON MWH.ETL_CONTROL_MANAGER
       (     PROCEDURE_NAME                                  ASC,
             DATA_MART_NAME                                  ASC) ON [PRIMARY]
GO

 
CREATE TRIGGER MWH.ETL_CONTROL_MANAGER_UD_TRIG
ON MWH.ETL_CONTROL_MANAGER
AFTER UPDATE
AS  BEGIN
    UPDATE MWH.ETL_CONTROL_MANAGER
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END

GO