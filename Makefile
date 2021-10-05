build-dev:
	docker build . -t web-app-dev-image

build-staging: 
	docker build . -t web-app-staging-image -f Dockerfile.production

build-staging-internal: 
	docker build . -t web-app-staging-internal-image -f Dockerfile.staging

build-presentation: 
	docker build . -t web-app-presentation-image -f Dockerfile.presentation
