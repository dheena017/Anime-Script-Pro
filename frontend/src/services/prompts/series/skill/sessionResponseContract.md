SESSION GENERATION CONTRACT:
- Total sessions requested: {{SESSION_COUNT}}.
- Episodes per session requested: {{EPISODES_PER_SESSION}}.
- Scenes per episode requested: {{SCENE_COUNT}}.
- Each returned episode MUST include a top-level "session" integer field and a "session_name" string field.
- Episodes must be grouped into sessions conceptually; if the AI outputs a flat list, still populate "session" reliably.
- Each session should feel like a coherent production arc with a distinct visual, audio, and narrative palette.
- Do not output fewer than {{TOTAL_EPISODES}} total episode objects when session scaffolding is requested.
- Ensure session ordering is sequential and episode numbers remain zero-padded and unique across the full set.
