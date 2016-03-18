module.exports = function({ duration, temperature, speed, mode }) {
  if (mode !== 'off') {
    mode = 10;
  } else {
    mode = 0;
  }
  return (Math.abs(temperature - 26) + mode) * (speed) * duration;
};
