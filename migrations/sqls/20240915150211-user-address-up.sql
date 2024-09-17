/* Replace with your SQL commands */
CREATE TABLE "address" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" VARCHAR(255),
    "postal_code" INTEGER,
    "country" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT (now())
);

CREATE INDEX ON "address" ("city");
CREATE INDEX ON "address" ("postal_code");
CREATE INDEX ON "address" ("country");

ALTER TABLE "address" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

