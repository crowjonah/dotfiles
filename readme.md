# crowjonahs’s dotfiles

Personal dotfiles, originally based on:

- [mathiasbynens/dotfiles](https://github.com/mathiasbynens/dotfiles)
- [paulirish/dotfiles](https://github.com/paulirish/dotfiles)

This repository is now documented from this fork’s perspective and uses a modern Homebrew workflow centered on a `Brewfile`.

## Installation

```bash
git clone https://github.com/crowjonahs/dotfiles.git && cd dotfiles && source bootstrap.sh
```

To update later:

```bash
source bootstrap.sh
```

## Homebrew setup (Brewfile-first)

This repo now treats `Brewfile` as the source of truth for Homebrew packages.

- Install/upgrade dependencies: `./brew.sh`
- Under the hood: `brew bundle --file=./Brewfile`

If you prefer running directly:

```bash
brew bundle --file=./Brewfile
```

## Private/local configuration

Use `~/.extra` for personal machine-only settings that should not be committed.

Example:

```bash
# ~/.extra
PATH=/opt/local/bin:$PATH
PATH=/opt/local/sbin:$PATH
PATH=~/.rvm/bin:$PATH
PATH=~/code/git-friendly:$PATH

export PATH
```

## macOS defaults

When setting up a new Mac:

```bash
./.macos
```

## Repository notes

- `README.md` is the canonical documentation for this fork.
- `README.md~main` is kept only as an upstream reference/archive snapshot from `main`.
- Legacy notes previously in `readme.md` have been folded into this file.

## File overview

### Core shell configuration

- `.aliases`
- `.bash_profile`
- `.bash_prompt`
- `.bashrc`
- `.exports`
- `.functions`
- `.extra` (local-only, not committed)

### Common tooling config

- `.ackrc`
- `.vimrc`, `.vim`
- `.inputrc`
- `.gitattributes`
- `.gitconfig`
- `.gitignore`

### Setup scripts

- `bootstrap.sh` — sync and install dotfiles
- `sync.sh` — sync tracked files into `$HOME`
- `install-deps.sh` — non-brew bootstrap dependencies
- `brew.sh` — thin wrapper around Brewfile bundle install

## Similar projects

- [jshint `.jshintrc`](https://github.com/jshint/node-jshint/blob/master/.jshintrc)
- [EditorConfig](https://editorconfig.org/)

## Syntax highlighting

Still useful for dotfiles editing in Sublime Text:

- [Dotfiles Syntax Highlighting](https://github.com/mattbanks/dotfiles-syntax-highlighting-st2)
