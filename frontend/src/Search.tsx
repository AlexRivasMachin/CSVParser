import { useEffect, useState } from "react";
import { Data } from "./types"
import { toast } from "sonner";
import { searchData } from "./services/search";

export const Search = ({initialData } : {initialData : Data}) => {

    const [data, setData] = useState<Data>(initialData);
    const [search, setSearch] = useState<string>('');

    const handleSearch = async (event: React.FormEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    };

    useEffect(() => {
        const pathName = search == ''
            ? window.location.pathname
            : `?q=${search}`; // si no hay nada en search, se queda en la misma página, si hay algo, se añade el query param
            
        window.history.replaceState({}, '', pathName);
    }), [search];

    useEffect(() => {
        if(!search || search == ""){
            setData(initialData);
            return;
        }
        searchData(search)
            .then(([error, newData]) => {
                if (error) {
                    console.error(error);
                    toast.error('Error searching data');
                    return;
                }
                if (newData) setData(newData);
            });
    }, [search, initialData]);

    return (
        <>
            <h3> Search</h3>
                <div>
                <p>Search:</p>
                <input 
                    onChange={handleSearch} 
                    type="search" 
                    placeholder="Search Information"
                />
                <ul>
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