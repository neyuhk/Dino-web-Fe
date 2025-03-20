// src/helpers/simulation.ts
export function simulateLED(state: string): void {
    const ledElement = document.getElementById('simulated-led');
    if (ledElement) {
      // When state is 'HIGH', set the LED element's background to yellow.
      // When state is 'LOW', set it to black.
      ledElement.style.backgroundColor = state === 'HIGH' ? 'yellow' : 'black';
    }
    console.log('LED state:', state);
  }
  