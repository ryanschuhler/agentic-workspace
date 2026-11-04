#!/usr/bin/env bash

#
# Creates or removes a sandbox for one ticket: a git worktree on its own
# branch, with its own Compose project and ports.
#

set -o errexit
set -o nounset
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTION="${1:-}"
TICKET="${2:-}"

if [[ -z "${ACTION}" || -z "${TICKET}" ]]
then
	echo "Usage: scripts/worktree.sh create|remove <TICKET>" >&2

	exit 1
fi

MAIN_CHECKOUT="$(dirname "$(git -C "${ROOT}" rev-parse --path-format=absolute --git-common-dir)")"
WORKTREE="$(dirname "${MAIN_CHECKOUT}")/$(basename "${MAIN_CHECKOUT}")-${TICKET}"
PROJECT="aw-$(echo "${TICKET}" | tr '[:upper:]' '[:lower:]')"

function free_offset {
	local offset

	for offset in $(seq 1 50)
	do
		if ! grep --quiet --recursive "^LIFERAY_PORT=$((8080 + offset * 10))$" "$(dirname "${MAIN_CHECKOUT}")"/*/.env 2>/dev/null
		then
			echo "${offset}"

			return
		fi
	done

	echo "No free port offset is left." >&2

	exit 1
}

case "${ACTION}" in
	create)
		git -C "${MAIN_CHECKOUT}" worktree add -b "${TICKET}" "${WORKTREE}" main

		OFFSET=$(free_offset)

		cat > "${WORKTREE}/.env" <<ENV
COMPOSE_PROJECT_NAME=${PROJECT}
LIFERAY_IMAGE=liferay/dxp:2025.q1.0-lts
LIFERAY_PORT=$((8080 + OFFSET * 10))
SIDECAR_PORT=$((58081 + OFFSET * 10))
ENV

		(cd "${WORKTREE}" && yarn install --silent)

		if [[ "${HERDR_ENV:-}" == "1" ]]
		then
			herdr workspace create --cwd "${WORKTREE}" --label "${TICKET}" --no-focus > /dev/null
		fi

		echo "Created ${WORKTREE}"
		cat "${WORKTREE}/.env"
		;;
	remove)
		if [[ -n "$(git -C "${WORKTREE}" status --porcelain)" ]]
		then
			echo "${WORKTREE} has uncommitted changes. Commit or discard them first." >&2

			exit 1
		fi

		(cd "${WORKTREE}" && docker compose --profile sidecar down --volumes)

		git -C "${MAIN_CHECKOUT}" worktree remove "${WORKTREE}"

		echo "Removed ${WORKTREE}. The branch ${TICKET} is kept."
		;;
	*)
		echo "Usage: scripts/worktree.sh create|remove <TICKET>" >&2

		exit 1
		;;
esac
