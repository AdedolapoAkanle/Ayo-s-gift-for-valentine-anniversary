const turnPageBtn = document.getElementById("turnPageBtn");
const coverPage = document.getElementById("coverPage");
const photoReveal = document.getElementById("photoReveal");
const mainPages = document.getElementById("mainPages");
const continueBtn = document.getElementById("continueBtn");
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0;
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;
const iframes = document.querySelectorAll("iframe");
const bottleOverlay = document.getElementById("bottleOverlay");
const bottleMessage = document.getElementById("bottleMessage");
const bottleAudio = document.getElementById("bottleAudio");
const messageScroll = document.getElementById("messageScroll");
const closeBottle = document.getElementById("closeBottle");
const sectionBottles = document.querySelectorAll(".section-bottle");

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  } else {
    bgMusic.play();
    musicToggle.textContent = "🎵";
  }
  isPlaying = !isPlaying;
});

window.addEventListener("beforeunload", () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
    isPlaying = false;
  }
});

iframes.forEach((iframe) => {
  iframe.addEventListener("mouseenter", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
      isPlaying = false;
    }
  });
});

turnPageBtn.addEventListener("click", () => {
  bgMusic.play();

  let fade = setInterval(() => {
    if (bgMusic.volume < 0.3) {
      bgMusic.volume += 0.02;
    } else {
      clearInterval(fade);
    }
  }, 200);

  coverPage.classList.add("turning");

  setTimeout(() => {
    photoReveal.classList.add("visible");
  }, 1000);
});

continueBtn.addEventListener("click", () => {
  mainPages.classList.add("visible");

  setTimeout(() => {
    mainPages.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
});

document.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".heart-doodle, .stamp");

  parallaxElements.forEach((el, index) => {
    const speed = (index + 1) * 0.1;
    el.style.transform = `translateY(${scrolled * speed}px) rotate(${
      scrolled * 0.02
    }deg)`;
  });
});

const pages = document.querySelectorAll(".page");

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

pages.forEach((page) => {
  observer.observe(page);
});

document.querySelectorAll(".polaroid").forEach((polaroid) => {
  polaroid.addEventListener("mousemove", (e) => {
    const rect = polaroid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    polaroid.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  polaroid.addEventListener("mouseleave", () => {
    const originalRotation =
      polaroid.style.transform.match(/rotate\((.+?)deg\)/);
    const rotation = originalRotation ? originalRotation[1] : "0";
    polaroid.style.transform = `rotate(${rotation}deg)`;
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("button")) {
    const heart = document.createElement("div");
    heart.className = "click-heart";
    const hearts = ["💕", "❤️", "💖", "💗", "💝"];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
});

const letterPage = document.querySelector(".page:last-child");
const letterSection = document.querySelector(".letter-section");

if (letterSection && letterPage) {
  const letterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            letterSection.classList.add("unrolled");
          }, 300);
          letterObserver.disconnect();
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  letterObserver.observe(letterPage);
}

function createConfetti() {
  const colors = ["#d4a5a5", "#8b7355", "#fff8dc", "#6b4e4e"];

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.3 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}

sectionBottles.forEach((bottle) => {
  bottle.addEventListener("click", () => {
    const message = bottle.getAttribute("data-message");
    const audioSrc = bottle.getAttribute("data-audio");

    bottleMessage.textContent = message;

    if (audioSrc) {
      bottleAudio.src = audioSrc;
      bottleAudio.style.display = "block";
      bottleMessage.textContent =
        "Random spot maybe but who cares lol🙃... Press play 🎙️";
    } else {
      bottleAudio.style.display = "none";
    }

    bottleOverlay.classList.add("active");
    createConfetti();

    if (isPlaying) {
      bgMusic.volume = 0.1;
    }

    bottle.style.opacity = "0";
    bottle.style.transform = "translateX(-50%) scale(0)";
    bottle.style.pointerEvents = "none";
  });
});

closeBottle.addEventListener("click", () => {
  bottleOverlay.classList.remove("active");

  if (!bottleAudio.paused) {
    bottleAudio.pause();
    bottleAudio.currentTime = 0;
  }

  if (isPlaying) {
    setTimeout(() => {
      let fade = setInterval(() => {
        if (bgMusic.volume < 0.3) {
          bgMusic.volume += 0.02;
        } else {
          clearInterval(fade);
        }
      }, 50);
    }, 300);
  }
});

bottleOverlay.addEventListener("click", (e) => {
  if (e.target === bottleOverlay) {
    closeBottle.click();
  }
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 0);
});

window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});
