start_db:
	docker-compose up -d

stop_db:
	docker-compose down

server:
	npm run dev

.PHONY: start_db stop_db server