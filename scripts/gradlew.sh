#!/usr/bin/env bash

#
# Runs the Gradle wrapper with JDK 21. Uses the local JDK when it is 21, and a
# temurin container when it is not, so the build does not depend on the host.
#

set -o errexit
set -o nounset
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if java -version 2>&1 | grep --quiet 'version "21'
then
	exec "${ROOT}/gradlew" --project-dir "${ROOT}" "${@}"
fi

GRADLE_CACHE="${GRADLE_CACHE:-${HOME}/.cache/agentic-workspace-gradle}"

mkdir -p "${GRADLE_CACHE}"

exec docker run \
	--env GRADLE_USER_HOME=/cache \
	--env HOME=/tmp \
	--rm \
	--user "$(id -u):$(id -g)" \
	--volume "${GRADLE_CACHE}:/cache" \
	--volume "${ROOT}:/workspace" \
	--workdir /workspace \
	eclipse-temurin:21-jdk \
	./gradlew --no-daemon "${@}"
