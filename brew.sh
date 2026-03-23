#!/usr/bin/env bash

set -euo pipefail

# Install command-line tools using Homebrew Bundle.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_FILE="${SCRIPT_DIR}/Brewfile"

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is required but not installed."
  exit 1
fi

if [ ! -f "${BUNDLE_FILE}" ]; then
  echo "Brewfile not found at ${BUNDLE_FILE}."
  exit 1
fi

brew update
brew bundle --file="${BUNDLE_FILE}"
brew cleanup

# Switch to using brew-installed bash as default shell.
BREW_PREFIX=$(brew --prefix)
if [ -x "${BREW_PREFIX}/bin/bash" ] && ! fgrep -q "${BREW_PREFIX}/bin/bash" /etc/shells; then
  echo "${BREW_PREFIX}/bin/bash" | sudo tee -a /etc/shells
  chsh -s "${BREW_PREFIX}/bin/bash"
fi
