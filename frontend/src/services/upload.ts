import { ApiResponse ,type Data } from '../types';
export const handleUpload= async (file: File): Promise<[null, Data?]> =>{
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('http://localhost:3000/api/files', {
            method: 'POST',
            body: formData
        });
        const data = await response.json() as ApiResponse;
        return [null, data.data];

    }catch(error){
        console.log(error);
        return [null];
    }
}