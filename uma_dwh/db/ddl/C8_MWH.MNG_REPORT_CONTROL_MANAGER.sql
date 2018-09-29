--  C8_MWH.MNG_REPORT_CONTROL_MANAGER.sql
 
 
 
USE [UMA_DWH]
GO
 
SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO
 
 
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MNG_REPORT_CONTROL_MANAGER' and ss.name = 'MWH')
       DROP PROCEDURE MWH.MNG_REPORT_CONTROL_MANAGER
GO
 
 
 
--  example of SP call
--  exec  MWH.MNG_REPORT_CONTROL_MANAGER   'ADD', PROCEDURE_NAME, REPORT_NAME, REPORT_REQUESTER_D_STAFF_ID, REPORT_ANALYST_D_STAFF_ID, SP_DEVELOPER_D_STAFF_ID, POWERBI_DEVELOPER_D_STAFF_ID, SSRS_DEVELOPER_D_STAFF_ID, ACTIVE
 
 
 
CREATE PROCEDURE [MWH].[MNG_REPORT_CONTROL_MANAGER]
  @message VARCHAR(20),   --  valid meaages :   ADD, RUN, REPORT,  RUN_ALL
  @PROCEDURE_NAME                               VARCHAR(80) ,
  @REPORT_NAME                                         VARCHAR(80) ,
  @REPORT_REQUESTER_D_STAFF_ID           INTEGER ,
  @REPORT_ANALYST_D_STAFF_ID             INTEGER ,
  @SP_DEVELOPER_D_STAFF_ID               INTEGER ,
  @POWERBI_DEVELOPER_D_STAFF_ID          INTEGER ,
  @SSRS_DEVELOPER_D_STAFF_ID             INTEGER ,
  @ACTIVE                                              SMALLINT
 
AS
 
SET NOCOUNT ON;
DECLARE @FND_ID                  INTEGER = -1;
DECLARE @InsertedRows AS TABLE (Id int)
DECLARE @REPORT_CONTROL_MANAGER_HISTORY_Id INTEGER = -1;
DECLARE @MY_REPORT_CONTROL_MANAGER_ID INTEGER = -1;
 
 
 
IF  @message = 'ADD'
       BEGIN
 
                IF( @REPORT_REQUESTER_D_STAFF_ID       IS NULL) begin
                     SET @REPORT_REQUESTER_D_STAFF_ID = 790;
                END;
 
                IF( @REPORT_ANALYST_D_STAFF_ID         IS NULL) begin
                     SET @REPORT_ANALYST_D_STAFF_ID = 790;
                END;
 
                IF( @SP_DEVELOPER_D_STAFF_ID           IS NULL) begin
                     SET @SP_DEVELOPER_D_STAFF_ID = 8805;
                END;
 
                IF( @POWERBI_DEVELOPER_D_STAFF_ID             IS NULL) begin
                     SET @POWERBI_DEVELOPER_D_STAFF_ID = 8805;
                END;
 
                IF( @SSRS_DEVELOPER_D_STAFF_ID         IS NULL) begin
                     SET @SSRS_DEVELOPER_D_STAFF_ID = 8805;
                END;
 
                IF( @ACTIVE        IS NULL) begin
                     SET @ACTIVE = 1;
                END;
 
 
              SELECT @MY_REPORT_CONTROL_MANAGER_ID  =  ID
              FROM MWH.REPORT_CONTROL_MANAGER
              WHERE PROCEDURE_NAME = UPPER(@PROCEDURE_NAME);
 
              IF (@MY_REPORT_CONTROL_MANAGER_ID  =  -1)
                     BEGIN
                           INSERT INTO MWH.REPORT_CONTROL_MANAGER (PROCEDURE_NAME, REPORT_NAME, REPORT_REQUESTER_D_STAFF_ID, REPORT_ANALYST_D_STAFF_ID, SP_DEVELOPER_D_STAFF_ID, POWERBI_DEVELOPER_D_STAFF_ID, SSRS_DEVELOPER_D_STAFF_ID, ACTIVE )
                           VALUES ( upper(@PROCEDURE_NAME), upper(@REPORT_NAME), @REPORT_REQUESTER_D_STAFF_ID, @REPORT_ANALYST_D_STAFF_ID, @SP_DEVELOPER_D_STAFF_ID, @POWERBI_DEVELOPER_D_STAFF_ID, @SSRS_DEVELOPER_D_STAFF_ID, @ACTIVE );
 
                           SELECT @MY_REPORT_CONTROL_MANAGER_ID = @@IDENTITY;
                    END
              ELSE
                     BEGIN
                           UPDATE MWH.REPORT_CONTROL_MANAGER
                                   SET  REPORT_NAME  =  @REPORT_NAME,
                                  REPORT_REQUESTER_D_STAFF_ID  =  @REPORT_REQUESTER_D_STAFF_ID,
                                  REPORT_ANALYST_D_STAFF_ID  =  @REPORT_ANALYST_D_STAFF_ID,
                                  SP_DEVELOPER_D_STAFF_ID  =  @SP_DEVELOPER_D_STAFF_ID,
                                  POWERBI_DEVELOPER_D_STAFF_ID  =  @POWERBI_DEVELOPER_D_STAFF_ID,
                                  SSRS_DEVELOPER_D_STAFF_ID  =  @SSRS_DEVELOPER_D_STAFF_ID,
                                  ACTIVE  =  @ACTIVE
                                  WHERE ID = @MY_REPORT_CONTROL_MANAGER_ID; 
                     END
       END
 
ELSE
      BEGIN
                     INSERT INTO  "S_MST"."UMA_DWH_ETL_ERRORS" ("ERROR_DESCRI", "ETL_JOB_TABLE", "ETL_JOB_TABLE_ID"  )
                     VALUES (  ' MWH.MNG_REPORT_CONTROL_MANAGER  message error, no RUNNING process for ID : ' , 'MWH.REPORT_CONTROL_MANAGER_HISTORY', 0  );
       END
 
 
 
SELECT   @MY_REPORT_CONTROL_MANAGER_ID;
 
 
GO