-- Table: public.meaning

-- DROP TABLE IF EXISTS public.meaning;

CREATE TABLE IF NOT EXISTS public.meaning
(
    id integer NOT NULL DEFAULT nextval('"Meaning_id_seq"'::regclass),
    meaning text COLLATE pg_catalog."default",
    word text COLLATE pg_catalog."default",
    date date,
    user_id integer,
    asked_count integer,
    correct_count integer,
    CONSTRAINT "Meaning_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.meaning
    OWNER to postgres;