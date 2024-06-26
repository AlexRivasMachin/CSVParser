import { useState } from 'react';
import './App.css'
import { handleUpload } from './services/upload';
import { Toaster, toast } from 'sonner';
import {type Data } from './types';
import { Search } from './Search';

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
      toast.success('File uploaded successfully');
      setAppStatus(APP_STATUS.READY_TO_SEARCH);
    }

    console.log(data);
  }

  const showButtom = appStatus === APP_STATUS.READY_TO_UPLOAD || appStatus === APP_STATUS.LOADING;
  const showInput = appStatus === APP_STATUS.IDLE;

  return (
    <>
        <h1><span style={{color : '#ff7b00'}}>CSV</span>Parser</h1>
        <div className="links">
            <a href="https://github.com/AlexRivasMachin" target='_blank'>Github</a>
            <a href="https://www.linkedin.com/in/alex-rivas-machin/" target='_blank'>Linkedin</a>
            <a href="https://alexdev.eus/" target='_blank'>Portfolio</a>
        </div>
    <div className="inputZone">
      <Toaster />
      
      <h3> Upload your CSV file and search</h3>
      <p id='demo'>
        Download the demo file:
        <a href='/demo.csv' download> Demo.csv</a>
      </p>
      {showInput && <h4>Upload your CSV file</h4>}
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
    </div>
      {
        appStatus === APP_STATUS.READY_TO_SEARCH && (
          <Search initialData={data}/>
        )
      }
    </>
  )
}

export default App
