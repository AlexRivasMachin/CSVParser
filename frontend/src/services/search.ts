import {type ApiSearchResponse, type Data } from '../types';
import { API_HOST } from '../config';

export const searchData = async (search: string): Promise<[Error | null , Data?]> => {
    
    try {
        const response = await fetch(`http://localhost:3000/api/users?q=${search}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json() as ApiSearchResponse;
        return [null, json.data];

    } catch (error) {
        return [null];
    }

    return [null];
}