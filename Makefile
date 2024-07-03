start_db:
	docker-compose up -d

stop_db:
	docker-compose down

migrate_up:
	npx db-migrate up

migrate_down:
	npx db-migrate down

server:
	npx npm run dev

.PHONY: start_db stop_db server migrate migrate-down