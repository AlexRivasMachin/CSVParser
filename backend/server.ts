// NOS DICE QUE TIENE QUE SER TS Y NODE => vamos a usar npm ts-node
// POST y GET => vamos a usar npm express
//Vamos a usar multer para subir archivos, vamos a usar npm multer
//Convert CSV to JSON => vamos a usar npm convert-csv-to-json
import multer from 'multer'; // Middleware para gestionar la subida de archivos
import convertCsvToJson from 'convert-csv-to-json';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

//Documentación en https://www.npmjs.com/package/multer => como usamos typescript, hay que hacer @types/multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let data :Array<Record<string, string>> = [];

app.use(cors());

//Definido en el ununciado (nos dice de usar file como entrada)
app.post('/api/files', upload.single('file') ,async (req, res) => {
    //1. Extraer el archivo del request (.csv)
    const { file } = req;
    //2. Procesar el archivo validando que lo tenemos y que cumple con el formato
    if (!file) {
        return res.status(400).json({message: 'File is requested'});
    }
    if(file.mimetype !== 'text/csv') { //mirar tipo de archuvo
        return res.status(400).json({message: 'Invalid file type, use CSV'});
    }
    //3. Transformar a String
    //4. String a JSON desde el csv 
    //5. Guardar el archivo JSON en el sistema de archivos
    try{
        const csv = Buffer.from(file.buffer).toString('utf-8'); // si usanmos el convertCsvToJson, es any, por tanto hacemos este paso por el tipado
        //convertimos el resultado a CSV
        const json = convertCsvToJson.getJsonFromCsv(csv);
        data = json;
    }catch(err){
        return res.status(400).json({message: 'Invalid file type, use CSV'});
    }

    //6. Return 200 wiTh OK
    return res.status(200).json({data: data ,message: 'OK'});
});

//Definido en el ununciado
app.get('/api/users', async (req, res) => {
    //1. Leer el archivo csv y extraer el contenido
    const { q } = req.query;
    //2. Validad el query param
    if(q === undefined){
        return res.status(400).json({message: 'Query param is required'});
    }
    //3. Filtrar el contenido
    const searchFilter = q.toString().toLowerCase();
    const filtereData = data.filter(row => {
        return Object.values(row).some(value => value.toLowerCase().includes(searchFilter));
    });

    //4. Return 200 con el contenido filtrado
    return res.status(200).json({data: filtereData});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
