export const requestWakeLock = async () => {
  try {
    window.wakeLock = await navigator.wakeLock.request('screen');
  }
  catch (err) {
    console.error(err);
  }
};