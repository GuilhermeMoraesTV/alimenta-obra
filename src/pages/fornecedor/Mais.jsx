import React from "react";
import { Icon } from "./shared.jsx";

export function More(props) {
  const { icon } = props;
  const tools = [
    ["fornecedor-documentos", "package", "Documentos"],
    ["fornecedor-financeiro", "chart", "Financeiro"],
    ["configuracoes", "settings", "Configuracoes"]
  ];

  return (
    <section className="supplier-more">
      <header className="admin-home-hero compact supplier-more-hero">
        <div>
          <span className="compact-kicker">Fornecedor</span>
          <h1>Mais ferramentas</h1>
          <p>Acesse documentos, financeiro e configuracoes sem deixar o rodape principal carregado.</p>
        </div>
      </header>
      <div className="supplier-more-grid">
        {tools.map(([view, iconName, title]) => (
          <button className="supplier-more-tile" data-view={view} key={view}>
            <span><Icon icon={icon} name={iconName} size={24} /></span>
            <strong>{title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
