# Only run for interactive shells
[[ $- != *i* ]] && return

# Load shared shell dotfiles (repo-first, fallback to home)
DOTFILES_DIR="$HOME/dev/dotfiles"
for name in .path .bash_prompt .exports .aliases .functions .extra; do
  if [ -r "$DOTFILES_DIR/$name" ] && [ -f "$DOTFILES_DIR/$name" ]; then
    source "$DOTFILES_DIR/$name"
  elif [ -r "$HOME/$name" ] && [ -f "$HOME/$name" ]; then
    source "$HOME/$name"
  fi
done
unset name DOTFILES_DIR

# Case-insensitive globbing
shopt -s nocaseglob

# Append to history, don’t overwrite
shopt -s histappend

# Autocorrect typos in cd paths
shopt -s cdspell

# Enable some Bash 4+ niceties when available
for option in autocd globstar; do
  shopt -s "$option" 2>/dev/null
done

# Bash completion
if command -v brew >/dev/null 2>&1 && [ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]; then
  export BASH_COMPLETION_COMPAT_DIR="$(brew --prefix)/etc/bash_completion.d"
  source "$(brew --prefix)/etc/profile.d/bash_completion.sh"
elif [ -f /etc/bash_completion ]; then
  source /etc/bash_completion
fi

# Git completion
if [ -f ~/.git-completion.bash ]; then
  source ~/.git-completion.bash
fi

# Enable tab completion for `g` alias if _git exists
if type _git >/dev/null 2>&1; then
  complete -o default -o nospace -F _git g
fi

# SSH host completion
[ -e "$HOME/.ssh/config" ] && complete -o default -o nospace -W "$(grep '^Host' ~/.ssh/config | grep -v '[?*]' | cut -d ' ' -f2- | tr ' ' '\n')" scp sftp ssh

# defaults completion
complete -W "NSGlobalDomain" defaults

# avn
[[ -s "$HOME/.avn/bin/avn.sh" ]] && source "$HOME/.avn/bin/avn.sh"

# nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# killall completion
complete -o nospace -W "Contacts Calendar Dock Finder Mail Safari iTunes SystemUIServer Terminal Twitter" killall

# PATH additions
export PATH="$PATH:$HOME/.pulumi/bin"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
export PATH="$(go env GOPATH)/bin:$PATH"
export PATH="$HOME/.rbenv/bin:$PATH"

# conda
__conda_setup="$('/Users/cro10245/miniconda3/bin/conda' 'shell.bash' 'hook' 2>/dev/null)"
if [ $? -eq 0 ]; then
  eval "$__conda_setup"
else
  if [ -f "/Users/cro10245/miniconda3/etc/profile.d/conda.sh" ]; then
    . "/Users/cro10245/miniconda3/etc/profile.d/conda.sh"
  else
    export PATH="/Users/cro10245/miniconda3/bin:$PATH"
  fi
fi
unset __conda_setup

# bun completions
# [ -s "/Users/cro10245/.bun/_bun" ] && source "/Users/cro10245/.bun/_bun"

# rbenv
eval "$(rbenv init - bash)"

# ---------- Worktree completions (bash only) ----------

_wt_all_branches() {
  git branch -a --format='%(refname:short)' 2>/dev/null | sed 's#^remotes/##' | sort -u
}

_wt_worktree_branches() {
  git worktree list --porcelain 2>/dev/null |
    awk '/^branch / { sub("^refs/heads/", "", $2); print $2 }' |
    sort -u
}

_wt_worktree_paths() {
  git worktree list --porcelain 2>/dev/null |
    awk '/^worktree / { print $2 }' |
    sort -u
}

_wtn_completion_bash() {
  local cur
  cur="${COMP_WORDS[COMP_CWORD]}"

  # Complete only the 2nd arg (base branch)
  if [ "$COMP_CWORD" -eq 2 ]; then
    COMPREPLY=( $(compgen -W "$(_wt_all_branches)" -- "$cur") )
  else
    COMPREPLY=()
  fi
}

_wte_completion_bash() {
  local cur
  cur="${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=( $(compgen -W "$(_wt_all_branches)" -- "$cur") )
}

_wto_completion_bash() {
  local cur
  cur="${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=( $(compgen -W "$(_wt_worktree_branches)" -- "$cur") )
}

_wtr_completion_bash() {
  local cur
  cur="${COMP_WORDS[COMP_CWORD]}"

  # Complete only the 1st arg (worktree path)
  if [ "$COMP_CWORD" -eq 1 ]; then
    COMPREPLY=( $(compgen -W "$(_wt_worktree_paths)" -- "$cur") )
  else
    COMPREPLY=()
  fi
}

complete -r wtn 2>/dev/null
complete -r wte 2>/dev/null
complete -r wto 2>/dev/null
complete -r wtr 2>/dev/null

complete -o nospace -F _wtn_completion_bash wtn
complete -o nospace -F _wte_completion_bash wte
complete -o nospace -F _wto_completion_bash wto
complete -o nospace -F _wtr_completion_bash wtr
