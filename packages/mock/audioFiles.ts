/// Gets the url of an audio file for a song. The function will always return
// the same song url for the same id. Multiple ids may return the same song
// url. The urls come from `audioFiles`.
export const songUrlForId = (songId: string): string => {
  const hashed = hash(songId);
  const index = hashed % audioFiles.length;

  return audioFiles[index];
};

// List of random royalty free audio files downloaded off the internet and put
// in my google driver.
export const audioFiles = [
  '1quUPON7PvA2XR38qhPc_cH7gO9HHnTTz', // Sample_BeeMoved_96kHz24bit.flac
  '1V6cdWBkwhDniUP5-hloe0bJoAfMo9N0q', // bensound-littleidea.mp3
  '1s78VFglzsCBlwnaQ1aoAL4KKzvVYkWsE', // bensound-funnysong.mp3
  '1jAF3ui6zcygH84__zTKntFiE_m9NVvrx', // bensound-energy.mp3
  '18hwSDyL8b-VW2AYxbgv3IQm97D1SlsfC', // bensound-dubstep.mp3
  '1UefWNDyZF2D1DSoxBi8YX8ku6zlgLXzF', // bensound-creativeminds.mp3
  '1v8Y-vb5ivcAeigHubuzwFKMwhcseb1tG', // bensound-buddy.mp3
  '1lzUwLscNWcIX8FNoKeKi6hlBO0WA3FLY', // bensound-betterdays.mp3
].map(id => `https://drive.google.com/uc?export=download&id=${id}`);

const hash = (s: string): number => {
  let sum = 0;
  const maxUpperBound = 32;
  const upperBound = Math.min(s.length, maxUpperBound);
  const bucketSize = 128;
  const powerBase = 2;

  for (let i = upperBound - 1, j = 0; i >= 0; i--, j++) {
    const char = s.charCodeAt(i) % bucketSize;
    sum += char * Math.pow(powerBase, j);
  }

  return sum;
};
