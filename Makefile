build-dev:
	docker build . -t web-app-dev-image

build-staging: 
	docker build . -t web-app-staging-image -f Dockerfile.production
