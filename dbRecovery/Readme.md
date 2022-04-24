http://localhost:3000/

SELECT public."getRandomMeanings"(1, 1)

CREATE FUNCTION getRandomMeanings(userId int, meaningId int)
RETURNS text
LANGUAGE 'plpgsql'
as
$$
Declare
optional_meanings text;
Begin
SELECT string_agg(meaning::text, ',') into optional_meanings
FROM public.meaning where user_id=userId and id != meaningId limit 5 ;
return optional_meanings;
End;
$$
