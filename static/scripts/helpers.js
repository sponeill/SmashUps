function generateRandomId() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const timestamp = new Date().getTime();
  const randomId = `${timestamp}-${randomNumber}`;

  return randomId;
}
