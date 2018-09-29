USE [UMA_DWH]
GO

DROP TABLE [MWH].[ETL_TryCatchError]
GO
 
/****** Object:  Table [MWH].[ETL_TryCatchError]    Script Date: 3/30/2018 8:39:30 AM ******/
SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [MWH].[ETL_TryCatchError](
       [ID] [int] IDENTITY(1,1) NOT NULL,
       [INSERT_DTTM] [datetime] NOT NULL,
       [UPDATE_DTTM] [datetime] NOT NULL,
       [LST_MOD_USER] [varchar](80) NOT NULL,
       [ERR] [int] NULL,
       [ErrorSeverity] [int] NULL,
       [ErrorState] [int] NULL,
       [ErrorProcedure] [nvarchar](128) NULL,
       [ErrorLine] [int] NULL,
       [ErrorMessage] [nvarchar](4000) NULL,
       [ETLProcedureName] [nvarchar](300) NULL,
CONSTRAINT [PK_ETL_TryCatchError] PRIMARY KEY NONCLUSTERED
(
       [ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = OFF, ALLOW_PAGE_LOCKS = OFF) ON [PRIMARY]
) ON [PRIMARY]
 
GO
 
ALTER TABLE [MWH].[ETL_TryCatchError] ADD  CONSTRAINT [MWH_ETL_TryCatchError_INSERT_DTTM_DF]  DEFAULT (getdate()) FOR [INSERT_DTTM]
GO
 
ALTER TABLE [MWH].[ETL_TryCatchError] ADD  CONSTRAINT [MWH_ETL_TryCatchError_UPDATE_DTTM_DF]  DEFAULT (getdate()) FOR [UPDATE_DTTM]
GO
 
ALTER TABLE [MWH].[ETL_TryCatchError] ADD  CONSTRAINT [MWH_ETL_TryCatchError_LST_MOD_USER_DF]  DEFAULT (user_name()) FOR [LST_MOD_USER]
GO
