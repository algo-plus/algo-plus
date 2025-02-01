import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

const WRITE_BLOCK_GEOMETRY = 'algoplus-revivew-note-write-block-geometry';

export type BlockGeometry = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export const saveWriteBlockGeometryToStorage = async (
    geometry: BlockGeometry
) => {
    await saveObjectInLocalStorage({ [WRITE_BLOCK_GEOMETRY]: geometry });
};

export const loadWriteBlockGeometryFromStorage =
    async (): Promise<BlockGeometry | null> => {
        return await getObjectFromLocalStorage(WRITE_BLOCK_GEOMETRY);
    };
