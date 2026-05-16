import { useCallback, useEffect, useRef } from 'react';

export const useAutoResizeTextarea = (value: string, enabled: boolean) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const scheduleResizeTextarea = useCallback(() => {
    window.requestAnimationFrame(resizeTextarea);
  }, [resizeTextarea]);

  useEffect(() => {
    if (enabled) {
      resizeTextarea();
    }
  }, [enabled, value, resizeTextarea]);

  return {
    textareaRef,
    resizeTextarea,
    scheduleResizeTextarea
  };
};
