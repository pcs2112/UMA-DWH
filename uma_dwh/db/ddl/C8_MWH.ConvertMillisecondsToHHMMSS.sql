--  C8_MWH.ConvertMillisecondsToHHMMSS.sql
 
 
USE [UMA_DWH]
GO
 
/****** Object:  UserDefinedFunction [MWH].[ConvertTimeToHHMMSS]    Script Date: 9/25/2018 12:21:22 PM ******/
SET ANSI_NULLS ON
GO
 
SET QUOTED_IDENTIFIER ON
GO
 
--drop  function [MWH].[ConvertMillisecondsToHHMMSS];
 
create function [MWH].[ConvertMillisecondsToHHMMSS]
(
    @MilliSeconds_in BIGINT
)
returns varchar(20)
as
begin
 
    declare @seconds BIGINT, @minutes BIGINT, @hours BIGINT, @milliSeconds BIGINT;
 
    set @hours = cast( @MilliSeconds_in / 1000 / 60 / 60  as BIGINT);
 
    set @minutes = cast( (@MilliSeconds_in / 1000 / 60) - (@hours * 60)   as BIGINT);
 
    set @seconds = cast( (@MilliSeconds_in / 1000 ) - (@hours * 3600) - (@minutes * 60 )  as BIGINT);
 
       set @milliSeconds = (@MilliSeconds_in) % 1000;
 
 
    return    convert(varchar(13), convert(int, @hours)) + ':' +
        right('00' + convert(varchar(2), convert(int, @minutes)), 2) + ':' +
        right( '00' + convert(varchar(6), @seconds), 2) + ':' +
              right( '000' + convert(varchar(6), @milliSeconds), 3)
 
 
 
 
end;
GO