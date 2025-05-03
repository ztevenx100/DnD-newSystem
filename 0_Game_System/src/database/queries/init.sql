-- Creation of tables

-- Users table
CREATE TABLE usuarios (
    usu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usu_nombre VARCHAR(100) NOT NULL,
    usu_email VARCHAR(100) UNIQUE NOT NULL,
    usu_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usu_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game System table
CREATE TABLE sistema_juego (
    sju_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sju_nombre VARCHAR(100) NOT NULL,
    sju_descripcion TEXT,
    sju_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sju_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Character table
CREATE TABLE personajes_usuario (
    pus_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pus_usuario UUID REFERENCES usuarios(usu_id),
    pus_sistema_juego UUID REFERENCES sistema_juego(sju_id),
    pus_nombre VARCHAR(50) NOT NULL,
    pus_clase VARCHAR(3) NOT NULL,
    pus_raza VARCHAR(3) NOT NULL,
    pus_trabajo VARCHAR(3) NOT NULL,
    pus_nivel INTEGER NOT NULL DEFAULT 1,
    pus_puntos_suerte INTEGER NOT NULL DEFAULT 1,
    pus_vida INTEGER NOT NULL DEFAULT 1,
    pus_arma_principal VARCHAR(50),
    pus_arma_secundaria VARCHAR(50),
    pus_cantidad_oro INTEGER DEFAULT 0,
    pus_cantidad_plata INTEGER DEFAULT 0,
    pus_cantidad_bronce INTEGER DEFAULT 0,
    pus_descripcion TEXT,
    pus_conocimientos VARCHAR(100),
    pus_alineacion CHAR(1),
    pus_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pus_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE habilidad (
    hab_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hab_nombre VARCHAR(100) NOT NULL,
    hab_siglas VARCHAR(10) NOT NULL,
    hab_tipo CHAR(1) NOT NULL, -- C: Class, E: Extra, R: Ring
    had_estadistica_base VARCHAR(3), -- STR, INT, DEX, CON, PER, CHA
    hab_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hab_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Character statistics table
CREATE TABLE estadistica_personaje (
    epe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epe_usuario UUID REFERENCES usuarios(usu_id),
    epe_personaje UUID REFERENCES personajes_usuario(pus_id),
    epe_sigla VARCHAR(3) NOT NULL, -- STR, INT, DEX, CON, PER, CHA
    epe_nombre VARCHAR(50) NOT NULL,
    epe_num_dado INTEGER NOT NULL DEFAULT 0,
    epe_num_clase INTEGER NOT NULL DEFAULT 0,
    epe_num_nivel INTEGER NOT NULL DEFAULT 0,
    epe_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    epe_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Character skills table
CREATE TABLE habilidad_personaje (
    hpe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hpe_habilidad UUID REFERENCES habilidad(hab_id),
    hpe_usuario UUID REFERENCES usuarios(usu_id),
    hpe_personaje UUID REFERENCES personajes_usuario(pus_id),
    hpe_campo VARCHAR(20) NOT NULL, -- skillClass, skillExtra, skillRing0, skillRing1, skillRing2
    hpe_alineacion CHAR(1),
    hab_habilidad UUID,
    hpe_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hpe_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Character inventory table
CREATE TABLE inventario_personaje (
    inp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inp_usuario UUID REFERENCES usuarios(usu_id),
    inp_personaje UUID REFERENCES personajes_usuario(pus_id),
    inp_nombre VARCHAR(50) NOT NULL,
    inp_descripcion TEXT,
    inp_cantidad INTEGER NOT NULL DEFAULT 1,
    inp_fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inp_fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data

-- Game System
INSERT INTO sistema_juego (sju_nombre, sju_descripcion) 
VALUES ('D&D New System', 'Un nuevo sistema basado en D&D con mecánicas simplificadas');

-- Skills
-- Class Skills
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo) 
VALUES 
('Strength Strike', 'SSTR', 'C'),
('Intelligence Cast', 'SINT', 'C'),
('Dexterity Shot', 'SDEX', 'C'),
('Constitution Recovery', 'SCON', 'C'),
('Perception Find', 'SPER', 'C'),
('Charisma Influence', 'SCHA', 'C');

-- Extra Skills
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo)
VALUES 
('Dual Wielding', 'EDWI', 'E'),
('Arcane Knowledge', 'EARK', 'E'),
('Stealth', 'ESTE', 'E'),
('First Aid', 'EFAI', 'E'),
('Investigation', 'EINV', 'E'),
('Persuasion', 'EPER', 'E');

-- Ring Skills - Strength
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Brutal Strike', 'RBST', 'R', 'STR'),
('Shield Wall', 'RSHW', 'R', 'STR'),
('Weapon Master', 'RWPM', 'R', 'STR');

-- Ring Skills - Intelligence
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Spell Mastery', 'RSPM', 'R', 'INT'),
('Arcane Shield', 'RARS', 'R', 'INT'),
('Magic Theory', 'RMTH', 'R', 'INT');

-- Ring Skills - Dexterity
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Quick Shot', 'RQSH', 'R', 'DEX'),
('Evasion', 'REVA', 'R', 'DEX'),
('Acrobatics', 'RACR', 'R', 'DEX');

-- Ring Skills - Constitution
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Endurance', 'REND', 'R', 'CON'),
('Vitality', 'RVIT', 'R', 'CON'),
('Resilience', 'RRES', 'R', 'CON');

-- Ring Skills - Perception
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Eagle Eye', 'REAE', 'R', 'PER'),
('Trap Detection', 'RTRD', 'R', 'PER'),
('Investigation Master', 'RINM', 'R', 'PER');

-- Ring Skills - Charisma
INSERT INTO habilidad (hab_nombre, hab_siglas, hab_tipo, had_estadistica_base)
VALUES 
('Leadership', 'RLEA', 'R', 'CHA'),
('Diplomacy', 'RDIP', 'R', 'CHA'),
('Intimidation', 'RINT', 'R', 'CHA');

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.pus_fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personajes_usuario_updated_at
    BEFORE UPDATE ON personajes_usuario
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables if needed


--
-- Name: ene_enemigo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ene_enemigo (
    ene_id uuid DEFAULT gen_random_uuid() NOT NULL,
    ene_ubi uuid,
    ene_nombre text NOT NULL,
    ene_raza text DEFAULT 'HUM'::text NOT NULL,
    ene_clase text NOT NULL,
    ene_trabajo text NOT NULL,
    ene_edad integer DEFAULT 20 NOT NULL,
    ene_tipo text DEFAULT 'N'::text NOT NULL,
    ene_estado text DEFAULT 'A'::text NOT NULL,
    ene_str smallint DEFAULT '0'::smallint NOT NULL,
    ene_int smallint DEFAULT '0'::smallint NOT NULL,
    ene_dex smallint DEFAULT '0'::smallint NOT NULL,
    ene_con smallint DEFAULT '0'::smallint NOT NULL,
    ene_per smallint DEFAULT '0'::smallint NOT NULL,
    ene_cha smallint DEFAULT '0'::smallint NOT NULL,
    ene_vida smallint DEFAULT '20'::smallint NOT NULL
);


ALTER TABLE public.ene_enemigo OWNER TO postgres;

--
-- Name: COLUMN ene_enemigo.ene_vida; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.ene_enemigo.ene_vida IS 'Puntos de vida';


--
-- Name: epe_estadistica_personaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.epe_estadistica_personaje (
    epe_personaje uuid NOT NULL,
    epe_nombre text,
    epe_num_dado smallint DEFAULT '0'::smallint NOT NULL,
    epe_num_clase smallint DEFAULT '0'::smallint NOT NULL,
    epe_num_nivel smallint DEFAULT '0'::smallint NOT NULL,
    epe_usuario uuid NOT NULL,
    epe_sigla text NOT NULL
);


ALTER TABLE public.epe_estadistica_personaje OWNER TO postgres;

--
-- Name: esc_escenario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.esc_escenario (
    esc_id uuid DEFAULT gen_random_uuid() NOT NULL,
    esc_tipo text DEFAULT 'P'::text NOT NULL,
    esc_nombre text,
    esc_orden smallint DEFAULT '0'::smallint NOT NULL
);


ALTER TABLE public.esc_escenario OWNER TO postgres;

--
-- Name: TABLE esc_escenario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.esc_escenario IS 'listado de escenarios';


--
-- Name: hab_habilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hab_habilidad (
    hab_id uuid DEFAULT gen_random_uuid() NOT NULL,
    hab_nombre text NOT NULL,
    hab_descripcion text,
    had_estadistica_base text NOT NULL,
    hab_dado text DEFAULT 'D20'::text NOT NULL,
    hab_vlr_min smallint,
    hab_vlr_solventar smallint,
    hab_turnos text,
    hab_siglas text NOT NULL,
    hab_tipo text
);


ALTER TABLE public.hab_habilidad OWNER TO postgres;

--
-- Name: hpe_habilidad_personaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hpe_habilidad_personaje (
    hpe_habilidad uuid NOT NULL,
    hpe_usuario uuid DEFAULT gen_random_uuid() NOT NULL,
    hpe_personaje uuid DEFAULT gen_random_uuid() NOT NULL,
    hpe_campo text NOT NULL,
    hpe_alineacion text
);


ALTER TABLE public.hpe_habilidad_personaje OWNER TO postgres;

--
-- Name: inp_inventario_personaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inp_inventario_personaje (
    inp_id uuid DEFAULT gen_random_uuid() NOT NULL,
    inp_usuario uuid DEFAULT gen_random_uuid() NOT NULL,
    inp_personaje uuid DEFAULT gen_random_uuid() NOT NULL,
    inp_nombre text NOT NULL,
    inp_descripcion text,
    inp_cantidad integer DEFAULT 0
);


ALTER TABLE public.inp_inventario_personaje OWNER TO postgres;

--
-- Name: TABLE inp_inventario_personaje; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.inp_inventario_personaje IS 'Datos del inventario por personaje';


--
-- Name: mis_mision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mis_mision (
    mis_id uuid DEFAULT gen_random_uuid() NOT NULL,
    mis_ubi uuid NOT NULL,
    mis_nombre text NOT NULL,
    mis_tipo text DEFAULT 'N'::text NOT NULL,
    mis_cumplido text DEFAULT 'N'::text NOT NULL,
    mis_estado text DEFAULT 'A'::text NOT NULL
);


ALTER TABLE public.mis_mision OWNER TO postgres;

--
-- Name: mmu_mapamundi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mmu_mapamundi (
    mmu_id uuid DEFAULT gen_random_uuid() NOT NULL,
    mmu_sju uuid DEFAULT gen_random_uuid() NOT NULL,
    mmu_esc uuid DEFAULT gen_random_uuid() NOT NULL,
    mmu_ubi uuid DEFAULT gen_random_uuid() NOT NULL,
    mmu_pos_x smallint DEFAULT '0'::smallint NOT NULL,
    mmu_pos_y smallint DEFAULT '0'::smallint NOT NULL
);


ALTER TABLE public.mmu_mapamundi OWNER TO postgres;

--
-- Name: pnj_personaje_no_jugable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pnj_personaje_no_jugable (
    pnj_id uuid DEFAULT gen_random_uuid() NOT NULL,
    pnj_nombre text NOT NULL,
    pnj_clase text NOT NULL,
    pnj_trabajo text NOT NULL,
    pnj_edad integer DEFAULT 20 NOT NULL,
    pnj_estado text DEFAULT 'A'::text NOT NULL,
    pnj_tipo text DEFAULT 'M'::text NOT NULL,
    pnj_ubi uuid,
    pnj_str smallint DEFAULT '0'::smallint NOT NULL,
    pnj_int smallint DEFAULT '0'::smallint NOT NULL,
    pnj_dex smallint DEFAULT '0'::smallint NOT NULL,
    pnj_con smallint DEFAULT '0'::smallint NOT NULL,
    pnj_per smallint DEFAULT '0'::smallint NOT NULL,
    pnj_cha smallint DEFAULT '0'::smallint NOT NULL,
    pnj_raza text DEFAULT 'HUM'::text NOT NULL,
    pnj_vida smallint DEFAULT '20'::smallint NOT NULL
);


ALTER TABLE public.pnj_personaje_no_jugable OWNER TO postgres;

--
-- Name: TABLE pnj_personaje_no_jugable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pnj_personaje_no_jugable IS 'Listado de personajes no jugables';


--
-- Name: COLUMN pnj_personaje_no_jugable.pnj_vida; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.pnj_personaje_no_jugable.pnj_vida IS 'Puntos de vida';


--
-- Name: pus_personajes_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pus_personajes_usuario (
    pus_id uuid DEFAULT gen_random_uuid() NOT NULL,
    pus_usuario uuid NOT NULL,
    pus_nombre text NOT NULL,
    pus_clase text,
    pus_raza text,
    pus_trabajo text,
    pus_nivel numeric DEFAULT '1'::numeric NOT NULL,
    pus_descripcion text,
    pus_fec_modificacion timestamp with time zone DEFAULT now(),
    pus_conocimientos text,
    pus_arma_principal text,
    pus_arma_secundaria text,
    pus_cantidad_oro integer DEFAULT 0 NOT NULL,
    pus_cantidad_plata integer DEFAULT 0 NOT NULL,
    pus_cantidad_bronce integer DEFAULT 0 NOT NULL,
    pus_sistema_juego uuid,
    pus_puntos_suerte smallint DEFAULT '0'::smallint NOT NULL,
    pus_vida smallint DEFAULT '20'::smallint NOT NULL,
    pus_alineacion text
);


ALTER TABLE public.pus_personajes_usuario OWNER TO postgres;

--
-- Name: TABLE pus_personajes_usuario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pus_personajes_usuario IS 'Datos de los personajes del usuario';


--
-- Name: COLUMN pus_personajes_usuario.pus_vida; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.pus_personajes_usuario.pus_vida IS 'Puntos de vida';


--
-- Name: sju_sistema_juego; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sju_sistema_juego (
    sju_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sju_nombre text DEFAULT ''::text,
    sju_descripcion text,
    sju_estado text DEFAULT 'A'::text NOT NULL
);


ALTER TABLE public.sju_sistema_juego OWNER TO postgres;

--
-- Name: COLUMN sju_sistema_juego.sju_estado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sju_sistema_juego.sju_estado IS 'Estado del sistema de juego';


--
-- Name: son_sonidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.son_sonidos (
    son_id uuid DEFAULT gen_random_uuid() NOT NULL,
    son_nombre text,
    son_url text
);


ALTER TABLE public.son_sonidos OWNER TO postgres;

--
-- Name: TABLE son_sonidos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.son_sonidos IS 'Listado de sonidos';


--
-- Name: sub_sonido_ubicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_sonido_ubicacion (
    sub_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sub_ubi uuid,
    sub_son uuid NOT NULL,
    sub_tipo text,
    sub_estado text DEFAULT 'A'::text NOT NULL,
    sub_icon text
);


ALTER TABLE public.sub_sonido_ubicacion OWNER TO postgres;

--
-- Name: TABLE sub_sonido_ubicacion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.sub_sonido_ubicacion IS 'Listado de sonidos por ubicación';


--
-- Name: ubi_ubicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ubi_ubicacion (
    ubi_id uuid DEFAULT gen_random_uuid() NOT NULL,
    ubi_tipo text NOT NULL,
    ubi_nombre text
);


ALTER TABLE public.ubi_ubicacion OWNER TO postgres;

--
-- Name: usu_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usu_usuario (
    usu_id uuid DEFAULT gen_random_uuid() NOT NULL,
    usu_nombre character varying NOT NULL,
    usu_fec_modificacion timestamp with time zone DEFAULT now() NOT NULL,
    usu_email character varying
);


ALTER TABLE public.usu_usuario OWNER TO postgres;

--
-- Name: TABLE usu_usuario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.usu_usuario IS 'Usuarios del sistema';


--
-- Name: ene_enemigo ene_enemigos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ene_enemigo
    ADD CONSTRAINT ene_enemigos_pkey PRIMARY KEY (ene_id);


--
-- Name: epe_estadistica_personaje epe_estadistica_personaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.epe_estadistica_personaje
    ADD CONSTRAINT epe_estadistica_personaje_pkey PRIMARY KEY (epe_personaje, epe_usuario, epe_sigla);


--
-- Name: esc_escenario esc_escenario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esc_escenario
    ADD CONSTRAINT esc_escenario_pkey PRIMARY KEY (esc_id);


--
-- Name: hab_habilidad hab_habilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hab_habilidad
    ADD CONSTRAINT hab_habilidad_pkey PRIMARY KEY (hab_id);


--
-- Name: hpe_habilidad_personaje hpe_habilidad_personaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hpe_habilidad_personaje
    ADD CONSTRAINT hpe_habilidad_personaje_pkey PRIMARY KEY (hpe_usuario, hpe_personaje, hpe_campo);


--
-- Name: inp_inventario_personaje inp_inventario_personaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inp_inventario_personaje
    ADD CONSTRAINT inp_inventario_personaje_pkey PRIMARY KEY (inp_id, inp_usuario, inp_personaje);


--
-- Name: mis_mision mis_mision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_mision
    ADD CONSTRAINT mis_mision_pkey PRIMARY KEY (mis_id);


--
-- Name: mmu_mapamundi mmu_mapamundi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mmu_mapamundi
    ADD CONSTRAINT mmu_mapamundi_pkey PRIMARY KEY (mmu_id, mmu_sju, mmu_esc, mmu_ubi);


--
-- Name: pnj_personaje_no_jugable pnj_personaje_no_jugable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pnj_personaje_no_jugable
    ADD CONSTRAINT pnj_personaje_no_jugable_pkey PRIMARY KEY (pnj_id);


--
-- Name: pus_personajes_usuario pus_personajes_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pus_personajes_usuario
    ADD CONSTRAINT pus_personajes_usuario_pkey PRIMARY KEY (pus_id, pus_usuario);


--
-- Name: sju_sistema_juego sju_sistema_juego_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sju_sistema_juego
    ADD CONSTRAINT sju_sistema_juego_pkey PRIMARY KEY (sju_id);


--
-- Name: son_sonidos son_sonidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.son_sonidos
    ADD CONSTRAINT son_sonidos_pkey PRIMARY KEY (son_id);


--
-- Name: sub_sonido_ubicacion sub_sonido_ubicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_sonido_ubicacion
    ADD CONSTRAINT sub_sonido_ubicacion_pkey PRIMARY KEY (sub_id);


--
-- Name: ubi_ubicacion ubi_ubicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubi_ubicacion
    ADD CONSTRAINT ubi_ubicacion_pkey PRIMARY KEY (ubi_id);


--
-- Name: usu_usuario usu_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usu_usuario
    ADD CONSTRAINT usu_usuario_pkey PRIMARY KEY (usu_id);

--
-- Name: ene_enemigo ene_enemigo_ene_ubi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ene_enemigo
    ADD CONSTRAINT ene_enemigo_ene_ubi_fkey FOREIGN KEY (ene_ubi) REFERENCES public.ubi_ubicacion(ubi_id);


--
-- Name: epe_estadistica_personaje epe_pus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.epe_estadistica_personaje
    ADD CONSTRAINT epe_pus_fkey FOREIGN KEY (epe_usuario, epe_personaje) REFERENCES public.pus_personajes_usuario(pus_usuario, pus_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hpe_habilidad_personaje hpe_habilidad_personaje_hpe_habilidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hpe_habilidad_personaje
    ADD CONSTRAINT hpe_habilidad_personaje_hpe_habilidad_fkey FOREIGN KEY (hpe_habilidad) REFERENCES public.hab_habilidad(hab_id);


--
-- Name: hpe_habilidad_personaje hpe_pus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hpe_habilidad_personaje
    ADD CONSTRAINT hpe_pus_fkey FOREIGN KEY (hpe_usuario, hpe_personaje) REFERENCES public.pus_personajes_usuario(pus_usuario, pus_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inp_inventario_personaje inp_pus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inp_inventario_personaje
    ADD CONSTRAINT inp_pus_fkey FOREIGN KEY (inp_usuario, inp_personaje) REFERENCES public.pus_personajes_usuario(pus_usuario, pus_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mis_mision mis_mision_mis_ubi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_mision
    ADD CONSTRAINT mis_mision_mis_ubi_fkey FOREIGN KEY (mis_ubi) REFERENCES public.ubi_ubicacion(ubi_id);


--
-- Name: pnj_personaje_no_jugable pnj_personaje_no_jugable_pnj_ubi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pnj_personaje_no_jugable
    ADD CONSTRAINT pnj_personaje_no_jugable_pnj_ubi_fkey FOREIGN KEY (pnj_ubi) REFERENCES public.ubi_ubicacion(ubi_id);


--
-- Name: mmu_mapamundi public_mmu_mapamundi_mmu_esc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mmu_mapamundi
    ADD CONSTRAINT public_mmu_mapamundi_mmu_esc_fkey FOREIGN KEY (mmu_esc) REFERENCES public.esc_escenario(esc_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mmu_mapamundi public_mmu_mapamundi_mmu_sju_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mmu_mapamundi
    ADD CONSTRAINT public_mmu_mapamundi_mmu_sju_fkey FOREIGN KEY (mmu_sju) REFERENCES public.sju_sistema_juego(sju_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mmu_mapamundi public_mmu_mapamundi_mmu_ubi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mmu_mapamundi
    ADD CONSTRAINT public_mmu_mapamundi_mmu_ubi_fkey FOREIGN KEY (mmu_ubi) REFERENCES public.ubi_ubicacion(ubi_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sub_sonido_ubicacion public_sub_sonido_ubicacion_sub_son_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_sonido_ubicacion
    ADD CONSTRAINT public_sub_sonido_ubicacion_sub_son_fkey FOREIGN KEY (sub_son) REFERENCES public.son_sonidos(son_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sub_sonido_ubicacion public_sub_sonido_ubicacion_sub_ubi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_sonido_ubicacion
    ADD CONSTRAINT public_sub_sonido_ubicacion_sub_ubi_fkey FOREIGN KEY (sub_ubi) REFERENCES public.ubi_ubicacion(ubi_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pus_personajes_usuario pus_personajes_usuario_pus_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pus_personajes_usuario
    ADD CONSTRAINT pus_personajes_usuario_pus_usuario_fkey FOREIGN KEY (pus_usuario) REFERENCES public.usu_usuario(usu_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pus_personajes_usuario pus_sju_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pus_personajes_usuario
    ADD CONSTRAINT pus_sju_fkey FOREIGN KEY (pus_sistema_juego) REFERENCES public.sju_sistema_juego(sju_id);

    
--
-- Name: epe_estadistica_personaje  Adicionar las estadísticas del personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY " Adicionar las estadísticas del personaje" ON public.epe_estadistica_personaje FOR INSERT WITH CHECK (true);


--
-- Name: epe_estadistica_personaje Acceder a las estadisticas de personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder a las estadisticas de personaje" ON public.epe_estadistica_personaje FOR SELECT USING (true);


--
-- Name: sju_sistema_juego Acceder al listado de sistemas de juego; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder al listado de sistemas de juego" ON public.sju_sistema_juego FOR SELECT USING (true);


--
-- Name: hab_habilidad Acceder listado de actividades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder listado de actividades" ON public.hab_habilidad FOR SELECT USING (true);


--
-- Name: hpe_habilidad_personaje Acceder listado de habilidades por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder listado de habilidades por personaje" ON public.hpe_habilidad_personaje FOR SELECT USING (true);


--
-- Name: inp_inventario_personaje Acceder listado de inventarios por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder listado de inventarios por personaje" ON public.inp_inventario_personaje FOR SELECT USING (true);


--
-- Name: pus_personajes_usuario Acceder listado de personajes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder listado de personajes" ON public.pus_personajes_usuario FOR SELECT USING (true);


--
-- Name: usu_usuario Acceder listado de usuarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Acceder listado de usuarios" ON public.usu_usuario FOR SELECT USING (true);


--
-- Name: pus_personajes_usuario Actualizar datos del personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Actualizar datos del personaje" ON public.pus_personajes_usuario FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: hpe_habilidad_personaje Actualizar habilidades por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Actualizar habilidades por personaje" ON public.hpe_habilidad_personaje FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: inp_inventario_personaje Actualizar items del inventario por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Actualizar items del inventario por personaje" ON public.inp_inventario_personaje FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: epe_estadistica_personaje Actualizar las estadísticas del personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Actualizar las estadísticas del personaje" ON public.epe_estadistica_personaje FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: mis_mision Actualizar misión por ubicación; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Actualizar misión por ubicación" ON public.mis_mision FOR UPDATE USING (true);


--
-- Name: inp_inventario_personaje Adicionar al listado de elementos de inventario por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Adicionar al listado de elementos de inventario por personaje" ON public.inp_inventario_personaje FOR INSERT WITH CHECK (true);


--
-- Name: hpe_habilidad_personaje Adicionar habilidades por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Adicionar habilidades por personaje" ON public.hpe_habilidad_personaje FOR INSERT WITH CHECK (true);


--
-- Name: pus_personajes_usuario Adicionar personajes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Adicionar personajes" ON public.pus_personajes_usuario FOR INSERT WITH CHECK (true);


--
-- Name: inp_inventario_personaje Eliminar item del listado de inventario por personaje; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Eliminar item del listado de inventario por personaje" ON public.inp_inventario_personaje FOR DELETE USING (true);


--
-- Name: pus_personajes_usuario Eliminar personaje del listado; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Eliminar personaje del listado" ON public.pus_personajes_usuario FOR DELETE USING (true);


--
-- Name: ene_enemigo Listado de enemigos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de enemigos" ON public.ene_enemigo FOR SELECT USING (true);


--
-- Name: esc_escenario Listado de escenarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de escenarios" ON public.esc_escenario FOR SELECT USING (true);


--
-- Name: mis_mision Listado de misiones por ubicación; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de misiones por ubicación" ON public.mis_mision FOR SELECT USING (true);


--
-- Name: pnj_personaje_no_jugable Listado de personajes no jugables; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de personajes no jugables" ON public.pnj_personaje_no_jugable FOR SELECT USING (true);


--
-- Name: son_sonidos Listado de sonidos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de sonidos" ON public.son_sonidos FOR SELECT USING (true);


--
-- Name: sub_sonido_ubicacion Listado de sonidos por ubicacion; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de sonidos por ubicacion" ON public.sub_sonido_ubicacion FOR SELECT USING (true);


--
-- Name: ubi_ubicacion Listado de ubicaciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado de ubicaciones" ON public.ubi_ubicacion FOR SELECT USING (true);


--
-- Name: mmu_mapamundi Listado del mapamundi; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Listado del mapamundi" ON public.mmu_mapamundi FOR SELECT USING (true);


--
-- Name: ene_enemigo; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ene_enemigo ENABLE ROW LEVEL SECURITY;

--
-- Name: epe_estadistica_personaje; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.epe_estadistica_personaje ENABLE ROW LEVEL SECURITY;

--
-- Name: esc_escenario; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.esc_escenario ENABLE ROW LEVEL SECURITY;

--
-- Name: hab_habilidad; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.hab_habilidad ENABLE ROW LEVEL SECURITY;

--
-- Name: hpe_habilidad_personaje; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.hpe_habilidad_personaje ENABLE ROW LEVEL SECURITY;

--
-- Name: inp_inventario_personaje; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.inp_inventario_personaje ENABLE ROW LEVEL SECURITY;

--
-- Name: mis_mision; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mis_mision ENABLE ROW LEVEL SECURITY;

--
-- Name: mmu_mapamundi; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mmu_mapamundi ENABLE ROW LEVEL SECURITY;

--
-- Name: pnj_personaje_no_jugable; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pnj_personaje_no_jugable ENABLE ROW LEVEL SECURITY;

--
-- Name: pus_personajes_usuario; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pus_personajes_usuario ENABLE ROW LEVEL SECURITY;

--
-- Name: sju_sistema_juego; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sju_sistema_juego ENABLE ROW LEVEL SECURITY;

--
-- Name: son_sonidos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.son_sonidos ENABLE ROW LEVEL SECURITY;

--
-- Name: sub_sonido_ubicacion; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sub_sonido_ubicacion ENABLE ROW LEVEL SECURITY;

--
-- Name: ubi_ubicacion; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ubi_ubicacion ENABLE ROW LEVEL SECURITY;

--
-- Name: usu_usuario; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.usu_usuario ENABLE ROW LEVEL SECURITY;

INSERT INTO public.ene_enemigo (ene_id, ene_ubi, ene_nombre, ene_raza, ene_clase, ene_trabajo, ene_edad, ene_tipo, ene_estado, ene_str, ene_int, ene_dex, ene_con, ene_per, ene_cha, ene_vida) VALUES
('4a6a9c5a-393f-4c3e-a04e-56f6051c00bf', '167d5c26-c266-422f-96f1-6731bc3e3b68', 'No muerto', 'NMU', 'WAR', '???', 0, 'N', 'A', 3, 3, 3, 3, 3, 3, 10),
('54423b85-6e6b-4136-baf2-acff3aa4913e', 'ac878cf0-4e7f-491b-b89c-3ba0e6ef1808', 'Malgrim, el Dragón de la Sombra', 'DRA', '???', '???', 1000, 'B', 'A', 20, 20, 20, 20, 20, 20, 20);
INSERT INTO public.epe_estadistica_personaje (epe_personaje, epe_nombre, epe_num_dado, epe_num_clase, epe_num_nivel, epe_usuario, epe_sigla) VALUES
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Fuerza', 1, 2, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'STR'),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Inteligencia', 4, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'INT'),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Destreza', 2, 1, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'DEX'),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Constitucion', 2, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CON'),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Percepcion', 3, 1, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'PER'),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Carisma', 1, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CHA'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Fuerza', 3, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'STR'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Destreza', 1, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'DEX'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Carisma', 3, 1, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CHA'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Inteligencia', 2, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'INT'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Percepcion', 4, 1, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'PER'),
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Constitucion', 1, 2, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CON'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Fuerza', 4, 3, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'STR'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Inteligencia', 2, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'INT'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Destreza', 4, 1, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'DEX'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Constitucion', 3, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CON'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Percepcion', 2, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'PER'),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Carisma', 1, 0, 0, '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'CHA');
INSERT INTO public.esc_escenario (esc_id, esc_tipo, esc_nombre, esc_orden) VALUES
('c041bf49-b324-4f46-80d5-4383fe1d45b3', 'P', 'Pueblo inicial', 0),
('30bba856-815f-4713-9b62-041aef9017ee', 'T', 'Taberna', 1),
('3bd192ef-3889-469e-8d37-5bc3bc3bf9c9', 'B', 'Bosque cercano', 2),
('f7e436ea-5d3f-475b-ad3f-09cfa48902ef', 'C', 'Cueva', 3);
INSERT INTO public.hab_habilidad (hab_id, hab_nombre, hab_descripcion, had_estadistica_base, hab_dado, hab_vlr_min, hab_vlr_solventar, hab_turnos, hab_siglas, hab_tipo) VALUES
('c4de4295-462d-4ee8-a463-e302e2200f78', 'Potenciador de magia', NULL, 'INT', 'D20', NULL, NULL, NULL, 'SE04', 'E'),
('8087f9f2-d85c-4124-bb6a-9e6d206d6fc3', 'Supervivencia', NULL, 'DEX', 'D20', NULL, NULL, NULL, 'SE06', 'E'),
('e898db76-c09b-4f48-83ff-2f56c3fec8ef', 'Ataque con arma arrojadiza', NULL, 'DEX', 'D20', NULL, NULL, NULL, 'SE05', 'E'),
('e3e93acb-0434-42fc-9f63-a5779654c613', 'Inyección', NULL, 'CON', 'D20', NULL, NULL, '5', 'R', 'R'),
('6fbb833b-281d-4465-9313-a38bdb19ecb7', 'Escudo mental', NULL, 'INT', 'D20', NULL, NULL, '3', 'R', 'R'),
('86109eef-f06a-4d84-9288-0890d68973b1', 'Ataque de aura', NULL, 'STR', 'D20', NULL, NULL, 'D4', 'SSTR', 'C'),
('69a4de56-4331-4a5e-8683-665bcf93c4f3', 'Procesamiento rápido', NULL, 'INT', 'D20', 10, NULL, NULL, 'SINT', 'C'),
('4c628d0d-cb92-4b12-8693-e0dc2b08f9ef', 'Golpe certero', NULL, 'DEX', 'D20', NULL, NULL, NULL, 'SDEX', 'C'),
('fcf50f73-78ff-4a50-9372-4f1ce4f182e9', 'Primeros auxilios', NULL, 'CON', 'D20', NULL, NULL, NULL, 'SHEA', 'C'),
('3123ef07-6ed3-404f-bd39-9b805f90d271', 'Transmutación básica', NULL, 'PER', 'D20', NULL, NULL, NULL, 'SCRE', 'C'),
('a28cc609-35d1-4022-8a7f-9085fe1677c2', 'Interpretación', NULL, 'CHA', 'D20', NULL, NULL, NULL, 'SSUP', 'C'),
('127c8a59-8ab7-4441-b7f8-7bc27ec7d061', 'Defensa con múltiples armas', NULL, 'STR', 'D20', NULL, NULL, NULL, 'SE01', 'E'),
('77057c3e-1fcf-405d-8357-d14894807643', 'Ataque de oportunidad', NULL, 'STR', 'D20', NULL, NULL, NULL, 'SE02', 'E'),
('60cfeb0b-431f-45e8-ae00-6ef75ee0a202', 'Ataque mágico', NULL, 'INT', 'D20', NULL, NULL, NULL, 'SE03', 'E'),
('4e0c56d5-f981-4462-8b50-51591a1e44ee', 'Reanimación', NULL, 'CON', 'D20', NULL, NULL, NULL, 'SE07', 'E'),
('15e94216-ce53-4d96-b84a-b717b2704182', 'Manitas', NULL, 'PER', 'D20', NULL, NULL, NULL, 'SE09', 'E'),
('a463ef66-8932-4b4a-9f7a-2ccae696b03d', 'Auxilio urgente', NULL, 'CON', 'D20', NULL, NULL, NULL, 'SE08', 'E'),
('06f2395d-91bb-414b-8db5-8cf2eea6ae13', 'Agudeza social', NULL, 'CHA', 'D20', NULL, NULL, NULL, 'SE11', 'E'),
('e5761d14-296f-4c2a-814b-e48693af85f7', 'Desarme de trampas', NULL, 'PER', 'D20', NULL, NULL, NULL, 'SE10', 'E'),
('74239c9f-d9ca-4838-adb7-3dfb81fd4fdd', 'Persuasión', NULL, 'CHA', 'D20', NULL, NULL, NULL, 'SE12', 'E'),
('ce570c22-d6e4-4694-b0de-96688420ff75', 'Conocimiento Arcano', NULL, 'INT', 'D20', NULL, NULL, '9', 'R', 'R'),
('f839b04c-d23d-49ea-8331-2580279b43d4', 'Agilidad felina', NULL, 'DEX', 'D20', NULL, NULL, '2', 'R', 'R'),
('0c312915-44bc-4169-a6ff-5af2c3c30d85', 'Camuflaje', NULL, 'DEX', 'D20', NULL, NULL, '4', 'R', 'R'),
('7755a775-a3e9-4f48-a9c0-f6174df8b35e', 'Vista de águila', NULL, 'DEX', 'D20', NULL, NULL, '6', 'R', 'R'),
('fc6f1ccd-d04b-452c-8cbe-20fa556180ad', 'Reflejo Veloz', NULL, 'DEX', 'D20', NULL, NULL, '8', 'R', 'R');
INSERT INTO public.hpe_habilidad_personaje (hpe_habilidad, hpe_usuario, hpe_personaje, hpe_campo, hpe_alineacion) VALUES
('86109eef-f06a-4d84-9288-0890d68973b1', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'skillClass', NULL),
('c4de4295-462d-4ee8-a463-e302e2200f78', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'skillExtra', NULL),
('86109eef-f06a-4d84-9288-0890d68973b1', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'skillClass', NULL),
('60cfeb0b-431f-45e8-ae00-6ef75ee0a202', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'skillExtra', NULL),
('86109eef-f06a-4d84-9288-0890d68973b1', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'skillClass', NULL),
('15e94216-ce53-4d96-b84a-b717b2704182', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'skillExtra', NULL);
INSERT INTO public.inp_inventario_personaje (inp_id, inp_usuario, inp_personaje, inp_nombre, inp_descripcion, inp_cantidad) VALUES
('81b86e1d-a8ab-40c7-b327-cddc7def9dc3', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '74d24874-5ae6-4c08-9a2a-a9ff4a382352', 'Gema', 'Articulo del elegido', 1),
('0ecc7bf0-0fb8-4335-820b-1d6ba3b0955b', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Gema', 'Articulo del elegido', 1),
('f1a9f192-fd53-487b-abe5-014194283776', '43c29fa1-d02c-4da5-90ea-51f451ed8952', '541a36f5-fbaf-4113-b536-a1343d5ab2e7', 'Soga', '5 mts', 1),
('36bc7460-f6f8-44c5-ba51-63e6bbc392c0', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Gema', 'Articulo del elegido', 1),
('b7960491-d2c0-424f-83de-18c03072ea8c', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Cuerda', '3 metros', 1),
('ae0a1545-db08-41ef-b41a-3898ce9fbb60', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Cantimplora', 'Capacidad 1 litro', 1),
('ebc1efb8-fbb4-4570-a8e3-e84c1bda77ed', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Pedernal y mecha', 'Fuego', 1),
('776c773f-d99b-4629-996d-8cbeca3c6dbb', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Impermeable', 'Protege contra la lluvia', 1),
('e9f6ae63-7644-4e62-aa2e-5cc895b310a3', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Cacerola', 'Utensilio de cocina', 1),
('0963352d-206c-4cfd-a513-3b0da58616cb', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', 'Relicario', 'Objeto valioso', 1);
INSERT INTO public.mis_mision (mis_id, mis_ubi, mis_nombre, mis_tipo, mis_cumplido, mis_estado) VALUES
('9f836f93-c6c1-4cc9-9f79-fc4801d17533', '167d5c26-c266-422f-96f1-6731bc3e3b68', 'Encuentra la sala de la reliquia', 'P', 'N', 'A'),
('d622d957-4656-47df-8664-0545d1ec7c58', '91574f42-68e2-4360-823f-5ed8acc85283', 'Encontrar la reliquia del aventurero caído', 'N', 'N', 'A'),
('aa3b8a3e-e373-4f98-832e-679f0db6a486', 'ac878cf0-4e7f-491b-b89c-3ba0e6ef1808', 'Ahuyentar a la criatura misteriosa', 'P', 'N', 'A');
INSERT INTO public.mmu_mapamundi (mmu_id, mmu_sju, mmu_esc, mmu_ubi, mmu_pos_x, mmu_pos_y) VALUES
('036bd999-f79e-4203-bc93-ecce0bfdca35', 'd127c085-469a-4627-8801-77dc7262d41b', 'c041bf49-b324-4f46-80d5-4383fe1d45b3', '56ef79bb-30c7-49b6-8189-9e83f15121a9', 2, 3),
('6bb8753b-5536-48c2-8725-a4c2bf01d829', 'd127c085-469a-4627-8801-77dc7262d41b', 'f7e436ea-5d3f-475b-ad3f-09cfa48902ef', 'ac878cf0-4e7f-491b-b89c-3ba0e6ef1808', 10, 3),
('869cba34-2e8e-4056-b196-04bb87403df3', 'd127c085-469a-4627-8801-77dc7262d41b', 'f7e436ea-5d3f-475b-ad3f-09cfa48902ef', '91574f42-68e2-4360-823f-5ed8acc85283', 4, 1),
('bce70d2d-8710-4b7f-b01c-68e34bd31327', 'd127c085-469a-4627-8801-77dc7262d41b', '30bba856-815f-4713-9b62-041aef9017ee', 'abe27ecc-9300-4d09-8b08-fda824c420db', 0, 3),
('9b880c9d-896a-4f50-a9ae-0acc14fffc4c', 'd127c085-469a-4627-8801-77dc7262d41b', '3bd192ef-3889-469e-8d37-5bc3bc3bf9c9', '167d5c26-c266-422f-96f1-6731bc3e3b68', 1, 3),
('eb4d9472-e9d0-40af-826b-0c47328d5e37', 'd127c085-469a-4627-8801-77dc7262d41b', 'c041bf49-b324-4f46-80d5-4383fe1d45b3', '27cc759a-c390-4593-91b5-b8f0c43bf5b6', 3, 4),
('6e474781-2757-4808-a49f-62a4308684fc', 'd127c085-469a-4627-8801-77dc7262d41b', 'c041bf49-b324-4f46-80d5-4383fe1d45b3', '03888d96-caa5-4517-8188-f9cfbc49b440', 3, 5),
('2e3e4c7f-ee48-4667-8e6a-6a184b4ae27e', 'd127c085-469a-4627-8801-77dc7262d41b', 'c041bf49-b324-4f46-80d5-4383fe1d45b3', 'a76ec692-0ae0-4034-8dde-12d38b5fa688', 5, 4),
('e6437c98-0917-45b8-a14c-9a87759f0b52', 'd127c085-469a-4627-8801-77dc7262d41b', 'c041bf49-b324-4f46-80d5-4383fe1d45b3', '26ea8005-27d4-4233-8dde-77bf6257de2f', 8, 4);
INSERT INTO public.pnj_personaje_no_jugable (pnj_id, pnj_nombre, pnj_clase, pnj_trabajo, pnj_edad, pnj_estado, pnj_tipo, pnj_ubi, pnj_str, pnj_int, pnj_dex, pnj_con, pnj_per, pnj_cha, pnj_raza, pnj_vida) VALUES
('84d22758-4ac7-47c3-bb3c-a188877e1a21', 'Lugh', 'WAR', 'ART', 100, 'A', 0, '56ef79bb-30c7-49b6-8189-9e83f15121a9', 10, 10, 10, 10, 10, 10, 'HUM', 20),
('08dae30e-589d-4814-a80d-de6a7f69ea87', 'Jenny', 'SCO', 'HUN', 18, 'A', 1, '56ef79bb-30c7-49b6-8189-9e83f15121a9', 2, 2, 2, 1, 1, 3, 'HUM', 20),
('c9163af5-33cf-47be-8ea7-fb1c83ceef60', '???', 'WAR', '???', 0, 'A', 0, '91574f42-68e2-4360-823f-5ed8acc85283', 0, 0, 0, 0, 0, 0, 'HUM', 0);
INSERT INTO public.pus_personajes_usuario (pus_id, pus_usuario, pus_nombre, pus_clase, pus_raza, pus_trabajo, pus_nivel, pus_descripcion, pus_fec_modificacion, pus_conocimientos, pus_arma_principal, pus_arma_secundaria, pus_cantidad_oro, pus_cantidad_plata, pus_cantidad_bronce, pus_sistema_juego, pus_puntos_suerte, pus_vida, pus_alineacion) VALUES
('541a36f5-fbaf-4113-b536-a1343d5ab2e7', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'Ben 10', 'WAR', 'HUM', 'HUN', 1, 'Alien multiforma', '2024-08-11 18:46:40.056681+00', 'FOR,ACO', 'Daga', 'Kunai', 0, 0, 0, 'd127c085-469a-4627-8801-77dc7262d41b', 4, 10, NULL),
('74d24874-5ae6-4c08-9a2a-a9ff4a382352', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'Adler', 'WAR', 'HUM', 'HUN', 1, 'Vampiro albino', '2024-08-09 03:53:59.143298+00', 'FOR,ACO', 'Cuchillo de combate', 'Espada larga', 0, 0, 0, 'd127c085-469a-4627-8801-77dc7262d41b', 4, 20, NULL),
('ef5e5e7a-afe0-40b8-ad76-ba25592fa6fd', '43c29fa1-d02c-4da5-90ea-51f451ed8952', 'Deo', 'WAR', 'DWA', 'BLA', 1, 'Enano de cabello rojo y corto, ojos color miel, de apariencia joven de 20, de contextura esbelta con músculos, experto en herrería, con armadura de cuero, combate y artes marciales, que porta un martillo y un hacha.', '2024-02-14 13:25:37.381702+00', 'FOR,ALC', 'Hacha de mano', 'Espada corta', 0, 3, 0, 'd127c085-469a-4627-8801-77dc7262d41b', 3, 20, NULL);
INSERT INTO public.sju_sistema_juego (sju_id, sju_nombre, sju_descripcion, sju_estado) VALUES
('d127c085-469a-4627-8801-77dc7262d41b', 'Azar de las dos manos', 'En el mundo de fantasía de Renascentia, dos dioses opuestos gobiernan: el Dios del Orden y el Dios del Caos. La sociedad se divide en dos facciones, cada una adorando a su respectivo dios y siguiendo sus principios. Estos bandos mantienen una neutralidad frágil, con una leve discriminación hacia el otro. Sin embargo, una facción oculta llamada "Corrupción" se opone a ambos dioses. Son inescrupulosos y buscan desestabilizar y corromper el mundo.', 'A');
INSERT INTO public.son_sonidos (son_id, son_nombre, son_url) VALUES
('233476bb-f783-44f6-9ad2-c52c4431b6c4', 'Lluvia', NULL),
('8a80b255-69e0-44f9-92cc-1a879e536d22', 'Viento', NULL),
('6bd39404-daf0-452e-b11d-22283c9254e5', 'Tormenta', NULL),
('5ee63160-1ce8-4965-9b60-76591e92adb7', 'Noche', NULL),
('0b999b2c-c3c0-4fd3-ad1e-13380f8fbbd3', 'Fogata', NULL),
('1660d300-8a23-4233-b21c-bbd0f2e4d023', 'Pajaros', NULL),
('6fc90c71-5f45-4239-ba26-01575fa69713', 'Olas', NULL),
('dc4cc962-dc97-4da8-85d7-30af4f41656a', 'Corazón', NULL),
('ec0e3abe-7b04-49a8-805c-9c7f10628d62', 'Ruinas', NULL),
('4b46164c-92c0-4c8c-8e66-5904b3207062', 'Intro', 'https://www.youtube.com/watch?v=8Y5JLnE8H-0'),
('3a30e2b9-8384-4cee-b5e3-c24cb7adf967', 'Taberna Instrumental', 'https://www.youtube.com/watch?v=8KsPfymSbdk'),
('fb9eb0f1-8165-4591-820d-c6f8c3264978', 'Herreria Instrumental', 'https://www.youtube.com/watch?v=gkahJepZHsk');
INSERT INTO public.sub_sonido_ubicacion (sub_id, sub_ubi, sub_son, sub_tipo, sub_estado, sub_icon) VALUES
('9121c678-84f9-40a8-9ec2-6602d0907c11', NULL, '233476bb-f783-44f6-9ad2-c52c4431b6c4', 'G', 'A', 'LL'),
('338013eb-665a-4809-a807-d4d80eee7433', NULL, '8a80b255-69e0-44f9-92cc-1a879e536d22', 'G', 'A', 'VI'),
('058dd0d2-2c14-4cb4-8edb-b2b9b00d97b2', NULL, '6bd39404-daf0-452e-b11d-22283c9254e5', 'G', 'A', 'TO'),
('ae63a2c1-3f29-47b4-843e-649db4717a3a', NULL, '5ee63160-1ce8-4965-9b60-76591e92adb7', 'G', 'A', 'NO'),
('9f52ce8c-fc01-47e5-b3c0-2a8648fcd915', NULL, '0b999b2c-c3c0-4fd3-ad1e-13380f8fbbd3', 'G', 'A', 'FO'),
('3477dba3-b538-4e23-b3b6-3047c58d706a', NULL, '1660d300-8a23-4233-b21c-bbd0f2e4d023', 'G', 'A', 'PA'),
('f90b5b75-7e8f-4ab0-8bb2-eb9e78f53d12', NULL, '6fc90c71-5f45-4239-ba26-01575fa69713', 'G', 'A', 'OL'),
('a2fb7958-ed79-4697-ac2a-e393f5fdce54', NULL, 'dc4cc962-dc97-4da8-85d7-30af4f41656a', 'G', 'A', 'CO'),
('b4dffa76-dc95-4bd8-99da-1182471cd1b5', '167d5c26-c266-422f-96f1-6731bc3e3b68', 'ec0e3abe-7b04-49a8-805c-9c7f10628d62', 'U', 'A', 'RU'),
('cba67b93-062d-4d94-a79e-9b89b924b2cc', NULL, '4b46164c-92c0-4c8c-8e66-5904b3207062', 'GL', 'A', 'SP'),
('5ae20af6-8a3d-4038-8e55-94572f24b7dd', '56ef79bb-30c7-49b6-8189-9e83f15121a9', '3a30e2b9-8384-4cee-b5e3-c24cb7adf967', 'UL', 'A', 'SP'),
('e46388e6-c9b0-4b71-a668-5c1b38f8955f', '03888d96-caa5-4517-8188-f9cfbc49b440', 'fb9eb0f1-8165-4591-820d-c6f8c3264978', 'UL', 'A', 'SP');
INSERT INTO public.ubi_ubicacion (ubi_id, ubi_tipo, ubi_nombre) VALUES
('56ef79bb-30c7-49b6-8189-9e83f15121a9', 'TAB', 'Taberna inicial'),
('167d5c26-c266-422f-96f1-6731bc3e3b68', 'MOL', 'Monumento olvidado'),
('26ea8005-27d4-4233-8dde-77bf6257de2f', 'GRE', 'Gremio'),
('27cc759a-c390-4593-91b5-b8f0c43bf5b6', 'ARM', 'Armeria'),
('03888d96-caa5-4517-8188-f9cfbc49b440', 'HER', 'Herreria'),
('f2387440-a526-498b-a866-57aec4303928', 'CAV', 'Caverna'),
('91574f42-68e2-4360-823f-5ed8acc85283', 'CEM', 'Cementerio'),
('9f8b0489-7096-45ff-9459-beb66e8578b8', 'REL', 'Reliquia'),
('ac878cf0-4e7f-491b-b89c-3ba0e6ef1808', 'NMO', 'Nido de monstros'),
('ff4abdeb-2dd3-405d-bbf5-c1631d631087', 'TEM', 'Templo'),
('53391317-ddc2-4bc9-a62b-be5ab4a20683', 'CAM', 'Campamento'),
('095bd4ea-1ca0-434d-82dc-34d9705d7812', 'ZDE', 'Zona de descanso'),
('a76ec692-0ae0-4034-8dde-12d38b5fa688', 'TIE', 'Tienda'),
('abe27ecc-9300-4d09-8b08-fda824c420db', 'PIN', 'Punto de interes');
INSERT INTO public.usu_usuario (usu_id, usu_nombre, usu_fec_modificacion, usu_email)
VALUES 
('43c29fa1-d02c-4da5-90ea-51f451ed8952', 'Pedro Steven Castiblanco', '2024-01-05 19:04:14.014607+00', 'pscastiblanco@gmail.com'),
('eb42d503-ee93-407b-bc84-432366c87791', 'Paula Orjuela', '2024-01-05 19:04:33.902571+00', NULL);
