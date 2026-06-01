import { TEXT_MODELS } from "./aiModels/textModels";

// ─────────────────────────────────────────────────────────────────────────────
// Script Generation — Centralized Default Constants
//
// All default parameter values for script generation functions are defined
// here. Never hardcode these strings in individual generator files.
// ─────────────────────────────────────────────────────────────────────────────

/** Default text model — always points to the first free model in the registry */
export const DEFAULT_SCRIPT_MODEL: string = TEXT_MODELS[0].id;

/** Default content type (used across all script generators) */
export const DEFAULT_CONTENT_TYPE = "Anime" as const;

/** Default tone/vibe for the generated script */
export const DEFAULT_TONE = "Hype/Energetic" as const;

/** Default target audience */
export const DEFAULT_AUDIENCE = "General Fans" as const;

/** Default session number (season) */
export const DEFAULT_SESSION = "1" as const;

/** Default episode number */
export const DEFAULT_EPISODE = "1" as const;

/** Default number of scenes per episode */
export const DEFAULT_NUM_SCENES = "12" as const;

/** Default recapper persona (empty = no persona override) */
export const DEFAULT_RECAPPER_PERSONA = "" as const;
