module.exports = function(duration, speed, temperature, lastTemperature) {
  let currentTemperature, bill;
  if (speed > 0) {
    currentTemperature = lastTemperature - (Math.abs(lastTemperature - temperature) / 500) * speed * duration;
    if (currentTemperature < temperature) {
      currentTemperature = temperature;
    }
  } else {
    currentTemperature = lastTemperature + (duration / 30) * 0.5;
    if (currentTemperature > 35) {
      currentTemperature = 35;
    }
  }

  bill = (50 - temperature) / 10 / 600 * speed * duration;
  return {
    currentTemperature: currentTemperature.toFixed(2),
    bill
  };
};
