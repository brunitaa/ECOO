import "./AppShell.css";

export default function AppShell({ children, header, footer, className = "" }) {
  return (
    <div className={`ec-app-shell ${className}`.trim()}>
      {header && <header className="ec-app-shell__header">{header}</header>}
      <div className="ec-app-shell__content">{children}</div>
      {footer && <footer className="ec-app-shell__footer">{footer}</footer>}
    </div>
  );
}