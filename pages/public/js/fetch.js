

    
function desloga(){
    sessionStorage.removeItem('usuario')
    window.location.href = '/home'
}



function logado(){
    const th = document.querySelector("#cabecalhoelementos");
    let bpesquisa = document.querySelector("#pesquisa");
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    let login = document.querySelector("#loginbotao");
    let cadastro = document.querySelector("#cadastrobotao");

    if (user && login && cadastro) {
        login.remove();
        cadastro.remove();

        bpesquisa.style.width = "39%";

        let a_anunciarlivro = document.createElement("a");
        a_anunciarlivro.classList.add("anunciar-livro4");
        a_anunciarlivro.innerHTML = "Anunciar livro";
        a_anunciarlivro.href = "/AnunciarLivro";

        let a_meuslivros = document.createElement("a");
        a_meuslivros.classList.add("meus-livros4");
        a_meuslivros.innerHTML = "Meus livros";
        a_meuslivros.href = "/MeusLivros";

        let deslogar = document.createElement("button");
        deslogar.style.width = "100px";
        deslogar.style.height = "38px";
        deslogar.innerHTML = "Sair";
        deslogar.id = "Deslogar";
        deslogar.onclick = desloga;

        let br = document.createElement('br')
        let perfilImagem = document.createElement('img');
        perfilImagem.src = user.foto
        perfilImagem.classList.add("PerfilFoto");

        th.appendChild(a_anunciarlivro);
        th.appendChild(a_meuslivros);
        th.appendChild(deslogar);
        th.appendChild(br);
        th.appendChild(perfilImagem);


    }
    if (user) {
        sessionStorage.setItem("usuario", JSON.stringify(user));
    }
    
}

function exibir() {
    fetch('/exibirCapas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar capas: ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        if (data.success && Array.isArray(data.capas)) {
            
            const exibirLivros = document.getElementById('exibirLivros');
            exibirLivros.innerHTML = ''; 

            if (data.capas.length == 0){
                let p = document.createElement('p');
                p.classList.add('nenhumLivro');
                p.innerText = "Nenhum Livro Anunciado na Plataforma"
                exibirLivros.appendChild(p)
                return;
            }
            data.capas.forEach(capa => {
                let img = document.createElement('img');
                img.src = capa; 
                img.alt = 'Capa do Livro'; 
                img.classList.add('capa-livro'); 
                exibirLivros.appendChild(img); 
            });
        } else {
            console.error('Erro ao processar dados do servidor.');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar as capas:', error);
    });
}


function verificarLogin() {
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    if (user === null) {
        alert("Você não está logado para acessar essa página");
        window.location.href = "/home"; 
        return false; 
    }
    sessionStorage.setItem('usuario', JSON.stringify(user)); 
    return true; 
}



function inicializarPagLivro() {
    if (!verificarLogin()) {
        return; 
    }
    logado(); 
    exibir(); 
}

function inicializarAnuncio() {
    if (!verificarLogin()) {
        return; 
    }
    logado();
}


