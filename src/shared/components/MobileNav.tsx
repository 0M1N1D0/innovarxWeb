"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import styles from "./MobileNav.module.css";

interface MobileNavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: readonly MobileNavLink[];
  localeSwitcher: ReactNode;
  cta: ReactNode;
  navLabel: string;
  openLabel: string;
  closeLabel: string;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({
  links,
  localeSwitcher,
  cta,
  navLabel,
  openLabel,
  closeLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const panelContent = panelContentRef.current;
    const previousFocus = previousFocusRef.current;
    const bodyLockedClass = styles.bodyLocked;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const animationFrame = window.requestAnimationFrame(() => {
      panelContent?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    });

    if (bodyLockedClass) document.body.classList.add(bodyLockedClass);

    function closeMenu() {
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !panelContent) return;

      const focusableElements = Array.from(
        panelContent.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (!panelContent.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!panelContent?.contains(target) && !buttonRef.current?.contains(target)) {
        closeMenu();
      }
    }

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) closeMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (bodyLockedClass) document.body.classList.remove(bodyLockedClass);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      mediaQuery.removeEventListener("change", handleBreakpointChange);
      previousFocus?.focus();
    };
  }, [open]);

  function toggleMenu() {
    if (!open) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : buttonRef.current;
    }
    setOpen((currentOpen) => !currentOpen);
  }

  function handlePanelClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  }

  return (
    <div className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div
        id={panelId}
        className={`${styles.panel} ${open ? styles.open : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          ref={panelContentRef}
          className={styles.panelContent}
          role="dialog"
          aria-modal="true"
          aria-label={navLabel}
          onClick={handlePanelClick}
        >
          <nav aria-label={navLabel}>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            {localeSwitcher}
            {cta}
          </div>
        </div>
      </div>
    </div>
  );
}
