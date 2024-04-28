import { useState } from 'react';
import './App.css'
import { handleUpload } from './services/upload';
import { Toaster, toast } from 'sonner';
import {type Data } from './types';

const APP_STATUS = {
  IDLE: 'IDLE', //base
  LOADING: 'LOADING', //cargando
  READY_TO_UPLOAD: 'READY_TO_UPLOAD', //listo para subir
  SUCCESS: 'SUCCESS', //subido
  ERROR: 'ERROR', //error
  READY_TO_SEARCH: 'READY_TO_SEARCH' //listo para buscar
} as const;

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS] //para que no se pueda modificar el valor de las constantes, Y SINO NO PIILLA EL TUPI, y se romperia en el useState

function App() {

  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_TO_UPLOAD);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() //para que al hacer el submit no recargue la página
    if (appStatus !== APP_STATUS.READY_TO_UPLOAD || !file) {
      return;
    }

    setAppStatus(APP_STATUS.LOADING);

    const [error, newData] = await handleUpload(file);
    if (error) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error('Error uploading file');
      return;
    }
    setAppStatus(APP_STATUS.SUCCESS);
    if (newData) {
      console.log(newData);
      setData(newData);
      setAppStatus(APP_STATUS.READY_TO_SEARCH);
      toast.success('File uploaded successfully');
    }
  }

  const showButtom = appStatus === APP_STATUS.READY_TO_UPLOAD || appStatus === APP_STATUS.LOADING;

  return (
    <>
      <Toaster />
      <h3> Upload your CSV and search</h3>
      <form onSubmit={handleSubmit}>
        <label>   
          <input 
          disabled={appStatus=== APP_STATUS.LOADING} 
          onChange={handleInputChange} 
          name='file' 
          type="file" 
          accept='.csv'
          />
        </label>

        {showButtom && (
          <button disabled={appStatus === APP_STATUS.LOADING}>
            {appStatus === APP_STATUS.READY_TO_UPLOAD ? 'Upload' : 'Loading...'}
          </button>
        )}

      </form> 
    </>
  )
}

export default App
