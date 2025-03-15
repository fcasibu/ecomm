'use client';

import { useState } from 'react';

interface Stage {
  readonly title: string;
  readonly key: string;
}

type StageKey<T extends readonly Stage[]> = T[number]['key'];

export function useMultiStage<const T extends readonly Stage[]>(
  stages: T,
  initialStage: StageKey<T>,
) {
  const [currentStage, setCurrentStage] = useState(initialStage);

  const onNext = () => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage);
    const newStage = stages[currentIndex + 1]?.key;

    if (currentIndex < stages.length - 1 && newStage) {
      setCurrentStage(newStage);
    }
  };

  const onPrevious = () => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage);
    const newStage = stages[currentIndex - 1]?.key;

    if (currentIndex > 0 && newStage) {
      setCurrentStage(newStage);
    }
  };

  const goToStage = (stage: T[number]['key']) => {
    setCurrentStage(stage);
  };

  const isStageDisabled = (stageKey: T[number]['key']) => {
    const currentStageIndex = stages.findIndex(
      (stage) => stage.key === currentStage,
    );
    const disabledStages = stages.filter(
      (_, index) => index > currentStageIndex,
    );

    return disabledStages.some((stage) => stage.key === stageKey);
  };

  return {
    currentStage,
    onNext,
    onPrevious,
    goToStage,
    isStageDisabled,
  };
}
