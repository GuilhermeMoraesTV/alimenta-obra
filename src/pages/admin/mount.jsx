import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { AdminReactPage } from "./PaginaAdmin.jsx";

const mountedRoots = new WeakMap();

export function unmountAdminReactPage(container = document) {
  container.querySelectorAll("[data-admin-react-root]").forEach((element) => {
    const root = mountedRoots.get(element);
    if (!root) return;
    root.unmount();
    mountedRoots.delete(element);
  });
}

export function mountAdminReactPage(container, props) {
  const element = container.querySelector("[data-admin-react-root]");
  if (!element) return;

  let root = mountedRoots.get(element);
  if (!root) {
    root = createRoot(element);
    mountedRoots.set(element, root);
  }

  flushSync(() => {
    root.render(<AdminReactPage {...props} />);
  });
}
