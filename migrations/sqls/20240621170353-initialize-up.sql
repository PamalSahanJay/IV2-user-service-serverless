/* Replace with your SQL commands */
CREATE TABLE "users" (
    "user_id" bigserial PRIMARY KEY,
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "profile_picture" TEXT,
    "verification_code" integer,
    "expiry" timestamptz,
    "verified" BOOLEAN DEFAULT FALSE,
    "created_at" timestamptz NOT NULL DEFAULT (now())
); 

CREATE INDEX ON "users" ("phone");