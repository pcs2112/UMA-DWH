USE UMA_DWH
GO -- delimiter

-- C8_MWH_FILES.D_SCHOOL_CATEGORY.sql
-- 2019-05-28 13:08
-- Generated by:
-- Charles Matula


/*
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'D_CATEGORY' and ss.name = 'MWH_FILES')
	DROP TABLE MWH_FILES.D_CATEGORY
GO

DROP SYNONYM CollegeScorecard.D_CATEGORY



*/

CREATE TABLE MWH_FILES.D_CATEGORY (
	ID INT NOT NULL IDENTITY (1, 1),
	INSERT_DTTM DATETIME CONSTRAINT D_CATEGORY_INSERT_DTTM_DF DEFAULT getdate () NOT NULL,
	UPDATE_DTTM DATETIME CONSTRAINT D_CATEGORY_UPDATE_DTTM_DF DEFAULT getdate () NOT NULL,
	LST_MOD_USER VARCHAR (80) CONSTRAINT D_CATEGORY_LST_MOD_USER_DF DEFAULT user_name () NOT NULL,
	MSTR_LOAD_ID INT CONSTRAINT D_CATEGORY_MSTR_LOAD_ID_DF DEFAULT (-1) NOT NULL,
	ACTIVE_FLAG SMALLINT CONSTRAINT D_CATEGORY_ACTIVE_FLG_DF DEFAULT 1 NOT NULL,
	CATEGORY					VARCHAR(80),
	DESCRIPTION					VARCHAR(800),
	FORMULA						VARCHAR(800)
	CONSTRAINT PK_D_CATEGORY PRIMARY KEY NONCLUSTERED
	(
		ID ASC
	)
	WITH (
		PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]
) ON [PRIMARY]

GO -- delimiter

CREATE TRIGGER MWH_FILES.D_CATEGORY_TRIG
ON MWH_FILES.D_CATEGORY
AFTER UPDATE
		AS BEGIN
	UPDATE D_CATEGORY
	SET UPDATE_DTTM = GETDATE()
	WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO -- delimiter

CREATE UNIQUE INDEX [D_SCHOOL_CATEGORY_IDX_01]
	ON MWH_FILES.D_CATEGORY
(
	ID ASC,
	CATEGORY ASC
) WITH (
	PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]
GO -- delimiter



CREATE UNIQUE INDEX [D_CATEGORY_IDX_02]
	ON MWH_FILES.D_CATEGORY
(
	CATEGORY ASC,
	ID ASC
) WITH (
	PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]
GO -- delimiter



CREATE SYNONYM CollegeScorecard.D_CATEGORY
for MWH_FILES.D_CATEGORY;
GO


DECLARE	@SINGLE_QUOTE char(1);

select CATEGORY, DESCRIPTION, FORMULA from MWH_FILES.D_CATEGORY 

where ID = 5






insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('Ultimate Medical Academy (All Campuses)' , 'UMA Online and UMA Clearwater' , 'WHERE UNITID IN (441371, 450173)');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('Florida Community Colleges' , 'Predominate Degree is Associates, State is Florida, and institution type is Public' , 'WHERE PREDDEG = 2 AND STABBR = ''FL'' AND CONTROL = 1');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('All US Community Colleges' , 'Predominate Degree is Associates and institution type is Public' , 'WHERE PREDDEG = 2 AND CONTROL = 1');


insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('>60% Minority Students' , 'Sum of % Minority >= 60%' , 'WHERE  ( COALESCE(UGDS_BLACK,0) + COALESCE(UGDS_HISP,0) + COALESCE(UGDS_ASIAN,0) + COALESCE(UGDS_AIAN,0) + COALESCE(UGDS_NHPI,0) + COALESCE(UGDS_2MOR,0) + COALESCE(UGDS_NRA,0) + COALESCE(UGDS_UNKN,0)) >= .6');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('>60% Pell' , 'Percent Pell >= 60%' , 'WHERE PCTPELL >= .6');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('Private For Profit Associates' , 'Predominate Degree is Associates and institution type is Private For Profit' , 'WHERE PREDDEG = 2 AND CONTROL = 3');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('Private Not For Profit Associates' , 'Predominate Degree is Associates and institution type is Private Not For Profit' , 'WHERE PREDDEG = 2 AND CONTROL = 2');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('All US Schools' , 'No Filter' , ' ');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('>80% Pell' , 'Percent Pell >= 80%' , 'WHERE PCTPELL >= .8');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('HBCU' , 'Historically Black College' , 'WHERE HBCU = 1');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('HBCU Private' , 'Historically Black College, Private Not for Profit' , 'WHERE HBCU = 1 AND CONTROL = 2');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('All Florida Public Universities' , 'State is Florida, Predominate Degree is Bachelors, and type is Public' , 'WHERE STABBR = ''FL'' AND PREDDEG = 3 AND CONTROL = 1');

insert into MWH_FILES.D_CATEGORY (	CATEGORY, DESCRIPTION, FORMULA	)
VALUES ('All Florida FP Schools' , 'Stabominate Degree is Associates and institution type is Sublic' , 'WHERE STABBR = ''FL'' AND CONTROL = 3');











/*

select de.COLUMN_NAME, vc.value 
from MWH_FILES.D_CSV_FILE_COLUMN_VALUE vc with(nolock) 
join MWH_FILES.D_CSV_DICTIONARY_ENTRY de with(nolock) on (vc.[D_CSV_DICTIONARY_ENTRY_ID] = de.ID)
join [MWH_FILES].[D_CSV_FILE] cf with(nolock) on (cf.ID = vc.D_CSV_FILE_ID)
where cf.id = 22
and de.COLUMN_NAME like '%CIPCODE1%'


select * from [MWH_FILES].[D_CSV_FILE]

select distinct dc.[CATEGORY],  dc.[FORMULA]  ,did.[UNIT_ID],did.[OPE_ID] ,did.[OPE_ID6] ,did.[INST_NAME] ,did.[CITY], did.[STATE_ABBR]    ,did.[ZIP]           
from [MWH_FILES].[D_CATEGORY] dc with(nolock)
join [MWH_FILES].[D_SCHOOL_TO_CATEGORY] stc with(nolock) on (stc.D_CATEGORY_ID = dc.ID)
join [MWH_FILES].[D_INSTITUTION_DETAILS] did with(nolock) on (stc.[UNIT_ID] = did.[UNIT_ID])

--where dc.ID = 2
where stc.[D_CSV_FILE_ID] = 22
order by did.INST_NAME asc


select * from [MWH_FILES].[D_CSV_FILE]

*/

