--  C8_MWH_FILES.MANAGE_COLLEGE_SCORECARD_D_CATEGORY.sql

-- select @@version
-- Microsoft SQL Server 2016 (SP2-CU6) (KB4488536) - 13.0.5292.0 (X64)   Mar 11 2019 23:19:30   Copyright (c) Microsoft Corporation  Enterprise Edition (64-bit) on Windows Server 2012 R2 Standard 6.3 <X64> (Build 9600: ) (Hypervisor) 

--  select top 100 * from [MWH].[ETL_TryCatchError] with(nolock) order by ID desc

USE [UMA_DWH]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

--  select * from [MWH_FILES].[D_CSV_FILE]



IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'P' AND so.name = 'MANAGE_COLLEGE_SCORECARD_D_CATEGORY' and ss.name = 'MWH_FILES')
	DROP PROCEDURE [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY]
GO


 CREATE PROCEDURE [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY]
  @message VARCHAR(50)		,     
  @VARCHAR_01	varchar(256) ,		 
  @VARCHAR_02	NVARCHAR(MAX) ,		
  @VARCHAR_03	varchar(256) ,		
  @VARCHAR_04	NVARCHAR(MAX) ,		
  @VARCHAR_05	varchar(MAX) ,    
  @VARCHAR_06	varchar(MAX) ,
  @VARCHAR_07	varchar(MAX) ,
  @VARCHAR_08	varchar(MAX) ,
  @VARCHAR_09	varchar(MAX) ,	
  @VARCHAR_10	varchar(MAX)
 AS
 
 




/*					--  SAVE_COLLEGE_SCORECARD_D_CATEGORY
exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'bad message', 'Ultimate Medical Academy (All Campuses)', 'UMA Online and UMA Clearwater', 'WHERE UNITID IN (441371, 450173)', 'MERGED2017_18_PP.CSV', '[COLLEGE_SC].[WHERE_TABLE_2014_15]', '','','','',''

exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'SAVE_COLLEGE_SCORECARD_D_CATEGORY', '', 'Ultimate Medical Academy V3 (All Campuses)', 'UMA Online and UMA Clearwater', 'WHERE UNITID IN (441371, 450173)', 'MERGED2017_18_PP.CSV', '[COLLEGE_SC].[WHERE_TABLE_2017_18]', '','','','',''


exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'LIST_COLLEGE_SCORECARD_D_CATEGORIES', '', '', '', '', '', '','','','',''

*/

/*
  DECLARE @message		VARCHAR(50) = 	'SAVE_COLLEGE_SCORECARD_D_CATEGORY';							--  message
  DECLARE @VARCHAR_01	varchar(256) = ''
  DECLARE @VARCHAR_02	varchar(256) = 'Ultimate Medical Academy V10 (All Campuses)';					--  CATEGORY
  DECLARE @VARCHAR_03	varchar(256) = 'UMA Online and UMA Clearwater  try 6';									--  DESCRIPTION
  DECLARE @VARCHAR_04	NVARCHAR(MAX) = 'WHERE UNITID IN (441371, 450173)';								--  FORMULA	
  DECLARE @VARCHAR_05	varchar(MAX) = 'MERGED2017_18_PP.CSV';											--  CSV_FILE_NAME
  DECLARE @VARCHAR_06	varchar(MAX) = '[COLLEGE_SC].[WHERE_TABLE_2017_18]';							--  WHERE_TABLE_COLUMNS,  this needs to exist before the save a category
  DECLARE @VARCHAR_07	varchar(MAX) ;
  DECLARE @VARCHAR_08	varchar(MAX) ;
  DECLARE @VARCHAR_09	varchar(MAX) ;
  DECLARE @VARCHAR_10	varchar(MAX) ;
 */

 /*
  DECLARE @message		VARCHAR(50) = 	'UPDATE_COLLEGE_SCORECARD_D_CATEGORY';							--  message
  DECLARE @VARCHAR_01	varchar(256) = '19'
  DECLARE @VARCHAR_02	varchar(256) = 'Ultimate Medical Academy V10 (All Campuses)';					--  CATEGORY
  DECLARE @VARCHAR_03	varchar(256) = 'UMA Online and UMA Clearwater  update';							--  DESCRIPTION
  DECLARE @VARCHAR_04	NVARCHAR(MAX) = 'WHERE UNITID IN (441371, 450173)';								--  FORMULA	
  DECLARE @VARCHAR_05	varchar(MAX) = 'MERGED2017_18_PP.CSV';											--  CSV_FILE_NAME
  DECLARE @VARCHAR_06	varchar(MAX) = '[COLLEGE_SC].[WHERE_TABLE_2017_18]';							--  WHERE_TABLE_COLUMNS,  this needs to exist before the save a category
  DECLARE @VARCHAR_07	varchar(MAX) ;
  DECLARE @VARCHAR_08	varchar(MAX) ;
  DECLARE @VARCHAR_09	varchar(MAX) ;
  DECLARE @VARCHAR_10	varchar(MAX) ;
*/


 DECLARE @ERR INTEGER = 0;
 DECLARE @ErrorSeverity INTEGER;
 DECLARE @ErrorState INTEGER;
 DECLARE @ErrorProcedure NVARCHAR(128);
 DECLARE @ErrorLine INTEGER;
 DECLARE @ErrorMessage NVARCHAR(4000);
 DECLARE @TryCatchError_ID INTEGER = 0;

 DECLARE @RETURN_FLG	INTEGER = -2;
 DECLARE @D_CSV_FILE_ID	INTEGER;
 DECLARE @SERVER_NAME  VARCHAR(100) = 'MLK-EDM-D-SQ02';

 DECLARE @My_SP_NAME VARCHAR(50);
 SET @My_SP_NAME = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID);

 DECLARE @VARIABLE_ERROR	VARCHAR(80);

 DECLARE	@D_CATEGORY_ID			INTEGER;
 DECLARE	@CATEGORY				varchar(80);
 DECLARE	@DESCRIPTION			varchar(800);
 DECLARE	@FORMULA				varchar(800);
 DECLARE	@FILE_NAME				varchar(800);
 DECLARE	@WHERE_UNIT_ID_TABLE	nvarchar(256);


  IF( @message NOT in ('SAVE_COLLEGE_SCORECARD_D_CATEGORY', 'UPDATE_COLLEGE_SCORECARD_D_CATEGORY' , 'LIST_COLLEGE_SCORECARD_D_CATEGORIES', 'LIST_COLLEGE_SCORECARD_FORMULA_TABLES' , 'LIST_COLLEGE_SCORECARD_CSV_FILES' , 'GET_COLLEGE_SCORECARD_D_CATEGORY' )) begin
	SET @VARIABLE_ERROR = 'INVALID MESSAGE :' + @message;

		SELECT
		@ERR = -911,
		@ErrorSeverity = -911,
		@ErrorState = -911,
		@ErrorProcedure = @My_SP_NAME,
		@ErrorLine = 0,
		@ErrorMessage = @VARIABLE_ERROR ;

	EXEC MWH.MERGE_ETL_TryCatchError_wRtn 'save error', @ERR, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine,																			@ErrorMessage, @My_SP_NAME, @TryCatchError_ID OUTPUT;
  end   

	BEGIN TRY
	-- exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'SAVE_COLLEGE_SCORECARD_D_CATEGORY', 'blank',  'Ultimate Medical Academy V5 (All Campuses)', 'UMA Online and UMA Clearwater', 'WHERE UNITID IN (441371, 450173)', 'MERGED2017_18_PP.CSV', '[COLLEGE_SC].[WHERE_TABLE_2017_18]', '','','',''

	 IF ( @message = 'SAVE_COLLEGE_SCORECARD_D_CATEGORY') BEGIN
		    
			SET	@CATEGORY		= @VARCHAR_02 ;
			SET	@DESCRIPTION	= @VARCHAR_03;
			SET	@FORMULA		= @VARCHAR_04;
			SET @FILE_NAME		= @VARCHAR_05;	
			SET @WHERE_UNIT_ID_TABLE = @VARCHAR_06;

		SELECT  @D_CSV_FILE_ID = coalesce(ID, -1) from  [MWH_FILES].[D_CSV_FILE] with(nolock) where FILE_NAME = @FILE_NAME;

--		SELECT  * from   [MWH_FILES].[D_CATEGORY] with(nolock) order by ID asc

--		SELECT  * from  [MWH_FILES].[D_CSV_FILE] with(nolock) where FILE_NAME = @FILE_NAME;
		--  Check if the DB has the WHERE_TABLE_COLUMNS table...  the table with all the necessary COLUMNS to support the FORMULA clause (i.e.  thet is needs to get created before saving a category that needs it
		IF OBJECT_ID(@WHERE_UNIT_ID_TABLE) IS NOT NULL  and @D_CSV_FILE_ID != -1
		begin
			insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
			VALUES (@CATEGORY , @DESCRIPTION , @FORMULA);
			set @D_CATEGORY_ID = @@IDENTITY;

			-- insert rows 
			--  execute MWH_FILES.POPULATE_D_SCHOOL_TO_CATEGORY 14, '[COLLEGE_SC].[WHERE_TABLE_2017_18]' 
			IF(@D_CATEGORY_ID > 0) begin
				execute MWH_FILES.POPULATE_D_SCHOOL_TO_CATEGORY @D_CATEGORY_ID, @D_CSV_FILE_ID, @WHERE_UNIT_ID_TABLE
			
				set @RETURN_FLG = @D_CATEGORY_ID;
			END;
		end else begin
			set @RETURN_FLG = -10;
		end;
	 END;

	-- exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'UPDATE_COLLEGE_SCORECARD_D_CATEGORY', 'blank',  'Ultimate Medical Academy V3 (All Campuses)', 'UMA Online and UMA Clearwater', 'WHERE UNITID IN (441371, 450173)', 'MERGED2017_18_PP.CSV', '[COLLEGE_SC].[WHERE_TABLE_2017_18]', '','','',''

	 IF ( @message = 'UPDATE_COLLEGE_SCORECARD_D_CATEGORY') BEGIN

			SET @D_CATEGORY_ID  = cast(@VARCHAR_01 as integer);
	 		SET	@CATEGORY		= @VARCHAR_02 ;
			SET	@DESCRIPTION	= @VARCHAR_03;
			SET	@FORMULA		= @VARCHAR_04;
			SET @FILE_NAME		= @VARCHAR_05;	
			SET @WHERE_UNIT_ID_TABLE = @VARCHAR_06;

		SELECT  @D_CSV_FILE_ID = coalesce(ID, -1) from  [MWH_FILES].[D_CSV_FILE] with(nolock) where FILE_NAME = @FILE_NAME;

		--  Check if the DB has the WHERE_TABLE_COLUMNS table...  the table with all the necessary COLUMNS to support the FORMULA clause (i.e.  thet is needs to get created before saving a category that needs it
		IF OBJECT_ID(@WHERE_UNIT_ID_TABLE) IS NOT NULL  and @D_CSV_FILE_ID != -1
		begin

			SET @D_CATEGORY_ID = cast(@VARCHAR_01 as integer);

			UPDATE MWH_FILES.D_CATEGORY 
			set	
			 CATEGORY		=	@VARCHAR_02,
			 DESCRIPTION	=	@VARCHAR_03, 
			 FORMULA		=	@VARCHAR_04	
			WHERE ID = @D_CATEGORY_ID;
			set @RETURN_FLG = @@IDENTITY;

			-- insert rows 
			
			--	 CREATE PROCEDURE MWH_FILES.POPULATE_D_SCHOOL_TO_CATEGORY
			--	@D_CATEGORY_ID		integer,
			--	@D_CSV_FILE_ID		INTEGER,
			--	@WHERE_UNIT_ID_TABLE	VARCHAR(200)

			IF(@RETURN_FLG > 0) begin
				execute MWH_FILES.POPULATE_D_SCHOOL_TO_CATEGORY @D_CATEGORY_ID, @D_CSV_FILE_ID, @WHERE_UNIT_ID_TABLE
			END;
		end else begin
			set @RETURN_FLG = -10;
		end;
	 END;







	 -- exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'LIST_COLLEGE_SCORECARD_D_CATEGORIES', '', '', '', '', '', '','','','',''

	 IF ( @message = 'LIST_COLLEGE_SCORECARD_D_CATEGORIES') BEGIN
		select   C.[ID] as ID,  c.[CATEGORY]  'CATEGORY NAME', c.[DESCRIPTION], sc.[WHERE_UNIT_ID_TABLE] , f.[FILE_NAME] as 'CSV File', c.[FORMULA] as 'FORMULA',  count(*) as UNITID_CNT, max(c.[UPDATE_DTTM]) 'LAST MODIFIED' 
		from [MWH_FILES].[D_SCHOOL_TO_CATEGORY]   sc
		join [MWH_FILES].[D_CATEGORY] c with(nolock) on (sc.[D_CATEGORY_ID] = c.ID)
		join [MWH_FILES].[D_CSV_FILE] f with(nolock) on (sc.[D_CSV_FILE_ID] = f.id) 
		where C.ID = 17
		group by  C.ID,  c.[CATEGORY] , c.[DESCRIPTION], sc.[WHERE_UNIT_ID_TABLE], f.FILE_NAME, c.[FORMULA]
		order by C.ID asc
		set @RETURN_FLG = @@ROWCOUNT;
	 END;

--	 exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'LIST_COLLEGE_SCORECARD_FORMULA_TABLES', '', '', '', '', '', '','','','',''

	 IF ( @message = 'LIST_COLLEGE_SCORECARD_FORMULA_TABLES') BEGIN
		SELECT '['+SCHEMA_NAME(schema_id)+'].['+name+']'
		AS SchemaTable
		FROM sys.tables  with(nolock)
		where SCHEMA_NAME(schema_id) = 'COLLEGE_SC'
		and name like 'WHERE%'
		and name not like '%_TITLE';

		set @RETURN_FLG = @@ROWCOUNT;
	 END;

--	 exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'LIST_COLLEGE_SCORECARD_CSV_FILES', '', '', '', '', '', '','','','',''

	 IF ( @message = 'LIST_COLLEGE_SCORECARD_CSV_FILES') BEGIN
		SELECT ID, [FILE_NAME] as 'CSV_FILE'
		FROM  [MWH_FILES].[D_CSV_FILE] with(nolock)
		order by [FILE_NAME] desc
		set @RETURN_FLG = @@ROWCOUNT;
	 END;

	 --	 exec  [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY] 'GET_COLLEGE_SCORECARD_D_CATEGORY', '', '', '', '', '', '','','','',''

	 IF ( @message = 'GET_COLLEGE_SCORECARD_D_CATEGORY') BEGIN
		SELECT  [ID]
		,[INSERT_DTTM]
		,[UPDATE_DTTM]
		,[LST_MOD_USER]
		,[MSTR_LOAD_ID]
		,[ACTIVE_FLAG]
		,[CATEGORY]
		,[DESCRIPTION]
		,[FORMULA]
		FROM [MWH_FILES].[D_CATEGORY] with(nolock)
		order by [CATEGORY]  desc
		set @RETURN_FLG = @@ROWCOUNT;
	 END;





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
		SET @RETURN_FLG = 0;
	END CATCH;

	RETURN @RETURN_FLG;
go

grant exec on [MWH_FILES].[MANAGE_COLLEGE_SCORECARD_D_CATEGORY]  to public;


--  select * from [MWH_FILES].[D_CATEGORY] with(nolock)


