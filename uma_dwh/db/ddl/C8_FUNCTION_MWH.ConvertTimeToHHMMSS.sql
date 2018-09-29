 

--  C8_FUNCTION_MWH.ConvertTimeToHHMMSS.sql

 -- sqlcmd -S localhost -U sa -P 1F0rg0t1 -i  C8_FUNCTION_MWH.ConvertTimeToHHMMSS.sql

 

--drop function [MWH].[ConvertTimeToHHMMSS];

 use UMA_DWH
 go
 

create function [MWH].[ConvertTimeToHHMMSS]

(

    @seconds_in integer

)

returns varchar(20)

as

begin

 

    declare @seconds decimal(18,3), @minutes int, @hours int;

 

    set @hours = convert(int, @seconds_in /60 / 60);

    set @minutes = convert(int, (@seconds_in / 60) - (@hours * 60 ));

    set @seconds = @seconds_in % 60;

 

    return

        convert(varchar(9), convert(int, @hours)) + ':' +

        right('00' + convert(varchar(2), convert(int, @minutes)), 2) + ':' +

        right( '00' + convert(varchar(6), @seconds), 6)

 

 

 

end;

 

 

