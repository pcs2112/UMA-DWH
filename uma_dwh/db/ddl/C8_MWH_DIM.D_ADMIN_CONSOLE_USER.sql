USE [UMA_DWH]
GO

IF EXISTS (SELECT * FROM sys.objects so JOIN  sys.schemas ss on (so.schema_id = ss.schema_id) WHERE so.type = 'U' AND so.name = 'D_ADMIN_CONSOLE_USER' and ss.name = 'MWH_DIM')
    DROP TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER](
    [ID] [int] IDENTITY(1,1) NOT NULL,
    [INSERT_DTTM] [datetime] NOT NULL,
    [UPDATE_DTTM] [datetime] NOT NULL,
    [LST_MOD_USER] [varchar](80) NOT NULL,
    [MSTR_LOAD_ID] [int] NOT NULL,
    D_STAFF_ID    INT,
    [EmployeeLastName] [varchar](80) NOT NULL,
    [EmployeeFirstName] [varchar](80) NOT NULL,
    [EmployeeEMAIL] [varchar](80) NOT NULL,
    [EmployeePHONE] [varchar](80) NULL,
    [EmployeeCELLPHONE] [varchar](80) NOT NULL,
    [EmployeePassword] [varchar](300) NOT NULL,
 CONSTRAINT [PK_D_ADMIN_CONSOLE_USER] PRIMARY KEY NONCLUSTERED 
(
    [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER] ADD  CONSTRAINT [D_ADMIN_CONSOLE_USER_INSERT_DTTM_DF]  DEFAULT (getdate()) FOR [INSERT_DTTM]
GO

ALTER TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER] ADD  CONSTRAINT [D_ADMIN_CONSOLE_USER_UPDATE_DTTM_DF]  DEFAULT (getdate()) FOR [UPDATE_DTTM]
GO

ALTER TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER] ADD  CONSTRAINT [D_ADMIN_CONSOLE_USER_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]
GO

ALTER TABLE [MWH_DIM].[D_ADMIN_CONSOLE_USER] ADD  CONSTRAINT [D_ADMIN_CONSOLE_USER_MSTR_LOAD_ID_DF]  DEFAULT ((-1)) FOR [MSTR_LOAD_ID]
GO
