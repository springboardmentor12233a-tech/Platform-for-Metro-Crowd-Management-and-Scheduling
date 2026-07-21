const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboard() {
  await delay(500);

  return {
    totalPassengers: 248734,
    activeTrains: 126,
    activeIncidents: 3,
    revenueToday: 1542000,
  };
}

export async function getIncidents() {
  await delay(500);

  return [];
}

export async function getStations() {
  await delay(500);

  return [];
}