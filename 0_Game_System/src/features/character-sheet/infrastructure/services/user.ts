import { getDataQueryUsu } from '@database/models/dbTables';
import { DBUsuario } from '@utils/types';

export const getUser = async(user: string): Promise<DBUsuario[]> => {
    const data = await Promise.resolve(
        getDataQueryUsu(
            'usu_id, usu_nombre, usu_fec_modificacion, usu_email'
            , { 'usu_id': user }
        )
    );

    return data;
}; 