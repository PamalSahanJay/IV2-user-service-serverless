CREATE TABLE "users" (
    "user_id" bigserial PRIMARY KEY,
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(255) NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
);
