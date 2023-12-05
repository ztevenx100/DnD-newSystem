import React, { useContext } from 'react';
import { useBackground } from '../../App';

import "./Home.css";
import homeBackground from '../../assets/img/jpg/bg-home-03.jpg';

const Home: React.FC = () => {
  const { setBackgroundImage } = useBackground();

  // Cambia la imagen de fondo cuando el componente se monta
  setBackgroundImage(homeBackground);

  return (
    <div className="bg-home">
      <article className='min-h-screen grid grid-cols-2 gap-2 p-2'>
        <header className='home-header col-span-2 flex items-center justify-center '>
          <h1 className='text-light'>El azar de las dos manos</h1>
        </header>

        <section id="description" className="home-section col-start-2">
          <h2>Descripción del Sistema</h2>
          <p>
            En el mundo de fantasía de Renascentia, dos dioses opuestos gobiernan: el Dios del Orden y el Dios del Caos. 
            La sociedad se divide en dos facciones, cada una adorando a su respectivo dios y siguiendo sus principios. 
            Estos bandos mantienen una neutralidad frágil, con una leve discriminación hacia el otro. Sin embargo, una facción oculta llamada "Corrupción" se opone a ambos dioses.
            Son inescrupulosos y buscan desestabilizar y corromper el mundo.
          </p>
          <p>
            Los humanos de este mundo son bendecidos con un emblema que les otorga poder. Este poder se basa en un sistema de magia, donde a medida que los personajes suben de nivel, 
            obtienen anillos de poder que les brindan habilidades específicas basadas en las propiedades del anillo, como Fuerza, Inteligencia, Destreza, Sanidad, Creación y Soporte.
          </p>
          <p>
            Los jugadores son los elegidos de los dioses y se les ha otorgado una gema opaca que contiene habilidades misteriosas. 
            A medida que avancen en la historia, los protagonistas deberán descubrir el poder de sus gemas para enfrentar las amenazas futuras y elegir qué facción, Orden o Caos, 
            es la más adecuada para ellos. Enfrentarán desafíos, misiones y batallas mientras exploran el mundo de Renascentia. Además, deberán descubrir y enfrentar la amenaza de la facción oculta de la Corrupción, 
            que busca destruir el equilibrio entre el Orden y el Caos.
          </p>
        </section>
        <section id="system" className="home-section col-start-2">
          <p>
            En el azar de las dos manos, se utiliza un sistema mixto de dados, dados D6 y un dado D20, siendo los D6 utilizados para respaldar el lanzamiento del D20, 
            pues los jugadores deberán realizar acciones increíbles o en algunos casos casi “milagrosas”, o en el uso de sus habilidades y el efecto que estos provoca.
          </p>
        </section>

      </article>
      <article className='min-h-screen grid grid-cols-3 gap-2 p-2'>
        <section id="world" className="home-section col-span-3">
          <h2>Mundo</h2>
          <p>
            El mundo de Renascentia es un mundo de fantasía medieval, dividido en dos facciones: 
            el Orden y el Caos. Estas facciones representan los dos extremos del espectro de la existencia, y su equilibrio es fundamental para la paz y la prosperidad del mundo.
          </p>
          <p>
            El Orden es una facción que representa la estabilidad, la tradición y la ley. Sus miembros creen en un mundo ordenado y estructurado, y trabajan para mantener el status quo.
          </p>
          <p>
            El Caos es una facción que representa el cambio, la innovación y la libertad. Sus miembros creen en un mundo en constante evolución, y trabajan para romper las reglas y desafiar el orden establecido.
          </p>
          <p>
            En medio de estas dos facciones se encuentra una facción oculta llamada la Corrupción. La Corrupción es una fuerza maligna que busca destruir el equilibrio entre el Orden y el Caos. 
            Sus miembros son inescrupulosos y no dudan en recurrir a la violencia y la destrucción para lograr sus objetivos.
          </p>
        </section>
        <section id="villagesOrder" className="home-section">
          <h2>Pueblos del Orden</h2>
          <p>
            Los pueblos del Orden son prósperos y bien organizados. Las calles están limpias y bien cuidadas, y los edificios son altos y majestuosos. Los habitantes del Orden son educados y respetuosos de la ley.
          </p>
          <p>
            Los pueblos del Orden suelen estar ubicados en zonas fértiles y prósperas. Las casas están construidas con materiales de alta calidad, como piedra y madera. Las calles están pavimentadas y bien iluminadas. 
            Los habitantes del Orden suelen vestir ropa formal y elegante.
          </p>
          <p>
            La sociedad del Orden está organizada en una jerarquía estricta. Los nobles ocupan los puestos más altos, seguidos por los comerciantes, los artesanos y los campesinos. El gobierno del Orden es una monarquía absoluta. 
            El rey o la reina tiene el poder absoluto sobre el reino.
          </p>
        </section>
        <section id="villagesCaos" className="home-section">
          <h2>Pueblos del Caos</h2>
          <p>
            Los pueblos del Caos son caóticos y vibrantes. Las calles están llenas de vida y las personas son libres de expresarse como quieran. Los habitantes del Caos son creativos e innovadores.
          </p>
          <p>
            Los pueblos del Caos suelen estar ubicados en zonas montañosas o boscosas. Las casas están construidas con materiales sencillos, como madera y paja. Las calles son estrechas y sinuosas. 
            Los habitantes del Caos suelen vestir ropa informal y cómoda.
          </p>
          <p>
            La sociedad del Caos es más igualitaria que la del Orden. No hay una jerarquía estricta, y todos los ciudadanos tienen la oportunidad de prosperar. El gobierno del Caos es una democracia. 
            El pueblo elige a sus representantes, que gobiernan en nombre del pueblo.
          </p>
        </section>
        <section id="villagesCorruption" className="home-section">
          <h2>Pueblos de la Corrupción</h2>
          <p>
            Los pueblos de la “Corrupción” son oscuros y siniestros. Las calles están llenas de peligros y las personas son crueles y despiadadas. Los habitantes son corruptos y malvados.
          </p>
          <p>
            Además, estos suelen estar ubicados en zonas remotas y peligrosas. Las casas están construidas con materiales ruinosos, como piedra y ladrillo. Las calles están llenas de escombros y basura, y en sus vestimentas reflejan la oscuridad misma. 
          </p>
          <p>
            En últimas esta ciudad se maneja bajo una dictadura, un líder tiránico controla a la población con mano de hierro. El pueblo es sometido a la opresión y el sufrimiento.
          </p>
        </section>
      </article>
    </div>
  );
};

export default Home;