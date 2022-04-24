-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
    email text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default",
    session_id text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User" UNIQUE (email)
        INCLUDE(email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;