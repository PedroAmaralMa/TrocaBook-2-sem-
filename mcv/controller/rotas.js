import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import CrudUser from '../CrudUser.js'
import { fileURLToPath } from 'url'
import multer  from 'multer'
import sessao from 'express-session'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const crudUser = new CrudUser()

const storage = multer.diskStorage(
    {destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
    })


const upload = multer({storage})



const app = express()
const router = express.Router()
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(sessao({
    secret: 'TrocaBookersAplicacao23@',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, '../../pages/public')))
app.use(express.static(path.join(__dirname, '../../pages/public/css')))
app.use(express.static(path.join(__dirname, '../../pages/public/img')))
app.use(express.static(path.join(__dirname, '/mcv')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, '../../pages/public/js')))

app.get('/home', function(req, res){
    res.redirect("index.html")
})

app.get('/cadastro', function(req, res){
    res.redirect("cadastro.html")
})

app.get('/login', function(req, res){
    res.redirect("login.html")
})

app.get('/SobreNos', function(req, res){
    res.redirect("sobrenos.html")
})

app.get('/AnunciarLivro', function(req, res){
    res.redirect("anunciar.html")
})

app.get('/CentralDeAjuda', function(req, res){
    res.redirect("ajuda.html")
})

app.get('/MeusLivros', function(req, res){
    res.redirect("paglivro.html")
})

app.post('/cadastrar', upload.single('foto'), function(req, res){

    const {nome, email, cpf, senha} = req.body
    const fotoPath = req.file ? req.file.path : null
    if (!nome || !email || !senha || !cpf || !fotoPath){
        return res.status(400).send('Algum campo deve ser preenchido')
    }
    const user = {"nome": nome, "email": email, "cpf": cpf, "senha": senha, "foto": fotoPath}
    crudUser.cadastrar(user, function(err, result){
        if (err){
            console.error("erro ao cadastrar: " + err);
            return res.status(500).json({ success: false, error: err });
        }
        res.json({ success: true, user: result });
        
    })
})

app.post('/logar', function(req, res) {
    const { email, senha } = req.body;
    const user = { "email": email, "senha": senha };

    crudUser.logar(user, function(err, result) {
        if (err) {
            console.error("Erro ao consultar usuário:", err);
            return res.status(500).json({ success: false, error: "Erro ao tentar logar" });
        }

        if (result.recordset.length !== 0) {
            req.session.usuario = {
                "email": result.recordset[0].email_Usuario,
                "nome": result.recordset[0].nm_Usuario,
                "foto": result.recordset[0].foto
            };
            // Exibe os dados da sessão no console
            console.log(req.session.usuario);

            res.json({ success: true, user: req.session.usuario });
        } else {
            // Caso o usuário não exista
            res.status(401).json({ success: false, error: "Credenciais inválidas" });
        }
    });
});

app.post('/cadastrarLivro',upload.single('imagem'), function(req, res){
    const {titulo, ano} = req.body
    const capaPath = req.file ? req.file.path : null
    if (!titulo || !ano || !capaPath) {
        return res.status(400).send('Título e ano são obrigatórios');
    }
    
    const livro = {"titulo": titulo, "ano": ano, "capa": capaPath}
    if (!req.session.usuario) {
        return res.status(401).send('Usuário não autenticado');
    }
    const user = req.session.usuario
    crudUser.cadastrarLivro(user, livro, function (err, result) {
        if (err) {
            console.error('Erro ao cadastrar o livro:', err);
            return res.status(500).send('Erro ao cadastrar o livro'); 
        }

        
        res.json({ success: true, livro: result });
    });
})

app.post('/exibirCapas', function(req, res){
    if (!req.session.usuario) {
        return res.status(401).send('Usuário não autenticado');
    }
    const user = req.session.usuario
    crudUser.exibirCapas(user, function (err, result){
        if (err){
            console.error('Erro ao procurar capas:', err);
            return res.status(500).send('Erro ao procurar capas'); 
        }
        res.json({ success: true, capas: result});
    })
})

let server = app.listen(3000, function(){
    let host = server.address().address
    let port = server.address().port
    console.log("Servidor iniciado em http://%s:%s", host, port)
})