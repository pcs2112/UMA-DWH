USE [UMA_DWH]
GO

--  C8_MWH.ETL_CONTROL_MANAGER_view.sql
 
 
/****** Script for SelectTopNRows command from SSMS  ******/
 
--drop view ETL_CONTROL_MANAGER_view
 
--  select * from MWH.ETL_CONTROL_MANAGER_view
 
 
alter VIEW MWH.ETL_CONTROL_MANAGER_view (
ID,
PROCEDURE_NAME,
DATA_MART_NAME,
[PRIORITY],
SOURCE_SERVER_NAME,
SOURCE_DB_NAME,
SOURCE_TABLE_NAME,
TARGET_TABLE_NAME,
SOURCE_SCHEMA_NAME,
TARGET_SCHEMA_NAME
) as
 
select
cm.[ID]
,cm.[PROCEDURE_NAME]
,cm.[DATA_MART_NAME]
,cm.[PRIORITY]
, max( eh.SOURCE_SERVER_NAME)
, max(eh.SOURCE_DB_NAME)
, max( eh.SOURCE_TABLE_NAME)
, max( eh.TARGET_TABLE_NAME)
, max( eh.SOURCE_SCHEMA_NAME)
, max( eh.TARGET_SCHEMA_NAME)
 
 
 
 
FROM MWH.ETL_CONTROL_MANAGER  cm
join [MWH].[ETL_HISTORY]  eh with(nolock)   on (cm.PROCEDURE_NAME = eh.CALLING_PROC )
where eh.INSERT_DTTM > dateadd(day, -500, getdate())
and cm.[PROCEDURE_NAME] not like '%CHECK_MERGE%'
group by
 cm.[ID]
,cm.[PROCEDURE_NAME]
,cm.[DATA_MART_NAME]
,cm.[PRIORITY]
 
 
go
 
 
grant select on MWH.ETL_CONTROL_MANAGER_view to public
go