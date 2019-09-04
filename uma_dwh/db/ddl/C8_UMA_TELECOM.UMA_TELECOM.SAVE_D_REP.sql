--  C8_UMA_TELECOM.UMA_TELECOM.SAVE_D_REP.sql



-- exec  UMA_TELECOM.PROCESS_API_DATA 'START'
--  this returns a single integer ,  LOAD_HISTORY_PKID


-- exec  UMA_TELECOM.PROCESS_API_DATA 'FINISHED',  LOAD_HISTORY_PKID
--  after all the Data has been processed, call the 'FINISHED' message with the LOAD_HISTORY_PKID sent when calling the START


--  select count(*) from UMA_TELECOM.D_REP  where [MSTR_LOAD_ID]   =  4080957


USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

--  select * from 


IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'SAVE_D_REP' and ss.name = 'UMA_TELECOM')
	DROP PROCEDURE UMA_TELECOM.SAVE_D_REP
GO



CREATE PROCEDURE UMA_TELECOM.SAVE_D_REP
	@LOAD_HISTORY_PKID		integer = -1 ,
	@REP_ID					integer			,
	@REP_userId				nVARCHAR(300) 	,
	@REP_homeSite			integer			,
	@REP_firstName			nvarchar(max)	,
	@REP_lastName			nvarchar(max)	,
	@REP_displayName		nvarchar(max)	,
	@REP_ntDomainUser		nvarchar(max)	,
	@REP_extension			nvarchar(max)	,
	@REP_outboundANI		nvarchar(max)	,
	@REP_id_LIST			nvarchar(max)	,
	@REP_customAttributes	nvarchar(max)	,
	@REP_dateAdded			datetime2
AS

	DECLARE @END_DATETIME DATETIME2;
	DECLARE @START_DATETIME DATETIME2;
	SET @START_DATETIME = sysdatetime();

	DECLARE @vSTART_RTNCODE INTEGER = -1;
	DECLARE @vFINISHED_RTNCODE INTEGER = -1;

	DECLARE @rtn_Insert_Cnt INTEGER = 0;
	DECLARE @rtn_Update_Cnt INTEGER = 0;



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
	SET @Target_Table_Name = 'D_REP';

	DECLARE	@D_REP_ID			integer = -1;

	DECLARE	@PRIOR_REP_homeSite	integer = -1;
	DECLARE	@PRIOR_REP_dateAdded datetime2 ;

--	EXEC MWH.MNG_LOAD_HISTORY   'START', @START_DATETIME, 0, @Source_Server_Name, @Source_DB_Name, @Source_Schema_Name,
--															@Source_Table_Name, @Target_Schema_Name, @Target_Table_Name, @My_SP_NAME,
--															@vPERIOD_START_DTTM, @vPERIOD_END_DTTM, 0, 0, 0, 0, 0, '', @LOAD_HIST_PKID OUTPUT;
--  select * from [UMA_TELECOM].[D_REP]

--  select * from UMA_TELECOM.D_REP_ERROR

	IF( @REP_userId is NULL or len(@REP_userId) <= 1) begin
		INSERT into UMA_TELECOM.D_REP_ERROR (REP_ID, REP_userId, REP_homeSite_ID, REP_firstName, REP_lastName, REP_displayName, REP_ntDomainUser, REP_extension, REP_outboundANI, REP_id_LIST, REP_customAttributes, REP_dateAdded )
		values(@REP_ID, @REP_userId, @REP_homeSite, @REP_firstName, @REP_lastName, @REP_displayName, @REP_ntDomainUser, @REP_extension, @REP_outboundANI, @REP_id_LIST, @REP_customAttributes, @REP_dateAdded);
		SET @ERR = 1

	end 
	else begin

BEGIN TRY

--	SET @REP_lastName = replace(@REP_lastName, '-', '');
--	SET @REP_displayName = replace(@REP_displayName,'-','');


	select @PRIOR_REP_homeSite = REP_homeSite_ID,
		   @PRIOR_REP_dateAdded = REP_dateAdded 
	from UMA_TELECOM.D_REP
	where REP_userId = @REP_userId;




	MERGE UMA_TELECOM.D_REP AS TARGET
	USING (SELECT
		@REP_ID,
		@REP_userId,
		@REP_homeSite,
		@REP_firstName,
		@REP_lastName,
		@REP_displayName,
		@REP_ntDomainUser,
		@REP_extension,
		@REP_outboundANI,
		@REP_id_LIST,
		@REP_customAttributes,
		@REP_dateAdded
	) AS SOURCE (
		REP_ID,
		REP_userId,
		REP_homeSite_ID,
		REP_firstName,
		REP_lastName,
		REP_displayName,
		REP_ntDomainUser,
		REP_extension,
		REP_outboundANI,
		REP_id_LIST,
		REP_customAttributes,
		REP_dateAdded
	)

	ON (TARGET.REP_userId = SOURCE.REP_userId)
	
WHEN MATCHED 
/*
and ( TARGET.REP_userId != SOURCE.REP_userId  
				or TARGET.REP_homeSite_ID != source.REP_homeSite_ID
				or TARGET.REP_firstName != source.REP_firstName				
				or TARGET.REP_lastName != source.REP_lastName
				or TARGET.REP_displayName != source.REP_displayName
				or TARGET.REP_ntDomainUser != source.REP_ntDomainUser
				or TARGET.REP_extension != source.REP_extension
				or TARGET.REP_outboundANI != source.REP_outboundANI								
				or TARGET.REP_id_LIST != source.REP_id_LIST										
				or TARGET.REP_customAttributes != source.REP_customAttributes																
	)
*/
	 THEN
	UPDATE SET
		[MSTR_LOAD_ID] = @LOAD_HISTORY_PKID,
		REP_ID = source.REP_ID,
		REP_userId = source.REP_userId,
		REP_homeSite_ID = source.REP_homeSite_ID,
		REP_firstName = source.REP_firstName,
		REP_lastName = source.REP_lastName,
		REP_displayName = source.REP_displayName,
		REP_ntDomainUser = source.REP_ntDomainUser,
		REP_extension = source.REP_extension,
		REP_outboundANI = source.REP_outboundANI,
		REP_id_LIST = source.REP_id_LIST,
		REP_customAttributes = source.REP_customAttributes,
		REP_dateAdded = source.REP_dateAdded
	WHEN NOT MATCHED THEN
	INSERT (
		[MSTR_LOAD_ID],
		REP_ID,
		REP_userId,
		REP_homeSite_ID,
		REP_firstName,
		REP_lastName,
		REP_displayName,
		REP_ntDomainUser,
		REP_extension,
		REP_outboundANI,
		REP_id_LIST,
		REP_customAttributes,
		REP_dateAdded

	) VALUES (
		@LOAD_HISTORY_PKID,
		source.REP_ID,
		source.REP_userId,
		source.REP_homeSite_ID,
		source.REP_firstName,
		source.REP_lastName,
		source.REP_displayName,
		source.REP_ntDomainUser,
		source.REP_extension,
		source.REP_outboundANI,
		source.REP_id_LIST,
		source.REP_customAttributes,
		source.REP_dateAdded
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

	SELECT @D_REP_ID = ID  
	from UMA_TELECOM.D_REP with(nolock)
	where REP_ID =  @REP_ID;
	
	IF(@PRIOR_REP_homeSite != @REP_homeSite  and  @PRIOR_REP_homeSite IS NOT NULL) begin	
		insert into UMA_TELECOM.D_REP_HomeSite_Hist (D_REP_ID, REP_homeSite_ID, REP_dateAdded )
		values (@D_REP_ID, @PRIOR_REP_homeSite, @PRIOR_REP_dateAdded);
	end

end

--	select @D_REP_ID as REP_ID;

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
	RETURN  @D_REP_ID

GO 



grant execute on UMA_TELECOM.SAVE_D_REP to public;
go