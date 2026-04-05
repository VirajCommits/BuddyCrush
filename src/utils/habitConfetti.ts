import confetti from "canvas-confetti";

export function triggerHabitConfetti(): void {
  const fire = (particleCount: number, angle: number) => {
    confetti({
      particleCount,
      angle,
      spread: 55,
      origin: { x: 0.95, y: 0.95 },
      startVelocity: 30,
      gravity: 0.8,
      drift: 0,
      ticks: 200,
      scalar: 0.7,
      zIndex: 9999,
      colors: ["#3B8A7F", "#4CAF50", "#E8627C", "#F5A623", "#D4A574"],
    });
  };

  fire(20, 130);
  setTimeout(() => fire(15, 115), 200);
  setTimeout(() => fire(12, 140), 500);
  setTimeout(() => fire(10, 120), 900);
}
