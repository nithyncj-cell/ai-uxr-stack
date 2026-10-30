# Installing a skill

Each skill comes as one `.zip` file holding a folder with a `SKILL.md` inside. Packs come as one zip per skill. Install each zip separately.

## Claude (claude.ai and the desktop app)

1. Download the skill's zip from the [website](https://claude.ai/artifact/2EdHDS4i5F6DBt9CKNfajS). Leave it zipped.
2. In Claude, open **Customize → Skills**.
3. Choose **+ → Create skill → Upload a skill**, and pick the zip.
4. Make sure the skill is switched on.
5. Start a new chat and ask for the job in plain words, for example "collate these interview transcripts" or "review my research plan as the CEO".

You'll know it loaded when the reply opens with the skill's intro and the line `Built by Nithyn`.

## Claude Code

1. Unzip the file. You get a folder such as `uxr-transcript-collator/` with `SKILL.md` inside.
2. Move the folder into one of these places:
   - `~/.claude/skills/` to use it in every project
   - `.claude/skills/` inside a project to use it in that project only
3. Start a new Claude Code session. The folder name must stay exactly as it is.

## Updating

Upload the new zip the same way. A skill with the same name replaces the old one. In Claude Code, replace the folder.

## If something goes wrong

| What you see | What to do |
|---|---|
| The upload is rejected | Upload the zip exactly as downloaded. If you re-zipped it yourself, the zip must contain the folder, not the files inside the folder. |
| The skill doesn't start | Name it in your request: "Use the uxr-transcript-collator skill on this transcript." |
| A different skill answers | Two skills may cover the same job. Switch off the one you don't want for this chat, or name the skill you want. |
| The reply skips the intro | Start a new chat. Each conversation shows the intro once, at the start. |
| A pack's skills don't hand work to each other | Install every zip in the pack. Each skill only routes to skills that are installed. |

Still stuck? Open an issue with the [skill feedback form](../../../issues/new/choose). Please don't paste participant data or confidential transcripts.
