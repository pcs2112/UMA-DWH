 
use UMA_DWH
go

create schema QUAD
go
 
 
 
IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'CTRLACCT' and ss.name = 'QUAD')
       DROP TABLE QUAD.CTRLACCT
GO
 
 
CREATE TABLE QUAD.CTRLACCT
(
       ID                                                            int IDENTITY(1,1) NOT NULL,
       INSERT_DTTM                                            datetime NOT NULL,
       UPDATE_DTTM                                            datetime NOT NULL,
       LST_MOD_USER                                    varchar(80) NOT NULL,
     P_CtrlAcct_ID                      int                    not null,
     PPath                                                    varchar(200)           not null,
     Code                                                     char(4)                not null,
     Name                                                     char(80)               not null    ,
     rUser_ID                                          smallint               null    ,
     Balance                                           numeric(16,5)          not null    ,
     rUnit_ID                                          smallint               not null    ,
     Note_ID                                           int                    null    ,
     NLevel                                                   smallint               null    ,
     mDrCr                                                    smallint               not null    ,
     Reserved                                          varchar(10)            null    ,
     DefAcct                                           smallint               null    ,
CONSTRAINT PK_QUAD_CTRLACCT             PRIMARY KEY NONCLUSTERED
(
              ID            ASC
)      WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
 
go
 
 
 
 
ALTER TABLE [QUAD].[CTRLACCT] ADD  CONSTRAINT [CTRLACCT_INSERT_DTTM_DF]  DEFAULT (getdate()) FOR [INSERT_DTTM]
GO
 
ALTER TABLE [QUAD].[CTRLACCT] ADD  CONSTRAINT [CTRLACCT_UPDATE_DTTM_DF]  DEFAULT (getdate()) FOR [UPDATE_DTTM]
GO
 
ALTER TABLE [QUAD].[CTRLACCT] ADD  CONSTRAINT [CTRLACCT_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]
GO
 
 
 
 
CREATE TRIGGER QUAD.CTRLACCT_UD_TRIG
ON QUAD.CTRLACCT
AFTER UPDATE
AS  BEGIN
    UPDATE QUAD.CTRLACCT
    SET UPDATE_DTTM = GETDATE()
    WHERE ID IN (SELECT DISTINCT ID FROM INSERTED)
END
GO
 
 
 
 
 
CREATE UNIQUE NONCLUSTERED INDEX [QUAD.CTRLACCT_IDX_01] ON QUAD.CTRLACCT
(
       PPath         ASC,
       CODE          ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO
 
CREATE UNIQUE NONCLUSTERED INDEX [QUAD.CTRLACCT_IDX_02] ON QUAD.CTRLACCT
(
       [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO
 
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,    Code,             Name,   rUser_ID,  Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved,   DefAcct)
                   values ( 0,               '',   'NODE',  'Initial NODE',          0,        0,        0,      null,      0,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'ASST', 'Asset',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'LIAB', 'Liability',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'EQTY', 'Equity',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'INCM', 'Income',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'EXPN', 'Expense',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'DIMS', 'Dimension',        0,       0,        0,    NULL,      1,     0,     null,     null);
 
 
insert into QUAD.CTRLACCT (P_CtrlAcct_ID, PPath,   Code,  Name,   rUser_ID, Balance, rUnit_ID, Note_ID, NLevel, mDrCr, Reserved, DefAcct)
                   values ( 1,         'NODE', 'FACT', 'Fact',        0,       0,        0,    NULL,      1,     0,     null,     null);