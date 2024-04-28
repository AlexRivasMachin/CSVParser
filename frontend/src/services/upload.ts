export const handleUpload= async (file: File): Promise<[null, string]> =>{
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('http://localhost:4000/api/files', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return [null, data];

    }catch(error){
        console.error({error});
        return [null, 'error'];
    }
}