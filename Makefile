GOHOSTARCH := $(shell go env GOHOSTARCH)
QEMU_VERSION ?= v2.12.0
QEMU_ARCH ?= amd64
GOARCH ?= $(shell go env GOARCH)

DOCKER_IMAGE ?= alexphillips/shoutout-board
DOCKER_TAG ?= latest
ifneq ($(TARGET), library)
  DOCKER_PLATFORM ?= linux-$(GOARCH)
else
  DOCKER_PLATFORM ?= $(shell docker version -f {{.Server.Os}}-{{.Server.Arch}} 2>/dev/null || echo 'undefined')
endif
DOCKER_REF ?= $(DOCKER_IMAGE):$(DOCKER_TAG)-$(DOCKER_PLATFORM)

.PHONY: docker-download-qemu-binary
docker-download-qemu-binary:
	@if [ "$(QEMU_ARCH)" != ${GOHOSTARCH} ]; then \
	  echo "Downloading qemu binary for multi-arch support."; \
	  (curl -sL https://github.com/multiarch/qemu-user-static/releases/download/${QEMU_VERSION}/qemu-${QEMU_ARCH}-static.tar.gz | tar xz); \
	fi;
