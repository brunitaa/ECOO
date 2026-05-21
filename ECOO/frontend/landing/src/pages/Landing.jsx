import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrandLogo } from '@ecoo/ui';
import { EcoPointIcon } from '@ecoo/ui';
import {
  Icon,
  Button,
  KpiCard,
  EcoWaves,
  ChartCard,
  LineChartPanel,
  BarChartPanel,
} from "@ecoo/ui";
import "./Landing.css";

const m = motion;

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const DEMO_SERIE = [
  { label: "Ene", value: 42 },
  { label: "Feb", value: 58 },
  { label: "Mar", value: 71 },
  { label: "Abr", value: 89 },
  { label: "May", value: 112 },
  { label: "Jun", value: 134 },
];

const DEMO_BARS = [
  { label: "Papel", value: 320 },
  { label: "Plastico", value: 280 },
  { label: "Vidrio", value: 190 },
  { label: "Organico", value: 150 },
];

export default function Landing() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="landing">
      <header className="landing-nav ec-glass">
        <Link to="/" className="landing-nav__logo">
          <BrandLogo height={38} />
        </Link>
        <nav className="landing-nav__links">
          <a href="#producto">Explorar ECOO</a>
          <Link to="/login?tipo=comercio">Empresas</Link>
          <Link to="/login?tipo=ciudadano">Ciudadanos</Link>
          <a href="#rse">RSE</a>
          <a href="#analytics">Analytics</a>
        </nav>
        <div className="landing-nav__cta">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" icon="sparkles">
              Registrarse
            </Button>
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <EcoWaves variant="hero" />
        <div className="landing-hero__dots ec-dots-bg" />
        <m.div
          className="landing-hero__inner"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <m.div className="landing-hero__copy" {...fadeUp}>
            <span className="landing-pill">
              <Icon name="leaf" size={14} /> Enterprise Eco-SaaS
            </span>
            <h1>
              Convierte acciones sostenibles en{" "}
              <span className="ec-gradient-text">impacto medible</span>
            </h1>
            <p className="landing-hero__lead">
              ECOO conecta empresas, ciudadanos y comercios con QR inteligentes,
              ECOO POINTS y tableros RSE en tiempo real. Tecnologia,
              sostenibilidad y recompensas reales.
            </p>
            <div className="landing-hero__actions">
              <Link to="/register">
                <Button size="lg" icon="sparkles">
                  Empezar gratis
                </Button>
              </Link>
              <a href="#rse">
                <Button variant="secondary" size="lg" icon="book">
                  Que es RSE
                </Button>
              </a>
            </div>
            <div className="landing-hero__trust">
              <span>
                <Icon name="shield" size={16} /> Validacion auditada
              </span>
              <span>
                <Icon name="qr" size={16} /> QR ECOO POINT
              </span>
              <span>
                <Icon name="chart" size={16} /> Analytics ESG
              </span>
            </div>
          </m.div>

          <m.div
            className="landing-hero__visual"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="landing-phone ec-glass">
              <div className="landing-phone__hdr">
                <BrandLogo height={24} />
                <span className="landing-phone__pill">En vivo</span>
              </div>
              <div className="landing-phone__balance">
                <small>Tu saldo ECOO POINTS</small>
                <strong>250</strong>
                <EcoPointIcon size={36} className="landing-phone__coin" />
              </div>
              <div className="landing-phone__impact">
                <div>
                  <strong>12.5 kg</strong>
                  <span>Residuos</span>
                </div>
                <div>
                  <strong>8.7 kg</strong>
                  <span>CO2 evitado</span>
                </div>
              </div>
              <div className="landing-phone__chart">
                <LineChartPanel data={DEMO_SERIE} />
              </div>
            </div>
          </m.div>
        </m.div>
      </section>

      <section id="producto" className="landing-section">
        <m.div className="landing-section__hdr" {...fadeUp}>
          <h2>Plataforma integral de sostenibilidad</h2>
          <p>Un solo ecosistema para operar, medir y escalar programas RSE.</p>
        </m.div>
        <div className="landing-features">
          {[
            {
              icon: "qr",
              title: "ECOO POINT",
              desc: "QR unicos con reglas dinamicas, expiracion y tracking anti-fraude.",
            },
            {
              icon: "shield",
              title: "Validacion corporativa",
              desc: "Evidencia fotografica y moderacion antes de acreditar puntos.",
            },
            {
              icon: "chart",
              title: "Analytics ejecutivos",
              desc: "KPIs, tendencias, rankings y reportes para comites RSE.",
            },
            {
              icon: "gift",
              title: "Recompensas y canje",
              desc: "ECOO POINTS canjeables con validacion QR en comercios aliados.",
            },
          ].map((f, i) => (
            <m.article
              key={f.title}
              className="landing-feature ec-glass"
              {...fadeUp}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <div className="landing-feature__icon">
                <Icon name={f.icon} size={26} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </m.article>
          ))}
        </div>
      </section>

      <section
        id="analytics"
        className="landing-section landing-analytics ec-dots-bg"
      >
        <m.div className="landing-section__hdr" {...fadeUp}>
          <h2>Analytics que impulsan decisiones</h2>
          <p>
            Visualiza impacto ambiental, engagement y conversion QR en tiempo
            real.
          </p>
        </m.div>
        <div className="landing-charts">
          <ChartCard title="Tendencia de reciclajes" subtitle="Ultimos 6 meses">
            <LineChartPanel data={DEMO_SERIE} />
          </ChartCard>
          <ChartCard
            title="Materiales recuperados"
            subtitle="Por tipo de residuo"
          >
            <BarChartPanel data={DEMO_BARS} color="#66bb6a" />
          </ChartCard>
        </div>
        <div className="landing-stats-row">
          <KpiCard label="CO2 evitado" value={1284} suffix=" kg" icon="tree" />
          <KpiCard label="ECOO POINTS" value={45200} icon="coin" />
          <KpiCard label="Empresas activas" value={24} icon="building" />
          <KpiCard label="Ciudadanos" value={1200} icon="users" />
        </div>
      </section>

      <section id="rse" className="landing-section landing-rse">
        <EcoWaves variant="footer" />
        <m.div className="landing-rse__content" {...fadeUp}>
          <h2>Responsabilidad Social Empresarial (RSE)</h2>
          <p className="landing-lead">
            La RSE integra criterios ambientales, sociales y de gobernanza
            (ESG). ECOO operacionaliza el pilar ambiental con datos auditables y
            engagement ciudadano.
          </p>
          <div className="landing-rse__grid">
            {[
              {
                icon: "target",
                title: "Por que importa",
                items: [
                  "Cumplimiento ESG y reporting",
                  "Reputacion y confianza B2B",
                  "Retencion de talento",
                ],
              },
              {
                icon: "factory",
                title: "Beneficios empresariales",
                items: [
                  "Tableros RSE en vivo",
                  "Campanas y rankings",
                  "Exportacion de impacto",
                ],
              },
              {
                icon: "globe",
                title: "Beneficio ambiental",
                items: [
                  "Trazabilidad de residuos",
                  "CO2 evitado medible",
                  "Economia circular",
                ],
              },
            ].map((block) => (
              <article key={block.title} className="landing-rse__card ec-glass">
                <h3>
                  <Icon name={block.icon} size={20} /> {block.title}
                </h3>
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </m.div>
      </section>

      <section id="como" className="landing-section">
        <h2>Como funciona ECOO</h2>
        <ol className="landing-steps">
          {[
            "La empresa configura reglas y descarga QR ECOO POINT",
            "El ciudadano escanea, declara y sube evidencia",
            "Moderacion aprueba y acredita ECOO POINTS",
            "Canje en comercios con validacion QR o codigo",
          ].map((step, i) => (
            <m.li key={step} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <span>{i + 1}</span>
              <p>{step}</p>
            </m.li>
          ))}
        </ol>
      </section>

      <section id="faq" className="landing-section">
        <h2>Preguntas frecuentes</h2>
        <div className="landing-faq">
          {[
            {
              q: "Que son los ECOO POINTS?",
              a: "Moneda ecologica acreditada tras validar cada accion de reciclaje verificada.",
            },
            {
              q: "Como validan los comercios?",
              a: "Escaneando el QR del cupon o ingresando el codigo en el panel de caja.",
            },
            {
              q: "Las empresas pueden descargar QR?",
              a: "Si, en PNG, SVG e impresion directa desde el panel RSE.",
            },
          ].map((item) => (
            <details key={item.q} className="landing-faq__item ec-glass">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <m.div className="landing-cta__inner ec-glass" {...fadeUp}>
          <EcoPointIcon size={56} />
          <h2>Escala tu programa de sostenibilidad hoy</h2>
          <p>Enterprise-ready. Seguro. Medible. Listo para produccion.</p>
          <Link to="/register">
            <Button size="lg" icon="chevronRight" iconRight="chevronRight">
              Crear cuenta
            </Button>
          </Link>
        </m.div>
      </section>

      <footer className="landing-footer">
        <BrandLogo height={32} />
        <p>ECOO · Convierte tus acciones sostenibles en recompensas reales</p>
        <div className="landing-footer__links">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
          <a href="#producto">Explorar ECOO</a>
        </div>
      </footer>
    </div>
  );
}