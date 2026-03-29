import { presentationStorage } from "@/lib/presentation-storage";
import { usePresentationState } from "@/states/presentation-state";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef } from "react";

interface UseDebouncedSaveOptions {
  delay?: number;
}

export const useDebouncedSave = (options: UseDebouncedSaveOptions = {}) => {
  const { delay = 1000 } = options;
  const { setSavingStatus } = usePresentationState();

  const debouncedSave = useRef(
    debounce(
      () => {
        const {
          slides,
          currentPresentationId,
          currentPresentationTitle,
          theme,
          language,
          outline,
          presentationInput,
          presentationStyle,
          imageSource,
          config,
        } = usePresentationState.getState();

        if (!currentPresentationId || slides.length === 0) return;

        try {
          setSavingStatus("saving");

          presentationStorage.update(currentPresentationId, {
            content: { slides, config },
            title: currentPresentationTitle || undefined,
            theme: String(theme),
            language,
            outline,
            prompt: presentationInput || undefined,
            presentationStyle: presentationStyle || undefined,
            imageSource,
          });

          setSavingStatus("saved");
          setTimeout(() => setSavingStatus("idle"), 2000);
        } catch (error) {
          console.error("Failed to save presentation:", error);
          setSavingStatus("idle");
        }
      },
      delay,
      { maxWait: delay * 2 },
    ),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const saveImmediately = useCallback(() => {
    debouncedSave.cancel();

    const {
      slides,
      currentPresentationId,
      currentPresentationTitle,
      theme,
      language,
      outline,
      presentationInput,
      presentationStyle,
      imageSource,
      config,
    } = usePresentationState.getState();

    if (!currentPresentationId || slides.length === 0) return;

    try {
      setSavingStatus("saving");

      presentationStorage.update(currentPresentationId, {
        content: { slides, config },
        title: currentPresentationTitle || undefined,
        theme: String(theme),
        language,
        outline,
        prompt: presentationInput || undefined,
        presentationStyle: presentationStyle || undefined,
        imageSource,
      });

      setSavingStatus("saved");
      setTimeout(() => setSavingStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save presentation:", error);
      setSavingStatus("idle");
    }
  }, [debouncedSave, setSavingStatus]);

  const save = useCallback(() => {
    setSavingStatus("saving");
    void debouncedSave();
  }, [debouncedSave, setSavingStatus]);

  return { save, saveImmediately };
};
