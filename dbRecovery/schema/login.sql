-- Table: public.login

-- DROP TABLE IF EXISTS public.login;

CREATE TABLE IF NOT EXISTS public.login
(
    email text COLLATE pg_catalog."default",
    login_at timestamp with time zone,
    "sessionId" text COLLATE pg_catalog."default",
    id integer NOT NULL DEFAULT nextval('"Login_id_seq"'::regclass),
    CONSTRAINT "Login_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.login
    OWNER to postgres;