/**
 * useStudioBasePath
 *
 * Returns the correct route base path for the current studio session.
 * The app has two valid bases:
 *   - /studio           (when opened directly)
 *   - /projects/:id     (when opened from a project)
 *
 * Using contentType.toLowerCase() (e.g. "anime") as the base is WRONG
 * because no such route exists in App.tsx. Use this hook instead.
 */
import { useMatch } from 'react-router-dom';

export function useStudioBasePath(): string {
  const studioMatch = useMatch('/studio/*');
  const projectMatch = useMatch('/projects/:projectId/*');

  if (projectMatch?.params.projectId) {
    return `/projects/${projectMatch.params.projectId}`;
  }
  if (studioMatch) {
    return '/studio';
  }

  // Fallback: parse the base from the current URL up to (not including) /cast or /series etc.
  const path = window.location.pathname;
  const match = path.match(/^(.*?)\/(cast|world|series|script|storyboard|seo|prompts|screening|assets|engine|api|lore)(\/|$)/);
  if (match) return match[1];

  return '/studio'; // safe default
}
