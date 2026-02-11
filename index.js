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

// Stop music when leaving page or closing browser
window.addEventListener("beforeunload", () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});

// Also stop when page visibility changes (tab switching)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
    isPlaying = false;
  }
});

// Pause background music when Spotify plays
iframes.forEach((iframe) => {
  iframe.addEventListener("mouseenter", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
      isPlaying = false;
    }
  });
});

// musicToggle.addEventListener("click", () => {
//   if (isPlaying) {
//     bgMusic.pause();
//     musicToggle.textContent = "🔇";
//   } else {
//     bgMusic.play();
//     musicToggle.textContent = "🎵";
//   }
//   isPlaying = !isPlaying;
// });

// window.addEventListener("beforeunload", () => {
//   bgMusic.pause();
//   bgMusic.currentTime = 0;
// });

// iframes.forEach((iframe) => {
//   iframe.addEventListener("mouseenter", () => {
//     bgMusic.pause();
//     musicToggle.textContent = "🔇";
//     isPlaying = false;
//   });
// });

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
  const ribbonOverlay = document.createElement("div");
  ribbonOverlay.className = "ribbon-overlay";
  ribbonOverlay.innerHTML = `
    <div class="ribbon-bow">
      <div class="ribbon-knot">🎀</div>
      <div class="ribbon-tail ribbon-tail--left"></div>
      <div class="ribbon-tail ribbon-tail--right"></div>
    </div>
  `;

  letterPage.style.position = "relative";
  letterPage.insertBefore(ribbonOverlay, letterSection);

  const ribbonObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            ribbonOverlay.classList.add("ribbon--loosen");
          }, 600);
          setTimeout(() => {
            ribbonOverlay.classList.add("ribbon--slide");
          }, 1400);

          setTimeout(() => {
            ribbonOverlay.classList.add("ribbon--gone");
            letterSection.classList.add("unrolled");
          }, 2200);

          ribbonObserver.disconnect();
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  ribbonObserver.observe(letterPage);
}
