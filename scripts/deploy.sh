#!/usr/bin/env bash

#
# Builds client extensions, copies each zip into the Liferay container, and
# waits until Liferay logs that it started. With no argument, deploys every
# client extension in dependency order.
#

set -o errexit
set -o nounset
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT}"

set -o allexport
source .env
set +o allexport

ORDER=(
	liferay-sample-instance-settings
	liferay-sample-batch
	liferay-sample-etc-spring-boot
	liferay-sample-global-css-1
	liferay-sample-custom-element-2
	liferay-sample-site-initializer
)

PROJECTS=("${@:-${ORDER[@]}}")

function deploy {
	local project="${1}"
	local zip="client-extensions/${project}/dist/${project}.zip"
	local since

	echo "Deploying ${project}"

	"${ROOT}/scripts/gradlew.sh" --quiet ":client-extensions:${project}:build"

	since=$(date --utc +%Y-%m-%dT%H:%M:%SZ)

	docker compose cp "${zip}" liferay:/opt/liferay/osgi/client-extensions/

	for _ in $(seq 1 60)
	do
		if docker compose logs --since "${since}" liferay | grep --quiet "STARTED ${project}"
		then
			echo "Started ${project}"

			return
		fi

		sleep 2
	done

	echo "Liferay did not start ${project} in 120 seconds. Read: docker compose logs liferay --tail 100" >&2

	exit 1
}

for project in "${PROJECTS[@]}"
do
	deploy "${project}"

	if [[ "${project}" == "liferay-sample-etc-spring-boot" ]]
	then
		docker compose --profile sidecar up --build --detach sidecar

		for _ in $(seq 1 60)
		do
			if [[ $(curl --silent "http://localhost:${SIDECAR_PORT}/ready" || true) == "READY" ]]
			then
				echo "The sidecar is ready."

				break
			fi

			sleep 2
		done
	fi
done
