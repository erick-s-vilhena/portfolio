export class GenericCarousel {
  constructor(root, userOptions = {}) {
    this.root = root;
    this.track = root.querySelector(".carousel-track");
    this.originalSlides = Array.from(root.querySelectorAll(".carousel-slide"));
    this.bulletsContainer = root.querySelector(".carousel-bullets");

    this.options = this.buildOptions(userOptions);
    this.currentIndex = 0;
    this.currentTranslate = 0;
    this.startX = 0;
    this.prevTranslate = 0;
    this.isDragging = false;
    this.autoplayId = null;
    this.resizeTimeout = null;
    this.viewport = null;
    this.allSlides = [];
    this.realSlides = [];
    this.cloneCount = 0;
    this.slideWidth = 0;

    this.boundHandlers = {};
    this.init();
  }

    buildOptions(userOptions) {
        const d = this.root.dataset;
        return {
            infinite: this.parseBool(userOptions.infinite ?? d.infinite, true),
            autoplay: this.parseBool(userOptions.autoplay ?? d.autoplay, false),
            autoplaySpeed: Number(userOptions.autoplaySpeed ?? d.autoplaySpeed ?? 3500),
            showBullets: this.parseBool(userOptions.showBullets ?? d.showBullets, true),
            dragMobile: this.parseBool(userOptions.dragMobile ?? d.dragMobile, true),
            reverse: this.parseBool(userOptions.reverse ?? d.reverse, false),
            snap: this.parseBool(userOptions.snap ?? d.snap, true),
            slidesPerView: {
            desktop: Number(userOptions.slidesDesktop ?? d.slidesDesktop ?? 1),
            tablet: Number(userOptions.slidesTablet ?? d.slidesTablet ?? 1),
            mobile: Number(userOptions.slidesMobile ?? d.slidesMobile ?? 1),
            litterMobile: Number(userOptions.slidesLitterMobile ?? d.slidesLitterMobile ?? 1),
            }
        };
    }

  parseBool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    return String(value).toLowerCase() === "true";
  }

  getSlidesPerView() {
    if (window.innerWidth <= 500) return this.options.slidesPerView.litterMobile;
    if (window.innerWidth <= 768) return this.options.slidesPerView.mobile;
    if (window.innerWidth <= 1024) return this.options.slidesPerView.tablet;
    return this.options.slidesPerView.desktop;
  }

  getMaxStartIndex() {
    return Math.max(0, this.realSlides.length - this.slidesPerView);
  }

  getBulletCount() {
    return Math.max(1, this.getMaxStartIndex() + 1);
  }

  getInitialRealIndex() {
    return this.options.reverse ? this.getMaxStartIndex() : 0;
  }

  clampRealIndex(index) {
    return Math.max(0, Math.min(index, this.getMaxStartIndex()));
  }

  init() {
    this.wrapViewport();
    this.setupSlides();
    this.createBullets();
    this.goToInitial(false);
    this.bindEvents();
    this.updateBullets();
    this.updateBulletsVisibility();
    this.startAutoplay();
  }

  wrapViewport() {
    const existingViewport = this.root.querySelector(".carousel-viewport");
    if (existingViewport) {
      this.viewport = existingViewport;
      return;
    }

    const viewport = document.createElement("div");
    viewport.className = "carousel-viewport";
    this.track.parentNode.insertBefore(viewport, this.track);
    viewport.appendChild(this.track);
    this.viewport = viewport;
  }

  setupSlides() {
    this.track.innerHTML = "";
    this.realSlides = this.originalSlides.map(slide => slide.cloneNode(true));
    this.slidesPerView = Math.max(1, this.getSlidesPerView());

    if (this.options.infinite && this.realSlides.length > this.slidesPerView) {
      this.cloneCount = this.slidesPerView;

      const headClones = this.realSlides.slice(0, this.cloneCount).map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add("is-clone");
        return clone;
      });

      const tailClones = this.realSlides.slice(-this.cloneCount).map(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add("is-clone");
        return clone;
      });

      [...tailClones, ...this.realSlides, ...headClones].forEach(slide => {
        this.track.appendChild(slide);
      });

      this.allSlides = Array.from(this.track.children);
      this.currentIndex = this.cloneCount + this.getInitialRealIndex();
    } else {
      this.cloneCount = 0;
      this.realSlides.forEach(slide => this.track.appendChild(slide));
      this.allSlides = Array.from(this.track.children);
      this.currentIndex = this.getInitialRealIndex();
    }

    this.slideWidth = this.viewport.clientWidth / this.slidesPerView;

    this.allSlides.forEach(slide => {
      slide.style.flex = `0 0 ${100 / this.slidesPerView}%`;
      slide.style.maxWidth = `${100 / this.slidesPerView}%`;
    });
  }

  createBullets() {
    if (!this.bulletsContainer) return;

    this.bulletsContainer.innerHTML = "";

    const bulletCount = this.getBulletCount();

    for (let index = 0; index < bulletCount; index++) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Ir para o grupo ${index + 1}`);

      button.addEventListener("click", () => {
        const realIndex = index;
        const target = this.options.infinite ? realIndex + this.cloneCount : realIndex;
        this.goTo(target);
        this.restartAutoplay();
      });

      this.bulletsContainer.appendChild(button);
    }
  }

  updateBullets() {
    if (!this.bulletsContainer) return;

    const buttons = Array.from(this.bulletsContainer.children);
    const realIndex = this.getRealIndex();

    buttons.forEach((button, index) => {
      button.classList.toggle("is-active", index === realIndex);
    });
  }

  updateBulletsVisibility() {
    if (!this.bulletsContainer) return;
    this.bulletsContainer.style.display = this.options.showBullets ? "flex" : "none";
  }

  getRealIndex() {
    if (!this.options.infinite || this.realSlides.length <= this.slidesPerView) {
      return this.clampRealIndex(this.currentIndex);
    }

    let index = (this.currentIndex - this.cloneCount) % this.realSlides.length;
    if (index < 0) index += this.realSlides.length;

    return this.clampRealIndex(index);
  }

  setTranslate(value, animate = true) {
    this.track.style.transition = animate ? "transform .35s ease" : "none";
    this.track.style.transform = `translateX(${value}px)`;
    this.currentTranslate = value;
  }

  goTo(index, animate = true) {
    this.currentIndex = index;
    const offset = -(this.currentIndex * this.slideWidth);
    this.prevTranslate = offset;
    this.setTranslate(offset, animate);
    this.updateBullets();
  }

  goToRealIndex(realIndex, animate = true) {
    const clamped = this.clampRealIndex(realIndex);
    const target = this.options.infinite ? clamped + this.cloneCount : clamped;
    this.goTo(target, animate);
  }

  goToInitial(animate = false) {
    this.goToRealIndex(this.getInitialRealIndex(), animate);
  }

  next() {
    if (!this.options.infinite) {
      if (this.currentIndex >= this.getMaxStartIndex()) {
        this.goToRealIndex(0);
        return;
      }

      this.goTo(this.currentIndex + 1);
      return;
    }

    this.goTo(this.currentIndex + 1);
  }

  prev() {
    if (!this.options.infinite) {
      if (this.currentIndex <= 0) {
        this.goToRealIndex(this.getMaxStartIndex());
        return;
      }

      this.goTo(this.currentIndex - 1);
      return;
    }

    this.goTo(this.currentIndex - 1);
  }

  handleInfiniteLoop() {
    if (!this.options.infinite || this.realSlides.length <= this.slidesPerView) return;

    const maxRealIndex = this.getMaxStartIndex();
    const firstReal = this.cloneCount;
    const lastReal = this.cloneCount + maxRealIndex;

    if (this.currentIndex > lastReal) {
      this.currentIndex = firstReal;
      this.goTo(this.currentIndex, false);
    }

    if (this.currentIndex < firstReal) {
      this.currentIndex = lastReal;
      this.goTo(this.currentIndex, false);
    }
  }

  startAutoplay() {
    if (!this.options.autoplay) return;

    this.stopAutoplay();

    this.autoplayId = setInterval(() => {
      if (this.options.reverse) {
        this.prev();
      } else {
        this.next();
      }
    }, this.options.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  restartAutoplay() {
    if (!this.options.autoplay) return;
    this.startAutoplay();
  }

  pointerDown(clientX) {
    if (!this.options.dragMobile) return;

    this.isDragging = true;
    this.startX = clientX;
    this.root.classList.add("is-dragging");
    this.stopAutoplay();
  }

    pointerMove(clientX) {
        if (!this.isDragging) return;

        const moved = clientX - this.startX;
        const nextTranslate = this.prevTranslate + moved;

        if (this.options.snap) {
            this.setTranslate(nextTranslate, false);
        } else {
            this.setTranslate(this.clampTranslate(nextTranslate), false);
            this.syncIndexFromTranslate();
        }
    }

    pointerUp() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.root.classList.remove("is-dragging");

        const movedBy = this.currentTranslate - this.prevTranslate;
        const threshold = this.slideWidth * 0.15;

        if (!this.options.snap) {
            this.currentTranslate = this.clampTranslate(this.currentTranslate);
            this.prevTranslate = this.currentTranslate;
            this.setTranslate(this.currentTranslate, false);
            this.syncIndexFromTranslate();
            this.restartAutoplay();
            return;
        }

        if (movedBy < -threshold) {
            this.next();
        } else if (movedBy > threshold) {
            this.prev();
        } else {
            this.goTo(this.currentIndex);
        }

        this.restartAutoplay();
    }

  bindEvents() {
    this.boundHandlers.onTransitionEnd = () => this.handleInfiniteLoop();
    this.boundHandlers.onMouseEnter = () => this.stopAutoplay();
    this.boundHandlers.onMouseLeave = () => this.startAutoplay();
    this.boundHandlers.onMouseDown = (e) => this.pointerDown(e.clientX);
    this.boundHandlers.onMouseMove = (e) => this.pointerMove(e.clientX);
    this.boundHandlers.onMouseUp = () => this.pointerUp();
    this.boundHandlers.onTouchStart = (e) => this.pointerDown(e.touches[0].clientX);
    this.boundHandlers.onTouchMove = (e) => this.pointerMove(e.touches[0].clientX);
    this.boundHandlers.onTouchEnd = () => this.pointerUp();
    this.boundHandlers.onResize = () => {
      clearTimeout(this.resizeTimeout);

      this.resizeTimeout = setTimeout(() => {
        const reverse = this.options.reverse;
        const currentRealIndex = reverse ? this.getInitialRealIndex() : this.getRealIndex();

        this.setupSlides();
        this.createBullets();
        this.goToRealIndex(currentRealIndex, false);
        this.updateBullets();
        this.updateBulletsVisibility();
      }, 120);
    };

    this.track.addEventListener("transitionend", this.boundHandlers.onTransitionEnd);
    this.root.addEventListener("mouseenter", this.boundHandlers.onMouseEnter);
    this.root.addEventListener("mouseleave", this.boundHandlers.onMouseLeave);

    this.track.addEventListener("mousedown", this.boundHandlers.onMouseDown);
    window.addEventListener("mousemove", this.boundHandlers.onMouseMove);
    window.addEventListener("mouseup", this.boundHandlers.onMouseUp);

    this.track.addEventListener("touchstart", this.boundHandlers.onTouchStart, { passive: true });
    this.track.addEventListener("touchmove", this.boundHandlers.onTouchMove, { passive: true });
    this.track.addEventListener("touchend", this.boundHandlers.onTouchEnd);

    window.addEventListener("resize", this.boundHandlers.onResize);
  }

  getMinTranslate() {
    if (this.options.infinite && this.realSlides.length > this.slidesPerView) {
        const firstRealIndex = this.cloneCount;
        return -(firstRealIndex * this.slideWidth);
    }

    return -(this.getMaxStartIndex() * this.slideWidth);
    }

    getMaxTranslate() {
    if (this.options.infinite && this.realSlides.length > this.slidesPerView) {
        const lastRealIndex = this.cloneCount + this.getMaxStartIndex();
        return -(lastRealIndex * this.slideWidth);
    }

    return 0;
    }

    clampTranslate(value) {
    const minT = Math.min(this.getMinTranslate(), this.getMaxTranslate());
    const maxT = Math.max(this.getMinTranslate(), this.getMaxTranslate());
    return Math.max(minT, Math.min(value, maxT));
    }

    syncIndexFromTranslate() {
    const estimatedIndex = Math.round(Math.abs(this.currentTranslate) / this.slideWidth);

    if (this.options.infinite && this.realSlides.length > this.slidesPerView) {
        const firstRealIndex = this.cloneCount;
        const lastRealIndex = this.cloneCount + this.getMaxStartIndex();
        this.currentIndex = Math.max(firstRealIndex, Math.min(estimatedIndex, lastRealIndex));
    } else {
        this.currentIndex = Math.max(0, Math.min(estimatedIndex, this.getMaxStartIndex()));
    }

    this.updateBullets();
    }

  destroy() {
    this.stopAutoplay();
    clearTimeout(this.resizeTimeout);

    if (this.track && this.boundHandlers.onTransitionEnd) {
      this.track.removeEventListener("transitionend", this.boundHandlers.onTransitionEnd);
      this.track.removeEventListener("mousedown", this.boundHandlers.onMouseDown);
      this.track.removeEventListener("touchstart", this.boundHandlers.onTouchStart);
      this.track.removeEventListener("touchmove", this.boundHandlers.onTouchMove);
      this.track.removeEventListener("touchend", this.boundHandlers.onTouchEnd);
    }

    if (this.root && this.boundHandlers.onMouseEnter) {
      this.root.removeEventListener("mouseenter", this.boundHandlers.onMouseEnter);
      this.root.removeEventListener("mouseleave", this.boundHandlers.onMouseLeave);
    }

    window.removeEventListener("mousemove", this.boundHandlers.onMouseMove);
    window.removeEventListener("mouseup", this.boundHandlers.onMouseUp);
    window.removeEventListener("resize", this.boundHandlers.onResize);

    this.root.classList.remove("is-dragging");

    if (this.track) {
      this.track.style.transition = "";
      this.track.style.transform = "";
      this.track.innerHTML = "";

      this.originalSlides.forEach(slide => {
        this.track.appendChild(slide.cloneNode(true));
      });
    }

    if (this.bulletsContainer) {
      this.bulletsContainer.innerHTML = "";
    }

    if (this.viewport && this.viewport.parentNode) {
      this.viewport.parentNode.insertBefore(this.track, this.viewport);
      this.viewport.remove();
      this.viewport = null;
    }
  }
}