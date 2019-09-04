--  C8_UMA_TELECOM.UMA_TELECOM.PROCESS.sql


USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- exec  UMA_TELECOM.PROCESS_API_DATA 'START'
--  this returns a single integer ,  LOAD_HISTORY_PKID


-- exec  UMA_TELECOM.PROCESS_API_DATA 'FINISHED',  4060449
--  after all the Data has been processed, call the 'FINISHED' message with the LOAD_HISTORY_PKID sent when calling the START

 DECLARE		@UD_X_REP_TO_REP_SKILL INTEGER  = 0 ;
 DECLARE		@UD_X_REP_TO_REP_ROLE INTEGER  = 0 ;
 DECLARE		@UD_X_REP_TO_REP_WORKGROUP INTEGER  = 0 ;


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'PROCESS_API_DATA' and ss.name = 'UMA_TELECOM')
	DROP PROCEDURE UMA_TELECOM.PROCESS_API_DATA
GO



CREATE PROCEDURE UMA_TELECOM.PROCESS_API_DATA
	@MESSAGE				VARCHAR(100),
	@LOAD_HIST_PKID_IN		INTEGER	= -911
AS


 DECLARE @PERIOD_START_DTTM            DATETIME2;
 SET @PERIOD_START_DTTM = getdate();

 DECLARE		@ERR			INTEGER  = 0 ;
 DECLARE		@ErrorSeverity	INTEGER;
 DECLARE		@ErrorState		INTEGER;
 DECLARE		@ErrorProcedure	nvarchar(128) ;
 DECLARE		@ErrorLine		INTEGER;
 DECLARE		@ErrorMessage	nvarchar(4000);
 DECLARE		@TryCatchError_ID	INTEGER  = 0 ;

 DECLARE @vPERIOD_START_DTTM	varchar(27);
 DECLARE @vPERIOD_END_DTTM		varchar(27);
 set @vPERIOD_START_DTTM =	cast( @PERIOD_START_DTTM  as varchar(27));

 set @vPERIOD_END_DTTM   =	cast( @PERIOD_START_DTTM  as varchar(27));

 DECLARE  @LOAD_HIST_PKID  INTEGER = -911;
 DECLARE  @LOAD_HIST_DUMMY  INTEGER = -911;
 
 DECLARE		@D_REP_PROC_CNT					INTEGER = 0;
 DECLARE		@D_REP_SKILL_PROC_CNT			INTEGER = 0;
 DECLARE		@D_REP_ROLE_PROC_CNT			INTEGER = 0;
 DECLARE		@D_REP_WORKGROUP_PROC_CNT		INTEGER = 0;
 DECLARE		@D_TOTAL_PROC_CNT				INTEGER	= 0;
 DECLARE		@UD_X_REP_TO_REP_SKILL INTEGER  = 0 ;
 DECLARE		@UD_X_REP_TO_REP_ROLE INTEGER  = 0 ;
 DECLARE		@UD_X_REP_TO_REP_WORKGROUP INTEGER  = 0 ;
 DECLARE		@D_TOTAL_UD_CNT				INTEGER	= 0;
 DECLARE		@D_REP_NEW_CNT				INTEGER	= 0;
 


	DECLARE @My_SP_NAME VARCHAR(50);
	SET @My_SP_NAME = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID);


	DECLARE @Source_Server_Name VARCHAR(60);
	SET @Source_Server_Name = 'http://lionwebapi-fr.ultimatemedical.edu';

	DECLARE @Source_DB_Name VARCHAR(40);
	SET @Source_DB_Name = '/api';

	DECLARE @Source_Schema_Name VARCHAR(40);
	SET @Source_Schema_Name = '/v2/Telecom';

	DECLARE @Source_Table_Name VARCHAR(60);
	SET @Source_Table_Name = '/GetAllUsers';

	DECLARE @Target_Schema_Name VARCHAR(40);
	SET @Target_Schema_Name = 'MWH';

	DECLARE @Target_Table_Name VARCHAR(60);
	SET @Target_Table_Name = 'ETL_HISTORY';






--  select * from [UMA_TELECOM].[D_REP]
	BEGIN TRY

	IF(@MESSAGE = 'START') begin
		EXEC MWH.MNG_LOAD_HISTORY   'START', @PERIOD_START_DTTM, 0, @Source_Server_Name, @Source_DB_Name, @Source_Schema_Name,
															@Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME,
															@vPERIOD_START_DTTM, @vPERIOD_END_DTTM, 0, 0, 0, 0, 0, '', @LOAD_HIST_PKID OUTPUT;

		SELECT @LOAD_HIST_PKID as RETURN_VALUE

	END

	IF(@MESSAGE = 'FINISHED') begin


		SELECT @D_REP_PROC_CNT = count(*)	from [UMA_TELECOM].[D_REP] with(nolock) where [MSTR_LOAD_ID] = @LOAD_HIST_PKID_IN;
		SELECT @D_REP_NEW_CNT = count(*)	from [UMA_TELECOM].[D_REP] with(nolock) where [MSTR_LOAD_ID] = @LOAD_HIST_PKID_IN and [INSERT_DTTM] = [UPDATE_DTTM];


		SELECT @D_REP_SKILL_PROC_CNT = count(*)	from [UMA_TELECOM].[X_REP_TO_REP_SKILL]   with(nolock) where [MSTR_LOAD_ID] = @LOAD_HIST_PKID_IN;

		SELECT @D_REP_ROLE_PROC_CNT = count(*)	from [UMA_TELECOM].[X_REP_TO_REP_ROLE]  with(nolock) where [MSTR_LOAD_ID] = @LOAD_HIST_PKID_IN;

		SELECT @D_REP_WORKGROUP_PROC_CNT = count(*)	from [UMA_TELECOM].[X_REP_TO_REP_WORKGROUP]  with(nolock) where [MSTR_LOAD_ID] = @LOAD_HIST_PKID_IN;

		SET @D_TOTAL_PROC_CNT = @D_REP_PROC_CNT + @D_REP_SKILL_PROC_CNT + @D_REP_ROLE_PROC_CNT + @D_REP_WORKGROUP_PROC_CNT;


		update [UMA_TELECOM].[X_REP_TO_REP_SKILL]
		SET [REP_SKILL_dateRemoved] = @PERIOD_START_DTTM
		where [MSTR_LOAD_ID] != @LOAD_HIST_PKID_IN;
		SET @UD_X_REP_TO_REP_SKILL = @@ROWCOUNT;

		update  [UMA_TELECOM].[X_REP_TO_REP_ROLE]
		SET  [REP_ROLE_dateRemoved] = @PERIOD_START_DTTM
		where [MSTR_LOAD_ID] != @LOAD_HIST_PKID_IN;
		SET @UD_X_REP_TO_REP_ROLE = @@ROWCOUNT;


		update   [UMA_TELECOM].[X_REP_TO_REP_WORKGROUP]
		SET   [REP_WORKGROUP_dateRemoved] = @PERIOD_START_DTTM
		where [MSTR_LOAD_ID] != @LOAD_HIST_PKID_IN;
		SET @UD_X_REP_TO_REP_WORKGROUP = @@ROWCOUNT;

		EXEC MWH.MNG_LOAD_HISTORY   'FINISHED', @PERIOD_START_DTTM, @LOAD_HIST_PKID_IN, @Source_Server_Name, @Source_DB_Name,
															@Source_Schema_Name, @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name,
															@My_SP_NAME, @vPERIOD_START_DTTM, @vPERIOD_END_DTTM, @D_REP_NEW_CNT, @D_TOTAL_PROC_CNT,  @D_TOTAL_UD_CNT,
															 @TryCatchError_ID, 0, '', @LOAD_HIST_DUMMY OUTPUT;



		SET @D_TOTAL_UD_CNT = @UD_X_REP_TO_REP_SKILL + @UD_X_REP_TO_REP_ROLE + @UD_X_REP_TO_REP_WORKGROUP;


		SELECT @D_TOTAL_PROC_CNT  as RETURN_VALUE,  @D_REP_NEW_CNT as NEW_REP_COUNT, @D_TOTAL_UD_CNT as REMOVED_COUNT

	END



	END TRY
	BEGIN CATCH
	SELECT
		@ERR = ERROR_NUMBER(),
		@ErrorSeverity = ERROR_SEVERITY(),
		@ErrorState = ERROR_STATE(),
		@ErrorProcedure = ERROR_PROCEDURE(),
		@ErrorLine = ERROR_LINE(),
		@ErrorMessage = ERROR_MESSAGE();

	EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error', @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine,
																				@ErrorMessage, @My_SP_NAME, @TryCatchError_ID OUTPUT;

	END CATCH;



	RETURN

GO 



grant execute on UMA_TELECOM.PROCESS_API_DATA to public;
go