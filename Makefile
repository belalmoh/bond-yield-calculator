.PHONY: run-frontend run-backend setup-frontend setup-backend

setup-all: setup-frontend setup-backend
	@echo "Installing all dependencies..."

setup-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && yarn install
	@echo "Setting up frontend environment variables..."
	cd frontend && if [ -f example.env ] && ! [ -f .env ]; then cp example.env .env; fi

setup-backend:
	@echo "Installing backend dependencies..."
	cd backend && yarn install
	@echo "Setting up backend environment variables..."
	cd backend && if [ -f example.env ] && ! [ -f .env ]; then cp example.env .env; fi

run-frontend: setup-frontend
	@echo "Starting frontend dev server..."
	cd frontend && yarn run dev

run-backend: setup-backend
	@echo "Starting backend dev server..."
	cd backend && yarn run start:dev
