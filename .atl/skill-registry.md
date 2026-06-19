# Skill Registry — next-restaurant

**Generated**: 2026-06-19
**Source**: User-level skills + built-in
**Project-level skills**: None detected
**AGENTS.md**: `~/.config/opencode/AGENTS.md` (245 lines)

> This is an INDEX, not generated summaries. Subagents read the full SKILL.md source.

## Convention Files

| File | Path |
|---|---|
| AGENTS.md (global) | `~/.config/opencode/AGENTS.md` (245 lines) |

## Skills by Scope

### User-Level Skills (`~/.config/opencode/skills/`)

| Skill | Trigger / Description | Path |
|---|---|---|
| branch-pr | Create Gentle AI pull requests with issue-first checks. Trigger: creating, opening, or preparing PRs for review. | `~/.config/opencode/skills/branch-pr/SKILL.md` |
| chained-pr | Trigger: PRs over 400 lines, stacked PRs, review slices. Split oversized changes into chained PRs that protect review focus. | `~/.config/opencode/skills/chained-pr/SKILL.md` |
| cognitive-doc-design | Design docs that reduce cognitive load. Trigger: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs. | `~/.config/opencode/skills/cognitive-doc-design/SKILL.md` |
| coltman-orchestrator-team | Coltman — Director de Orquesta. Coordina agentes SDD. | `~/.config/opencode/skills/coltman-orchestrator-team/SKILL.md` |
| comment-writer | Write warm, direct collaboration comments. Trigger: PR feedback, issue replies, reviews, Slack messages, or GitHub comments. | `~/.config/opencode/skills/comment-writer/SKILL.md` |
| customize-opencode | Use ONLY when editing/creating opencode's own configuration. Built-in. | `<built-in>` |
| go-testing | Trigger: Go tests, go test coverage, Bubbletea teatest, golden files. Apply focused Go testing patterns. | `~/.config/opencode/skills/go-testing/SKILL.md` |
| hr-assistant | HR Assistant — Analista de Talento. | `~/.config/opencode/skills/hr-assistant/SKILL.md` |
| issue-creation | Create Gentle AI issues with issue-first checks. Trigger: creating GitHub issues, bug reports, or feature requests. | `~/.config/opencode/skills/issue-creation/SKILL.md` |
| judgment-day | Trigger: judgment day, dual review, adversarial review, juzgar. Run blind dual review, fix confirmed issues, then re-judge. | `~/.config/opencode/skills/judgment-day/SKILL.md` |
| marketing-team | Sales & Marketing Team — Pipeline Completo. | `~/.config/opencode/skills/marketing-team/SKILL.md` |
| researcher | Abogado del Diablo (Adversarial) — attacks architecture papers. | `~/.config/opencode/skills/researcher/SKILL.md` |
| scribe | El Cronista — synthesizer for archive. | `~/.config/opencode/skills/scribe/SKILL.md` |
| skill-creator | Trigger: new skills, agent instructions, documenting AI usage patterns. Create LLM-first skills with valid frontmatter. | `~/.config/opencode/skills/skill-creator/SKILL.md` |
| skill-improver | Trigger: improve skills, audit skills, refactor skills, skill quality. Audit and upgrade existing LLM-first skills. | `~/.config/opencode/skills/skill-improver/SKILL.md` |
| work-unit-commits | Plan commits as reviewable work units. Trigger: implementation, commit splitting, chained PRs, or keeping tests and docs with code. | `~/.config/opencode/skills/work-unit-commits/SKILL.md` |

### User-Level Skills (`~/.agents/skills/`)

| Skill | Trigger / Description | Path |
|---|---|---|
| find-skills | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X"... | `~/.agents/skills/find-skills/SKILL.md` |
| gog | Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs. | `~/.agents/skills/gog/SKILL.md` |
| goplaces | Query Google Places for text search, place details, resolve, reviews, or scriptable JSON via goplaces. | `~/.agents/skills/goplaces/SKILL.md` |
| nano-pdf | Edit PDFs with natural-language instructions using the nano-pdf CLI. | `~/.agents/skills/nano-pdf/SKILL.md` |
| node-connect | Diagnose OpenClaw Android, iOS, or macOS node pairing, QR/setup code, route, auth, and connection failures. | `~/.agents/skills/node-connect/SKILL.md` |
| openai-whisper | Local speech-to-text with the Whisper CLI (no API key). | `~/.agents/skills/openai-whisper/SKILL.md` |
| spotify-player | Terminal Spotify playback/search via spogo (preferred) or spotify_player. | `~/.agents/skills/spotify-player/SKILL.md` |
| tmux | Remote-control tmux sessions for interactive CLIs by sending keystrokes and scraping pane output. | `~/.agents/skills/tmux/SKILL.md` |

### Excluded from Registry

Skills prefixed `sdd-*`, `_shared`, and `skill-registry` are omitted (SDD pipeline infrastructure).
