-- C8_MWH_FILES.MANAGE_API_CONSOLE_DATA.sql

USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


IF EXISTS (SELECT * FROM sys.objects so JOIN sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MANAGE_API_CONSOLE_DATA' and ss.name = 'MWH_FILES')
 DROP PROCEDURE MWH_FILES.MANAGE_API_CONSOLE_DATA
GO



-- exec MWH_FILES.MANAGE_API_CONSOLE_DATA 'LIST_SKILLS' , '' , '' , '' , '' , '' , '' , '' , ''
-- exec MWH_FILES.MANAGE_API_CONSOLE_DATA 'UPDATE_SKILLS' , '2', 'SNAPSHOT' , '' , '' , '' , '' , '' , ''
-- select [REP_SKILL_UPDATE_TYPE], count(*) from [UMA_TELECOM].[D_REP_SKILL] with(nolock) group by REP_SKILL_UPDATE_TYPE

CREATE PROCEDURE [MWH_FILES].[MANAGE_API_CONSOLE_DATA]
  @message          VARCHAR(50)                       = 'LIST_SKILLS',   --  'LIST_SKILLS', 'LIST_WORKGROUPS', 'LIST_ROLES', 'LIST_REPS', 'SAVE_SKILLS'
  @VARIABLE_01      varchar(80)                       = '',                      --  if the message is for SKILLS, then D_REP_SKILL_ID
  @VARIABLE_02      varchar(80)                       = '',                      --     if the message is for SKILLS, then  [REP_SKILL_UPDATE_TYPE]

  @VARIABLE_03      varchar(80)                       = '',                      --     if the message is for SKILLS, then D_REP_ID
  @VARIABLE_04      varchar(80)                       = '',                      --     if the message is for SKILLS, then REP_SKILL_ID
  @VARIABLE_05      varchar(80)                       = '',                      --     if the message is for SKILLS, then REP_SKILL_proficiency
  @VARIABLE_06      varchar(80)                       = '',                      --     if the message is for SKILLS, then REP_SKILL_desireToUse
  @VARIABLE_07      varchar(80)                       = '',                      --     if the message is for SKILLS, then REP_SKILL_dateAdded
  @VARIABLE_08      varchar(80)                       = ''                       --     if the message is for SKILLS, then REP_SKILL_dateRemoved

AS

DECLARE @VARIABLE_ERROR   VARCHAR(80);

DECLARE @ERR INTEGER = 0;
DECLARE @ErrorSeverity INTEGER;
DECLARE @ErrorState INTEGER;
DECLARE @ErrorProcedure NVARCHAR(128);
DECLARE @ErrorLine INTEGER;
DECLARE @ErrorMessage NVARCHAR(4000);
DECLARE @TryCatchError_ID INTEGER = 0;
DECLARE @RETURN_FLG INTEGER = -2;
DECLARE @SERVER_NAME  VARCHAR(100) = 'MLK-EDM-D-SQ02';

DECLARE @My_SP_NAME VARCHAR(50);


SET @My_SP_NAME = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID);

BEGIN TRY

IF( @message NOT in ('LIST_SKILLS', 'UPDATE_SKILLS', 'LIST_WORKGROUPS', 'LIST_ROLES', 'LIST_REPS')) begin
       SET @VARIABLE_ERROR = 'INVALID MESSAGE :' + @message;
  END else begin

       IF ( @message = 'LIST_SKILLS') BEGIN
             select ID, 'D_REP_SKILL' as TABLE_NAME, rs.[REP_SKILL_displayName], rs.[REP_SKILL_UPDATE_TYPE] ,  rs.[REP_SKILL_SYSTEM] ,  rs.INSERT_DTTM, rs.[UPDATE_DTTM]
             from [UMA_TELECOM].[D_REP_SKILL] rs with(nolock)
             order by rs.[REP_SKILL_UPDATE_TYPE] desc, [UPDATE_DTTM] desc;
       END;

       IF ( @message = 'UPDATE_SKILL') BEGIN

             DECLARE @D_REP_SKILL_ID                        INTEGER  =  cast(@VARIABLE_01 as integer);
             DECLARE @REP_SKILL_UPDATE_TYPE           varchar(8)  = substring(@VARIABLE_02, 1, 8);
             DECLARE @UPDATE_TYPE_RETURN              INTEGER;

             UPDATE [UMA_TELECOM].[D_REP_SKILL]
             set  [REP_SKILL_UPDATE_TYPE]    =  @REP_SKILL_UPDATE_TYPE
             where [ID] = @D_REP_SKILL_ID;

             set @UPDATE_TYPE_RETURN = @@ERROR;

             select @UPDATE_TYPE_RETURN;


--           select  * from [UMA_TELECOM].[D_REP_SKILL]   where [ID] = 1;

       END

       IF ( @message = 'LIST_WORKGROUPS') BEGIN
             select ID, 'D_REP_WORKGROUPS' as TABLE_NAME, rs.[REP_WORKGROUP_NAME] ,    rs.[REP_WORKGROUP_ID_ALTERNATE]  ,  rs.INSERT_DTTM, rs.[UPDATE_DTTM]
             from [UMA_TELECOM].[D_REP_WORKGROUP] rs with(nolock)
             order by rs.[REP_WORKGROUP_Name] desc, [UPDATE_DTTM] desc;
       END;

       IF ( @message = 'LIST_ROLES') BEGIN
             select ID, 'D_REP_ROLES' as TABLE_NAME, rs.[REP_ROLE_roleId]  ,    rs.[REP_ROLE_name]   ,  rs.INSERT_DTTM, rs.[UPDATE_DTTM]
             from [UMA_TELECOM].[D_REP_ROLE]  rs with(nolock)
             order by  [UPDATE_DTTM] desc;
       END;

       IF ( @message = 'LIST_REPS') BEGIN
             select ID, 'D_REP' as TABLE_NAME, rs.[REP_ID] , rs.[REP_userId],  rs.[REP_homeSite_ID]  ,rs.[REP_firstName]  ,rs.[REP_lastName]  ,rs.[REP_displayName]  ,rs.[REP_ntDomainUser] ,
                           rs.[REP_extension] ,rs.[REP_outboundANI] ,rs.[REP_id_LIST]  ,rs.[REP_customAttributes] ,rs.[REP_dateAdded]   ,rs.INSERT_DTTM, rs.[UPDATE_DTTM]
             from  [UMA_TELECOM].[D_REP]  rs with(nolock)
             order by  rs.[UPDATE_DTTM] desc;
       END;

end;
END TRY
BEGIN CATCH
       SELECT
             @ERR = ERROR_NUMBER(),
             @ErrorSeverity = ERROR_SEVERITY(),
             @ErrorState = ERROR_STATE(),
             @ErrorProcedure = ERROR_PROCEDURE(),
             @ErrorLine = ERROR_LINE(),
             @ErrorMessage = ERROR_MESSAGE() + ':' + @message;

             EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error', @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine,
                                                                                                                                     @ErrorMessage, @My_SP_NAME, @TryCatchError_ID OUTPUT;
             SET          @RETURN_FLG = 0;
--           select @ErrorMessage

END CATCH;

RETURN @RETURN_FLG;



grant exec on MWH_FILES.MANAGE_API_CONSOLE_DATA to public;
go
