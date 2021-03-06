--  C8_UMA_TELECOM.X_REP_TO_REP_WORKGROUP.sql
use UMA_DWH
go

--create schema UMA_TELECOM
-- go








--  C8_UMA_TELECOM.D_REP.sql

/*
Workgroups one to many

$id: integer,
name: string,
id: string,
dateAdded: datetime
customAttributes: (Figure out what this is)

select * from [UMA_TELECOM].[D_REP_WORKGROUP]

select  REP_WORKGROUP_ID, REP_WORKGROUP_Name, count(*) from UMA_TELECOM.D_REP_WORKGROUP  group by REP_WORKGROUP_ID, REP_WORKGROUP_Name

select  REP_WORKGROUP_customAttributes, count(*) from UMA_TELECOM.D_REP_WORKGROUP  group by REP_WORKGROUP_customAttributes

*/


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'D_REP_WORKGROUP' and ss.name = 'UMA_TELECOM')
	DROP TABLE UMA_TELECOM.D_REP_WORKGROUP
GO


CREATE TABLE UMA_TELECOM.D_REP_WORKGROUP(
		ID INT NOT NULL IDENTITY (1,1),
		INSERT_DTTM DATETIME CONSTRAINT UMA_TELECOM_D_REP_WORKGROUP_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
		UPDATE_DTTM DATETIME CONSTRAINT UMA_TELECOM_D_REP_WORKGROUP_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
		LST_MOD_USER VARCHAR(80) CONSTRAINT UMA_TELECOM_D_REP_WORKGROUP_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
		MSTR_LOAD_ID INT CONSTRAINT UMA_TELECOM_D_REP_WORKGROUP_MSTR_LOAD_ID_DF DEFAULT (-1) NOT NULL,
		REP_WORKGROUP_Name				NVARCHAR(200)	NOT NULL,
		REP_WORKGROUP_id_ALTERNATE		NVARCHAR(200)	,
 CONSTRAINT PK_UMA_TELECOM_D_REP_WORKGROUP		PRIMARY KEY NONCLUSTERED 
(
		ID				ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO



CREATE NONCLUSTERED INDEX  UMA_TELECOM_D_REP_WORKGROUP_IDX01   on UMA_TELECOM.D_REP_WORKGROUP 
(
		ID				ASC,
		REP_WORKGROUP_Name		ASC,
		REP_WORKGROUP_id_ALTERNATE	ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE NONCLUSTERED INDEX  UMA_TELECOM_D_REP_WORKGROUP_IDX02   on UMA_TELECOM.D_REP_WORKGROUP 
(
		REP_WORKGROUP_Name			ASC,
		REP_WORKGROUP_id_ALTERNATE	ASC,
		ID							ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO


CREATE UNIQUE INDEX  UMA_TELECOM_D_REP_WORKGROUP_IDX03   on UMA_TELECOM.D_REP_WORKGROUP 
(
		REP_WORKGROUP_Name			ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO


CREATE TRIGGER UMA_TELECOM.D_REP_WORKGROUP_UD_TRIG
ON UMA_TELECOM.D_REP_WORKGROUP
AFTER UPDATE
AS  BEGIN
    UPDATE UMA_TELECOM.D_REP_WORKGROUP
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO










IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'X_REP_TO_REP_WORKGROUP' and ss.name = 'UMA_TELECOM')
	DROP TABLE UMA_TELECOM.X_REP_TO_REP_WORKGROUP
GO
--  C8_UMA_TELECOM.D_REP.sql

/*
Workgroups one to many

$id: integer,
name: string,
id: string,
dateAdded: datetime
customAttributes: (Figure out what this is)



select  REP_WORKGROUP_ID, REP_WORKGROUP_Name, count(*) from UMA_TELECOM.X_REP_TO_REP_WORKGROUP  group by REP_WORKGROUP_ID, REP_WORKGROUP_Name

select  REP_WORKGROUP_customAttributes, count(*) from UMA_TELECOM.X_REP_TO_REP_WORKGROUP  group by REP_WORKGROUP_customAttributes

*/


CREATE TABLE UMA_TELECOM.X_REP_TO_REP_WORKGROUP(
		ID INT NOT NULL IDENTITY (1,1),
		INSERT_DTTM DATETIME CONSTRAINT UMA_TELECOM_X_REP_TO_REP_WORKGROUP_INSERT_DTTM_DF DEFAULT getdate() NOT NULL,
		UPDATE_DTTM DATETIME CONSTRAINT UMA_TELECOM_X_REP_TO_REP_WORKGROUP_UPDATE_DTTM_DF DEFAULT getdate() NOT NULL,
		LST_MOD_USER VARCHAR(80) CONSTRAINT UMA_TELECOM_X_REP_TO_REP_WORKGROUP_LST_MOD_USER_DF DEFAULT user_name() NOT NULL,
		MSTR_LOAD_ID INT CONSTRAINT UMA_TELECOM_X_REP_TO_REP_WORKGROUP_MSTR_LOAD_ID_DF DEFAULT (-1) NOT NULL,
		D_REP_ID						integer			NOT NULL,
		D_REP_WORKGROUP_ID				integer			NOT NULL,
		REP_WORKGROUP_ID				integer			NOT NULL,
		REP_WORKGROUP_dateAdded			datetime2		NOT NULL,
		REP_WORKGROUP_dateRemoved		datetime2		NULL,
		REP_WORKGROUP_customAttributes	nvarchar(200),

 CONSTRAINT PK_UMA_TELECOM_X_REP_TO_REP_WORKGROUP		PRIMARY KEY NONCLUSTERED 
(
		ID				ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
GO


CREATE NONCLUSTERED INDEX  UMA_TELECOM_X_REP_TO_REP_WORKGROUP_IDX01   on UMA_TELECOM.X_REP_TO_REP_WORKGROUP 
(
		
		D_REP_ID			ASC,
		D_REP_WORKGROUP_ID	ASC,
		REP_WORKGROUP_dateRemoved	ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO


CREATE NONCLUSTERED INDEX  UMA_TELECOM_X_REP_TO_REP_WORKGROUP_IDX02   on UMA_TELECOM.X_REP_TO_REP_WORKGROUP 
(
		REP_WORKGROUP_dateRemoved	ASC,
		D_REP_ID			ASC,
		D_REP_WORKGROUP_ID	ASC

)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO



CREATE TRIGGER UMA_TELECOM.X_REP_TO_REP_WORKGROUP_UD_TRIG
ON UMA_TELECOM.X_REP_TO_REP_WORKGROUP
AFTER UPDATE
AS  BEGIN
    UPDATE UMA_TELECOM.X_REP_TO_REP_WORKGROUP
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO


