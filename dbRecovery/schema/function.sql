-- FUNCTION: public.getrandommeanings(integer, integer)

-- DROP FUNCTION IF EXISTS public.getrandommeanings(integer, integer);

CREATE OR REPLACE FUNCTION public.getrandommeanings(
	userid integer,
	meaningid integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
Declare
	optional_meanings text;
Begin
    SELECT string_agg(meaning::text, ':') into optional_meanings
    FROM
	(
		select meaning from public.meaning
   	    where user_id=userId and id != meaningId limit 3
	)
	sub;
	return optional_meanings;
End;
$BODY$;

ALTER FUNCTION public.getrandommeanings(integer, integer)
    OWNER TO postgres;
