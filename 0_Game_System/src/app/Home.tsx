import React, { useEffect } from 'react';

import "./Home.css";
import homeBackground from '@img/webp/bg-home-03.webp';

// Imagenes temporales - Reemplazar con imágenes reales
const orderCityPlaceholder = "https://images.unsplash.com/photo-1596825205494-50489906c003?q=80&w=800&auto=format&fit=crop";
const chaosCityPlaceholder = "https://images.unsplash.com/photo-1560269507-c4e1da5adae1?q=80&w=800&auto=format&fit=crop";
const corruptionCityPlaceholder = "https://images.unsplash.com/photo-1618390944943-93cccf3cf231?q=80&w=800&auto=format&fit=crop";
const worldMapPlaceholder = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop";

interface HomeProps {
  changeBackground: (newBackground: string) => void;
}

const Home: React.FC<HomeProps> = ({ changeBackground }) => {
  useEffect(() => {
    changeBackground(homeBackground);
  }, [changeBackground]);

  return (
    <div className="bg-home">
      <div className="home-container">
        {/* Header Principal */}
        <header className="home-header">
          <h1>El azar de las dos manos</h1>
          <p>Un mundo donde el Orden y el Caos se enfrentan en una batalla eterna</p>
        </header>

        <nav className="main-nav" aria-label="Navegación principal">
          <ul>
            <li><a href="#sistema">Sistema de Juego</a></li>
            <li><a href="#mundo">Mundo</a></li>
            <li><a href="#facciones">Facciones</a></li>
          </ul>
        </nav>

        {/* Sección de Introducción */}
        <div className="intro-section">
          <div className="intro-content">
            <section className="home-section" id="sistema">
              <h2>Descripción del Sistema</h2>
              <p>
                En el mundo de fantasía de <strong>Renascentia</strong>, dos dioses opuestos gobiernan: el Dios del Orden y el Dios del Caos. 
                La sociedad se divide en dos facciones, cada una adorando a su respectivo dios y siguiendo sus principios. 
                Estos bandos mantienen una neutralidad frágil, con una leve discriminación hacia el otro. Sin embargo, una facción oculta llamada <em>"Corrupción"</em> se opone a ambos dioses.
                Son inescrupulosos y buscan desestabilizar y corromper el mundo.
              </p>
              <p>
                Los humanos de este mundo son bendecidos con un emblema que les otorga poder. Este poder se basa en un sistema de magia, donde a medida que los personajes suben de nivel, 
                obtienen anillos de poder que les brindan habilidades específicas basadas en las propiedades del anillo, como Fuerza, Inteligencia, Destreza, Sanidad, Creación y Soporte.
              </p>
              <p>
                Los jugadores son los elegidos de los dioses y se les ha otorgado una gema opaca que contiene habilidades misteriosas. 
                A medida que avancen en la historia, los protagonistas deberán descubrir el poder de sus gemas para enfrentar las amenazas futuras y elegir qué facción 
                es la más adecuada para ellos.
              </p>
            </section>

            <div className="system-section">
              <h3>Mecánica de Juego</h3>
              <p>
                <strong>Sistema de juego:</strong> "El azar de las dos manos" utiliza un sistema mixto de dados, combinando D6 y D20. 
                Los dados D6 se utilizan para respaldar el lanzamiento del D20, permitiendo a los jugadores realizar acciones increíbles 
                o incluso "milagrosas" en el uso de sus habilidades y los efectos que estos provocan.
              </p>
            </div>
          </div>
            {/* Imagen del mundo o mapa */}
          <div className="intro-image" aria-hidden="true">
            <img src={worldMapPlaceholder} alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Sección de Mundo */}
        <h2 className="world-title" id="mundo">El Mundo de Renascentia</h2>
        <section className="home-section world-section">
          <div className="world-description">
            <div className="world-overview">
              <p>
                El mundo de Renascentia es un reino de fantasía medieval, dividido en dos grandes facciones: 
                el Orden y el Caos. Estas facciones representan los dos extremos del espectro de la existencia, 
                y su equilibrio es fundamental para la paz y la prosperidad del mundo.
              </p>
            </div>
            
            <div className="factions-overview">
              <div className="faction-brief order-brief">
                <h3>El Orden</h3>
                <p>
                  Es una facción que representa la estabilidad, la tradición y la ley. 
                  Sus miembros creen en un mundo ordenado y estructurado, y trabajan para mantener el status quo.
                </p>
              </div>
              
              <div className="faction-brief chaos-brief">
                <h3>El Caos</h3>
                <p>
                  Es una facción que representa el cambio, la innovación y la libertad. 
                  Sus miembros creen en un mundo en constante evolución, y trabajan para romper las reglas y desafiar el orden establecido.
                </p>
              </div>
              
              <div className="faction-brief corruption-brief">
                <h3>La Corrupción</h3>
                <p>
                  Es una facción oculta que busca destruir el equilibrio entre el Orden y el Caos. 
                  Sus miembros son inescrupulosos y no dudan en recurrir a la violencia y la destrucción para lograr sus objetivos.
                </p>
              </div>
            </div>
          </div>
        </section>
          {/* Sección de Facciones */}
        <h2 className="factions-title" id="facciones">Las Facciones de Renascentia</h2>
        <div className="factions-container">
          {/* Facción del Orden */}
          <article className="faction-card faction-order">
            <h3>Pueblos del Orden</h3>
            <div className="image-container">
              <img src={orderCityPlaceholder} alt="Ciudad del Orden - arquitectura organizada y monumental" />
            </div>
            <div className="faction-content">
              <p>
                <strong>Los pueblos del Orden</strong> son prósperos y bien organizados. Las calles están limpias y bien cuidadas, 
                y los edificios son altos y majestuosos. Los habitantes son educados y respetuosos de la ley.
              </p>
              <p>
                Sus asentamientos suelen ubicarse en zonas fértiles y prósperas. Las construcciones utilizan materiales de alta calidad, 
                como piedra y madera noble. Las calles están pavimentadas y bien iluminadas.
              </p>
              <p>
                La sociedad está organizada en una jerarquía estricta bajo una monarquía absoluta. 
                El rey o la reina tiene el poder absoluto sobre el reino, manteniendo tradiciones milenarias.
              </p>
            </div>
            <div className="faction-traits" aria-label="Características de la facción">
              <span className="faction-trait">Estabilidad</span>
              <span className="faction-trait">Tradición</span>
              <span className="faction-trait">Prosperidad</span>
            </div>
          </article>

          {/* Facción del Caos */}
          <article className="faction-card faction-chaos">
            <h3>Pueblos del Caos</h3>
            <div className="image-container">
              <img src={chaosCityPlaceholder} alt="Ciudad del Caos - arquitectura orgánica y diversa" />
            </div>
            <div className="faction-content">
              <p>
                <strong>Los pueblos del Caos</strong> son vibrantes y llenos de vida. Las calles rebosan de actividad y las personas son libres 
                de expresarse como quieran. Los habitantes son creativos e innovadores.
              </p>
              <p>
                Suelen estar ubicados en zonas montañosas o boscosas. Las casas están construidas con materiales sencillos, 
                como madera y paja. Las calles son estrechas y sinuosas formando patrones orgánicos.
              </p>
              <p>
                La sociedad es igualitaria bajo un sistema democrático. No hay una jerarquía estricta, 
                y todos los ciudadanos tienen la oportunidad de prosperar y expresar su individualidad.
              </p>
            </div>
            <div className="faction-traits" aria-label="Características de la facción">
              <span className="faction-trait">Libertad</span>
              <span className="faction-trait">Innovación</span>
              <span className="faction-trait">Creatividad</span>
            </div>
          </article>

          {/* Facción de la Corrupción */}
          <article className="faction-card faction-corruption">
            <h3>Pueblos de la Corrupción</h3>
            <div className="image-container">
              <img src={corruptionCityPlaceholder} alt="Ciudad de la Corrupción - arquitectura sombría y decadente" />
            </div>
            <div className="faction-content">
              <p>
                <strong>Los pueblos de la Corrupción</strong> son oscuros y siniestros. Las calles están llenas de peligros 
                y las personas son crueles y despiadadas. Los habitantes viven en un constante estado de temor.
              </p>
              <p>
                Estos asentamientos suelen estar ubicados en zonas remotas y peligrosas. Las estructuras están construidas con 
                materiales ruinosos, y las calles están llenas de escombros y abandonadas a la decadencia.
              </p>
              <p>
                Esta sociedad se maneja bajo una dictadura brutal donde un líder tiránico controla a la población con mano de hierro. 
                El pueblo es sometido a constante opresión y sufrimiento para alimentar oscuros propósitos.
              </p>
            </div>
            <div className="faction-traits" aria-label="Características de la facción">
              <span className="faction-trait">Poder</span>
              <span className="faction-trait">Destrucción</span>
              <span className="faction-trait">Opresión</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Home;