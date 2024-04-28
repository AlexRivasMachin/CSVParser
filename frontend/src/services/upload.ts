import { ApiResponse, type Data } from '../types';

export const handleUpload = async (file: File): Promise<[Error | null , Data?]> => {

    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`http://localhost:3000/api/files`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json() as ApiResponse;
        return [null, json.data];

    } catch (error) {
        return [null];
    }

    return [null];
}