import { useEffect, useState } from "react";
import { Data } from "./types"
import { toast } from "sonner";
import { searchData } from "./services/search";
import { useDebounce } from '@uidotdev/usehooks';
import './Search.css'

export const Search = ({initialData } : {initialData : Data}) => {

    const DEBOUNCE_TIME = 300;
    const [data, setData] = useState<Data>(initialData);
    const [search, setSearch] = useState<string>(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('q') || ''; // si no hay query param, devuelve un string vacío, es decir con la url bien puesta, ya van filtradosº
    });

    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

    const handleSearch = async (event: React.FormEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    };

    useEffect(() => {
        const pathName = search == ''
            ? window.location.pathname
            : `?q=${debouncedSearch}`; // si no hay nada en search, se queda en la misma página, si hay algo, se añade el query param
            
        window.history.replaceState({}, '', pathName);
    }), [debouncedSearch];

    useEffect(() => {
        if(!debouncedSearch || debouncedSearch == ""){
            setData(initialData);
            return;
        }
        searchData(debouncedSearch)
            .then(([error, newData]) => {
                if (error) {
                    console.error(error);
                    toast.error('Error searching data');
                    return;
                }
                if (newData) setData(newData);
            });
    }, [debouncedSearch, initialData]);

    return (
        <>
        <div className="searchZone">
            <div className="searchInput">
                <h3> Search</h3>
                <input 
                    onChange={handleSearch} 
                    type="search" 
                    placeholder="Search Information"
                    defaultValue={debouncedSearch}
                />
            </div>
            <ul className="searchData">
                {data.map((record) => (
                    <li key={record.id}>
                        <article>
                            {Object.entries(record).map(([key, value]) => (
                                    <p key={key}><strong>{key}:</strong>{value}</p>
                            ))}
                        </article>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}