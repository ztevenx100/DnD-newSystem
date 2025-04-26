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