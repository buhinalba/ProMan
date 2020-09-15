ALTER TABLE IF EXISTS ONLY public.board DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.board DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;


DROP TABLE IF EXISTS public.board;
CREATE TABLE board (
    id serial NOT NULL,
    title varchar,
    user_id integer
);


DROP TABLE IF EXISTS public.status;
CREATE TABLE status (
    id serial NOT NULL,
    title varchar,
    board_id integer
);


DROP TABLE IF EXISTS public.card;
CREATE TABLE card (
    id serial NOT NULL,
    board_id integer,
    title varchar,
    status_id integer,
    "order" integer
);

DROP TABLE IF EXISTS public.user;
CREATE TABLE "user" (
    id serial NOT NULL,
    username varchar,
    password varchar
);


ALTER TABLE ONLY board
    ADD CONSTRAINT pk_board_id PRIMARY KEY (id);

ALTER TABLE ONLY status
    ADD CONSTRAINT pk_status_id PRIMARY KEY (id);

ALTER TABLE ONLY card
    ADD CONSTRAINT pk_card_id PRIMARY KEY (id);

ALTER TABLE ONLY "user"
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);


ALTER TABLE ONLY card
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES board(id);

ALTER TABLE ONLY card
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES status(id);

ALTER TABLE ONLY board
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY status
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES board(id);

-- password of user: '1111'
INSERT INTO "user" VALUES (DEFAULT, 'pistike', '$2b$12$eW00pz93SL0sVCSsNg0pAupoYv9F3dhjURUxmsp9AiWswzIu4YRAi');

INSERT INTO board VALUES(DEFAULT,'Board 1', 1);
INSERT INTO board VALUES(DEFAULT,'Board 2', 1);

INSERT INTO status VALUES(DEFAULT,'new', 1);
INSERT INTO status VALUES(DEFAULT,'in progress', 1);
INSERT INTO status VALUES(DEFAULT,'testing', 1);
INSERT INTO status VALUES(DEFAULT,'done', 1);
INSERT INTO status VALUES(DEFAULT,'new', 2);
INSERT INTO status VALUES(DEFAULT,'in progress', 2);
INSERT INTO status VALUES(DEFAULT,'testing', 2);
INSERT INTO status VALUES(DEFAULT,'done', 2);

INSERT INTO card VALUES (DEFAULT,1,'new card 1',1,0);
INSERT INTO card VALUES (DEFAULT,1,'new card 2',1,1);
INSERT INTO card VALUES (DEFAULT,1, 'in progress card',2,0);
INSERT INTO card VALUES (DEFAULT,1,'planning',3,0);
INSERT INTO card VALUES(DEFAULT,1,'done card 1',4,0);
INSERT INTO card VALUES(DEFAULT,1,'done card 1',4,1);
INSERT INTO card VALUES(DEFAULT,2,'new card 1',1,0);
INSERT INTO card VALUES(DEFAULT,2,'new card 2',1,1);
INSERT INTO card VALUES(DEFAULT,2,'in progress card',2,0);
INSERT INTO card VALUES(DEFAULT,2,'planning',3,0);
INSERT INTO card VALUES(DEFAULT,2,'done card 1',4,0);
INSERT INTO card VALUES(DEFAULT,2,'done card 1',4,1);