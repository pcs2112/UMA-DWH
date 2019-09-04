--  C8_UMA_TELECOM.UMA_TELECOM.SAVE_D_REP_WORKGROUP.sql

--  select D_REP_ID , count(*) from [UMA_TELECOM].[D_REP_SKILL]  group by D_REP_ID order by count(*) desc

--  select * from  [UMA_TELECOM].[D_REP_SKILL]  where D_REP_ID = 64 order by REP_SKILL_ID asc
/*
Workgroups one to many
$id: integer,
name: string,
id: string,
dateAdded: datetime
customAttributes: (Figure out what this is)
*/

USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'SAVE_D_REP_WORKGROUP' and ss.name = 'UMA_TELECOM')
	DROP PROCEDURE UMA_TELECOM.SAVE_D_REP_WORKGROUP
GO



CREATE PROCEDURE UMA_TELECOM.SAVE_D_REP_WORKGROUP
		@LOAD_HISTORY_PKID				integer  = -1 ,
		@D_REP_ID						integer,
		@REP_WORKGROUP_ID				integer	,
		@REP_WORKGROUP_Name				nVARCHAR(100),
		@REP_WORKGROUP_id_ALTERNATE		nVARCHAR(100),
		@REP_WORKGROUP_dateAdded			datetime2,
		@REP_WORKGROUP_customAttributes	nvarchar(200)

AS

	DECLARE @END_DATETIME DATETIME2;
	DECLARE @START_DATETIME DATETIME2;
	SET @START_DATETIME = sysdatetime();

	DECLARE @vSTART_RTNCODE INTEGER = -1;
	DECLARE @vFINISHED_RTNCODE INTEGER = -1;

	DECLARE @rtn_Insert_Cnt INTEGER = 0;
	DECLARE @rtn_Update_Cnt INTEGER = 0;
	DECLARE	@SELECT_ERROR	INTEGER = 0;

	DECLARE	@D_REP_WORKGROUP_ID	INTEGER = -1;
	DECLARE	@X_REP_TO_REP_WORKGROUP_ID		integer = 0;

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
	SET @Target_Table_Name = 'D_REP_WORKGROUP';


--	EXEC MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0, @Source_Server_Name, @Source_DB_Name, @Source_Schema_Name,
--															@Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME,
--															@vPERIOD_START_DTTM, @vPERIOD_END_DTTM, 0, 0, 0, 0, 0, '', @LOAD_HIST_PKID OUTPUT;

	BEGIN TRY
	
	MERGE UMA_TELECOM.D_REP_WORKGROUP AS TARGET
	USING (SELECT
		@REP_WORKGROUP_Name,
		@REP_WORKGROUP_id_ALTERNATE
	) AS SOURCE (
		REP_WORKGROUP_Name,
		REP_WORKGROUP_id_ALTERNATE
	)
	ON ( TARGET.REP_WORKGROUP_Name = SOURCE.REP_WORKGROUP_Name )	
	WHEN MATCHED   THEN
	UPDATE SET
		[MSTR_LOAD_ID] = @LOAD_HISTORY_PKID,
		REP_WORKGROUP_id_ALTERNATE = source.REP_WORKGROUP_id_ALTERNATE

	WHEN NOT MATCHED THEN
	INSERT (
		[MSTR_LOAD_ID],
		REP_WORKGROUP_Name,
		REP_WORKGROUP_id_ALTERNATE
	) VALUES (
		@LOAD_HISTORY_PKID,
		source.REP_WORKGROUP_Name,
		source.REP_WORKGROUP_id_ALTERNATE
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


	select  @D_REP_WORKGROUP_ID =  ID 
	from UMA_TELECOM.D_REP_WORKGROUP   with(nolock)
	where REP_WORKGROUP_Name = @REP_WORKGROUP_Name;
	SET @SELECT_ERROR = @@ERROR;


	IF ( @SELECT_ERROR = 0 ) begin

		

		--  find the active WorkGroup X_REP
		SELECT @X_REP_TO_REP_WORKGROUP_ID = ID
		FROM [UMA_TELECOM].[X_REP_TO_REP_WORKGROUP] with(nolock)
		where [D_REP_ID] = @D_REP_ID
		and [D_REP_WORKGROUP_ID] = @D_REP_WORKGROUP_ID
		and [REP_WORKGROUP_dateRemoved] is NULL;



		MERGE [UMA_TELECOM].[X_REP_TO_REP_WORKGROUP]  AS TARGET
		USING (SELECT
			@D_REP_ID,
			@D_REP_WORKGROUP_ID,
			@REP_WORKGROUP_ID,
			@REP_WORKGROUP_dateAdded,
			@REP_WORKGROUP_customAttributes
		) AS SOURCE (
			D_REP_ID,
			D_REP_WORKGROUP_ID,
			REP_WORKGROUP_ID,
			REP_WORKGROUP_dateAdded,
			REP_WORKGROUP_customAttributes
		)
		ON (TARGET.D_REP_ID = SOURCE.D_REP_ID  and  TARGET.D_REP_WORKGROUP_ID = source.D_REP_WORKGROUP_ID and [REP_WORKGROUP_dateRemoved] is NULL)
		WHEN MATCHED THEN
		UPDATE SET
			[MSTR_LOAD_ID] = @LOAD_HISTORY_PKID,
			REP_WORKGROUP_ID = source.REP_WORKGROUP_ID,
			REP_WORKGROUP_dateAdded = source.REP_WORKGROUP_dateAdded,
			REP_WORKGROUP_customAttributes = source.REP_WORKGROUP_customAttributes
		WHEN NOT MATCHED THEN
		INSERT (
			[MSTR_LOAD_ID],
			D_REP_ID,
			D_REP_WORKGROUP_ID,
			REP_WORKGROUP_ID,
			REP_WORKGROUP_dateAdded,
			REP_WORKGROUP_customAttributes
		) VALUES (
			@LOAD_HISTORY_PKID,
			source.D_REP_ID,
			source.D_REP_WORKGROUP_ID,
			source.REP_WORKGROUP_ID,
			source.REP_WORKGROUP_dateAdded,
			source.REP_WORKGROUP_customAttributes
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
			select 0 as INSERT_CNT, 0 as UPDATE_CNT
		end
*/



		RETURN

GO 



grant execute on UMA_TELECOM.SAVE_D_REP_WORKGROUP to public;
go



