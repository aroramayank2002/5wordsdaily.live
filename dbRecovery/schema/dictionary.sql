-- Table: public.dictionary

-- DROP TABLE IF EXISTS public.dictionary;

CREATE TABLE IF NOT EXISTS public.dictionary
(
    id integer NOT NULL DEFAULT nextval('"Dictionary_id_seq"'::regclass),
    word text COLLATE pg_catalog."default",
    meaning text COLLATE pg_catalog."default",
    CONSTRAINT "Dictionary_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.dictionary
    OWNER to postgres;