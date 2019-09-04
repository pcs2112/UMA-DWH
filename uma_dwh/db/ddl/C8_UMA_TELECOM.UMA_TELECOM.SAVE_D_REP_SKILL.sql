--  C8_UMA_TELECOM.UMA_TELECOM.SAVE_D_REP_SKILL.sql

USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'SAVE_D_REP_SKILL' and ss.name = 'UMA_TELECOM')
	DROP PROCEDURE UMA_TELECOM.SAVE_D_REP_SKILL
GO



CREATE PROCEDURE UMA_TELECOM.SAVE_D_REP_SKILL
		@LOAD_HISTORY_PKID			integer = -1,
		@D_REP_ID					integer,
		@REP_SKILL_ID				integer	,
		@REP_SKILL_displayName		nVARCHAR(100),
		@REP_SKILL_proficiency		integer,
		@REP_SKILL_desireToUse		integer,
		@REP_SKILL_id_ALTERNATE		nVARCHAR(300),
		@REP_SKILL_dateAdded		datetime2

AS

	DECLARE @END_DATETIME DATETIME2;
	DECLARE @START_DATETIME DATETIME2;
	SET @START_DATETIME = sysdatetime();

	DECLARE @vSTART_RTNCODE INTEGER = -1;
	DECLARE @vFINISHED_RTNCODE INTEGER = -1;

	DECLARE @rtn_Insert_Cnt INTEGER = 0;
	DECLARE @rtn_Update_Cnt INTEGER = 0;
	DECLARE		@D_REP_SKILL_ID		INTEGER	= -911;


	DECLARE @SummaryOfChanges TABLE(Change VARCHAR(20));

	DECLARE @LOAD_HIST_PKID INTEGER;
	DECLARE @LOAD_HIST_DUMMY INTEGER;

	DECLARE @ERR INTEGER = 0;
	DECLARE @ErrorSeverity INTEGER;
	DECLARE @ErrorState INTEGER;
	DECLARE @ErrorProcedure NVARCHAR(128);
	DECLARE @ErrorLine INTEGER;
	DECLARE @ErrorMessage NVARCHAR(4000);
	DECLARE @TryCatchError_ID INTEGER = 0;
	DECLARE	@SELECT_ERROR	integer = -1;

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
	SET @Target_Schema_Name = 'UMA_TELECOM';

	DECLARE @Target_Table_Name VARCHAR(60);
	SET @Target_Table_Name = 'D_REP_SKILL';


--	EXEC MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0, @Source_Server_Name, @Source_DB_Name, @Source_Schema_Name,
--															@Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME,
--															@vPERIOD_START_DTTM, @vPERIOD_END_DTTM, 0, 0, 0, 0, 0, '', @LOAD_HIST_PKID OUTPUT;

BEGIN TRY


	MERGE UMA_TELECOM.D_REP_SKILL AS TARGET
	USING (SELECT
		@REP_SKILL_displayName
	) AS SOURCE (
		REP_SKILL_displayName
	)

	ON (TARGET.REP_SKILL_displayName = SOURCE.REP_SKILL_displayName  )
	
	WHEN MATCHED THEN

	UPDATE SET
		[MSTR_LOAD_ID] = @LOAD_HISTORY_PKID
	WHEN NOT MATCHED THEN
	INSERT (
		[MSTR_LOAD_ID],
		REP_SKILL_displayName
	) VALUES (
		@LOAD_HISTORY_PKID,
		source.REP_SKILL_displayName
	)
	OUTPUT $ACTION INTO @SummaryOfChanges;

	SELECT @rtn_Insert_Cnt = COUNT(*)
	FROM @SummaryOfChanges
	WHERE Change = 'INSERT'
	GROUP BY Change;

	SELECT @rtn_Update_Cnt = COUNT(*)
	FROM @SummaryOfChanges
	WHERE Change = 'UPDATE'
	GROUP BY Change;


	

	SELECT @D_REP_SKILL_ID = ID
	FROM UMA_TELECOM.D_REP_SKILL with(nolock)
	WHERE [REP_SKILL_displayName] = @REP_SKILL_displayName;

	SET @SELECT_ERROR = @@ERROR;


	IF ( @SELECT_ERROR = 0 ) begin

		MERGE [UMA_TELECOM].[X_REP_TO_REP_SKILL] AS TARGET
		USING (SELECT
			@D_REP_ID,
			@D_REP_SKILL_ID,
			@REP_SKILL_ID,
			@REP_SKILL_proficiency,
			@REP_SKILL_desireToUse,
			@REP_SKILL_id_ALTERNATE,
			@REP_SKILL_dateAdded
		) AS SOURCE (
			D_REP_ID,
			D_REP_SKILL_ID,
			REP_SKILL_ID,
			REP_SKILL_proficiency,
			REP_SKILL_desireToUse,
			REP_SKILL_id_ALTERNATE,
			REP_SKILL_dateAdded
		)
		ON (TARGET.D_REP_ID = SOURCE.D_REP_ID  and  TARGET.D_REP_SKILL_ID = source.D_REP_SKILL_ID)
	
		WHEN MATCHED THEN

		UPDATE SET
			[MSTR_LOAD_ID] = @LOAD_HISTORY_PKID,
			REP_SKILL_ID = source.REP_SKILL_ID,
			REP_SKILL_proficiency = source.REP_SKILL_proficiency,
			REP_SKILL_desireToUse = source.REP_SKILL_desireToUse,
			REP_SKILL_id_ALTERNATE = source.REP_SKILL_id_ALTERNATE,
			REP_SKILL_dateAdded = source.REP_SKILL_dateAdded
		WHEN NOT MATCHED THEN
		INSERT (
			[MSTR_LOAD_ID],
			D_REP_ID,
			D_REP_SKILL_ID,
			REP_SKILL_ID,
			REP_SKILL_proficiency,
			REP_SKILL_desireToUse,
			REP_SKILL_id_ALTERNATE,
			REP_SKILL_dateAdded
		) VALUES (
			@LOAD_HISTORY_PKID,
			source.D_REP_ID,
			source.D_REP_SKILL_ID,
			source.REP_SKILL_ID,
			source.REP_SKILL_proficiency,
			source.REP_SKILL_desireToUse,
			source.REP_SKILL_id_ALTERNATE,
			source.REP_SKILL_dateAdded
		)
		OUTPUT $ACTION INTO @SummaryOfChanges;

		SELECT @rtn_Insert_Cnt = COUNT(*)
		FROM @SummaryOfChanges
		WHERE Change = 'INSERT'
		GROUP BY Change;

		SELECT @rtn_Update_Cnt = COUNT(*)
		FROM @SummaryOfChanges
		WHERE Change = 'UPDATE'
		GROUP BY Change;

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

	SET @END_DATETIME = sysdatetime();

--	EXEC MWH.MNG_LOAD_HISTORY   'FINISHED', @END_DATETIME, @LOAD_HIST_PKID, @Source_Server_Name, @Source_DB_Name,
--															@Source_Schema_Name, @Source_Table_Name, @Target_Schema_Name, @Target_Table_Name,
--															@My_SP_NAME, @vPERIOD_START_DTTM, @vPERIOD_END_DTTM, @rtn_Insert_Cnt, @rtn_Update_Cnt,
--															@rtn_Delete_Cnt, @TryCatchError_ID, 0, '', @LOAD_HIST_DUMMY OUTPUT;

/*
	IF @ERR = 0 begin
		select @rtn_Insert_Cnt as INSERT_CNT, @rtn_Update_Cnt as UPDATE_CNT
	end else begin
		select -1 as INSERT_CNT, -1 as UPDATE_CNT
	end
*/
	
	RETURN

GO 





grant execute on UMA_TELECOM.SAVE_D_REP_SKILL to public;
go

