const canva = document.querySelector("canvas");
const ctx = canva.getContext("2d");

canva.width = 1024;
canva.height = 576;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canva.width, canva.height);

const gravity = 0.7;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 0 },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  offset: { x: 215, y: 172 },
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  swordBox: {
    offset: {
      x: -160,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  offset: { x: 215, y: 156 },
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  swordBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const keys = {
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  c: { pressed: false },
  w: { pressed: false },
  x: { pressed: false },
  space: { pressed: false },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canva.width, canva.height);
  // ctx.drawImage(
  //   enemy.image,
  //   enemy.image.width / enemy.framesMax,
  //   0,
  //   enemy.image.width / enemy.framesMax,
  //   enemy.image.height,
  //   0,
  //   0,
  //   (enemy.image.width / enemy.framesMax) * enemy.scale,
  //   enemy.image.height * enemy.scale
  // );
  // ctx.save();
  // ctx.scale(-1, 1);
  // ctx.drawImage(
  //   enemy.image,
  //   (enemy.image.width / enemy.framesMax) * 6,
  //   0,
  //   enemy.image.width / enemy.framesMax,
  //   enemy.image.height,
  //   -enemy.scale * (enemy.image.width / enemy.framesMax),
  //   200,
  //   (enemy.image.width / enemy.framesMax) * enemy.scale,
  //   enemy.image.height * enemy.scale
  // );
  // ctx.restore();
  background.update();
  shop.update();
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(0, 0, canva.width, canva.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.ArrowRight.pressed && player.lastKeyPressed === "ArrowRight") {
    player.velocity.x = 5;
    player.switchSprite("run");
    player.dir = -1;
  } else if (keys.ArrowLeft.pressed && player.lastKeyPressed === "ArrowLeft") {
    player.velocity.x = -5;
    player.switchSprite("run");
    player.dir = 1;
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (keys.c.pressed && enemy.lastKeyPressed === "c") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
    enemy.dir = -1;
  } else if (keys.w.pressed && enemy.lastKeyPressed === "w") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
    enemy.dir = 1;
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  // detect for collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (player.isAttacking && player.framesCurrent === 2) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 4
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.isDead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        player.lastKeyPressed = "ArrowRight";

        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        player.lastKeyPressed = "ArrowLeft";
        break;
      case "ArrowUp":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.isDead) {
    switch (event.key) {
      case "c":
        keys.c.pressed = true;
        enemy.lastKeyPressed = "c";

        break;
      case "w":
        keys.w.pressed = true;
        enemy.lastKeyPressed = "w";
        break;
      case "d":
        enemy.velocity.y = -20;
        break;
      case "x":
        enemy.attack();
        break;
      default:
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      player.lastKeyPressed = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      player.lastKeyPressed = "ArrowLeft";

      break;

    case " ":
      keys.space.pressed = false;
      enemy.lastKeyPressed = " ";

    case "c":
      keys.c.pressed = false;
      enemy.lastKeyPressed = "c";
      break;
    case "w":
      keys.w.pressed = false;
      enemy.lastKeyPressed = "w";
    case "x":
      keys.x.pressed = false;
      enemy.lastKeyPressed = "x";

      break;
  }
});
