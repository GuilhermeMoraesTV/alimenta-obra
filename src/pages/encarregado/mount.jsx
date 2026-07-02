import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { LeaderReactPage } from "./PaginaEncarregado.jsx";

const mountedRoots = new WeakMap();

export function unmountLeaderReactPage(container = document) {
  container.querySelectorAll("[data-leader-react-root]").forEach((element) => {
    const root = mountedRoots.get(element);
    if (!root) return;
    root.unmount();
    mountedRoots.delete(element);
  });
}

export function mountLeaderReactPage(container, props) {
  const element = container.querySelector("[data-leader-react-root]");
  if (!element) return;

  let root = mountedRoots.get(element);
  if (!root) {
    root = createRoot(element);
    mountedRoots.set(element, root);
  }

  flushSync(() => {
    root.render(<LeaderReactPage {...props} />);
  });
}
