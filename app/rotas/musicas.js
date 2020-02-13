module.exports = function (app) {

    app.get('/musicas', function (req, resp) {

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let musicas = new app.repositorio.MusicaRepository(conexao);

        musicas.todos(function (erros, resultado) {

            if (erros) {
                console.log(erros);
            }
            resp.render('musicas/listagem', {lista: resultado });
        });
        conexao.end();
    });

    app.get('/musicas/form', function (req, resp) {
        resp.render('musicas/form-cadastro', {errosValidacao: {},  musica: {} });
    });

    app.post('/musicas', function (req, resp) {

        let musica = req.body;
        console.log(musica);

        req.assert('nome', 'Nome do musica é obrigatório.').notEmpty();
        req.assert('duracao', 'Duração da musica é obrigatório.').notEmpty();
        req.assert('artistas', 'Artistas da musica são obrigatórios.').notEmpty();
        
        let erros = req.validationErrors();

        if (erros) {
            resp.render('musicas/form-cadastro', { errosValidacao: erros, musica: musica });
            return;
        }

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let musicas = new app.repositorio.MusicaRepository(conexao);

        musicas.salva(musica, function (erros, resultados) {           
           resp.redirect('/musicas');
        });

        conexao.end();

    });

    app.post('/musicas/remove/(:id)', function (req, resp) {
        let musica = {
            id: req.params.id
        }

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let musicas = new app.repositorio.MusicaRepository(conexao);

        musicas.remove(musica, function (erros, resultados) {
            resp.redirect('/musicas');
        });
    });


    app.get('/musica/edita/(:id)', function (req, resp) {
        

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let musicas = new app.repositorio.MusicaRepository(conexao);

        musicas.porId(req.params.id, function (erros, resultado) {
            if (erros ) {
                console.log(erros);
            }
            resp.render('musicas/form-cadastro', {errosValidacao: erros,  
                                                    musica: {
                                                        id: resultado[0].id,
                                                        nome: resultado[0].nome,
                                                        duracao: resultado[0].duracao,
                                                        artistas: resultado[0].artistas,
                                                        dataCadastro: resultado[0].dataCadastro } 
            });
            console.log(resultado);
        });
        conexao.end();
    });


}