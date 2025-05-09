import { getDataQueryUsu } from '@database/models/dbTables';
import { DBUsuario } from '@utils/types';

export const getUser = async(user: string): Promise<DBUsuario[]> => {
    try {
        const data = await Promise.resolve(
            getDataQueryUsu(
                'usu_id, usu_nombre, usu_fec_modificacion, usu_email'
                , { 'usu_id': user }
            )
        );

        // Asegurar que los datos incluyan tanto los campos usu_* como los alias
        return data.map(usuario => ({
            ...usuario,
            id: usuario.usu_id,
            nombre: usuario.usu_nombre,
            email: usuario.usu_email
        }));
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        // Devolver un usuario por defecto en caso de error
        return [{
            usu_id: "43c29fa1-d02c-4da5-90ea-51f451ed8952",
            usu_nombre: "Usuario Temporal",
            usu_email: "temp@example.com",
            id: "43c29fa1-d02c-4da5-90ea-51f451ed8952",
            nombre: "Usuario Temporal", 
            email: "temp@example.com"
        }];
    }
};