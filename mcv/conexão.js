import mssql from 'mssql'
const config = {
    user:"sa",
    password:"TrocaBookers@69",
    server:"localhost",
    database:"Trocabook",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const connection = new mssql.ConnectionPool(config);
connection.connect(function (err){
    if (!err){
        console.log('Conectado ao SQL Server com sucesso!');
            
    }else {
        console.error('Erro ao conectar ao SQL Server:', err);
        return callback(err, null);
    }
});

export default connection
        
    
