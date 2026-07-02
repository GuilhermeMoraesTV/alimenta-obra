import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { SupplierReactPage } from "./PaginaFornecedor.jsx";

const mountedRoots = new WeakMap();

export function unmountSupplierReactPage(container = document) {
  container.querySelectorAll("[data-supplier-react-root]").forEach((element) => {
    const root = mountedRoots.get(element);
    if (!root) return;
    root.unmount();
    mountedRoots.delete(element);
  });
}

export function mountSupplierReactPage(container, props) {
  const element = container.querySelector("[data-supplier-react-root]");
  if (!element) return;

  let root = mountedRoots.get(element);
  if (!root) {
    root = createRoot(element);
    mountedRoots.set(element, root);
  }

  flushSync(() => {
    root.render(<SupplierReactPage {...props} />);
  });
}
