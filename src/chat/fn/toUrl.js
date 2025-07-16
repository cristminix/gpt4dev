import { toBase64 } from "./fn/toBase64";

export const toUrl = async (file) => {
    if (file instanceof File) {
        return await toBase64(file);
    }
    return file.url ? file.url : file;
};
