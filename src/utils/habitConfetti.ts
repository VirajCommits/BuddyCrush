import confetti from "canvas-confetti";

/** Small burst from the bottom-right corner (not full-screen). */
export function triggerHabitConfetti(): void {
  const fire = (particleCount: number, angle: number) => {
    confetti({
      particleCount,
      angle,
      spread: 42,
      origin: { x: 0.98, y: 0.98 },
      startVelocity: 22,
      gravity: 1.05,
      drift: 0,
      ticks: 90,
      scalar: 0.55,
      zIndex: 9999,
      colors: ["#3B8A7F", "#4CAF50", "#E8627C", "#F5A623", "#D4A574"],
    });
  };
  fire(18, 125);
  setTimeout(() => fire(12, 110), 120);
}
