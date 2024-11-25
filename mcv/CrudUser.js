import conexao from './conexão.js';
import mssql from 'mssql';

class CrudUser {
    cadastrar(user, callback) {
            if (!conexao) {
                console.error('Falha na conexão:', err);
                return callback(err, null);
            }
            const request = new mssql.Request(conexao);
            try {
                request.input('CPF_Usuario', mssql.Char(11), user.cpf);
                request.query('select * from [usuario] where CPF_Usuario = @CPF_Usuario', function (err, result) {
                    if (err) return callback(err, null);
                    if (result.recordset.length !== 0) return callback(null, false);

                    request.input('nm_Usuario', mssql.VarChar(120), user.nome);
                    request.input('Email', mssql.VarChar(50), user.email);
                    request.input('senha', mssql.VarChar(255), user.senha);
                    request.input('Foto', mssql.VarChar(255), user.foto);
                    request.output('Qtd_total_Usuarios_Ativos', mssql.Int);

                    request.execute('sp_UsuarioInsert', function (err, result) {
                        if (err) return callback(err, null);
                        console.log("qtd total usuarios:", result.output.Qtd_total_Usuarios_Ativos);
                        return callback(null, result);
                    });
                });
            } catch (ex) {
                return callback(ex, null);
            } finally {
                console.log("yes")
            }
        ;
    }

    logar(user, callback) {
            if (!conexao) {
                console.error('Falha na conexão:', err);
                return callback(err, null);
            }
            const request = new mssql.Request(conexao);
            try {
                request.input('email', mssql.VarChar(50), user.email);
                request.input('senha', mssql.VarChar(255), user.senha);
                request.query('select nm_Usuario, email_Usuario, foto from [Usuario] where email_Usuario = @email and senha_Usuario = @senha', function (err, result) {
                    if (err) return callback(err, null);
                    callback(null, result);
                });
            } catch (ex) {
                return callback(ex, null);
            } finally {
                //connection.close();
            }
        
    }

    atualizarSenha(user, callback) {
        
            if (!conexao) {
                console.error('Falha na conexão:', err);
                return callback(err, null);
            }
            const request = new mssql.Request(conexao);
            try {
                request.input('nm_Usuario', mssql.VarChar(120), user.nome);
                request.input('email', mssql.VarChar(50), user.email);
                request.input('senha', mssql.VarChar(255), user.senha);
                
                request.query('select cd_Usuario from [Usuario] where nm_Usuario = @nm_Usuario and email_Usuario = @email', function (err, result) {
                    if (err) return callback(err, null);

                    const id_user = result.recordset[0].cd_Usuario;
                    request.input('cd_Usuario', mssql.Int, id_user);

                    request.execute('sp_UsuarioUpdate', function (err, result) {
                        if (err) return callback(err, null);
                        return callback(null, result);
                    });
                });
            } catch (ex) {
                return callback(ex, null);
            } finally {
                //connection.close();
            }
        
    }

    deletarConta(user, callback) {
        
            if (!conexao) {
                console.error('Falha na conexão:', err);
                return callback(err, null);
            }
            const request = new mssql.Request(conexao);
            try {
                request.input('nm_Usuario', mssql.VarChar(120), user.nome);
                request.input('email', mssql.VarChar(50), user.email);
                request.input('Status_Usuario', mssql.Char(1), 'D');

                request.query('select cd_Usuario from [Usuario] where nm_Usuario = @nm_Usuario and email_Usuario = @email', function (err, result) {
                    if (err) return callback(err, null);

                    const id_user = result.recordset[0].cd_Usuario;
                    request.input('cd_Usuario', mssql.Int, id_user);

                    request.execute('sp_UsuarioUpdate', function (err, result) {
                        if (err) return callback(err, null);
                        return callback(null, result);
                    });
                });
            } catch (ex) {
                return callback(ex, null);
            } finally {
                //connection.close();
            }
        
    }

    cadastrarLivro(user, livro, callback) {
        
            if (!conexao) {
                console.error('Falha na conexão:', err);
                return callback(err, null);
            } else {
                const userrequest = new mssql.Request(conexao);
                const livrorequest = new mssql.Request(conexao);
                let id_user;
                console.log(user)
                console.log(livro)
                userrequest.input('nm_Usuario', mssql.VarChar(120), user.nome);
                userrequest.input('email', mssql.VarChar(50), user.email);
                userrequest.query(
                    'select cd_Usuario from [Usuario] where nm_Usuario = @nm_Usuario and email_Usuario = @email',
                    function (err, result) {
                        if (err) {
                            //connection.close();
                            console.log(err)
                            return callback(err, null);
                        } else {
                            if (result.recordset.length === 0) {
                                //connection.close();
                                return callback(new Error('Usuário não encontrado'), null);
                            }
    
                            id_user = result.recordset[0].cd_Usuario;
                            console.log(id_user)
                            livrorequest.input('nm_Titulo', mssql.VarChar(150), livro.titulo);
                            livrorequest.input('ano', mssql.Int, livro.ano);
                            livrorequest.input('capa', mssql.VarChar(255), livro.capa)
                            livrorequest.output('cd_Livro', mssql.Int);
                            livrorequest.output('Qtd_Total_livros')
                            livrorequest.execute('sp_LivroInsert', function (err, result) {
                                if (err) {
                                    //connection.close();
                                    console.log(err)
                                    return callback(err, null);
                                } else {
                                    
                                    const id_livro = result.output.cd_Livro;
                                    console.log(id_livro)
                                    const userlivrorequest = new mssql.Request(conexao)
                                    userlivrorequest.input('cd_Usuario', mssql.Int, id_user);
                                    userlivrorequest.input('cd_Livro', mssql.Int, id_livro);
    
                                    userlivrorequest.execute(
                                        'sp_UsuarioLivroInsert',
                                        function (err, result) {
                                            //connection.close();
                                            if (err) {
                                                return callback(err, null);
                                            } else {
                                                return callback(null, result);
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                );
            }
        
    }

    exibirCapas(user, callback) {
        if (!conexao) {
            console.error('Falha na conexão:', err);
            return callback(new Error('Conexão com o banco de dados não estabelecida'), null);
        }
    
        const request = new mssql.Request(conexao);
        request.input('nm_usuario', mssql.VarChar(120), user.nome);
        request.input('email', mssql.VarChar(50), user.email);
    
        request.query(
            'SELECT cd_Usuario FROM [Usuario] WHERE nm_usuario = @nm_usuario AND email_usuario = @email',
            function (err, result) {
                if (err) {
                    console.error('Erro ao buscar usuário:', err);
                    return callback(err, null);
                }
    
                if (result.recordset.length === 0) {
                    return callback(new Error('Usuário não encontrado'), null);
                }
    
                const cd_user = result.recordset[0].cd_Usuario;
                const livroRequest = new mssql.Request(conexao);
    
                livroRequest.input('cd_user', mssql.Int, cd_user);
                livroRequest.execute('sp_SelecionarCapa', function (err, result) {
                    if (err) {
                        console.error('Erro ao executar sp_SelecionarCapa:', err);
                        return callback(err, null);
                    }
    
                    callback(null, result.recordset.map(row => row.capa));
                });
            }
        );
    }
    
    
}

export default CrudUser