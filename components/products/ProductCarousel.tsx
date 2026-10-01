"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ProductCarousel.module.css";

type ProductCarouselProps = {
  images: string[];
  alt: string;
};

const SWIPE_THRESHOLD = 40;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M7.5 1.5 1.5 7.5l6 6" : "M1.5 1.5l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductCarousel({ images, alt }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const goTo = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Foto ${alt}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(index - 1);
        if (event.key === "ArrowRight") goTo(index + 1);
      }}
    >
      <div
        className={styles.viewport}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(delta < 0 ? index + 1 : index - 1);
          touchStartX.current = null;
        }}
      >
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <div
              key={src}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(max-width: 1024px) 100vw, 563px" className={styles.image} />
            </div>
          ))}
        </div>
      </div>

      <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous slide" onClick={() => goTo(index - 1)}>
        <Chevron direction="left" />
      </button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next slide" onClick={() => goTo(index + 1)}>
        <Chevron direction="right" />
      </button>

      <div className={styles.dots}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
