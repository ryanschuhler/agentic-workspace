#!/usr/bin/env bash

#
# Manages the local stack of this checkout or worktree: up, down, reset,
# reprovision, status. Ports and the Compose project come from .env.
#

set -o errexit
set -o nounset
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT}"

if [[ ! -f .env ]]
then
	cp .env.example .env
fi

set -o allexport
source .env
set +o allexport

function compose {
	docker compose --profile sidecar "${@}"
}

function wait_for_liferay {
	echo "Waiting for Liferay on http://localhost:${LIFERAY_PORT}. The first start takes 5 to 10 minutes."

	for _ in $(seq 1 180)
	do
		if curl --fail --output /dev/null --silent "http://localhost:${LIFERAY_PORT}/c/portal/status"
		then
			echo "Liferay is ready."

			return
		fi

		sleep 5
	done

	echo "Liferay did not start in 15 minutes. Read: docker compose logs liferay --tail 100" >&2

	exit 1
}

function up {
	docker compose up --detach database liferay

	wait_for_liferay
}

function reprovision {
	local before

	before=$(compose logs liferay 2>/dev/null | grep --count "Initializing Liferay Sample" || true)

	curl \
		--output /dev/null \
		--request DELETE \
		--silent \
		--url "http://localhost:${LIFERAY_PORT}/o/headless-admin-site/v1.0/sites/LIFERAY_SAMPLE" \
		--user "test@liferay.com:test"

	compose exec liferay rm --force /opt/liferay/osgi/client-extensions/liferay-sample-site-initializer.zip

	"${ROOT}/scripts/deploy.sh" liferay-sample-site-initializer

	for _ in $(seq 1 60)
	do
		if [[ $(compose logs liferay | grep --count "Initializing Liferay Sample" || true) -gt ${before} ]]
		then
			echo "The site initializer ran."

			return
		fi

		sleep 3
	done

	echo "The site initializer did not run in 3 minutes." >&2

	exit 1
}

function status {
	echo "Project ${COMPOSE_PROJECT_NAME}"
	echo "Liferay http://localhost:${LIFERAY_PORT} (test@liferay.com / test)"
	echo "Sidecar http://localhost:${SIDECAR_PORT}"
	echo

	compose ps
}

case "${1:-status}" in
	down)
		compose stop
		;;
	reprovision)
		reprovision
		;;
	reset)
		if [[ "${2:-}" != "--yes" ]]
		then
			echo "Data loss. reset deletes the database and every volume of ${COMPOSE_PROJECT_NAME}. Run scripts/env.sh reset --yes to continue." >&2

			exit 1
		fi

		compose down --volumes

		up

		"${ROOT}/scripts/deploy.sh"
		;;
	status)
		status
		;;
	up)
		up
		;;
	*)
		echo "Usage: scripts/env.sh up|down|reset|reprovision|status" >&2

		exit 1
		;;
esac
