import React from "react";
import { Historico } from "./Historico.jsx";
import { Inicio } from "./Inicio.jsx";
import { Pedido } from "./Pedido.jsx";

export function LeaderReactPage(props) {
  if (props.page === "inicio") return <Inicio {...props} />;
  if (props.page === "historico") return <Historico {...props} />;
  return <Pedido {...props} />;
}
