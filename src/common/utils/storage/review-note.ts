import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

const WRITE_BLOCK_GEOMETRY = 'algoplus-revivew-note-write-block-geometry';
const WRITE_BLOCK_MODE = 'algoplus-revivew-note-write-block-mode';

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

export const saveWriteBlockModeToStorage = async (externalMode: boolean) => {
    await saveObjectInLocalStorage({
        [WRITE_BLOCK_MODE]: externalMode ? 'EXTERNAL' : 'EMBED',
    });
};

export const getStoredWriteBlockModeIsExternal = async (): Promise<boolean> => {
    const mode = await getObjectFromLocalStorage(WRITE_BLOCK_MODE);
    return mode === 'EXTERNAL';
};
