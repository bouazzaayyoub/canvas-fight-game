function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.swordBox.position.x + rectangle1.swordBox.width >=
      rectangle2.position.x &&
    rectangle1.swordBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.swordBox.position.y + rectangle1.swordBox.height >=
      rectangle2.position.y &&
    rectangle1.swordBox.position.y <= rectangle2.height + rectangle2.position.y
  );
}
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#winnerText").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#winnerText").innerHTML = "equal fight";
  } else if (player.health > enemy.health) {
    document.querySelector("#winnerText").innerHTML = "player wins!";
  } else if (enemy.health > player.health) {
    document.querySelector("#winnerText").innerHTML = "enemy wins!";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  } else {
    determineWinner({ player, enemy, timerId });
  }
}
