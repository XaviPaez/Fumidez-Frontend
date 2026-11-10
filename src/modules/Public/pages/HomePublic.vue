<template>
  <div class="public-home">

    <PublicHeader />

    <!-- ===================================================== -->
    <!-- HERO MULTIMEDIA -->
    <!-- ===================================================== -->

    <section
      id="inicio"
      class="hero"
    >
      <div class="hero-media">

        <template v-if="heroActual">

          <video
            v-if="heroActual.tipo === 'video'"
            :key="heroActual.src"
            class="hero-media-element"
            :src="heroActual.src"
            :autoplay="!movimientoReducido"
            muted
            loop
            playsinline
          ></video>

          <img
            v-else
            :key="heroActual.src"
            class="hero-media-element"
            :src="heroActual.src"
            alt="FUMIDEZ en campo"
          />

        </template>

      </div>

      <div class="hero-overlay"></div>

      <div class="hero-grid">

        <div class="hero-copy reveal">
          <div class="hero-kicker">
            <span></span>
            FUMIGADORA DEL ECUADOR · DESDE 1989
          </div>

          <h1>
            Protección técnica para
            <span>espacios más seguros.</span>
          </h1>

          <p class="hero-lead">
            Control de plagas, saneamiento ambiental y limpieza técnica
            para hogares, empresas e industrias en todo el Ecuador.
          </p>

          <div class="hero-actions">
            <button
              type="button"
              class="button-primary"
              @click="irContacto"
            >
              <i class="bi bi-calendar2-check"></i>
              Solicitar inspección gratuita
            </button>

            <button
              type="button"
              class="button-secondary"
              @click="irServicios"
            >
              Conocer nuestros servicios
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="hero-trust">
            <div>
              <i class="bi bi-patch-check-fill"></i>
              Productos autorizados
            </div>

            <div>
              <i class="bi bi-person-check-fill"></i>
              Personal técnico calificado
            </div>

            <div>
              <i class="bi bi-geo-alt-fill"></i>
              Cobertura nacional
            </div>
          </div>
        </div>

        <aside class="hero-experience reveal">
          <span class="hero-experience-label">
            EXPERIENCIA REAL
          </span>

          <strong>
            Trabajamos donde nuestros clientes nos necesitan.
          </strong>

          <p>
            Conoce intervenciones reales de FUMIDEZ en entornos
            industriales, comerciales, institucionales y residenciales.
          </p>

          <div class="hero-counter">
            <span>{{ heroIndex + 1 }}</span>
            <small>/ {{ heroMedia.length }}</small>
          </div>

          <div class="hero-slider-actions">
            <button
              type="button"
              aria-label="Multimedia anterior"
              @click="heroAnterior"
            >
              <i class="bi bi-arrow-left"></i>
            </button>

            <button
              type="button"
              aria-label="Siguiente multimedia"
              @click="heroSiguiente"
            >
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </aside>

      </div>

      <div class="hero-progress">
        <button
          v-for="(item, index) in heroMedia"
          :key="item.path"
          type="button"
          :class="{ active: index === heroIndex }"
          :aria-label="`Ver portada ${index + 1}`"
          @click="seleccionarHero(index)"
        ></button>
      </div>

      <div class="hero-metrics">
        <article>
          <strong>+35</strong>
          <span>Años de experiencia</span>
        </article>

        <article>
          <strong>1989</strong>
          <span>Fundada en Quito</span>
        </article>

        <article>
          <strong>360°</strong>
          <span>Prevención, control y seguimiento</span>
        </article>

        <article>
          <strong>Nacional</strong>
          <span>Cobertura en Ecuador</span>
        </article>
      </div>
    </section>


    <!-- ===================================================== -->
    <!-- VALOR -->
    <!-- ===================================================== -->

    <section class="value-section">
      <div class="content-container value-grid">

        <article
          v-for="item in valores"
          :key="item.titulo"
          class="value-card reveal"
        >
          <div class="value-icon">
            <i
              class="bi"
              :class="item.icono"
            ></i>
          </div>

          <div>
            <strong>{{ item.titulo }}</strong>
            <p>{{ item.descripcion }}</p>
          </div>

          <span class="card-accent"></span>
        </article>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- EMPRESA -->
    <!-- ===================================================== -->

    <nav class="solutions-shortcuts content-container" aria-label="Consulta rápida de servicios">
      <span>¿Cómo podemos ayudarte?</span>
      <button v-for="servicio in servicios" :key="servicio.id" type="button"
        @click="prepararConsulta(servicio.nombre)">
        {{ servicio.nombre }} <i class="bi bi-arrow-up-right"></i>
      </button>
    </nav>

    <section
      id="nosotros"
      class="section about-section"
    >
      <div class="content-container about-grid">

        <div class="about-media reveal">

          <div class="about-main media-hover">
            <component
              :is="esVideo(aboutPrincipal) ? 'video' : 'img'"
              v-if="aboutPrincipal"
              :src="aboutPrincipal.src"
              v-bind="esVideo(aboutPrincipal)
                ? { autoplay: !movimientoReducido, muted: true, loop: true, playsinline: true }
                : { alt: 'FUMIDEZ en campo' }"
            />
            <div class="media-shade"></div>
          </div>

          <div class="about-secondary media-hover">
            <component
              :is="esVideo(aboutSecundaria) ? 'video' : 'img'"
              v-if="aboutSecundaria"
              :src="aboutSecundaria.src"
              v-bind="esVideo(aboutSecundaria)
                ? { muted: true, loop: true, playsinline: true }
                : { alt: 'Trabajo técnico FUMIDEZ' }"
            />
            <div class="media-shade"></div>
          </div>

          <div class="about-experience">
            <strong>+35</strong>
            <span>años de experiencia</span>
          </div>

        </div>

        <div class="about-copy reveal">
          <span class="eyebrow">
            QUIÉNES SOMOS
          </span>

          <h2>
            Experiencia técnica que
            <span>protege tu operación.</span>
          </h2>

          <p class="lead">
            FUMIDEZ es una empresa ecuatoriana fundada en Quito en 1989,
            especializada en control de plagas, saneamiento ambiental
            y limpieza técnica.
          </p>

          <p>
            Nuestro enfoque combina inspección, prevención, tratamiento,
            monitoreo e informes para construir soluciones ajustadas
            a las necesidades de cada instalación.
          </p>

          <div class="about-points">
            <div>
              <i class="bi bi-check-circle-fill"></i>
              Personal técnico calificado
            </div>

            <div>
              <i class="bi bi-check-circle-fill"></i>
              Procedimientos profesionales
            </div>

            <div>
              <i class="bi bi-check-circle-fill"></i>
              Productos autorizados
            </div>

            <div>
              <i class="bi bi-check-circle-fill"></i>
              Atención a nivel nacional
            </div>
          </div>

          <button
            type="button"
            class="text-link"
            @click="irGaleria"
          >
            Conocer FUMIDEZ en acción
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- VIDEO CORPORATIVO / EXPERIENCIA -->
    <!-- ===================================================== -->

    <section
      v-if="videoPrincipal"
      class="section video-story-section"
    >
      <div class="content-container video-story-grid">

        <div class="video-story-copy reveal">
          <span class="eyebrow">
            FUMIDEZ EN CAMPO
          </span>

          <h2>
            Conoce nuestro trabajo
            <span>desde adentro.</span>
          </h2>

          <p>
            Mira al equipo FUMIDEZ trabajando en situaciones reales.
            Esta pieza audiovisual forma parte del material oficial
            entregado por la empresa.
          </p>

          <div class="video-story-points">
            <div>
              <i class="bi bi-check-circle-fill"></i>
              Personal técnico en operación
            </div>

            <div>
              <i class="bi bi-check-circle-fill"></i>
              Procedimientos profesionales
            </div>

            <div>
              <i class="bi bi-check-circle-fill"></i>
              Experiencia real en campo
            </div>
          </div>
        </div>

        <div
          class="video-story-player reveal"
          @click="abrirLightbox([videoPrincipal], 0)"
        >
          <video
            :src="videoPrincipal.src"
            muted
            autoplay
            loop
            playsinline
            preload="metadata"
          ></video>

          <div class="video-story-overlay"></div>

          <div class="video-story-play">
            <i class="bi bi-play-fill"></i>
          </div>

          <div class="video-story-caption">
            <span>VIDEO FUMIDEZ</span>
            <strong>Ver en pantalla completa</strong>
          </div>
        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- SERVICIOS -->
    <!-- ===================================================== -->

    <section
      id="servicios"
      class="section services-section"
    >
      <div class="content-container">

        <div class="section-heading reveal">
          <span class="eyebrow">
            NUESTROS SERVICIOS
          </span>

          <h2>
            Soluciones profesionales para
            <span>cada necesidad.</span>
          </h2>

          <p>
            Cada servicio muestra trabajos reales realizados por FUMIDEZ.
            Haz clic para explorar su galería completa.
          </p>
        </div>

        <div class="services-grid">

          <article
            v-for="servicio in servicios"
            :key="servicio.id"
            class="visual-card service-card reveal"
            @click="abrirCategoria(servicio)"
          >
            <img
              v-if="portadaServicio(servicio)"
              :src="portadaServicio(servicio).src"
              :alt="servicio.nombre"
              loading="lazy"
            />

            <div class="visual-overlay"></div>

            <span class="visual-number">
              {{ servicio.numero }}
            </span>

            <span class="visual-count">
              <i class="bi bi-images"></i>
              {{ mediaCategoria(servicio.categoriaMedia).length }}
            </span>

            <div class="visual-content">
              <span class="visual-label">
                {{ servicio.categoria }}
              </span>

              <h3>
                {{ servicio.nombre }}
              </h3>

              <p>
                {{ servicio.descripcion }}
              </p>

              <div class="service-actions">
                <button type="button" class="visual-action" @click.stop="abrirCategoria(servicio)">
                  Ver trabajos reales <i class="bi bi-arrow-right"></i>
                </button>
                <a class="service-quote" :href="enlaceWhatsapp(servicio.nombre)"
                  target="_blank" rel="noopener noreferrer" @click.stop
                  :aria-label="`Consultar sobre ${servicio.nombre} por WhatsApp`">
                  <i class="bi bi-whatsapp"></i> Consultar
                </a>
              </div>

              <span class="visual-line"></span>
            </div>
          </article>

        </div>
      </div>
    </section>


    <!-- ===================================================== -->
    <!-- CLIENTES / CASOS DE ÉXITO -->
    <!-- ===================================================== -->

    <section
      id="casos"
      class="section clients-section"
    >
      <div class="content-container">

        <div class="clients-heading">
          <div>
            <span class="eyebrow light">
              EXPERIENCIA QUE GENERA CONFIANZA
            </span>

            <h2>
              Clientes que confían
              <span>en FUMIDEZ.</span>
            </h2>
          </div>

          <p>
            Nuestra experiencia abarca industria, alimentos, educación,
            comercio, deporte, salud y organizaciones de distintos sectores.
          </p>
        </div>

        <button type="button" class="clients-pause" :aria-pressed="carruselPausado"
          @click="carruselPausado = !carruselPausado">
          <i :class="carruselPausado ? 'bi bi-play-fill' : 'bi bi-pause-fill'"></i>
          {{ carruselPausado ? 'Reanudar logos' : 'Pausar logos' }}
        </button>
        <div class="clients-viewport">

          <div class="clients-track" :class="{ 'is-paused': carruselPausado }">

            <article
              v-for="(cliente, index) in clientesDuplicados"
              :key="cliente.clave"
              :aria-hidden="index >= clientes.length ? 'true' : undefined"
              class="client-card"
            >
              <div class="client-logo-wrap">

                <img
                  v-if="cliente.logo"
                  :src="cliente.logo"
                  :alt="cliente.nombre"
                  loading="lazy"
                  decoding="async"
                  @load="prepararLogo($event)"
                  @error="cliente.logoError = true; $event.target.style.display = 'none'"
                />

                <span v-if="!cliente.logo || cliente.logoError" class="client-monogram">
                  {{ inicialesCliente(cliente.nombre) }}
                </span>

              </div>

              <div class="client-copy">
                <strong>
                  {{ cliente.nombre }}
                </strong>

                <span>
                  Cliente FUMIDEZ
                </span>
              </div>

              <div class="client-hover">
                <i class="bi bi-patch-check-fill"></i>
                Experiencia de servicio
              </div>
            </article>

          </div>

        </div>

        <div class="clients-note">
          <span class="clients-note-line"></span>

          <p>
            La relación comercial con estos clientes fue informada por FUMIDEZ.
            Los logos se muestran únicamente como referencia visual de marca.
          </p>
        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- POR QUÉ FUMIDEZ -->
    <!-- ===================================================== -->

    <section class="section why-section">
      <div class="content-container why-layout">

        <div class="experience-editorial reveal">
          <span class="eyebrow">EXPERIENCIA CON PROPÓSITO</span>
          <p class="experience-statement">Cuidar tu espacio.<br><span>Proteger lo que importa.</span></p>
          <div class="experience-facts">
            <div><strong>1989</strong><span>El inicio de nuestra trayectoria</span></div>
            <div><strong>360°</strong><span>Prevención, control y seguimiento</span></div>
            <div><strong>Ecuador</strong><span>Atención a distintos sectores</span></div>
          </div>
          <button type="button" class="editorial-link" @click="irContacto">
            Conversemos sobre tu espacio <i class="bi bi-arrow-up-right"></i>
          </button>
        </div>

        <div class="why-content reveal">
          <span class="eyebrow light">
            ¿POR QUÉ FUMIDEZ?
          </span>

          <h2>
            Más que un tratamiento:
            <span>una respuesta técnica integral.</span>
          </h2>

          <p class="why-lead">
            Combinamos experiencia, diagnóstico y seguimiento
            para ofrecer soluciones responsables y sostenibles.
          </p>

          <div class="why-grid">
            <article
              v-for="razon in razones"
              :key="razon.titulo"
              class="why-card"
            >
              <i
                class="bi"
                :class="razon.icono"
              ></i>

              <div>
                <h3>{{ razon.titulo }}</h3>
                <p>{{ razon.descripcion }}</p>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- METODOLOGÍA -->
    <!-- ===================================================== -->

    <section class="section process-section">
      <div class="content-container">

        <div class="process-heading reveal">

          <div class="process-heading-left">

            <span class="eyebrow">
              CÓMO TRABAJAMOS
            </span>

            <h2>
              Un proceso claro para
              <span>resultados sostenibles.</span>
            </h2>

          </div>


          <div class="process-heading-right">

            <p>
              Cada intervención sigue una metodología técnica:
              primero entendemos el problema, después definimos la solución,
              ejecutamos el tratamiento y finalmente damos seguimiento.
            </p>


            <div class="process-badge">

              <i class="bi bi-shield-check"></i>

              <div>

                <strong>
                  Metodología FUMIDEZ
                </strong>

                <span>
                  Diagnóstico · Acción · Seguimiento
                </span>

              </div>

            </div>

          </div>

        </div>


        <div class="process-timeline">

          <article
            v-for="(paso, index) in proceso"
            :key="paso.numero"
            class="process-step reveal"
          >

            <div class="process-step-top">

              <div class="process-step-number">
                {{ paso.numero }}
              </div>


              <div
                v-if="index < proceso.length - 1"
                class="process-connector"
              >
                <span></span>
              </div>

            </div>


            <div class="process-step-body">

              <div class="process-step-icon">

                <i
                  class="bi"
                  :class="paso.icono"
                ></i>

              </div>


              <h3>
                {{ paso.titulo }}
              </h3>


              <p>
                {{ paso.descripcion }}
              </p>


              <div class="process-step-footer">

                <span>
                  Paso {{ paso.numero }}
                </span>

                <i class="bi bi-arrow-up-right"></i>

              </div>

            </div>

          </article>

        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- GALERÍA COMPLETA -->
    <!-- ===================================================== -->

    <section
      id="galeria"
      class="section gallery-section"
    >
      <div class="content-container">

        <div class="gallery-heading">
          <div>
            <span class="eyebrow">
              GALERÍA FUMIDEZ
            </span>

            <h2>
              Nuestro trabajo,
              <span>sin filtros.</span>
            </h2>
          </div>

          <div class="gallery-summary">
            <strong>{{ mediaGaleriaUnica.length }}</strong>
            <span>archivos disponibles en galería</span>
          </div>
        </div>

        <div class="gallery-toolbar">
          <button
            type="button"
            :class="{ active: filtroGaleria === 'TODOS' }"
            @click="filtroGaleria = 'TODOS'"
          >
            Todos
            <span>{{ mediaGaleriaUnica.length }}</span>
          </button>

          <button
            v-for="categoria in categoriasGaleria"
            :key="categoria"
            type="button"
            :class="{ active: filtroGaleria === categoria }"
            @click="filtroGaleria = categoria"
          >
            {{ nombreCategoria(categoria) }}
            <span>{{ mediaGaleriaUnica.filter(item => item.categoria === categoria).length }}</span>
          </button>
        </div>

        <div class="gallery-slider">

          <button
            type="button"
            class="slider-arrow slider-arrow-left gallery-arrow"
            @click="desplazarCarrusel('galeria', -1)"
          >
            <i class="bi bi-arrow-left"></i>
          </button>

          <div
            ref="galeriaTrack"
            class="horizontal-track gallery-track"
          >
            <article
              v-for="(item, index) in galeriaFiltrada"
              :key="item.path"
              class="gallery-card visual-card"
              @click="abrirLightbox(galeriaFiltrada, index)"
            >

              <video
                v-if="item.tipo === 'video'"
                :src="item.src"
                muted
                loop
                playsinline
                preload="metadata"
              ></video>

              <img
                v-else
                :src="item.src"
                :alt="nombreCategoria(item.categoria)"
                loading="lazy"
              />

              <div class="visual-overlay"></div>

              <span
                v-if="item.tipo === 'video'"
                class="video-badge"
              >
                <i class="bi bi-play-fill"></i>
                Video
              </span>

              <div class="visual-content gallery-card-content">
                <span class="visual-label">
                  {{ nombreCategoria(item.categoria) }}
                </span>

                <h3>
                  FUMIDEZ en campo
                </h3>

                <div class="visual-action">
                  Ver multimedia
                  <i class="bi bi-arrows-fullscreen"></i>
                </div>

                <span class="visual-line"></span>
              </div>
            </article>
          </div>

          <button
            type="button"
            class="slider-arrow slider-arrow-right gallery-arrow"
            @click="desplazarCarrusel('galeria', 1)"
          >
            <i class="bi bi-arrow-right"></i>
          </button>

        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- SECTORES -->
    <!-- ===================================================== -->

    <section
      id="sectores"
      class="section sectors-section"
    >
      <div class="sector-orb sector-orb-one"></div>
      <div class="sector-orb sector-orb-two"></div>

      <div class="content-container">

        <div class="sectors-heading reveal">

          <div class="sectors-heading-copy">

            <span class="eyebrow light">
              SECTORES QUE ATENDEMOS
            </span>

            <h2>
              Una misma experiencia técnica,
              <span>adaptada a cada entorno.</span>
            </h2>

          </div>


          <div class="sectors-heading-side">

            <p>
              Cada sector tiene riesgos, exigencias y condiciones distintas.
              Por eso ajustamos el diagnóstico, la intervención y el seguimiento
              a la realidad de cada instalación.
            </p>


            <div class="sectors-value">

              <div class="sectors-value-icon">
                <i class="bi bi-grid-1x2"></i>
              </div>

              <div>

                <strong>
                  Cobertura multisectorial
                </strong>

                <span>
                  Hogar · Comercio · Industria · Instituciones
                </span>

              </div>

            </div>

          </div>

        </div>


        <div class="sector-feature-grid">

          <article
            v-for="(sector, index) in sectores"
            :key="sector.nombre"
            class="sector-experience-card reveal"
            :class="{
              'sector-featured': index === 0 || index === 3
            }"
          >

            <div class="sector-graphic">
              <span class="sector-ring ring-one"></span>
              <span class="sector-ring ring-two"></span>
              <span class="sector-diagonal"></span>
            </div>


            <div class="sector-top">

              <span class="sector-index">
                {{ String(index + 1).padStart(2, "0") }}
              </span>


              <div class="sector-icon">

                <i
                  class="bi"
                  :class="sector.icono"
                ></i>

              </div>

            </div>


            <div class="sector-content">

              <span class="sector-kicker">
                {{ sector.enfoque }}
              </span>


              <h3>
                {{ sector.nombre }}
              </h3>


              <p>
                {{ sector.descripcion }}
              </p>


              <div class="sector-hover-content">

                <div class="sector-benefit">

                  <i class="bi bi-check2-circle"></i>

                  <span>
                    {{ sector.valor }}
                  </span>

                </div>


                <button
                  type="button"
                  class="sector-action"
                  @click.stop="irServicios"
                >
                  Ver soluciones

                  <i class="bi bi-arrow-up-right"></i>
                </button>

              </div>

            </div>


            <span class="sector-bottom-line"></span>

          </article>

        </div>


        <div class="sector-footer-cta reveal">

          <div>

            <span class="sector-footer-label">
              ¿TU SECTOR NO APARECE AQUÍ?
            </span>

            <strong>
              Evaluamos instalaciones y necesidades específicas.
            </strong>

          </div>


          <button
            type="button"
            @click="irContacto"
          >
            Consultar con FUMIDEZ

            <i class="bi bi-arrow-right"></i>
          </button>

        </div>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- CTA -->
    <!-- ===================================================== -->

    <section id="preguntas" class="section faq-section">
      <div class="content-container faq-layout">
        <div>
          <span class="eyebrow">ANTES DE COMENZAR</span>
          <h2>Respuestas claras.<br><span>Decisiones con confianza.</span></h2>
          <p>Lo esencial para preparar tu consulta y conocer cómo trabajamos.</p>
          <button type="button" class="editorial-link" @click="irContacto">Tengo otra pregunta <i class="bi bi-arrow-right"></i></button>
        </div>
        <div class="faq-list">
          <details>
            <summary>¿Cómo solicito una evaluación de mi espacio?</summary>
            <p>Selecciona el servicio y el tipo de espacio en el asistente de consulta. Al continuar, se abrirá WhatsApp con un mensaje que podrás revisar antes de enviarlo al equipo de Fumidez.</p>
          </details>
          <details>
            <summary>¿Qué información ayuda a preparar la visita?</summary>
            <p>Indica la ciudad, el tipo de instalación, la situación que observas y las áreas afectadas. Si tienes fotografías, puedes compartirlas directamente en la conversación de WhatsApp.</p>
          </details>
          <details>
            <summary>¿Debo preparar o desocupar las instalaciones?</summary>
            <p>Depende del tratamiento y las condiciones del lugar. Antes de la intervención, solicita al equipo las indicaciones específicas sobre personas, mascotas, alimentos y tiempos de reingreso. No apliques recomendaciones generales sin confirmar el procedimiento.</p>
          </details>
          <details>
            <summary>¿Qué pasa si no sé qué servicio necesito?</summary>
            <p>Elige «Quiero orientación de un especialista» y describe lo que está ocurriendo. El equipo podrá orientarte sobre la evaluación y los siguientes pasos, sin que tengas que identificar por tu cuenta el tratamiento.</p>
          </details>
          <details>
            <summary>¿Dónde puedo consultar mis documentos de servicio?</summary>
            <p>Si tienes una cuenta habilitada, ingresa al Portal clientes con tus credenciales. Allí puedes consultar las órdenes e informes disponibles para tu cuenta.</p>
          </details>
        </div>
      </div>
    </section>

    <section
      id="contacto"
      class="contact-section"
    >
      <div class="contact-pattern"></div>
      <div class="contact-overlay"></div>

      <div class="content-container contact-content reveal">
        <span class="eyebrow light">
          ASISTENTE DE CONSULTA
        </span>

        <h2>
          Un espacio más seguro.
          <span>Empecemos por el tuyo.</span>
        </h2>

        <p>
          Cuéntanos qué está ocurriendo y nuestro equipo
          podrá orientarte sobre la solución más adecuada.
        </p>

        <div class="contact-brief">
          <div class="consultation-heading"><span>01 — Cuéntanos qué necesitas</span><i class="bi bi-chat-square-text"></i></div>
          <label for="consulta-espacio">Tipo de espacio</label>
          <select id="consulta-espacio" v-model="consultaEspacio">
            <option value="">Seleccionar tipo de espacio</option>
            <option>Hogar</option><option>Comercio u oficina</option>
            <option>Industria o bodega</option><option>Institución educativa</option>
            <option>Otro espacio</option>
          </select>
          <label for="consulta-servicio">¿Qué solución necesitas?</label>
          <select id="consulta-servicio" v-model="consultaServicio">
            <option value="">Quiero orientación de un especialista</option>
            <option v-for="servicio in servicios" :key="servicio.nombre" :value="servicio.nombre">{{ servicio.nombre }}</option>
          </select>
          <label for="consulta-ciudad">Ciudad o sector <span>(opcional)</span></label>
          <input id="consulta-ciudad" v-model.trim="consultaCiudad" maxlength="100"
            autocomplete="address-level2" placeholder="Ej. Quito, sector norte" />
          <label for="consulta-detalle">¿Qué has observado? <span>(opcional)</span></label>
          <textarea id="consulta-detalle" v-model.trim="consultaDetalle" rows="3" maxlength="500"
            placeholder="Cuéntanos la situación o las áreas que necesitas atender."></textarea>
          <details class="consultation-preview">
            <summary>02 — Revisar el mensaje que se preparará</summary>
            <p>{{ mensajeConsulta() }}</p>
          </details>
          <p>Sin envíos automáticos. Continúa en WhatsApp y comparte tu consulta cuando estés listo.</p>
        </div>

        <div class="contact-actions">
          <a
            :href="enlaceWhatsapp()"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-whatsapp"
          >
            <i class="bi bi-whatsapp"></i>
            Continuar en WhatsApp
          </a>

          <a
            href="tel:+593995770087"
            class="contact-phone"
          >
            <i class="bi bi-telephone"></i>
            099 577 0087
          </a>
        </div>
      </div>
    </section>


    <!-- ===================================================== -->
    <!-- FOOTER -->
    <!-- ===================================================== -->

    <footer class="public-footer">
      <div class="content-container footer-grid">

        <div class="footer-brand">
          <img
            src="/fumidez_logo.png"
            alt="FUMIDEZ"
          />

          <p>
            Control de plagas, saneamiento ambiental
            y limpieza técnica.
          </p>

          <span>
            Ecuador · Desde 1989
          </span>
        </div>

        <div class="footer-column">
          <strong>Empresa</strong>

          <button @click="irSeccion('nosotros')">
            Quiénes somos
          </button>

          <button @click="irSeccion('casos')">
            Experiencia en campo
          </button>

          <button @click="irSeccion('galeria')">
            Galería
          </button>
        </div>

        <div class="footer-column">
          <strong>Servicios</strong>

          <button @click="irSeccion('servicios')">
            Fumigación
          </button>

          <button @click="irSeccion('servicios')">
            Desratización
          </button>

          <button @click="irSeccion('servicios')">
            Desinfección
          </button>

          <button @click="irSeccion('servicios')">
            Limpieza técnica
          </button>
        </div>

        <div class="footer-column">
          <strong>Contacto</strong>

          <a href="tel:+593995770087">
            <i class="bi bi-telephone"></i>
            099 577 0087
          </a>

          <button @click="$router.push('/login')">
            <i class="bi bi-person-circle"></i>
            Portal clientes
          </button>
        </div>
      </div>

      <div class="content-container footer-bottom">
        <span>
          © {{ anioActual }} FUMIDEZ · Fumigadora del Ecuador
        </span>

        <span>
          Protegemos lo que más te importa
        </span>
      </div>
    </footer>


    <!-- ===================================================== -->
    <!-- WHATSAPP FLOTANTE -->
    <!-- ===================================================== -->

    <a
      :href="enlaceWhatsapp()"
      target="_blank"
      rel="noopener noreferrer"
      class="floating-whatsapp"
      aria-label="Contactar por WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
    </a>


    <!-- ===================================================== -->
    <!-- LIGHTBOX COMPLETO -->
    <!-- ===================================================== -->

    <transition name="lightbox">
      <div
        v-if="lightboxAbierto"
        class="lightbox-backdrop"
        @click.self="cerrarLightbox"
      >
        <div class="lightbox-shell">

          <div class="lightbox-topbar">
            <div>
              <span>
                {{ nombreCategoria(lightboxActual?.categoria) }}
              </span>

              <strong>
                {{ lightboxIndex + 1 }} / {{ lightboxItems.length }}
              </strong>
            </div>

            <button
              type="button"
              aria-label="Cerrar"
              @click="cerrarLightbox"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="lightbox-viewer">

            <button
              type="button"
              class="lightbox-nav previous"
              @click="lightboxAnterior"
            >
              <i class="bi bi-arrow-left"></i>
            </button>

            <video
              v-if="lightboxActual?.tipo === 'video'"
              :key="lightboxActual.src"
              :src="lightboxActual.src"
              controls
              autoplay
              playsinline
            ></video>

            <img
              v-else-if="lightboxActual"
              :key="lightboxActual.src"
              :src="lightboxActual.src"
              alt="Trabajo FUMIDEZ"
            />

            <button
              type="button"
              class="lightbox-nav next"
              @click="lightboxSiguiente"
            >
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

          <div class="lightbox-thumbs">
            <button
              v-for="(item, index) in lightboxItems"
              :key="item.path"
              type="button"
              :class="{ active: index === lightboxIndex }"
              @click="lightboxIndex = index"
            >
              <video
                v-if="item.tipo === 'video'"
                :src="item.src"
                muted
                preload="metadata"
              ></video>

              <img
                v-else
                :src="item.src"
                alt=""
              />

              <span
                v-if="item.tipo === 'video'"
                class="thumb-video"
              >
                <i class="bi bi-play-fill"></i>
              </span>
            </button>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>


<script>
import PublicHeader
  from "../components/PublicHeader.vue";


// =========================================================
// MULTIMEDIA FUMIDEZ
// Coloca la carpeta "Multimedia" del RAR dentro de:
// src/assets/public/Multimedia/
// =========================================================

const multimediaModules =
  import.meta.glob(
    "/src/assets/public/Multimedia/**/*.{jpg,jpeg,png,webp,mp4}",
    {
      eager: true,
      query: "?url",
      import: "default"
    }
  );



// =========================================================
// LOGOS DE CLIENTES
// Carpeta esperada:
// src/assets/public/Clientes/
// =========================================================

const clientesModules =
  import.meta.glob(
    "/src/assets/public/Clientes/**/*.{jpg,jpeg,png,webp}",
    {
      eager: true,
      query: "?url",
      import: "default"
    }
  );


const obtenerLogoCliente = (archivo) => {

  if (!archivo) {

    return null;
  }


  const entrada =
    Object.entries(
      clientesModules
    )
      .find(
        ([path]) =>
          path.endsWith(
            `/${archivo}`
          )
      );


  return entrada
    ? entrada[1]
    : null;
};


const normalizarCategoria = (path) => {

  const partes =
    path.split("/");


  const indice =
    partes.findIndex(
      item =>
        item.toLowerCase() ===
        "multimedia"
    );


  return indice !== -1
    ? partes[indice + 1]
    : "Otros";
};


const detectarTipo = (path) => {

  return path
    .toLowerCase()
    .endsWith(".mp4")
      ? "video"
      : "imagen";
};


const todosLosMedios =
  Object
    .entries(multimediaModules)
    .map(
      ([path, src]) => ({
        path,
        src,
        categoria:
          normalizarCategoria(path),
        tipo:
          detectarTipo(path)
      })
    )
    .sort(
      (a, b) =>
        a.path.localeCompare(
          b.path,
          "es"
        )
    );


export default {

  name:
    "HomePublic",


  components: {
    PublicHeader
  },


  data() {

    return {

      movimientoReducido: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      consultaServicio: "",
      consultaCiudad: "",
      consultaEspacio: "",
      consultaDetalle: "",
      logosPreparados: {},
      carruselPausado: false,

      anioActual:
        new Date()
          .getFullYear(),


      mediaTotal:
        todosLosMedios,


      heroIndex:
        0,


      heroTimer:
        null,


      observer:
        null,


      categoriaActiva:
        "Fumigacion",


      filtroGaleria:
        "TODOS",


      lightboxAbierto:
        false,


      lightboxItems:
        [],


      lightboxIndex:
        0,


      valores: [

        {
          icono:
            "bi-shield-check",
          titulo:
            "Experiencia comprobada",
          descripcion:
            "Más de 35 años brindando soluciones técnicas."
        },

        {
          icono:
            "bi-search",
          titulo:
            "Diagnóstico primero",
          descripcion:
            "Evaluamos antes de recomendar un tratamiento."
        },

        {
          icono:
            "bi-file-earmark-text",
          titulo:
            "Informes y seguimiento",
          descripcion:
            "Documentamos acciones y recomendaciones."
        },

        {
          icono:
            "bi-geo-alt",
          titulo:
            "Cobertura nacional",
          descripcion:
            "Atención para hogares, empresas e instituciones."
        }

      ],


      servicios: [

        {
          id: 1,
          numero: "01",
          categoria:
            "CONTROL DE INSECTOS",
          categoriaMedia:
            "Fumigacion",
          nombre:
            "Fumigación y Control de Insectos",
          descripcion:
            "Tratamientos profesionales adaptados al tipo de plaga, nivel de infestación y características del entorno."
        },

        {
          id: 2,
          numero: "02",
          categoria:
            "CONTROL DE ROEDORES",
          categoriaMedia:
            "Desratizacion",
          nombre:
            "Desratización",
          descripcion:
            "Inspección, identificación de riesgos, estaciones de control, monitoreo y medidas preventivas."
        },

        {
          id: 3,
          numero: "03",
          categoria:
            "SANEAMIENTO",
          categoriaMedia:
            "Desinfeccion",
          nombre:
            "Desinfección Ambiental",
          descripcion:
            "Procedimientos profesionales para mejorar las condiciones sanitarias de ambientes y superficies."
        },

        {
          id: 4,
          numero: "04",
          categoria:
            "LIMPIEZA TÉCNICA",
          categoriaMedia:
            "Lavado de Cisternas",
          nombre:
            "Limpieza y Desinfección de Cisternas",
          descripcion:
            "Retiro de sedimentos, limpieza técnica y desinfección de depósitos destinados al almacenamiento de agua."
        },

        {
          id: 5,
          numero: "05",
          categoria:
            "LIMPIEZA TÉCNICA",
          categoriaMedia:
            "Limpieza de Baños",
          nombre:
            "Limpieza de Baterías Sanitarias",
          descripcion:
            "Limpieza profunda y desinfección profesional de instalaciones sanitarias."
        }

      ],


      casos: [

        {
          id: 1,
          sector:
            "INDUSTRIA",
          titulo:
            "Control profesional en instalaciones productivas",
          categoriaMedia:
            "Fumigacion",
          indiceImagen:
            0,
          descripcion:
            "Intervenciones adaptadas a entornos industriales y áreas críticas de operación.",
          resultado:
            "Aplicación técnica y recomendaciones preventivas."
        },

        {
          id: 2,
          sector:
            "SANEAMIENTO",
          titulo:
            "Desinfección en ambientes de trabajo",
          categoriaMedia:
            "Desinfeccion",
          indiceImagen:
            0,
          descripcion:
            "Procedimientos de saneamiento aplicados a espacios comerciales e institucionales.",
          resultado:
            "Intervención profesional adaptada al entorno."
        },

        {
          id: 3,
          sector:
            "LIMPIEZA TÉCNICA",
          titulo:
            "Mantenimiento sanitario especializado",
          categoriaMedia:
            "Lavado de Cisternas",
          indiceImagen:
            0,
          descripcion:
            "Limpieza técnica de áreas que requieren procedimientos específicos de higiene.",
          resultado:
            "Mejores condiciones de limpieza y mantenimiento."
        }

      ],



      clientes: [

        {
          nombre: "Aglomerados Cotopaxi",
          archivo: "Aglomerados.png"
        },

        {
          nombre: "Edimca",
          archivo: "edimca.png"
        },

        {
          nombre: "Don Tablero",
          archivo: null
        },

        {
          nombre: "Aymesa",
          archivo: "Aymesa.png"
        },

        {
          nombre: "Kubiec",
          archivo: "kubie.png"
        },

        {
          nombre: "Laboratorios Laturi",
          archivo: "LaboratoriosLaturi.png"
        },

        {
          nombre: "Iván Bohman",
          archivo: null
        },

        {
          nombre: "Pollos de la Tri",
          archivo: "PollosTri.webp"
        },

        {
          nombre: "Reyviche",
          archivo: "Reyviche.png"
        },

        {
          nombre: "S.D. Aucas",
          archivo: "Aucas.webp"
        },

        {
          nombre: "Afroviche",
          archivo: "Afroviche.jpg"
        },

        {
          nombre: "Megaviche",
          archivo: "Megaviche.jpg"
        },

        {
          nombre: "P&G",
          archivo: "PyGEc.webp"
        },

        {
          nombre: "Comunidad de Fe",
          archivo: "Comunidad de Fe.jpg"
        },

        {
          nombre: "Fosforera Ecuatoriana",
          archivo: "Fosforera Ecuatoriana.png"
        },

        {
          nombre: "Unichem",
          archivo: "Unichem.jpg"
        },

        {
          nombre: "Conduit del Ecuador",
          archivo: "Conduit.jpg"
        },

        {
          nombre: "ICAP del Ecuador",
          archivo: "ICAP del Ecuador.jpg"
        },

        {
          nombre: "Charles Darwin",
          archivo: "Charles Darwin.jpg"
        },

        {
          nombre: "Fe y Alegría",
          archivo: "Fe y alegría.jpg"
        },

        {
          nombre: "Jama Banana",
          archivo: "Jama.jpeg"
        },

        {
          nombre: "Eton School",
          archivo: "Eton School.jpg"
        },

        {
          nombre: "Grupo Barnuevo",
          archivo: "Grupo Barnuevo.jpg"
        }

      ].map(
        cliente => ({
          ...cliente,

          logo:
            obtenerLogoCliente(
              cliente.archivo
            )
        })
      ),


      razones: [

        {
          icono:
            "bi-award",
          titulo:
            "+35 años de experiencia",
          descripcion:
            "Trayectoria sostenida atendiendo hogares, empresas e instituciones."
        },

        {
          icono:
            "bi-people",
          titulo:
            "Personal técnico calificado",
          descripcion:
            "Procedimientos profesionales adaptados a cada entorno."
        },

        {
          icono:
            "bi-search",
          titulo:
            "Diagnóstico antes de actuar",
          descripcion:
            "Analizamos condiciones y riesgos antes de definir una solución."
        },

        {
          icono:
            "bi-patch-check",
          titulo:
            "Productos autorizados",
          descripcion:
            "Trabajamos con productos y procedimientos adecuados."
        },

        {
          icono:
            "bi-file-earmark-text",
          titulo:
            "Informes y seguimiento",
          descripcion:
            "Documentamos acciones y recomendaciones preventivas."
        },

        {
          icono:
            "bi-geo-alt",
          titulo:
            "Cobertura nacional",
          descripcion:
            "Atención en diferentes sectores y tipos de instalaciones."
        }

      ],


      proceso: [

        {
          numero:
            "01",
          icono:
            "bi-search",
          titulo:
            "Inspeccionamos",
          descripcion:
            "Identificamos condiciones, riesgos, áreas afectadas y posibles causas."
        },

        {
          numero:
            "02",
          icono:
            "bi-clipboard2-check",
          titulo:
            "Diseñamos",
          descripcion:
            "Definimos un plan de acción adaptado al problema y a la instalación."
        },

        {
          numero:
            "03",
          icono:
            "bi-tools",
          titulo:
            "Ejecutamos",
          descripcion:
            "Aplicamos procedimientos profesionales y productos autorizados."
        },

        {
          numero:
            "04",
          icono:
            "bi-graph-up-arrow",
          titulo:
            "Monitoreamos",
          descripcion:
            "Realizamos seguimiento, recomendaciones preventivas e informes."
        }

      ],


      sectores: [

        {
          nombre:
            "Hogares y residencias",
          icono:
            "bi-house",
          enfoque:
            "PROTECCIÓN RESIDENCIAL",
          descripcion:
            "Prevención y control para proteger espacios familiares.",
          valor:
            "Diagnóstico adaptado al entorno del hogar."
        },

        {
          nombre:
            "Restaurantes y alimentos",
          icono:
            "bi-cup-hot",
          enfoque:
            "HIGIENE Y PREVENCIÓN",
          descripcion:
            "Control orientado a entornos con altos requisitos de higiene.",
          valor:
            "Prevención enfocada en áreas sensibles y de manipulación."
        },

        {
          nombre:
            "Oficinas y comercios",
          icono:
            "bi-building",
          enfoque:
            "CONTINUIDAD OPERATIVA",
          descripcion:
            "Soluciones para espacios de atención y trabajo.",
          valor:
            "Intervenciones planificadas para reducir afectación operativa."
        },

        {
          nombre:
            "Empresas e industrias",
          icono:
            "bi-buildings",
          enfoque:
            "CONTROL TÉCNICO",
          descripcion:
            "Programas técnicos adaptados a operaciones productivas.",
          valor:
            "Monitoreo, prevención y seguimiento en áreas críticas."
        },

        {
          nombre:
            "Bodegas y distribución",
          icono:
            "bi-box-seam",
          enfoque:
            "ALMACENAMIENTO SEGURO",
          descripcion:
            "Prevención y monitoreo en almacenamiento y logística.",
          valor:
            "Control preventivo para zonas de almacenamiento y tránsito."
        },

        {
          nombre:
            "Instituciones educativas",
          icono:
            "bi-mortarboard",
          enfoque:
            "ALTA CONCURRENCIA",
          descripcion:
            "Atención preventiva para espacios de alta concurrencia.",
          valor:
            "Planes ajustados a horarios, áreas comunes y circulación."
        },

        {
          nombre:
            "Centros de salud",
          icono:
            "bi-hospital",
          enfoque:
            "ENTORNOS SENSIBLES",
          descripcion:
            "Procedimientos responsables para entornos sensibles.",
          valor:
            "Intervenciones con especial atención a las condiciones del lugar."
        },

        {
          nombre:
            "Hoteles",
          icono:
            "bi-building-check",
          enfoque:
            "HOSPITALIDAD",
          descripcion:
            "Control preventivo y correctivo para espacios de hospitalidad.",
          valor:
            "Atención orientada a confort, prevención y continuidad."
        }

      ]

    };

  },


  computed: {

    categoriasDisponibles() {

      const orden =
        [
          "Fumigacion",
          "Desratizacion",
          "Desinfeccion",
          "Lavado de Cisternas",
          "Limpieza de Baños",
          "Portada"
        ];


      return orden.filter(
        categoria =>
          this.mediaCategoria(
            categoria
          ).length > 0
      );
    },


    heroMedia() {

      const portadaImagenes =
        this.mediaCategoria(
          "Portada"
        )
          .filter(
            item =>
              item.tipo ===
              "imagen"
          );


      if (
        portadaImagenes.length
      ) {

        return portadaImagenes;
      }


      return this.mediaTotal
        .filter(
          item =>
            item.tipo ===
            "imagen"
        )
        .slice(
          0,
          5
        );
    },


    videoPrincipal() {

      return this.mediaCategoria(
        "Portada"
      )
        .find(
          item =>
            item.tipo ===
            "video"
        )
        ||
        this.mediaTotal
          .find(
            item =>
              item.tipo ===
              "video"
          )
        ||
        null;
    },


    heroActual() {

      return this.heroMedia[
        this.heroIndex
      ] || null;
    },


    aboutPrincipal() {

      return this.mediaCategoria(
        "Fumigacion"
      )[1]
        || this.mediaCategoria(
          "Desratizacion"
        )[1]
        || null;
    },


    aboutSecundaria() {

      return this.mediaCategoria(
        "Desratizacion"
      )[1]
        || this.mediaCategoria(
          "Desinfeccion"
        )[1]
        || null;
    },


    rutasUsadasFueraGaleria() {

      const rutas =
        new Set();


      this.heroMedia.forEach(
        item => rutas.add(
          item.path
        )
      );


      if (
        this.videoPrincipal
      ) {

        rutas.add(
          this.videoPrincipal.path
        );
      }


      this.servicios.forEach(
        servicio => {

          const portada =
            this.portadaServicio(
              servicio
            );


          if (portada) {

            rutas.add(
              portada.path
            );
          }

        }
      );


      [
        this.aboutPrincipal,
        this.aboutSecundaria
      ]
        .filter(Boolean)
        .forEach(
          item => rutas.add(
            item.path
          )
        );


      return rutas;
    },


    mediaGaleriaUnica() {

      return this.mediaTotal
        .filter(
          item =>
            !this
              .rutasUsadasFueraGaleria
              .has(
                item.path
              )
        );
    },


    categoriasGaleria() {

      const orden =
        [
          "Fumigacion",
          "Desratizacion",
          "Desinfeccion",
          "Lavado de Cisternas",
          "Limpieza de Baños",
          "Portada"
        ];


      return orden.filter(
        categoria =>
          this.mediaGaleriaUnica
            .some(
              item =>
                item.categoria ===
                categoria
            )
      );
    },


    clientesDuplicados() {

      return [
        ...this.clientes,
        ...this.clientes
      ]
        .map(
          (cliente, index) => ({
            ...cliente,
            clave:
              `${cliente.nombre}-${index}`
          })
        );
    },


    galeriaFiltrada() {

      if (
        this.filtroGaleria ===
        "TODOS"
      ) {

        return this.mediaGaleriaUnica;
      }


      return this.mediaGaleriaUnica
        .filter(
          item =>
            item.categoria ===
            this.filtroGaleria
        );
    },


    lightboxActual() {

      return this.lightboxItems[
        this.lightboxIndex
      ] || null;
    }

  },


  mounted() {

    if (
      this.categoriasDisponibles.length
      &&
      !this.categoriasDisponibles.includes(
        this.categoriaActiva
      )
    ) {

      this.categoriaActiva =
        this.categoriasDisponibles[0];
    }


    this.iniciarHero();


    this.$nextTick(
      () => {
        this.iniciarAnimaciones();
      }
    );


    window.addEventListener(
      "keydown",
      this.controlarTeclado
    );
  },


  beforeUnmount() {

    this.detenerHero();


    if (this.observer) {

      this.observer.disconnect();
    }


    window.removeEventListener(
      "keydown",
      this.controlarTeclado
    );


    document.body.style.overflow =
      "";
  },


  methods: {
    mensajeConsulta(servicio = this.consultaServicio) {
      return [
        "Hola, FUMIDEZ. Me gustaría solicitar una inspección y recibir asesoría.",
        servicio ? `Servicio de interés: ${servicio}.` : "Necesito orientación sobre sus servicios.",
        this.consultaEspacio ? `Tipo de espacio: ${this.consultaEspacio}.` : "",
        this.consultaCiudad ? `Ubicación: ${this.consultaCiudad}.` : "",
        this.consultaDetalle ? `Situación: ${this.consultaDetalle}` : "",
        "¿Podrían indicarme los siguientes pasos y la disponibilidad? Gracias."
      ].filter(Boolean).join("\n");
    },

    enlaceWhatsapp(servicio = this.consultaServicio) {
      return `https://wa.me/593995770087?text=${encodeURIComponent(this.mensajeConsulta(servicio))}`;
    },

    prepararConsulta(servicio) {
      this.consultaServicio = servicio;
      this.irContacto();
      this.$nextTick(() => document.getElementById("consulta-espacio")?.focus({ preventScroll: true }));
    },

    prepararLogo(event) {
      const imagen = event.target;
      if (imagen.dataset.preparado) return;
      imagen.dataset.preparado = "true";
      const origen = imagen.currentSrc || imagen.src;
      if (this.logosPreparados[origen]) {
        imagen.src = this.logosPreparados[origen];
        return;
      }
      try {
        const canvas = document.createElement("canvas");
        const escala = Math.min(1, 800 / Math.max(imagen.naturalWidth, imagen.naturalHeight));
        canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala));
        canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala));
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
        const bitmap = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = bitmap;
        const visitado = new Uint8Array(width * height);
        const cola = [];
        const agregar = (x, y) => {
          if (x < 0 || y < 0 || x >= width || y >= height) return;
          const indice = y * width + x;
          if (visitado[indice]) return;
          visitado[indice] = 1;
          const p = indice * 4;
          if (data[p + 3] === 0 || (data[p] > 238 && data[p + 1] > 238 && data[p + 2] > 238)) {
            data[p + 3] = 0;
            cola.push(indice);
          }
        };
        for (let x = 0; x < width; x++) { agregar(x, 0); agregar(x, height - 1); }
        for (let y = 0; y < height; y++) { agregar(0, y); agregar(width - 1, y); }
        for (let i = 0; i < cola.length; i++) {
          const x = cola[i] % width;
          const y = Math.floor(cola[i] / width);
          agregar(x - 1, y); agregar(x + 1, y); agregar(x, y - 1); agregar(x, y + 1);
        }
        let minX = width, minY = height, maxX = -1, maxY = -1;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] > 0) {
              minX = Math.min(minX, x); minY = Math.min(minY, y);
              maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
            }
          }
        }
        if (maxX < minX) return;
        ctx.putImageData(bitmap, 0, 0);
        const recorte = document.createElement("canvas");
        recorte.width = maxX - minX + 1; recorte.height = maxY - minY + 1;
        recorte.getContext("2d").drawImage(canvas, minX, minY, recorte.width, recorte.height,
          0, 0, recorte.width, recorte.height);
        const resultado = recorte.toDataURL("image/png");
        this.logosPreparados[origen] = resultado;
        imagen.src = resultado;
      } catch {
        imagen.dataset.preparado = "original";
      }
    },

    inicialesCliente(nombre) {

      return String(
        nombre || ""
      )
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
          palabra =>
            palabra[0]
              ?.toUpperCase()
        )
        .join("");
    },


    esVideo(item) {

      return item?.tipo ===
        "video";
    },


    mediaCategoria(categoria) {

      return this.mediaTotal
        .filter(
          item =>
            item.categoria ===
            categoria
        );
    },


    nombreCategoria(categoria) {

      const nombres = {

        Fumigacion:
          "Fumigación",

        Desratizacion:
          "Desratización",

        Desinfeccion:
          "Desinfección",

        "Lavado de Cisternas":
          "Lavado de cisternas",

        "Limpieza de Baños":
          "Limpieza de baños",

        Portada:
          "FUMIDEZ"

      };


      return nombres[categoria]
        || categoria
        || "FUMIDEZ";
    },


    portadaServicio(servicio) {

      return this
        .mediaCategoria(
          servicio.categoriaMedia
        )[0] || null;
    },


    iniciarHero() {

      this.detenerHero();


      if (
        this.heroMedia.length <= 1 || this.movimientoReducido
      ) {

        return;
      }


      this.heroTimer =
        window.setInterval(
          () => {
            this.heroSiguiente();
          },
          6500
        );
    },


    detenerHero() {

      if (this.heroTimer) {

        window.clearInterval(
          this.heroTimer
        );


        this.heroTimer =
          null;
      }
    },


    heroSiguiente() {

      if (!this.heroMedia.length) {

        return;
      }


      this.heroIndex =
        (
          this.heroIndex + 1
        )
        %
        this.heroMedia.length;
    },


    heroAnterior() {

      if (!this.heroMedia.length) {

        return;
      }


      this.heroIndex =
        (
          this.heroIndex
          -
          1
          +
          this.heroMedia.length
        )
        %
        this.heroMedia.length;
    },


    seleccionarHero(index) {

      this.heroIndex =
        index;


      this.iniciarHero();
    },


    iniciarAnimaciones() {

      const elementos =
        document.querySelectorAll(
          ".reveal"
        );


      this.observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target
                    .classList
                    .add(
                      "is-visible"
                    );


                  this.observer
                    .unobserve(
                      entry.target
                    );
                }

              }
            );

          },
          {
            threshold:
              0.10
          }
        );


      elementos.forEach(
        elemento => {

          this.observer
            .observe(
              elemento
            );

        }
      );
    },


    irServicios() {

      this.irSeccion(
        "servicios"
      );
    },


    irContacto() {

      this.irSeccion(
        "contacto"
      );
    },


    irGaleria() {

      this.irSeccion(
        "galeria"
      );
    },


    irSeccion(id) {

      const elemento =
        document.getElementById(
          id
        );


      if (!elemento) {

        return;
      }


      const offset =
        88;


      window.scrollTo({

        top:
          elemento
            .getBoundingClientRect()
            .top
          +
          window.scrollY
          -
          offset,

        behavior:
          "smooth"

      });
    },


    abrirCategoria(servicio) {

      this.abrirCategoriaPorNombre(
        servicio.categoriaMedia
      );
    },


    abrirCategoriaPorNombre(
      categoria
    ) {

      const items =
        this.mediaCategoria(
          categoria
        );


      if (!items.length) {

        return;
      }


      this.abrirLightbox(
        items,
        0
      );
    },


    abrirLightbox(
      items,
      index = 0
    ) {

      this.lightboxItems =
        items;


      this.lightboxIndex =
        index;


      this.lightboxAbierto =
        true;


      document.body.style.overflow =
        "hidden";
    },


    cerrarLightbox() {

      this.lightboxAbierto =
        false;


      this.lightboxItems =
        [];


      this.lightboxIndex =
        0;


      document.body.style.overflow =
        "";
    },


    lightboxSiguiente() {

      if (
        !this.lightboxItems.length
      ) {

        return;
      }


      this.lightboxIndex =
        (
          this.lightboxIndex
          +
          1
        )
        %
        this.lightboxItems.length;
    },


    lightboxAnterior() {

      if (
        !this.lightboxItems.length
      ) {

        return;
      }


      this.lightboxIndex =
        (
          this.lightboxIndex
          -
          1
          +
          this.lightboxItems.length
        )
        %
        this.lightboxItems.length;
    },


    controlarTeclado(event) {

      if (!this.lightboxAbierto) {

        return;
      }


      if (
        event.key ===
        "Escape"
      ) {

        this.cerrarLightbox();
      }


      if (
        event.key ===
        "ArrowRight"
      ) {

        this.lightboxSiguiente();
      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        this.lightboxAnterior();
      }
    },


    desplazarCarrusel(
      tipo,
      direccion
    ) {

      const track =
        tipo ===
        "categoria"
          ? this.$refs.categoriaTrack
          : this.$refs.galeriaTrack;


      if (!track) {

        return;
      }


      track.scrollBy({

        left:
          track.clientWidth
          *
          0.78
          *
          direccion,

        behavior:
          "smooth"

      });
    }

  }

};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');


.public-home {
  --blue-950: #031f38;
  --blue-900: #052f54;
  --blue-850: #073b65;
  --blue-800: #084c78;
  --blue-700: #0b6599;
  --blue-600: #0e79ad;
  --red-700: #a6171d;
  --red-600: #c51e26;
  --red-500: #dc2d34;
  --white: #ffffff;
  --mist: #eef4f8;
  --slate-200: #d9e4ec;
  --slate-500: #7890a4;
  --slate-700: #3d5770;
  --slate-900: #152a3f;

  width: 100%;
  overflow-x: hidden;
  background: #ffffff;
  color: var(--slate-900);
  font-family:
    "Poppins",
    "Segoe UI",
    sans-serif;
}


* {
  box-sizing: border-box;
}


button,
a {
  font-family: inherit;
}


.content-container {
  width:
    min(
      calc(100% - 48px),
      1400px
    );

  margin:
    0 auto;
}


.section {
  padding:
    105px 0;
}


/* ========================================================= */
/* REVEAL */
/* ========================================================= */

.reveal {
  opacity: 0;

  transform:
    translateY(24px);

  transition:
    opacity 0.72s ease,
    transform 0.72s ease;
}


.reveal.is-visible {
  opacity: 1;

  transform:
    translateY(0);
}


/* ========================================================= */
/* TYPOGRAPHY */
/* ========================================================= */

.eyebrow {
  display:
    inline-flex;

  align-items:
    center;

  gap: 10px;

  margin-bottom:
    14px;

  color:
    var(--red-600);

  font-size:
    0.71rem;

  font-weight:
    800;

  letter-spacing:
    0.16em;
}


.eyebrow::before {
  content: "";

  width: 28px;
  height: 3px;

  background:
    var(--red-600);
}


.eyebrow.light {
  color:
    #9ccbe7;
}


.eyebrow.light::before {
  background:
    #4bb2e5;
}


.section-heading {
  max-width:
    850px;

  margin:
    0 auto 48px;

  text-align:
    center;
}


.section-heading h2,
.about-copy h2,
.cases-intro h2,
.why-content h2,
.gallery-heading h2,
.contact-content h2,
.field-heading h2 {
  margin: 0;

  font-size:
    clamp(
      2.25rem,
      4.4vw,
      4.25rem
    );

  line-height:
    1.02;

  font-weight:
    700;

  letter-spacing:
    -0.04em;
}


.section-heading h2,
.about-copy h2,
.gallery-heading h2 {
  color:
    var(--blue-900);
}


.section-heading h2 span,
.about-copy h2 span,
.gallery-heading h2 span {
  color:
    var(--blue-700);
}


.section-heading > p {
  max-width: 720px;

  margin:
    20px auto 0;

  color:
    var(--slate-500);

  font-size:
    0.96rem;

  line-height:
    1.75;
}


.light-heading {
  color:
    #ffffff !important;
}


.light-heading span {
  color:
    #6fc4e9 !important;
}


.light-copy {
  color:
    #bad3e3 !important;
}


/* ========================================================= */
/* HERO */
/* ========================================================= */

.hero {
  position:
    relative;

  min-height:
    790px;

  display:
    flex;

  align-items:
    center;

  overflow:
    hidden;

  background:
    var(--blue-950);
}


.hero-media {
  position:
    absolute;

  inset: 0;
}


.hero-media-element {
  width: 100%;
  height: 100%;

  object-fit:
    cover;

  object-position:
    center center;

  animation:
    heroFade 0.7s ease;
}


@keyframes heroFade {

  from {
    opacity: 0.45;

    transform:
      scale(1.015);
  }

  to {
    opacity: 1;

    transform:
      scale(1);
  }

}


.hero-overlay {
  position:
    absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(3, 27, 49, 0.985) 0%,
      rgba(5, 47, 84, 0.94) 38%,
      rgba(5, 47, 84, 0.67) 62%,
      rgba(5, 47, 84, 0.18) 100%
    );
}


.hero-grid {
  position:
    relative;

  z-index: 3;

  width:
    min(
      calc(100% - 48px),
      1500px
    );

  margin:
    0 auto;

  display:
    grid;

  grid-template-columns:
    1.18fr 0.52fr;

  align-items:
    end;

  gap:
    80px;

  padding:
    155px 0 170px;
}


.hero-copy {
  max-width:
    820px;
}


.hero-kicker {
  width:
    fit-content;

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  margin-bottom:
    24px;

  padding:
    9px 14px;

  border:
    1px solid
    rgba(255, 255, 255, 0.17);

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.07);

  color:
    #c8ddea;

  font-size:
    0.64rem;

  font-weight:
    800;

  letter-spacing:
    0.13em;

  backdrop-filter:
    blur(10px);
}


.hero-kicker span {
  width: 8px;
  height: 8px;

  border-radius:
    50%;

  background:
    var(--red-500);

  box-shadow:
    0 0 0 6px
    rgba(220, 45, 52, 0.16);
}


.hero h1 {
  margin: 0;

  color:
    #ffffff;

  font-size:
    clamp(
      3.6rem,
      6.4vw,
      6.8rem
    );

  font-weight:
    700;

  line-height:
    0.93;

  letter-spacing:
    -0.055em;
}


.hero h1 span {
  display:
    block;

  color:
    #70c0e7;
}


.hero-lead {
  max-width:
    700px;

  margin:
    30px 0 0;

  color:
    #d4e3ed;

  font-size:
    1.08rem;

  line-height:
    1.75;
}


.hero-actions {
  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    12px;

  margin-top:
    34px;
}


.button-primary,
.button-secondary {
  min-height:
    54px;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap: 9px;

  padding:
    0 21px;

  border-radius:
    999px;

  font-size:
    0.74rem;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    background-color 0.24s ease;
}


.button-primary {
  border:
    1px solid
    var(--red-500);

  background:
    linear-gradient(
      135deg,
      var(--red-500),
      var(--red-700)
    );

  color:
    #ffffff;

  box-shadow:
    0 12px 30px
    rgba(197, 30, 38, 0.29);
}


.button-primary:hover {
  transform:
    translateY(-3px);

  box-shadow:
    0 17px 38px
    rgba(197, 30, 38, 0.38);
}


.button-secondary {
  border:
    1px solid
    rgba(255, 255, 255, 0.28);

  background:
    rgba(255, 255, 255, 0.07);

  color:
    #ffffff;

  backdrop-filter:
    blur(10px);
}


.button-secondary:hover {
  transform:
    translateY(-3px);

  background:
    rgba(255, 255, 255, 0.13);
}


.hero-trust {
  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    22px;

  margin-top:
    35px;

  padding-top:
    24px;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.14);
}


.hero-trust div {
  display:
    flex;

  align-items:
    center;

  gap: 7px;

  color:
    #c8d8e4;

  font-size:
    0.66rem;

  font-weight:
    600;
}


.hero-trust i {
  color:
    #ff646a;
}


.hero-experience {
  align-self:
    end;

  margin-bottom:
    35px;

  padding:
    29px;

  border:
    1px solid
    rgba(255, 255, 255, 0.18);

  border-radius:
    24px;

  background:
    rgba(4, 31, 56, 0.48);

  backdrop-filter:
    blur(16px);

  color:
    #ffffff;
}


.hero-experience-label {
  color:
    #76c6e9;

  font-size:
    0.57rem;

  font-weight:
    800;

  letter-spacing:
    0.14em;
}


.hero-experience strong {
  display:
    block;

  margin-top:
    11px;

  font-size:
    1.35rem;

  line-height:
    1.25;
}


.hero-experience p {
  margin:
    13px 0 0;

  color:
    #c5d9e6;

  font-size:
    0.69rem;

  line-height:
    1.65;
}


.hero-counter {
  margin-top:
    25px;

  display:
    flex;

  align-items:
    baseline;

  gap:
    5px;
}


.hero-counter span {
  font-size:
    2rem;

  font-weight:
    800;
}


.hero-counter small {
  color:
    #8ebbd5;
}


.hero-slider-actions {
  display:
    flex;

  gap: 8px;

  margin-top:
    15px;
}


.hero-slider-actions button,
.slider-arrow,
.lightbox-nav {
  width: 45px;
  height: 45px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.20);

  border-radius:
    50%;

  background:
    rgba(255, 255, 255, 0.07);

  color:
    #ffffff;

  cursor:
    pointer;

  transition:
    transform 0.22s ease,
    background-color 0.22s ease;
}


.hero-slider-actions button:hover,
.slider-arrow:hover,
.lightbox-nav:hover {
  transform:
    scale(1.06);

  background:
    var(--red-600);
}


.hero-progress {
  position:
    absolute;

  z-index: 5;

  left: 30px;

  bottom:
    135px;

  display:
    flex;

  gap:
    6px;
}


.hero-progress button {
  width:
    28px;

  height:
    3px;

  padding: 0;

  border: none;

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.30);

  cursor:
    pointer;

  transition:
    width 0.25s ease,
    background-color 0.25s ease;
}


.hero-progress button.active {
  width:
    55px;

  background:
    var(--red-500);
}


.hero-metrics {
  position:
    absolute;

  z-index:
    4;

  right: 0;

  bottom: 0;

  width:
    min(
      60%,
      850px
    );

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  overflow:
    hidden;

  border-top-left-radius:
    25px;

  background:
    linear-gradient(
      90deg,
      rgba(5, 47, 84, 0.97),
      rgba(8, 82, 127, 0.97)
    );
}


.hero-metrics article {
  min-height:
    112px;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    center;

  padding:
    20px 23px;

  border-right:
    1px solid
    rgba(255, 255, 255, 0.10);

  transition:
    background-color 0.3s ease;
}


.hero-metrics article:hover {
  background:
    rgba(255, 255, 255, 0.08);
}


.hero-metrics strong {
  color:
    #ffffff;

  font-size:
    1.28rem;

  font-weight:
    800;
}


.hero-metrics span {
  margin-top:
    4px;

  color:
    #b6d5e7;

  font-size:
    0.56rem;

  line-height:
    1.4;
}


/* ========================================================= */
/* VALUE */
/* ========================================================= */

.value-section {
  padding:
    30px 0;

  background:
    #ffffff;
}


.value-grid {
  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    14px;
}


.value-card {
  position:
    relative;

  min-height:
    150px;

  display:
    grid;

  grid-template-columns:
    52px 1fr;

  align-items:
    center;

  gap:
    15px;

  padding:
    25px;

  overflow:
    hidden;

  border:
    1px solid
    var(--slate-200);

  border-radius:
    18px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f4f8fb
    );

  transition:
    transform 0.32s ease,
    background 0.32s ease,
    box-shadow 0.32s ease;
}


.value-card:hover {
  transform:
    translateY(-7px);

  background:
    linear-gradient(
      145deg,
      var(--blue-800),
      var(--blue-900)
    );

  box-shadow:
    0 22px 45px
    rgba(5, 47, 84, 0.18);
}


.value-icon {
  width: 50px;
  height: 50px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    14px;

  background:
    #e8f3fa;

  color:
    var(--blue-700);

  font-size:
    1.15rem;

  transition:
    transform 0.32s ease,
    background 0.32s ease,
    color 0.32s ease;
}


.value-card:hover .value-icon {
  transform:
    scale(1.08);

  background:
    rgba(255, 255, 255, 0.12);

  color:
    #ffffff;
}


.value-card strong {
  display:
    block;

  color:
    var(--blue-900);

  font-size:
    0.82rem;
}


.value-card p {
  margin:
    6px 0 0;

  color:
    var(--slate-500);

  font-size:
    0.62rem;

  line-height:
    1.55;
}


.value-card:hover strong,
.value-card:hover p {
  color:
    #ffffff;
}


/* ========================================================= */
/* ACCENT LINE */
/* ========================================================= */

.card-accent {
  position:
    absolute;

  left:
    25px;

  right:
    25px;

  bottom:
    16px;

  height:
    3px;

  background:
    var(--red-500);

  transform:
    scaleX(0.20);

  transform-origin:
    left;

  transition:
    transform 0.32s ease;
}


.value-card:hover .card-accent,
.process-card:hover .card-accent,
.sector-card:hover .card-accent {
  transform:
    scaleX(1);
}


/* ========================================================= */
/* ABOUT */
/* ========================================================= */

.about-section {
  background:
    #ffffff;
}


.about-grid {
  display:
    grid;

  grid-template-columns:
    1.05fr 0.95fr;

  align-items:
    center;

  gap:
    90px;
}


.about-media {
  position:
    relative;

  min-height:
    580px;
}


.about-main {
  width:
    80%;

  height:
    520px;

  border-radius:
    24px;
}


.about-secondary {
  position:
    absolute;

  right:
    0;

  bottom:
    0;

  width:
    43%;

  height:
    250px;

  border:
    9px solid
    #ffffff;

  border-radius:
    20px;

  box-shadow:
    0 22px 50px
    rgba(5, 47, 84, 0.16);
}


.media-hover {
  position:
    relative;

  overflow:
    hidden;
}


.media-hover img,
.media-hover video {
  width: 100%;
  height: 100%;

  object-fit:
    cover;

  filter:
    brightness(0.72)
    saturate(0.92);

  transition:
    transform 0.55s ease,
    filter 0.45s ease;
}


.media-shade {
  position:
    absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(5, 47, 84, 0.45),
      rgba(5, 47, 84, 0.04)
    );

  transition:
    opacity 0.35s ease;
}


.media-hover:hover img,
.media-hover:hover video {
  transform:
    scale(1.06);

  filter:
    brightness(1)
    saturate(1.05);
}


.media-hover:hover .media-shade {
  opacity:
    0.35;
}


.about-experience {
  position:
    absolute;

  top:
    42px;

  right:
    10%;

  width:
    150px;

  padding:
    22px;

  border-radius:
    18px;

  background:
    linear-gradient(
      145deg,
      var(--red-500),
      var(--red-700)
    );

  color:
    #ffffff;

  box-shadow:
    0 18px 40px
    rgba(197, 30, 38, 0.30);
}


.about-experience strong {
  display:
    block;

  font-size:
    2rem;

  font-weight:
    800;
}


.about-experience span {
  display:
    block;

  margin-top:
    4px;

  font-size:
    0.58rem;

  line-height:
    1.4;
}


.about-copy .lead {
  color:
    var(--slate-700);

  font-size:
    1.02rem;

  font-weight:
    500;
}


.about-copy > p {
  margin:
    18px 0 0;

  color:
    var(--slate-500);

  font-size:
    0.86rem;

  line-height:
    1.8;
}


.about-points {
  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    13px;

  margin-top:
    28px;
}


.about-points div {
  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  color:
    var(--slate-700);

  font-size:
    0.68rem;

  font-weight:
    700;
}


.about-points i {
  color:
    var(--blue-700);
}


.text-link {
  margin-top:
    30px;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    8px;

  padding:
    0 0 6px;

  border: none;

  border-bottom:
    2px solid
    var(--red-500);

  background:
    transparent;

  color:
    var(--blue-800);

  font-size:
    0.72rem;

  font-weight:
    800;

  cursor:
    pointer;
}


/* ========================================================= */
/* VISUAL CARD - HOVER UNIVERSAL */
 /* ========================================================= */

.visual-card {
  position:
    relative;

  overflow:
    hidden;

  background:
    var(--blue-900);

  cursor:
    pointer;

  transition:
    transform 0.36s ease,
    box-shadow 0.36s ease;
}


.visual-card:hover {
  transform:
    translateY(-8px);

  box-shadow:
    0 28px 58px
    rgba(3, 31, 56, 0.28);
}


.visual-card > img,
.visual-card > video {
  width: 100%;
  height: 100%;

  object-fit:
    cover;

  filter:
    brightness(0.53)
    saturate(0.92);

  transition:
    transform 0.58s ease,
    filter 0.42s ease;
}


.visual-card:hover > img,
.visual-card:hover > video {
  transform:
    scale(1.07);

  filter:
    brightness(0.94)
    saturate(1.08);
}


.visual-overlay {
  position:
    absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(4, 31, 56, 0.97) 0%,
      rgba(5, 47, 84, 0.65) 48%,
      rgba(5, 47, 84, 0.08) 100%
    );

  transition:
    background 0.42s ease;
}


.visual-card:hover .visual-overlay {
  background:
    linear-gradient(
      to top,
      rgba(4, 31, 56, 0.90) 0%,
      rgba(5, 47, 84, 0.34) 48%,
      rgba(5, 47, 84, 0.03) 100%
    );
}


.visual-content {
  position:
    absolute;

  z-index: 3;

  left:
    24px;

  right:
    24px;

  bottom:
    22px;

  color:
    #ffffff;

  transform:
    translateY(34px);

  transition:
    transform 0.36s ease;
}


.visual-card:hover .visual-content {
  transform:
    translateY(0);
}


.visual-label {
  display:
    block;

  margin-bottom:
    8px;

  color:
    #70c8ed;

  font-size:
    0.57rem;

  font-weight:
    800;

  letter-spacing:
    0.13em;
}


.visual-content h3 {
  margin: 0;

  color:
    #ffffff;

  font-size:
    1.22rem;

  font-weight:
    700;

  line-height:
    1.16;
}


.visual-content p {
  margin:
    10px 0 14px;

  color:
    rgba(255, 255, 255, 0.86);

  font-size:
    0.69rem;

  line-height:
    1.52;

  opacity: 0;

  transform:
    translateY(10px);

  transition:
    opacity 0.30s ease,
    transform 0.30s ease;
}


.visual-card:hover .visual-content p {
  opacity: 1;

  transform:
    translateY(0);
}


.visual-action {
  width:
    fit-content;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  color:
    #ffffff;

  font-size:
    0.68rem;

  font-weight:
    800;

  opacity: 0;

  transform:
    translateY(10px);

  transition:
    opacity 0.30s ease,
    transform 0.30s ease;
}


.visual-card:hover .visual-action {
  opacity: 1;

  transform:
    translateY(0);
}


.visual-line {
  display:
    block;

  width:
    108px;

  height:
    3px;

  margin-top:
    9px;

  background:
    var(--red-500);

  transform:
    scaleX(0.38);

  transform-origin:
    left;

  transition:
    transform 0.32s ease;
}


.visual-card:hover .visual-line {
  transform:
    scaleX(1);
}


.visual-number {
  position:
    absolute;

  z-index: 3;

  top:
    20px;

  right:
    22px;

  color:
    rgba(255, 255, 255, 0.83);

  font-size:
    1.45rem;

  font-weight:
    800;
}


.visual-count {
  position:
    absolute;

  z-index: 4;

  top:
    20px;

  left:
    20px;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    6px;

  padding:
    7px 10px;

  border:
    1px solid
    rgba(255, 255, 255, 0.18);

  border-radius:
    999px;

  background:
    rgba(3, 31, 56, 0.45);

  color:
    #ffffff;

  font-size:
    0.57rem;

  font-weight:
    700;

  backdrop-filter:
    blur(8px);
}


.video-badge {
  position:
    absolute;

  z-index: 4;

  top:
    18px;

  right:
    18px;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    5px;

  padding:
    7px 10px;

  border-radius:
    999px;

  background:
    var(--red-600);

  color:
    #ffffff;

  font-size:
    0.56rem;

  font-weight:
    800;
}


/* ========================================================= */
/* VIDEO STORY */
 /* ========================================================= */

.video-story-section {
  background:
    #ffffff;
}


.video-story-grid {
  display:
    grid;

  grid-template-columns:
    0.78fr 1.22fr;

  align-items:
    center;

  gap:
    70px;
}


.video-story-copy h2 {
  margin: 0;

  color:
    var(--blue-900);

  font-size:
    clamp(
      2.2rem,
      4vw,
      4rem
    );

  line-height:
    1.04;

  font-weight:
    700;

  letter-spacing:
    -0.04em;
}


.video-story-copy h2 span {
  display:
    block;

  color:
    var(--blue-700);
}


.video-story-copy > p {
  margin:
    20px 0 0;

  color:
    var(--slate-500);

  font-size:
    0.88rem;

  line-height:
    1.75;
}


.video-story-points {
  display:
    grid;

  gap:
    11px;

  margin-top:
    25px;
}


.video-story-points div {
  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  color:
    var(--slate-700);

  font-size:
    0.70rem;

  font-weight:
    700;
}


.video-story-points i {
  color:
    var(--red-500);
}


.video-story-player {
  position:
    relative;

  height:
    500px;

  overflow:
    hidden;

  border-radius:
    25px;

  background:
    var(--blue-950);

  cursor:
    pointer;

  box-shadow:
    0 25px 60px
    rgba(5, 47, 84, 0.18);
}


.video-story-player video {
  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

  filter:
    brightness(0.72)
    saturate(0.96);

  transition:
    transform 0.55s ease,
    filter 0.45s ease;
}


.video-story-player:hover video {
  transform:
    scale(1.04);

  filter:
    brightness(0.95)
    saturate(1.05);
}


.video-story-overlay {
  position:
    absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(3, 31, 56, 0.85),
      rgba(3, 31, 56, 0.08) 65%
    );
}


.video-story-play {
  position:
    absolute;

  left:
    50%;

  top:
    50%;

  width:
    78px;

  height:
    78px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.45);

  border-radius:
    50%;

  background:
    rgba(255, 255, 255, 0.13);

  color:
    #ffffff;

  font-size:
    2rem;

  backdrop-filter:
    blur(12px);

  transform:
    translate(-50%, -50%);

  transition:
    transform 0.25s ease,
    background-color 0.25s ease;
}


.video-story-player:hover
.video-story-play {
  transform:
    translate(-50%, -50%)
    scale(1.08);

  background:
    var(--red-600);
}


.video-story-caption {
  position:
    absolute;

  left:
    28px;

  bottom:
    27px;

  z-index:
    3;

  color:
    #ffffff;
}


.video-story-caption span {
  display:
    block;

  color:
    #76c7e9;

  font-size:
    0.57rem;

  font-weight:
    800;

  letter-spacing:
    0.13em;
}


.video-story-caption strong {
  display:
    block;

  margin-top:
    5px;

  font-size:
    0.82rem;
}


/* ========================================================= */
/* SERVICES */
 /* ========================================================= */

.services-section {
  background:
    linear-gradient(
      180deg,
      #f5f9fc,
      #edf4f8
    );
}


.services-grid {
  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    18px;
}


.service-card {
  height:
    355px;

  min-height:
    355px;

  border-radius:
    22px;
}


/* ========================================================= */
/* CLIENTS / SUCCESS */
 /* ========================================================= */

.clients-section {
  overflow:
    hidden;

  background:
    linear-gradient(
      145deg,
      var(--blue-950),
      #064a76
    );
}


.clients-heading {
  display:
    grid;

  grid-template-columns:
    1.1fr 0.9fr;

  align-items:
    end;

  gap:
    70px;
}


.clients-heading h2 {
  margin: 0;

  color:
    #ffffff;

  font-size:
    clamp(
      2.3rem,
      4.5vw,
      4.4rem
    );

  line-height:
    1.02;

  font-weight:
    700;

  letter-spacing:
    -0.04em;
}


.clients-heading h2 span {
  display:
    block;

  color:
    #72c7eb;
}


.clients-heading > p {
  margin: 0;

  color:
    #b7d1e0;

  font-size:
    0.88rem;

  line-height:
    1.75;
}


.clients-viewport {
  position:
    relative;

  margin-top:
    48px;

  overflow:
    hidden;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.10);

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.10);
}


.clients-viewport::before,
.clients-viewport::after {
  content: "";

  position:
    absolute;

  z-index:
    4;

  top: 0;

  bottom: 0;

  width:
    100px;

  pointer-events:
    none;
}


.clients-viewport::before {
  left: 0;

  background:
    linear-gradient(
      90deg,
      var(--blue-950),
      transparent
    );
}


.clients-viewport::after {
  right: 0;

  background:
    linear-gradient(
      -90deg,
      #064a76,
      transparent
    );
}


.clients-track {
  width:
    max-content;

  display:
    flex;

  gap:
    14px;

  padding:
    22px 0;

  animation:
    clientMarquee
    52s
    linear
    infinite;
}


.clients-viewport:hover
.clients-track {
  animation-play-state:
    paused;
}


@keyframes clientMarquee {

  from {
    transform:
      translateX(0);
  }

  to {
    transform:
      translateX(-50%);
  }

}


.client-card {
  position:
    relative;

  flex:
    0 0
    250px;

  height:
    175px;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  padding:
    20px;

  overflow:
    hidden;

  border:
    1px solid
    rgba(255, 255, 255, 0.10);

  border-radius:
    18px;

  background:
    rgba(255, 255, 255, 0.055);

  transition:
    transform 0.32s ease,
    background-color 0.32s ease,
    border-color 0.32s ease;
}


.client-card:hover {
  transform:
    translateY(-5px);

  border-color:
    rgba(115, 199, 235, 0.56);

  background:
    rgba(255, 255, 255, 0.11);
}


.client-logo-wrap {
  position:
    relative;

  width:
    72px;

  height:
    58px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  overflow:
    hidden;

  border-radius:
    12px;

  background:
    #ffffff;

  box-shadow:
    0 8px 24px
    rgba(0, 0, 0, 0.08);
}


.client-logo-wrap img {
  position:
    relative;

  z-index:
    2;

  width:
    60px;

  height:
    46px;

  padding:
    4px;

  object-fit:
    contain;
}


.client-monogram {
  position:
    absolute;

  inset: 0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  color:
    var(--blue-800);

  font-size:
    0.90rem;

  font-weight:
    900;
}


.client-copy strong {
  display:
    block;

  color:
    #ffffff;

  font-size:
    0.82rem;

  line-height:
    1.25;
}


.client-copy span {
  display:
    block;

  margin-top:
    4px;

  color:
    #83b8d3;

  font-size:
    0.53rem;

  font-weight:
    600;

  letter-spacing:
    0.06em;
}


.client-hover {
  position:
    absolute;

  left:
    20px;

  right:
    20px;

  bottom:
    17px;

  display:
    flex;

  align-items:
    center;

  gap:
    7px;

  color:
    #d8eef8;

  font-size:
    0.55rem;

  font-weight:
    700;

  opacity: 0;

  transform:
    translateY(10px);

  transition:
    opacity 0.30s ease,
    transform 0.30s ease;
}


.client-card:hover
.client-hover {
  opacity: 1;

  transform:
    translateY(0);
}


.client-card:hover
.client-copy {
  transform:
    translateY(-20px);
}


.client-copy {
  transition:
    transform 0.30s ease;
}


.client-hover i {
  color:
    #72c7eb;
}


.clients-note {
  max-width:
    800px;

  display:
    flex;

  align-items:
    flex-start;

  gap:
    15px;

  margin-top:
    28px;
}


.clients-note-line {
  flex:
    0 0 34px;

  height:
    3px;

  margin-top:
    8px;

  background:
    var(--red-500);
}


.clients-note p {
  margin: 0;

  color:
    #8fb4c8;

  font-size:
    0.58rem;

  line-height:
    1.65;
}


/* ========================================================= */
/* WHY */
 /* ========================================================= */

.why-section {
  overflow:
    hidden;

  background: var(--corporate-section-background);
}


.why-layout {
  display:
    grid;

  grid-template-columns:
    0.9fr 1.1fr;

  align-items:
    center;

  gap:
    70px;
}


.why-visual {
  position:
    relative;

  min-height:
    590px;
}


.why-orbit {
  position:
    absolute;

  border-radius:
    50%;

  border:
    1px solid
    rgba(111, 198, 234, 0.22);
}


.orbit-one {
  width:
    470px;

  height:
    470px;

  left:
    50px;

  top:
    60px;
}


.orbit-two {
  width:
    315px;

  height:
    315px;

  left:
    128px;

  top:
    138px;
}


.metric-bubble {
  position:
    absolute;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.25);

  border-radius:
    50%;

  background:
    radial-gradient(
      circle at 30% 25%,
      rgba(255, 255, 255, 0.42),
      rgba(107, 196, 233, 0.24) 32%,
      rgba(7, 64, 104, 0.28) 70%
    );

  backdrop-filter:
    blur(12px);

  color:
    #ffffff;

  box-shadow:
    inset 0 0 34px
    rgba(255, 255, 255, 0.10),
    0 25px 45px
    rgba(1, 24, 42, 0.18);

  animation:
    bubbleFloat
    5s
    ease-in-out
    infinite;
}


.bubble-main {
  width:
    245px;

  height:
    245px;

  left:
    90px;

  top:
    145px;
}


.bubble-small {
  width:
    145px;

  height:
    145px;
}


.bubble-one {
  left:
    325px;

  top:
    70px;

  animation-delay:
    -1.2s;
}


.bubble-two {
  left:
    345px;

  top:
    325px;

  animation-delay:
    -2.2s;
}


.bubble-three {
  left:
    35px;

  top:
    400px;

  animation-delay:
    -3.1s;
}


.metric-bubble strong {
  font-size:
    2rem;

  font-weight:
    800;
}


.bubble-main strong {
  font-size:
    3rem;
}


.metric-bubble span {
  max-width:
    120px;

  margin-top:
    3px;

  text-align:
    center;

  color:
    #d7ebf6;

  font-size:
    0.60rem;

  line-height:
    1.35;
}


@keyframes bubbleFloat {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-12px);
  }

}


.why-content h2 {
  color:
    #ffffff;
}


.why-content h2 span {
  display:
    block;

  color:
    #74c7eb;
}


.why-lead {
  max-width:
    750px;

  margin:
    20px 0 0;

  color:
    #c2d9e7;

  font-size:
    0.98rem;

  line-height:
    1.75;
}


.why-grid {
  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    12px 30px;

  margin-top:
    34px;
}


.why-card {
  position:
    relative;

  min-height:
    140px;

  display:
    grid;

  grid-template-columns:
    42px 1fr;

  gap:
    14px;

  padding:
    21px 0 21px 18px;

  border-left:
    3px solid
    #55b8e4;

  transition:
    transform 0.28s ease,
    background-color 0.28s ease,
    border-color 0.28s ease;
}


.why-card:hover {
  transform:
    translateX(7px);

  background:
    rgba(255, 255, 255, 0.05);

  border-left-color:
    var(--red-500);
}


.why-card > i {
  color:
    #6cc4e9;

  font-size:
    1.2rem;
}


.why-card h3 {
  margin: 0;

  color:
    #ffffff;

  font-size:
    1.02rem;
}


.why-card p {
  margin:
    8px 0 0;

  color:
    #b4d0df;

  font-size:
    0.67rem;

  line-height:
    1.6;
}


/* ========================================================= */
/* PROCESS PREMIUM */
 /* ========================================================= */

.process-section {
  position:
    relative;

  overflow:
    hidden;

  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #f4f8fb 100%
    );
}


/* ENCABEZADO */

.process-heading {
  display:
    grid;

  grid-template-columns:
    1.05fr 0.75fr;

  align-items:
    end;

  gap:
    80px;

  margin-bottom:
    70px;
}


.process-heading-left h2 {
  max-width:
    760px;

  margin: 0;

  color:
    var(--blue-900);

  font-size:
    clamp(
      2.6rem,
      4.8vw,
      4.8rem
    );

  font-weight:
    700;

  line-height:
    0.98;

  letter-spacing:
    -0.045em;
}


.process-heading-left h2 span {
  display:
    block;

  color:
    var(--blue-700);
}


.process-heading-right > p {
  margin: 0;

  color:
    var(--slate-500);

  font-size:
    0.88rem;

  line-height:
    1.8;
}


/* BADGE */

.process-badge {
  display:
    flex;

  align-items:
    center;

  gap:
    13px;

  margin-top:
    24px;

  padding:
    16px 18px;

  border:
    1px solid
    var(--slate-200);

  border-radius:
    14px;

  background:
    #ffffff;

  box-shadow:
    0 10px 28px
    rgba(5, 47, 84, 0.06);
}


.process-badge > i {
  width:
    42px;

  height:
    42px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  border-radius:
    11px;

  background:
    #e9f4fa;

  color:
    var(--blue-700);

  font-size:
    1.1rem;
}


.process-badge strong {
  display:
    block;

  color:
    var(--blue-900);

  font-size:
    0.72rem;
}


.process-badge span {
  display:
    block;

  margin-top:
    3px;

  color:
    var(--slate-500);

  font-size:
    0.56rem;
}


/* TIMELINE */

.process-timeline {
  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    0;
}


/* STEP */

.process-step {
  position:
    relative;

  min-width:
    0;

  padding-right:
    26px;
}


.process-step:last-child {
  padding-right:
    0;
}


/* TOP */

.process-step-top {
  position:
    relative;

  display:
    flex;

  align-items:
    center;

  margin-bottom:
    23px;
}


.process-step-number {
  position:
    relative;

  z-index:
    2;

  width:
    70px;

  height:
    70px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  border:
    1px solid
    #b9d0df;

  border-radius:
    50%;

  background:
    #ffffff;

  color:
    var(--blue-900);

  font-size:
    1.15rem;

  font-weight:
    800;

  box-shadow:
    0 9px 30px
    rgba(5, 47, 84, 0.08);

  transition:
    transform 0.32s ease,
    background 0.32s ease,
    color 0.32s ease,
    border-color 0.32s ease;
}


/* CONNECTOR */

.process-connector {
  position:
    absolute;

  z-index:
    1;

  left:
    70px;

  right:
    -1px;

  top:
    50%;

  height:
    1px;

  background:
    #cbd9e3;

  transform:
    translateY(-50%);
}


.process-connector span {
  display:
    block;

  width:
    0;

  height:
    100%;

  background:
    linear-gradient(
      90deg,
      var(--blue-600),
      var(--red-500)
    );

  transition:
    width 0.42s ease;
}


/* BODY */

.process-step-body {
  position:
    relative;

  min-height:
    265px;

  padding:
    28px 24px 24px;

  overflow:
    hidden;

  border:
    1px solid
    var(--slate-200);

  border-radius:
    18px;

  background:
    #ffffff;

  box-shadow:
    0 12px 32px
    rgba(5, 47, 84, 0.05);

  transition:
    transform 0.32s ease,
    border-color 0.32s ease,
    box-shadow 0.32s ease,
    background 0.32s ease;
}


.process-step-icon {
  width:
    50px;

  height:
    50px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    13px;

  background:
    #edf5fa;

  color:
    var(--blue-700);

  font-size:
    1.2rem;

  transition:
    background 0.32s ease,
    color 0.32s ease,
    transform 0.32s ease;
}


.process-step-body h3 {
  margin:
    25px 0 0;

  color:
    var(--blue-900);

  font-size:
    1.25rem;

  font-weight:
    700;
}


.process-step-body p {
  margin:
    11px 0 0;

  color:
    var(--slate-500);

  font-size:
    0.70rem;

  line-height:
    1.65;
}


/* FOOTER */

.process-step-footer {
  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-top:
    24px;

  padding-top:
    16px;

  border-top:
    1px solid
    #e6edf2;

  color:
    #879bad;

  font-size:
    0.56rem;

  font-weight:
    700;
}


.process-step-footer i {
  color:
    var(--red-500);

  transition:
    transform 0.3s ease;
}


/* ACCENT */

.process-step-body::after {
  content: "";

  position:
    absolute;

  left:
    24px;

  bottom:
    0;

  width:
    48px;

  height:
    3px;

  border-radius:
    999px 999px 0 0;

  background:
    var(--red-500);

  transition:
    width 0.32s ease;
}


/* HOVER */

.process-step:hover
.process-step-number {
  transform:
    scale(1.08);

  border-color:
    var(--blue-700);

  background:
    var(--blue-800);

  color:
    #ffffff;
}


.process-step:hover
.process-step-body {
  transform:
    translateY(-7px);

  border-color:
    #aac8da;

  background:
    linear-gradient(
      180deg,
      #ffffff,
      #f4f9fc
    );

  box-shadow:
    0 22px 48px
    rgba(5, 47, 84, 0.13);
}


.process-step:hover
.process-step-icon {
  transform:
    scale(1.07);

  background:
    var(--blue-800);

  color:
    #ffffff;
}


.process-step:hover
.process-connector span {
  width:
    100%;
}


.process-step:hover
.process-step-footer i {
  transform:
    translate(
      3px,
      -3px
    );
}


.process-step:hover
.process-step-body::after {
  width:
    calc(100% - 48px);
}


/* ========================================================= */
/* PROCESS RESPONSIVE */
 /* ========================================================= */

@media (max-width: 1050px) {

  .process-heading {
    grid-template-columns:
      1fr;

    gap:
      25px;
  }


  .process-heading-right {
    max-width:
      720px;
  }


  .process-timeline {
    grid-template-columns:
      repeat(2, 1fr);

    gap:
      35px 20px;
  }


  .process-step {
    padding-right:
      0;
  }


  .process-connector {
    display:
      none;
  }

}


@media (max-width: 650px) {

  .process-timeline {
    grid-template-columns:
      1fr;

    gap:
      24px;
  }


  .process-step {
    padding-right:
      0;
  }


  .process-step-top {
    margin-bottom:
      14px;
  }


  .process-step-number {
    width:
      58px;

    height:
      58px;
  }


  .process-step-body {
    min-height:
      auto;
  }

}


/* ========================================================= */
/* GALLERY CONTROLS / HORIZONTAL SLIDER */
 /* ========================================================= */

.gallery-slider {
  position:
    relative;

  margin-top:
    24px;
}


.gallery-toolbar {
  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    9px;

  margin-top:
    32px;
}


.gallery-toolbar button {
  min-height:
    42px;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    8px;

  padding:
    0 14px;

  border:
    1px solid
    var(--slate-200);

  border-radius:
    999px;

  background:
    #ffffff;

  color:
    var(--slate-700);

  font-size:
    0.64rem;

  font-weight:
    700;

  cursor:
    pointer;

  transition:
    background-color 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
}


.gallery-toolbar button:hover {
  transform:
    translateY(-2px);
}


.gallery-toolbar button span {
  min-width:
    24px;

  min-height:
    24px;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    #edf4f8;

  color:
    var(--blue-700);

  font-size:
    0.54rem;

  font-weight:
    800;
}


.gallery-toolbar button:hover,
.gallery-toolbar button.active {
  border-color:
    var(--blue-700);

  background:
    var(--blue-800);

  color:
    #ffffff;
}


.gallery-toolbar button:hover span,
.gallery-toolbar button.active span {
  background:
    rgba(255, 255, 255, 0.14);

  color:
    #ffffff;
}


.horizontal-track {
  display:
    flex;

  align-items:
    stretch;

  gap:
    16px;

  width:
    100%;

  overflow-x:
    auto;

  overflow-y:
    hidden;

  padding:
    14px 4px 28px;

  scroll-snap-type:
    x mandatory;

  scroll-behavior:
    smooth;

  scrollbar-width:
    none;
}


.horizontal-track::-webkit-scrollbar {
  display:
    none;
}


.slider-arrow {
  position:
    absolute;

  z-index:
    12;

  top:
    50%;

  width:
    46px;

  height:
    46px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.18);

  border-radius:
    50%;

  background:
    rgba(5, 47, 84, 0.92);

  color:
    #ffffff;

  box-shadow:
    0 10px 28px
    rgba(3, 31, 56, 0.22);

  cursor:
    pointer;

  transform:
    translateY(-50%);

  transition:
    transform 0.22s ease,
    background-color 0.22s ease;
}


.slider-arrow:hover {
  transform:
    translateY(-50%)
    scale(1.07);

  background:
    var(--red-600);
}


.slider-arrow-left {
  left:
    -22px;
}


.slider-arrow-right {
  right:
    -22px;
}


/* ========================================================= */
/* GALLERY */
 /* ========================================================= */

.gallery-section {
  background:
    linear-gradient(
      180deg,
      #f3f8fb,
      #ffffff
    );
}


.gallery-heading {
  display:
    flex;

  align-items:
    end;

  justify-content:
    space-between;

  gap:
    40px;
}


.gallery-heading h2 span {
  display:
    block;
}


.gallery-summary {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    flex-end;
}


.gallery-summary strong {
  color:
    var(--blue-900);

  font-size:
    3rem;

  font-weight:
    800;
}


.gallery-summary span {
  color:
    var(--slate-500);

  font-size:
    0.62rem;

  font-weight:
    600;
}




.gallery-track {
  padding-top:
    14px;
}


.gallery-card {
  flex:
    0 0
    min(
      330px,
      82vw
    );

  height:
    390px;

  border-radius:
    22px;

  scroll-snap-align:
    start;
}


.gallery-arrow {
  background:
    rgba(5, 47, 84, 0.90);

  border-color:
    rgba(255, 255, 255, 0.15);
}


/* ========================================================= */
/* SECTORS PREMIUM */
 /* ========================================================= */

.sectors-section {
  position:
    relative;

  overflow:
    hidden;

  background: var(--corporate-section-background);
}


.sector-orb {
  position:
    absolute;

  border-radius:
    50%;

  pointer-events:
    none;
}


.sector-orb-one {
  width:
    520px;

  height:
    520px;

  right:
    -180px;

  top:
    -180px;

  background:
    radial-gradient(
      circle,
      rgba(89, 194, 231, 0.16),
      transparent 68%
    );
}


.sector-orb-two {
  width:
    430px;

  height:
    430px;

  left:
    -160px;

  bottom:
    -180px;

  background:
    radial-gradient(
      circle,
      rgba(220, 45, 52, 0.12),
      transparent 70%
    );
}


/* HEADER */

.sectors-heading {
  position:
    relative;

  z-index:
    2;

  display:
    grid;

  grid-template-columns:
    1.08fr 0.82fr;

  align-items:
    end;

  gap:
    80px;

  margin-bottom:
    58px;
}


.sectors-heading h2 {
  max-width:
    820px;

  margin: 0;

  color:
    #ffffff;

  font-size:
    clamp(
      2.55rem,
      4.7vw,
      4.7rem
    );

  line-height:
    0.99;

  font-weight:
    700;

  letter-spacing:
    -0.045em;
}


.sectors-heading h2 span {
  display:
    block;

  color:
    #73c7eb;
}


.sectors-heading-side > p {
  margin: 0;

  color:
    #b9d3e2;

  font-size:
    0.86rem;

  line-height:
    1.78;
}


.sectors-value {
  display:
    flex;

  align-items:
    center;

  gap:
    13px;

  margin-top:
    24px;

  padding:
    15px 17px;

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  border-radius:
    14px;

  background:
    rgba(255, 255, 255, 0.055);

  backdrop-filter:
    blur(10px);
}


.sectors-value-icon {
  width:
    42px;

  height:
    42px;

  flex-shrink:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    11px;

  background:
    rgba(115, 199, 235, 0.14);

  color:
    #72c7eb;

  font-size:
    1.05rem;
}


.sectors-value strong {
  display:
    block;

  color:
    #ffffff;

  font-size:
    0.70rem;
}


.sectors-value span {
  display:
    block;

  margin-top:
    3px;

  color:
    #8eb6cd;

  font-size:
    0.54rem;
}


/* GRID */

.sector-feature-grid {
  position:
    relative;

  z-index:
    2;

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    16px;
}


.sector-experience-card {
  position:
    relative;

  min-height:
    300px;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  padding:
    24px;

  overflow:
    hidden;

  border:
    1px solid
    rgba(255, 255, 255, 0.11);

  border-radius:
    20px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.085),
      rgba(255, 255, 255, 0.035)
    );

  backdrop-filter:
    blur(8px);

  transition:
    transform 0.34s ease,
    border-color 0.34s ease,
    background 0.34s ease,
    box-shadow 0.34s ease;
}


.sector-experience-card:hover {
  transform:
    translateY(-8px);

  border-color:
    rgba(115, 199, 235, 0.46);

  background:
    linear-gradient(
      145deg,
      rgba(12, 105, 156, 0.62),
      rgba(4, 37, 66, 0.82)
    );

  box-shadow:
    0 28px 55px
    rgba(0, 15, 29, 0.23);
}


.sector-featured {
  background:
    linear-gradient(
      145deg,
      rgba(10, 103, 153, 0.38),
      rgba(255, 255, 255, 0.045)
    );
}


/* DECORACIÓN */

.sector-graphic {
  position:
    absolute;

  inset: 0;

  overflow:
    hidden;

  pointer-events:
    none;
}


.sector-ring {
  position:
    absolute;

  border:
    1px solid
    rgba(114, 199, 235, 0.11);

  border-radius:
    50%;

  transition:
    transform 0.55s ease,
    border-color 0.55s ease;
}


.ring-one {
  width:
    180px;

  height:
    180px;

  right:
    -78px;

  top:
    -70px;
}


.ring-two {
  width:
    105px;

  height:
    105px;

  right:
    -25px;

  top:
    -23px;
}


.sector-diagonal {
  position:
    absolute;

  width:
    130px;

  height:
    1px;

  right:
    -35px;

  bottom:
    55px;

  background:
    rgba(255, 255, 255, 0.08);

  transform:
    rotate(-38deg);
}


.sector-experience-card:hover
.ring-one {
  transform:
    scale(1.18);

  border-color:
    rgba(114, 199, 235, 0.23);
}


.sector-experience-card:hover
.ring-two {
  transform:
    scale(0.88);

  border-color:
    rgba(220, 45, 52, 0.26);
}


/* TOP */

.sector-top {
  position:
    relative;

  z-index:
    2;

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    space-between;
}


.sector-index {
  color:
    rgba(255, 255, 255, 0.22);

  font-size:
    1.55rem;

  font-weight:
    800;

  letter-spacing:
    -0.04em;

  transition:
    color 0.3s ease;
}


.sector-experience-card:hover
.sector-index {
  color:
    rgba(255, 255, 255, 0.70);
}


.sector-icon {
  width:
    52px;

  height:
    52px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius:
    14px;

  background:
    rgba(255, 255, 255, 0.08);

  color:
    #73c7eb;

  font-size:
    1.22rem;

  transition:
    transform 0.32s ease,
    background 0.32s ease,
    color 0.32s ease;
}


.sector-experience-card:hover
.sector-icon {
  transform:
    scale(1.08)
    rotate(-3deg);

  background:
    #ffffff;

  color:
    var(--blue-700);
}


/* CONTENT */

.sector-content {
  position:
    relative;

  z-index:
    2;

  margin-top:
    38px;

  transition:
    transform 0.34s ease;
}


.sector-experience-card:hover
.sector-content {
  transform:
    translateY(-10px);
}


.sector-kicker {
  display:
    block;

  margin-bottom:
    9px;

  color:
    #72c7eb;

  font-size:
    0.54rem;

  font-weight:
    800;

  letter-spacing:
    0.13em;
}


.sector-content h3 {
  margin: 0;

  color:
    #ffffff;

  font-size:
    1.15rem;

  font-weight:
    700;

  line-height:
    1.22;
}


.sector-content > p {
  min-height:
    48px;

  margin:
    10px 0 0;

  color:
    #b6d0df;

  font-size:
    0.66rem;

  line-height:
    1.6;
}


/* HOVER VALUE */

.sector-hover-content {
  max-height:
    0;

  overflow:
    hidden;

  opacity:
    0;

  transform:
    translateY(10px);

  transition:
    max-height 0.34s ease,
    opacity 0.28s ease,
    transform 0.28s ease;
}


.sector-experience-card:hover
.sector-hover-content {
  max-height:
    110px;

  opacity:
    1;

  transform:
    translateY(0);
}


.sector-benefit {
  display:
    flex;

  align-items:
    flex-start;

  gap:
    8px;

  margin-top:
    15px;

  color:
    #d7ebf5;

  font-size:
    0.58rem;

  line-height:
    1.55;
}


.sector-benefit i {
  flex-shrink:
    0;

  margin-top:
    2px;

  color:
    #73c7eb;
}


.sector-action {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  margin-top:
    13px;

  padding:
    0 0 4px;

  border:
    none;

  border-bottom:
    2px solid
    var(--red-500);

  background:
    transparent;

  color:
    #ffffff;

  font-size:
    0.60rem;

  font-weight:
    800;

  cursor:
    pointer;
}


.sector-action i {
  transition:
    transform 0.25s ease;
}


.sector-action:hover i {
  transform:
    translate(
      3px,
      -3px
    );
}


.sector-bottom-line {
  position:
    absolute;

  left:
    24px;

  bottom:
    17px;

  width:
    44px;

  height:
    3px;

  border-radius:
    999px;

  background:
    var(--red-500);

  transition:
    width 0.34s ease;
}


.sector-experience-card:hover
.sector-bottom-line {
  width:
    calc(100% - 48px);
}


/* CTA INFERIOR */

.sector-footer-cta {
  position:
    relative;

  z-index:
    2;

  min-height:
    110px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    25px;

  margin-top:
    18px;

  padding:
    24px 28px;

  border:
    1px solid
    rgba(255, 255, 255, 0.11);

  border-radius:
    18px;

  background:
    rgba(255, 255, 255, 0.055);

  backdrop-filter:
    blur(10px);
}


.sector-footer-label {
  display:
    block;

  color:
    #72c7eb;

  font-size:
    0.54rem;

  font-weight:
    800;

  letter-spacing:
    0.12em;
}


.sector-footer-cta strong {
  display:
    block;

  margin-top:
    5px;

  color:
    #ffffff;

  font-size:
    1rem;
}


.sector-footer-cta button {
  min-height:
    46px;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    8px;

  flex-shrink:
    0;

  padding:
    0 17px;

  border:
    1px solid
    rgba(255, 255, 255, 0.22);

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.07);

  color:
    #ffffff;

  font-size:
    0.64rem;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    background-color 0.25s ease,
    transform 0.25s ease;
}


.sector-footer-cta button:hover {
  transform:
    translateY(-2px);

  background:
    var(--red-600);
}


/* ========================================================= */
/* SECTORS RESPONSIVE */
 /* ========================================================= */

@media (max-width: 1120px) {

  .sectors-heading {
    grid-template-columns:
      1fr;

    gap:
      24px;
  }


  .sectors-heading-side {
    max-width:
      760px;
  }


  .sector-feature-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


@media (max-width: 680px) {

  .sector-feature-grid {
    grid-template-columns:
      1fr;
  }


  .sector-experience-card {
    min-height:
      280px;
  }


  .sector-hover-content {
    max-height:
      120px;

    opacity:
      1;

    transform:
      none;
  }


  .sector-content {
    transform:
      none !important;
  }


  .sector-footer-cta {
    align-items:
      flex-start;

    flex-direction:
      column;
  }


  .sector-footer-cta button {
    width:
      100%;
  }

}


/* ========================================================= */
/* CONTACT */
 /* ========================================================= */

.contact-section {
  position:
    relative;

  min-height:
    600px;

  display:
    flex;

  align-items:
    center;

  overflow:
    hidden;
}



.contact-pattern {
  position:
    absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at 82% 25%,
      rgba(78, 177, 221, 0.22),
      transparent 26%
    ),
    radial-gradient(
      circle at 68% 75%,
      rgba(220, 45, 52, 0.16),
      transparent 22%
    ),
    linear-gradient(
      135deg,
      #031f38,
      #07517f
    );
}


.contact-pattern::after {
  content: "";

  position:
    absolute;

  right:
    -120px;

  top:
    50%;

  width:
    520px;

  height:
    520px;

  transform:
    translateY(-50%)
    rotate(35deg);

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius:
    80px;
}


.contact-overlay {
  position:
    absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(3, 31, 56, 0.985),
      rgba(5, 55, 92, 0.87) 58%,
      rgba(5, 55, 92, 0.30)
    );
}


.contact-content {
  position:
    relative;

  z-index: 2;
}


.contact-content > * {
  max-width:
    760px;
}


.contact-content h2 {
  color:
    #ffffff;
}


.contact-content h2 span {
  display:
    block;

  color:
    #73c7eb;
}


.contact-content > p {
  margin:
    22px 0 0;

  color:
    #d1e2ec;

  font-size:
    0.95rem;

  line-height:
    1.75;
}


.contact-actions {
  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    11px;

  margin-top:
    30px;
}


.contact-whatsapp,
.contact-phone {
  min-height:
    52px;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    8px;

  padding:
    0 18px;

  border-radius:
    999px;

  font-size:
    0.72rem;

  font-weight:
    800;

  text-decoration:
    none;

  transition:
    transform 0.25s ease;
}


.contact-whatsapp {
  background:
    #ffffff;

  color:
    #138b4a;
}


.contact-phone {
  border:
    1px solid
    rgba(255, 255, 255, 0.30);

  background:
    rgba(255, 255, 255, 0.08);

  color:
    #ffffff;
}


.contact-whatsapp:hover,
.contact-phone:hover {
  transform:
    translateY(-3px);
}


/* ========================================================= */
/* FOOTER */
 /* ========================================================= */

.public-footer {
  background:
    #031f38;

  color:
    #ffffff;
}


.footer-grid {
  display:
    grid;

  grid-template-columns:
    1.5fr repeat(3, 1fr);

  gap:
    55px;

  padding:
    65px 0;
}


.footer-brand img {
  width:
    205px;

  filter:
    brightness(0)
    invert(1);
}


.footer-brand p {
  max-width:
    340px;

  margin:
    17px 0 0;

  color:
    #9eb8ca;

  font-size:
    0.66rem;

  line-height:
    1.65;
}


.footer-brand span {
  display:
    block;

  margin-top:
    13px;

  color:
    #6c91a8;

  font-size:
    0.56rem;
}


.footer-column {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    flex-start;

  gap:
    10px;
}


.footer-column strong {
  margin-bottom:
    7px;

  font-size:
    0.70rem;
}


.footer-column button,
.footer-column a {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    6px;

  padding: 0;

  border: none;

  background:
    transparent;

  color:
    #94afc2;

  font-size:
    0.61rem;

  text-align:
    left;

  text-decoration:
    none;

  cursor:
    pointer;
}


.footer-column button:hover,
.footer-column a:hover {
  color:
    #ffffff;
}


.footer-bottom {
  min-height:
    66px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.09);

  color:
    #668ba3;

  font-size:
    0.56rem;
}


/* ========================================================= */
/* FLOATING WHATSAPP */
 /* ========================================================= */

.floating-whatsapp {
  position:
    fixed;

  right:
    24px;

  bottom:
    24px;

  z-index:
    4500;

  width:
    56px;

  height:
    56px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    #20a65a;

  color:
    #ffffff;

  font-size:
    1.35rem;

  text-decoration:
    none;

  box-shadow:
    0 12px 28px
    rgba(32, 166, 90, 0.30);

  transition:
    transform 0.25s ease;
}


.floating-whatsapp:hover {
  transform:
    translateY(-4px)
    scale(1.04);
}


/* ========================================================= */
/* LIGHTBOX */
 /* ========================================================= */

.lightbox-backdrop {
  position:
    fixed;

  inset: 0;

  z-index:
    9000;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    22px;

  background:
    rgba(2, 20, 35, 0.94);

  backdrop-filter:
    blur(16px);
}


.lightbox-shell {
  width:
    min(
      100%,
      1350px
    );

  max-height:
    94vh;

  display:
    grid;

  grid-template-rows:
    auto minmax(0, 1fr) auto;

  overflow:
    hidden;

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  border-radius:
    24px;

  background:
    #031f38;

  box-shadow:
    0 35px 90px
    rgba(0, 0, 0, 0.38);
}


.lightbox-topbar {
  min-height:
    68px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  padding:
    0 20px 0 26px;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.09);
}


.lightbox-topbar > div {
  display:
    flex;

  align-items:
    center;

  gap:
    14px;
}


.lightbox-topbar span {
  color:
    #72c7eb;

  font-size:
    0.61rem;

  font-weight:
    800;

  letter-spacing:
    0.13em;
}


.lightbox-topbar strong {
  color:
    #ffffff;

  font-size:
    0.66rem;
}


.lightbox-topbar > button {
  width:
    42px;

  height:
    42px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid
    rgba(255, 255, 255, 0.16);

  border-radius:
    50%;

  background:
    rgba(255, 255, 255, 0.06);

  color:
    #ffffff;

  cursor:
    pointer;
}


.lightbox-viewer {
  position:
    relative;

  min-height:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  overflow:
    hidden;

  background:
    #01111e;
}


.lightbox-viewer img,
.lightbox-viewer video {
  width:
    100%;

  height:
    min(
      67vh,
      760px
    );

  object-fit:
    contain;

  background:
    #01111e;
}


.lightbox-nav {
  position:
    absolute;

  z-index:
    10;

  top:
    50%;

  transform:
    translateY(-50%);

  background:
    rgba(5, 47, 84, 0.78);

  backdrop-filter:
    blur(10px);
}


.lightbox-nav:hover {
  transform:
    translateY(-50%)
    scale(1.06);
}


.lightbox-nav.previous {
  left:
    18px;
}


.lightbox-nav.next {
  right:
    18px;
}


.lightbox-thumbs {
  display:
    flex;

  gap:
    8px;

  overflow-x:
    auto;

  padding:
    12px 16px;

  scrollbar-width:
    thin;

  scrollbar-color:
    #0d6a9f
    transparent;
}


.lightbox-thumbs button {
  position:
    relative;

  flex:
    0 0
    88px;

  height:
    62px;

  padding: 0;

  overflow:
    hidden;

  border:
    2px solid
    transparent;

  border-radius:
    9px;

  background:
    #052f54;

  opacity:
    0.58;

  cursor:
    pointer;

  transition:
    opacity 0.22s ease,
    border-color 0.22s ease;
}


.lightbox-thumbs button.active,
.lightbox-thumbs button:hover {
  opacity: 1;

  border-color:
    var(--red-500);
}


.lightbox-thumbs img,
.lightbox-thumbs video {
  width: 100%;
  height: 100%;

  object-fit:
    cover;
}


.thumb-video {
  position:
    absolute;

  inset: 0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  color:
    #ffffff;

  background:
    rgba(3, 31, 56, 0.34);
}


.lightbox-enter-active,
.lightbox-leave-active {
  transition:
    opacity 0.26s ease;
}


.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}


/* ========================================================= */
/* RESPONSIVE */
 /* ========================================================= */

@media (max-width: 1150px) {

  .video-story-grid {
    grid-template-columns:
      1fr;

    gap:
      35px;
  }



  .hero-grid {
    grid-template-columns:
      1fr;

    gap:
      35px;
  }


  .hero-experience {
    max-width:
      560px;
  }


  .hero-metrics {
    width:
      76%;
  }


  .value-grid,
  .process-grid,
  .sector-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }


  .about-grid,
  .why-layout {
    grid-template-columns:
      1fr;
  }


  .services-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }


  .clients-heading {
    grid-template-columns:
      1fr;

    gap:
      22px;
  }



  .why-visual {
    max-width:
      620px;
  }


  .footer-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


@media (max-width: 760px) {

  .video-story-player {
    height:
      360px;

    border-radius:
      20px;
  }


  .gallery-slider {
    margin-top:
      18px;
  }


  .gallery-toolbar {
    flex-wrap:
      nowrap;

    overflow-x:
      auto;

    padding-bottom:
      8px;

    scrollbar-width:
      none;
  }


  .gallery-toolbar::-webkit-scrollbar {
    display:
      none;
  }



  .client-card {
    flex-basis:
      205px;

    height:
      150px;
  }



  .content-container {
    width:
      min(
        calc(100% - 28px),
        1400px
      );
  }


  .section {
    padding:
      76px 0;
  }


  .hero {
    min-height:
      auto;
  }


  .hero-grid {
    width:
      min(
        calc(100% - 28px),
        1500px
      );

    padding:
      130px 0 350px;
  }


  .hero-overlay {
    background:
      linear-gradient(
        rgba(3, 31, 56, 0.89),
        rgba(3, 31, 56, 0.97)
      );
  }


  .hero h1 {
    font-size:
      3.05rem;
  }


  .hero-lead {
    font-size:
      0.90rem;
  }


  .hero-actions {
    display:
      grid;

    grid-template-columns:
      1fr;
  }


  .button-primary,
  .button-secondary {
    width:
      100%;
  }


  .hero-trust {
    display:
      grid;

    gap:
      10px;
  }


  .hero-experience {
    display:
      none;
  }


  .hero-progress {
    bottom:
      320px;

    left:
      20px;
  }


  .hero-metrics {
    width:
      100%;

    grid-template-columns:
      repeat(2, 1fr);

    border-top-left-radius:
      20px;
  }


  .hero-metrics article {
    min-height:
      86px;
  }


  .value-grid,
  .services-grid,
  .process-grid,
  .sector-grid,
  .why-grid {
    grid-template-columns:
      1fr;
  }


  .about-media {
    min-height:
      495px;
  }


  .about-main {
    width:
      90%;

    height:
      425px;
  }


  .about-secondary {
    width:
      46%;

    height:
      185px;
  }


  .about-experience {
    right: 0;
  }


  .about-points {
    grid-template-columns:
      1fr;
  }


  .service-card {
    height:
      365px;

    min-height:
      365px;
  }


  .case-card {
    height:
      410px;

    min-height:
      410px;
  }


  .visual-content {
    transform:
      translateY(0);
  }


  .visual-content p,
  .visual-action,
  .case-result {
    opacity:
      1;

    transform:
      translateY(0);
  }


  .slider-arrow {
    display:
      none;
  }


  .horizontal-track {
    margin-right:
      -14px;

    padding-right:
      20px;
  }


  .gallery-heading {
    align-items:
      flex-start;

    flex-direction:
      column;
  }


  .gallery-summary {
    align-items:
      flex-start;
  }


  .gallery-card {
    flex-basis:
      82vw;

    height:
      375px;
  }


  .why-visual {
    min-height:
      440px;

    transform:
      scale(0.78);

    transform-origin:
      top left;

    margin-bottom:
      -80px;
  }


  .contact-section {
    min-height:
      570px;
  }


  .contact-overlay {
    background:
      rgba(3, 31, 56, 0.88);
  }


  .contact-actions {
    display:
      grid;

    grid-template-columns:
      1fr;
  }


  .footer-grid {
    grid-template-columns:
      1fr;

    gap:
      35px;
  }


  .footer-bottom {
    flex-direction:
      column;

    align-items:
      flex-start;

    justify-content:
      center;

    gap:
      6px;

    padding:
      18px 0;
  }


  .lightbox-backdrop {
    padding:
      8px;
  }


  .lightbox-shell {
    border-radius:
      16px;
  }


  .lightbox-viewer img,
  .lightbox-viewer video {
    height:
      62vh;
  }


  .lightbox-nav {
    width:
      40px;

    height:
      40px;
  }

}


@media (max-width: 430px) {

  .hero h1 {
    font-size:
      2.65rem;
  }


  .hero-grid {
    padding-bottom:
      430px;
  }


  .hero-metrics {
    grid-template-columns:
      1fr;
  }


  .hero-metrics article {
    min-height:
      64px;

    flex-direction:
      row;

    align-items:
      center;

    justify-content:
      space-between;
  }


  .hero-progress {
    bottom:
      400px;
  }


  .why-visual {
    transform:
      scale(0.64);

    margin-bottom:
      -150px;
  }


  .floating-whatsapp {
    right:
      16px;

    bottom:
      16px;

    width:
      52px;

    height:
      52px;
  }

}


/* ========================================================= */
/* FUMIDEZ — PREMIUM UX REFRESH                              */
/* Diseño continuo, sobrio y editorial                       */
/* ========================================================= */

.public-home {
  --surface: rgba(255, 255, 255, 0.68);
  --surface-strong: rgba(255, 255, 255, 0.88);
  --hairline: rgba(7, 59, 101, 0.10);
  --premium-shadow: 0 24px 70px rgba(3, 31, 56, 0.10);
  --premium-shadow-hover: 0 34px 90px rgba(3, 31, 56, 0.16);
  --premium-radius: 30px;

  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 8% 18%, rgba(14, 121, 173, 0.10), transparent 26%),
    radial-gradient(circle at 92% 34%, rgba(197, 30, 38, 0.055), transparent 22%),
    radial-gradient(circle at 48% 68%, rgba(11, 101, 153, 0.07), transparent 30%),
    linear-gradient(180deg, #f8fbfd 0%, #f2f7fa 48%, #f8fbfd 100%);
  color: var(--slate-900);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
}

.public-home::before {
  content: "";
  position: fixed;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background-image:
    linear-gradient(rgba(5, 47, 84, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(5, 47, 84, 0.025) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent);
}

/* Elimina el efecto de “bloques blancos” entre secciones claras */
.value-section,
.about-section,
.video-story-section,
.services-section,
.process-section,
.gallery-section {
  background: transparent !important;
}

.section {
  position: relative;
  padding: 112px 0;
}

.section + .section::before,
.value-section + .section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: min(calc(100% - 96px), 1400px);
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(7, 59, 101, 0.10), transparent);
}

.content-container {
  width: min(calc(100% - 64px), 1440px);
}

.section-heading,
.gallery-heading {
  position: relative;
}

.section-heading h2,
.about-copy h2,
.gallery-heading h2,
.video-story-copy h2,
.process-heading h2 {
  letter-spacing: -0.055em;
  text-wrap: balance;
}

.section-heading > p,
.about-copy p,
.video-story-copy p,
.process-heading p {
  font-size: 1rem;
  line-height: 1.78;
}

/* Cards claras: vidrio suave, menos “dashboard”, más corporativo */
.value-card,
.process-step-body {
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: rgba(255, 255, 255, 0.66);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  backdrop-filter: blur(20px) saturate(135%);
  box-shadow: 0 14px 45px rgba(3, 31, 56, 0.065), inset 0 1px 0 rgba(255,255,255,.92);
}

.value-card {
  min-height: 168px;
  border-radius: 24px;
}

.value-card:hover {
  transform: translateY(-8px) scale(1.012);
  box-shadow: var(--premium-shadow-hover);
}

.about-main,
.about-secondary,
.video-story-player {
  border: 1px solid rgba(255,255,255,.75);
  box-shadow: var(--premium-shadow);
}

.about-main,
.video-story-player {
  border-radius: 32px;
}

.about-secondary {
  border-radius: 24px;
}

/* Servicios: más cinematográficos */
.services-grid {
  gap: 24px;
}

.service-card {
  min-height: 430px;
  height: 430px;
  border: 1px solid rgba(255,255,255,.72);
  border-radius: 30px;
  box-shadow: 0 20px 55px rgba(3,31,56,.11);
}

.visual-card {
  transform: translateZ(0);
}

.visual-card:hover {
  transform: translateY(-9px) scale(1.008);
  box-shadow: 0 36px 90px rgba(3,31,56,.24);
}

.visual-card > img,
.visual-card > video {
  filter: brightness(.72) saturate(.96) contrast(1.02);
}

.visual-card:hover > img,
.visual-card:hover > video {
  transform: scale(1.055);
  filter: brightness(.92) saturate(1.05) contrast(1.02);
}

.visual-overlay {
  background:
    linear-gradient(to top, rgba(3,31,56,.96) 0%, rgba(3,31,56,.52) 46%, rgba(3,31,56,.08) 100%);
}

.visual-content {
  left: 28px;
  right: 28px;
  bottom: 26px;
}

.visual-content h3 {
  font-size: 1.36rem;
  letter-spacing: -.025em;
}

.visual-label {
  color: #a8def4;
}

/* ========================================================= */
/* GALERÍA / TRABAJOS — experiencia visual premium           */
/* ========================================================= */

.gallery-section {
  overflow: hidden;
}

.gallery-section::after {
  content: "";
  position: absolute;
  z-index: -1;
  width: 680px;
  height: 680px;
  right: -280px;
  top: 4%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,121,173,.12), transparent 68%);
  pointer-events: none;
}

.gallery-heading {
  align-items: flex-end;
  padding: 34px 38px;
  border: 1px solid rgba(255,255,255,.86);
  border-radius: 30px;
  background: rgba(255,255,255,.58);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  backdrop-filter: blur(22px) saturate(140%);
  box-shadow: 0 18px 60px rgba(3,31,56,.07);
}

.gallery-summary {
  min-width: 180px;
  padding-left: 28px;
  border-left: 1px solid rgba(7,59,101,.10);
}

.gallery-summary strong {
  font-size: 3.5rem;
  line-height: .9;
  letter-spacing: -.06em;
}

.gallery-summary span {
  margin-top: 10px;
  font-size: .72rem;
  line-height: 1.45;
}

.gallery-toolbar {
  position: relative;
  z-index: 3;
  gap: 10px;
  margin-top: 24px;
  padding: 10px;
  width: fit-content;
  max-width: 100%;
  border: 1px solid rgba(255,255,255,.86);
  border-radius: 999px;
  background: rgba(255,255,255,.64);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 12px 38px rgba(3,31,56,.07);
}

.gallery-toolbar button {
  min-height: 44px;
  padding: 0 16px;
  border-color: transparent;
  background: transparent;
  font-size: .7rem;
}

.gallery-toolbar button:hover,
.gallery-toolbar button.active {
  border-color: transparent;
  background: var(--blue-900);
  box-shadow: 0 8px 22px rgba(3,31,56,.18);
}

.gallery-slider {
  margin-top: 22px;
  padding: 4px 0 10px;
}

.gallery-track {
  gap: 20px;
  padding: 18px 5px 38px;
}

.gallery-card {
  flex: 0 0 min(430px, 84vw);
  height: 510px;
  border: 1px solid rgba(255,255,255,.78);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(3,31,56,.12);
  scroll-snap-align: center;
}

.gallery-card:nth-child(3n + 2) {
  flex-basis: min(520px, 88vw);
}

.gallery-card::before {
  content: "Abrir trabajo";
  position: absolute;
  z-index: 5;
  top: 22px;
  left: 22px;
  padding: 9px 13px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 999px;
  background: rgba(3,31,56,.38);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  color: #fff;
  font-size: .64rem;
  font-weight: 700;
  letter-spacing: .02em;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity .28s ease, transform .28s ease;
}

.gallery-card:hover::before {
  opacity: 1;
  transform: translateY(0);
}

.gallery-card-content {
  padding-top: 70px;
}

.gallery-card .visual-action {
  padding: 10px 14px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  background: rgba(255,255,255,.10);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.gallery-arrow {
  width: 54px;
  height: 54px;
  border: 1px solid rgba(255,255,255,.75);
  background: rgba(255,255,255,.84);
  color: var(--blue-900);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 40px rgba(3,31,56,.16);
}

.gallery-arrow:hover {
  background: var(--blue-900);
  color: #fff;
}

/* Lightbox: convierte la galería en visor, no en modal genérico */
.lightbox-backdrop {
  background: rgba(2, 17, 30, .82);
  -webkit-backdrop-filter: blur(24px) saturate(115%);
  backdrop-filter: blur(24px) saturate(115%);
}

.lightbox-shell {
  width: min(calc(100% - 48px), 1500px);
  max-height: calc(100vh - 48px);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 32px;
  background: rgba(5, 26, 44, .90);
  box-shadow: 0 50px 140px rgba(0,0,0,.42);
}

.lightbox-topbar {
  border-bottom-color: rgba(255,255,255,.10);
}

.lightbox-viewer img,
.lightbox-viewer video {
  max-height: 70vh;
  border-radius: 20px;
}

.lightbox-thumbs {
  padding: 14px 18px 20px;
  background: rgba(255,255,255,.025);
}

.lightbox-thumbs button {
  border-radius: 14px;
  overflow: hidden;
  opacity: .62;
  transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
}

.lightbox-thumbs button:hover,
.lightbox-thumbs button.active {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.22);
}

/* Transiciones más finas y accesibles */
button,
a,
.visual-card,
.value-card,
.process-step-body {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible,
a:focus-visible,
.visual-card:focus-visible {
  outline: 3px solid rgba(14,121,173,.35);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .public-home *,
  .public-home *::before,
  .public-home *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
  }
}

@media (max-width: 900px) {
  .content-container {
    width: min(calc(100% - 30px), 1440px);
  }

  .section {
    padding: 82px 0;
  }

  .gallery-heading {
    padding: 28px;
  }

  .gallery-summary {
    padding-left: 0;
    border-left: 0;
  }

  .gallery-toolbar {
    width: 100%;
    border-radius: 22px;
  }

  .gallery-card,
  .gallery-card:nth-child(3n + 2) {
    flex-basis: 86vw;
    height: 470px;
  }
}

@media (max-width: 560px) {
  .public-home::before {
    display: none;
  }

  .section {
    padding: 68px 0;
  }

  .gallery-heading {
    padding: 22px;
    border-radius: 24px;
  }

  .gallery-card,
  .gallery-card:nth-child(3n + 2) {
    flex-basis: 88vw;
    height: 430px;
    border-radius: 24px;
  }

  .gallery-card::before {
    opacity: 1;
    transform: none;
  }

  .lightbox-shell {
    width: calc(100% - 18px);
    max-height: calc(100vh - 18px);
    border-radius: 24px;
  }
}

.public-home {
  --surface-soft: #f5f5f7;
  --corporate-section-background: #f5f5f7;
  --corporate-panel: #ffffff;
  --corporate-border: #e5e5e9;
}
.why-section, .sectors-section { border-block: 1px solid var(--corporate-border); }
.why-content h2, .sectors-heading h2 { font-size: clamp(2rem, 3.7vw, 3.65rem); line-height: 1.16; letter-spacing: -.035em; }
.why-content h2, .sectors-heading h2 { color: var(--blue-950); }
.why-content h2 span, .sectors-heading h2 span { color: var(--blue-900); }
.why-lead, .why-card p, .sectors-heading-side > p { color: #59616d; line-height: 1.8; }
.why-card, .sector-experience-card, .sectors-value {
  background: var(--corporate-panel);
  border: 1px solid var(--corporate-border);
  border-radius: 18px;
  box-shadow: none;
}
.why-card { padding: 22px; }
.why-card:hover, .sector-experience-card:hover {
  background: #ffffff;
  border-color: #c51e2640;
}
.metric-bubble {
  background: linear-gradient(145deg, rgba(167,224,246,.12), rgba(255,255,255,.025));
  border-color: var(--corporate-border);
  box-shadow: 0 16px 40px rgba(3,31,56,.16);
}
.sector-orb { opacity: .25; }
@media (max-width: 700px) {
  .why-card { padding: 16px; }
  .why-content h2, .sectors-heading h2 { font-size: clamp(1.9rem, 7vw, 2.6rem); }
}
.public-home :is(button, a, select, input):focus-visible {
  outline: 3px solid var(--red-600);
  outline-offset: 5px;
}
.public-home section[id] { scroll-margin-top: 110px; }
.hero { isolation: isolate; }
.hero-overlay {
  background: linear-gradient(100deg, rgba(3,31,56,.95) 5%, rgba(5,47,84,.83) 48%, rgba(3,31,56,.32));
}
.hero-copy h1 { font-size: clamp(2.5rem, 4.6vw, 4.8rem); line-height: 1.12; letter-spacing: -.045em; }
.hero-copy h1 span { color: #a7e0f6; }
.hero-lead { max-width: 660px; line-height: 1.85; color: #e4edf5; }
.hero-kicker { letter-spacing: .12em; font-size: .7rem; }
.hero-experience { backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.25); box-shadow: 0 24px 70px #031f3830; }
.hero-metrics { border-top: 1px solid #ffffff30; backdrop-filter: blur(16px); }
.hero-metrics strong { letter-spacing: -.035em; }
.button-primary { background: linear-gradient(115deg, var(--red-600), var(--red-700)); box-shadow: 0 10px 30px #a6171d40; }
.button-primary:hover { box-shadow: 0 16px 34px #a6171d60; transform: translateY(-3px); }
.button-secondary { border-color: #ffffff60; background: #ffffff0d; }
.value-section { background: var(--surface-soft); }
.value-card { border: 1px solid #dce7f0; box-shadow: 0 10px 35px #052f5408; border-radius: 18px; }
.value-card:hover { border-color: #0e79ad55; box-shadow: 0 18px 42px #052f5412; }
.about-copy h2, .section-heading h2, .process-heading h2, .gallery-heading h2 { letter-spacing: -.035em; line-height: 1.2; }
.about-main, .about-secondary { box-shadow: 0 24px 60px #052f541a; }
.services-section { background: linear-gradient(180deg, #f5f8fc, #fff); }
.service-card { border-radius: 24px; box-shadow: 0 15px 40px #052f541a; border: 1px solid #d9e4ec; }
.service-card .visual-overlay { background: linear-gradient(180deg, #031f3805 5%, #031f3880 38%, #031f38f5 100%); }
.service-card .visual-content p { color: #e1ecf5; }
.service-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 16px; }
.service-actions .visual-action { border: 0; background: transparent; padding: 8px 0; color: white; font: inherit; font-size: .75rem; cursor: pointer; }
.service-quote { display: inline-flex; align-items: center; gap: 7px; border: 1px solid #ffffff60; border-radius: 999px; padding: 8px 14px; color: white; background: #ffffff15; font-size: .75rem; text-decoration: none; transition: background .2s; }
.service-quote:hover { background: #ffffff30; color: white; }
.clients-section { background: linear-gradient(180deg, #fff, #eef4f8); border-block: 1px solid #d9e4ec; }
.clients-section .clients-heading h2 { color: var(--blue-950); letter-spacing: -.035em; }
.clients-section .clients-heading h2 span { color: var(--blue-700); }
.clients-section .eyebrow.light { color: var(--blue-900); }
.clients-section .clients-heading p { color: var(--slate-700); }
.clients-viewport::before { background: linear-gradient(90deg, #f6f9fb, transparent); width: 40px; }
.clients-viewport::after { background: linear-gradient(-90deg, #f6f9fb, transparent); width: 40px; }
.clients-track { gap: 30px; padding-block: 32px; }
.clients-track.is-paused { animation-play-state: paused; }
.clients-section .client-card { flex: 0 0 260px; height: 222px; padding: 16px 12px; align-items: center; justify-content: center; gap: 20px; border: 0; border-radius: 0; background: transparent; overflow: visible; }
.clients-section .client-card:hover { background: transparent; transform: translateY(-5px); }
.clients-section .client-logo-wrap { width: 230px; height: 135px; border-radius: 0; background: transparent; box-shadow: none; overflow: visible; }
.clients-section .client-logo-wrap img { width: 100%; height: 100%; padding: 5px; object-fit: contain; transition: transform .3s; }
.clients-section .client-card:hover img { transform: scale(1.06); }
.clients-section .client-copy { text-align: center; }
.clients-section .client-copy strong { color: var(--blue-950); font-size: .85rem; }
.clients-section .client-copy span { color: var(--slate-700); }
.clients-section .client-hover { display: none; }
.clients-section .clients-note p { color: var(--slate-700); }
.clients-section .clients-note-line { background: var(--blue-600); }
.clients-pause { display: inline-flex; align-items: center; gap: 7px; color: var(--blue-800); border: 1px solid #b8ccda; border-radius: 999px; padding: 9px 16px; background: transparent; font-size: .75rem; margin-top: 20px; }
.clients-pause:hover { background: #e1edf5; }
.process-section { background: white; }
.process-step-body { border: 1px solid #dce7f0; box-shadow: 0 12px 32px #052f5408; }
.gallery-card { border-radius: 20px; }
.sector-experience-card { border: 1px solid #ffffff25; }
.contact-section { background-color: var(--blue-950); }
.contact-content h2 { letter-spacing: -.04em; line-height: 1.15; }
.contact-brief { width: min(100%, 600px); margin: 30px auto 24px; padding: 24px; text-align: left; border: 1px solid #ffffff30; background: #ffffff0d; border-radius: 20px; backdrop-filter: blur(12px); }
.contact-brief label { display: block; color: #fff; font-size: .8rem; font-weight: 600; margin: 0 0 8px; }
.contact-brief label span { color: #bacfdf; font-weight: 400; }
.contact-brief select, .contact-brief input { width: 100%; min-height: 48px; border: 1px solid #ffffff40; border-radius: 10px; background: #fff; color: #152a3f; padding: 12px 14px; font: inherit; font-size: .85rem; margin-bottom: 18px; }
.contact-brief p { font-size: .72rem; line-height: 1.6; margin: 0; color: #c6dcea; }
.contact-actions { justify-content: center; }
.public-footer { border-top: 4px solid var(--red-600); }
.floating-whatsapp { box-shadow: 0 12px 34px #031f3840; border: 3px solid #fff; }
@media (max-width: 700px) {
  .hero-copy h1 { font-size: clamp(2.15rem, 9vw, 3rem); }
  .hero-lead { font-size: .95rem; }
  .hero-actions { gap: 12px; }
  .hero-actions button { width: 100%; justify-content: center; }
  .clients-section .client-card { flex-basis: 210px; height: 200px; }
  .clients-section .client-logo-wrap { width: 190px; height: 115px; }
  .contact-brief { padding: 18px; }
  .service-actions { gap: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .clients-viewport { overflow-x: auto; }
  .clients-track { animation: none; transform: none; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .public-home *, .public-home *::before, .public-home *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
.public-home { font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: #1d2530; }
.public-home .section { padding-block: clamp(72px, 8vw, 120px); }
.public-home .eyebrow { color: var(--blue-900); letter-spacing: .14em; font-weight: 700; }
.public-home .eyebrow::before { background: var(--red-600); }
.public-home .hero-kicker { color: #fff; }
.public-home .hero-kicker > span { background: var(--red-500); box-shadow: 0 0 0 5px #c51e2626; }
.public-home .hero-copy h1 span { color: #fff; }
.public-home .hero-copy h1 { max-width: 850px; font-weight: 700; }
.public-home .hero-experience { border-radius: 24px; box-shadow: none; background: #031f3866; }
.public-home .button-primary { border-radius: 999px; background: var(--red-600); box-shadow: none; }
.public-home .button-primary:hover { background: var(--red-700); box-shadow: 0 8px 24px #c51e2620; transform: translateY(-2px); }
.public-home .button-secondary { border-radius: 999px; }
.public-home .hero-metrics strong { font-weight: 650; }
.public-home .value-card { box-shadow: none; background: white; }
.public-home .value-icon { background: #edf3f8; color: var(--blue-900); }
.public-home .value-card:hover { border-color: #c51e2640; }
.solutions-shortcuts { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding-block: 34px; border-bottom: 1px solid #e5e5e9; }
.solutions-shortcuts > span { flex-basis: 100%; text-align: center; margin-bottom: 6px; font-size: .8rem; color: #59616d; }
.solutions-shortcuts button { display: inline-flex; gap: 10px; align-items: center; border: 1px solid #e5e5e9; background: #fff; color: var(--blue-950); border-radius: 999px; padding: 12px 18px; font-size: .82rem; transition: border-color .2s, background .2s; }
.solutions-shortcuts button:hover { background: #edf3f8; border-color: #c51e2650; color: var(--blue-800); }
.public-home .about-copy h2 span, .public-home .section-heading h2 span,
.public-home .process-heading h2 span, .public-home .gallery-heading h2 span { color: var(--blue-900); }
.public-home .services-section { background: #f5f5f7; }
.public-home .clients-section { background: #fff; border-color: #e5e5e9; }
.public-home .clients-heading h2 span { color: var(--blue-900); }
.public-home .clients-viewport::before { background: linear-gradient(90deg, white, transparent); }
.public-home .clients-viewport::after { background: linear-gradient(-90deg, white, transparent); }
.public-home .clients-note-line { background: var(--red-600); }
.public-home .clients-pause { border-color: #e5e5e9; color: #59616d; }
.public-home .clients-pause:hover { background: #f5f5f7; }
.public-home .why-layout { grid-template-columns: .85fr 1.15fr; gap: clamp(32px, 5vw, 80px); }
.experience-editorial { padding: 42px; border-radius: 28px; background: white; border: 1px solid #e5e5e9; }
.experience-statement { margin: 24px 0 32px; font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 650; line-height: 1.15; letter-spacing: -.04em; color: var(--blue-950); }
.experience-statement > span { color: #727780; }
.experience-facts { display: grid; gap: 24px; }
.experience-facts > div { display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #ededf0; }
.experience-facts strong { font-size: 2rem; font-weight: 650; letter-spacing: -.04em; color: var(--blue-900); }
.experience-facts span { font-size: .85rem; line-height: 1.55; color: #59616d; }
.editorial-link { display: inline-flex; align-items: center; gap: 12px; background: none; color: var(--blue-800); border: 0; padding: 12px 0; margin-top: 18px; font-size: .9rem; font-weight: 600; }
.editorial-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.public-home .why-card { min-height: 145px; border-radius: 16px; }
.public-home .why-card h3 { color: var(--blue-950); font-size: 1rem; }
.public-home .why-card > i { color: var(--blue-900); }
.public-home .why-card p { font-size: .85rem; }
.public-home .process-step-number { color: var(--blue-900); border-color: #d4e0eb; background: #fff; }
.public-home .process-step-icon, .public-home .process-badge > i { color: var(--blue-900); background: #edf3f8; }
.public-home .sectors-section { background: #f5f5f7; }
.public-home .sector-graphic, .public-home .sector-orb { display: none; }
.public-home .sector-experience-card { background: white; border: 1px solid #e5e5e9; padding: 28px; min-height: 330px; }
.public-home .sector-experience-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px #1d253009; border-color: #c51e2638; }
.public-home .sector-content, .public-home .sector-experience-card:hover .sector-content { transform: none; }
.public-home .sector-content h3, .public-home .sectors-value strong { color: var(--blue-950); }
.public-home .sector-content > p, .public-home .sectors-value span { color: #59616d; }
.public-home .sector-index { color: #a1a4ab; }
.public-home .sector-kicker { color: var(--blue-800); }
.public-home .sector-icon, .public-home .sector-experience-card:hover .sector-icon, .public-home .sectors-value-icon { color: var(--blue-900); background: #edf3f8; border-color: transparent; }
.public-home .sector-hover-content, .public-home .sector-experience-card:hover .sector-hover-content { opacity: 1; visibility: visible; max-height: none; transform: none; margin-top: 18px; }
.public-home .sector-benefit { color: #59616d; }
.public-home .sector-benefit i, .public-home .sector-action { color: var(--blue-800); }
.public-home .sector-action { background: transparent; border-color: #d4e0eb; }
.public-home .sector-bottom-line { background: var(--red-600); }
.public-home .sector-footer-cta { background: #fff; border: 1px solid #e5e5e9; border-radius: 20px; }
.public-home .sector-footer-label { color: var(--blue-900); }
.public-home .sector-footer-cta strong { color: var(--blue-950); }
.public-home .sector-footer-cta button { background: var(--blue-900); color: #fff; border-radius: 999px; border: 0; }
.public-home .sector-footer-cta button:hover { background: var(--blue-800); }
.faq-section { background: white; }
.faq-layout { display: grid; grid-template-columns: .85fr 1.15fr; gap: clamp(30px, 6vw, 90px); }
.faq-layout h2 { font-size: clamp(2rem, 3.5vw, 3.4rem); line-height: 1.15; letter-spacing: -.04em; color: var(--blue-950); margin: 20px 0; font-weight: 650; }
.faq-layout h2 span { color: #727780; }
.faq-layout > div > p { color: #59616d; line-height: 1.75; }
.faq-list details { border-bottom: 1px solid #e5e5e9; padding: 22px 0; }
.faq-list summary { cursor: pointer; color: var(--blue-950); font-size: 1.05rem; font-weight: 600; line-height: 1.5; padding-right: 16px; }
.faq-list summary::marker, .consultation-preview summary::marker { color: var(--blue-900); }
.faq-list details[open] summary { color: var(--blue-800); }
.faq-list details p { color: #59616d; line-height: 1.85; font-size: .95rem; margin: 16px 0 0; max-width: 65ch; }
.public-home .contact-section { background: #f5f5f7; padding-block: clamp(72px, 8vw, 120px); }
.public-home .contact-pattern, .public-home .contact-overlay { display: none; }
.public-home .contact-content h2 { color: var(--blue-950); }
.public-home .contact-content h2 span { color: var(--blue-900); }
.public-home .contact-content > p { color: #59616d; }
.public-home .contact-brief { background: #fff; border: 1px solid #e5e5e9; border-radius: 24px; padding: clamp(22px, 4vw, 40px); backdrop-filter: none; box-shadow: 0 12px 40px #1d253006; max-width: 660px; }
.consultation-heading { display: flex; justify-content: space-between; gap: 12px; color: var(--blue-800); padding-bottom: 22px; margin-bottom: 22px; border-bottom: 1px solid #e5e5e9; font-size: .85rem; font-weight: 600; }
.public-home .contact-brief label { color: var(--blue-950); font-size: .85rem; }
.public-home .contact-brief label span { color: #727780; }
.public-home .contact-brief select, .public-home .contact-brief input, .public-home .contact-brief textarea { width: 100%; min-height: 50px; border: 1px solid #d6d6dc; border-radius: 12px; background: #fafafa; color: #1d2530; padding: 12px 14px; font: inherit; font-size: .9rem; margin-bottom: 22px; }
.public-home .contact-brief textarea { resize: vertical; }
.public-home .contact-brief p { color: #59616d; font-size: .8rem; }
.consultation-preview { background: #f7f7f9; border-radius: 12px; padding: 16px; margin-bottom: 18px; }
.consultation-preview summary { cursor: pointer; color: var(--blue-800); font-size: .85rem; font-weight: 600; }
.public-home .consultation-preview p { white-space: pre-line; margin: 16px 0 0; line-height: 1.75; }
.public-home .contact-whatsapp { background: var(--blue-900); border-radius: 999px; color: #fff; box-shadow: none; }
.public-home .contact-whatsapp:hover { background: var(--blue-800); box-shadow: none; }
.public-home .contact-phone { color: var(--blue-950); border-color: #d6d6dc; border-radius: 999px; background: white; }
.public-home .contact-phone:hover { color: var(--blue-800); background: white; border-color: var(--blue-900); }
.public-home .faq-list summary:focus-visible, .consultation-preview summary:focus-visible { outline: 2px solid var(--red-600); outline-offset: 5px; border-radius: 4px; }
@media (max-width: 1000px) {
  .public-home .why-layout, .faq-layout { grid-template-columns: 1fr; }
  .experience-editorial { max-width: none; }
}
@media (max-width: 600px) {
  .experience-editorial { padding: 24px; }
  .experience-facts > div { grid-template-columns: 110px 1fr; }
  .experience-facts strong { font-size: 1.7rem; }
  .public-home .why-grid { grid-template-columns: 1fr; }
  .solutions-shortcuts { justify-content: flex-start; gap: 8px; }
  .solutions-shortcuts > span { text-align: left; }
  .solutions-shortcuts button { font-size: .75rem; padding: 10px 12px; }
}
</style>
