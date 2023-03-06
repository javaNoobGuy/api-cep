var body;
var enderecos = null;
var enderecosApi = null;

const atualizarApiEndereco = async() =>{
    const res = await fetch('http://localhost:3000/data');
    enderecosApi = await res.json();
}


atualizarApiEndereco();

const getItemIndex = (propriedade, valor, data) =>{
    return data.findIndex((item) => item.cliente[propriedade] == valor);
}

const validarConta = (clienteC, confirmeSenha) =>{
    let feedbacks = [];//vetor para guardar informações de feedback
    
    console.log("debug");
    console.log(enderecosApi)
    if(enderecosApi != null){//verifica se a api não está nula;
        console.log(enderecosApi);
        console.log('comparando com: ');
        
        if(enderecosApi.length > 0){
            index = getItemIndex('email', clienteC.email, enderecosApi);
            console.log(enderecosApi[index]);
            if(enderecosApi[index] != null){
                feedbacks.push('Email já utilizado');//envia mensagem de erro no vetor de feedback
            }
            index = getItemIndex('senha', clienteC.senha, enderecosApi);
            console.log(enderecosApi[index]);
            if(enderecosApi[index] != null){
                feedbacks.push('Senha já utilizada');//envia mensagem de erro no vetor de feedback
            }
        }
        console.log(feedbacks.length);
    }

    

    if(!validarCep(clienteC)){
        feedbacks.push('Cep inválido ou inexistente');//validação extra de cep
    }

    if(clienteC.senha != confirmeSenha){
        feedbacks.push('Repita igualmente a senha no confirmar senha');//confere se o campo de senha e confirme senha são compativeis
    }

    return feedbacks;//retorna o vetor de feedbacks
}

const criarConta = async() =>{//on click cria conta

    await atualizarApiEndereco();
    document.getElementById('feedback').innerText = "";//limpa o feedback
    document.getElementById('feedback').className = "";//tira a classe para não ter formatação

    let inputsToClean = [document.getElementById('email'),document.getElementById('senha'),
    document.getElementById('confirmeSenha'),document.getElementById('cep')];//vetor com inputs que devem ser limpos em caso de erro do usuário

    //pega os valores dos inputs
    let nome = document.getElementById('nome').value;
    let sobrenome = document.getElementById('sobrenome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmeSenha = document.getElementById('confirmeSenha').value;
    let cep = document.getElementById('cep').value;
    let numero = document.getElementById('numero').value;

    //texto json 
    let cliente = '{"nome" : "'+ nome + '", "sobrenome" : "'+sobrenome+'", "email" : "'+email+'", "senha" : "'+senha+'", "cep" : "'+cep+'", "numero" : "'+numero+'", "endereco":""}'
    cliente = JSON.parse(cliente);//transforma texto json em objeto javascript
    console.log(cliente);
    let result = validarConta(cliente, confirmeSenha);//chama a variavel que checa a validade dos inputs
    console.log('resultado validação: ' + result.length);

    if(result.length > 0 && result.length != undefined){//checa se tem erros no resultado da validação
        let erroFeed = document.getElementById('feedback');//pega um elemento para exibir as mensagens de erro
        erroFeed.className = "erro";//adiciona classe com formatação de erro


        for(let i = 0; i < result.length;i++){//adiciona as mensagens de erro no elemento feedback
            erroFeed.append(result[i]);
            erroFeed.append(document.createElement('br'));
        }

        for(let i = 0 ; i < inputsToClean.length;i++){//limpa os inputs
            inputsToClean[i].value = null;
        }

    }else{// se não tiver erros no resultado da validação
        pesquisarCep(cliente);//chama a função pesquisar cep
        console.log(cliente.endereco);

    }





}

const addClientePost = async(cliente) =>{

    const init = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(cliente)
    }

    const adcionarCliente = await fetch('http://localhost:3000/sendClient', init);
    const testePost = await adcionarCliente.json();
    console.log(testePost);
}

const adicionarClienteSistema = (cliente) => {


    console.log('sistema' + enderecosApi);

    addClientePost(cliente);

}

//cep

//preencher os inputs com arrow functions
const preencherFormulario = (cliente) => {
    let oldInner = document.getElementsByClassName('loginCadastroBg').innerHTML;
    document.getElementsByClassName('loginCadastroBg').innerHTML = "";
    let mapa = document.getElementById("mapa");
    console.log('sdaaaaaa'+cliente);
    console.log(cliente.endereco);

    let rua = cliente.endereco.logradouro;
    let estado = cliente.endereco.uf;
    let cidade = cliente.endereco.localidade;
    let bairro = cliente.endereco.bairro;

    enderecos = '{"rua" : "' + rua + '", "estado" : "'+estado+'", "cidade" : "'+cidade+'", "bairro" : "'+bairro+'" }';
    const datas = JSON.parse(enderecos);
    console.log(datas);

    estado = estado.replaceAll(" ", "%20");
    rua = rua.replaceAll(" ", "%20");
    cidade = cidade.replaceAll(" ", "%20");
    bairro = bairro.replaceAll(" ", "%20");     
         
    mapa.innerHTML = "<div class="+"mapouter"+"><div class="+"gmap_canvas"+"><iframe width="+"600"+" height="+"500"+" id="+"gmap_canvas"+" src="+"https://maps.google.com/maps?q="+cidade+",%20"+ bairro+ ",%20"+rua+",20%"+estado+"&t=&z=18&ie=UTF8&iwloc=&output=embed"+" frameborder="+"0"+" scrolling="+"no"+" marginheight="+"0"+" marginwidth="+"0"+"></iframe><br><style>.mapouter{position:relative;text-align:right;height:500px;width:600px;}</style><a href="+"https://www.embedgooglemap.net"+ ">embed google maps website</a><style>.gmap_canvas {overflow:hidden;background:none!important;height:500px;width:600px;}</style></div></div>";
    document.getElementById('endereco').innerHTML = '<ol>' + '<li>rua: '+datas.rua+'</li> <li>estado: '+datas.estado+'</li> <li>cidade: '+datas.cidade+'</li> <li>cidade: '+datas.bairro+'</li>'
    + '</ol>'

    console.log("LINK : https://maps.google.com/maps?q="+cidade+",%20"+ bairro+ ",%20"+rua+",20%"+estado+"&t=&z=13&ie=UTF8&iwloc=&output=embed");

    
}
//autopreenchimento
const cepValido = (cep) => {
    if (cep.length = 8) { 
        return true;
    } else {
        return false;
    }
}
//buscar API
//Com async e await podemos trabalhar com código assíncrono em um estilo mais parecido com o bom e velho código síncrono.

const validarCep = async (cliente) =>{

    const url = `http://viacep.com.br/ws/${cliente.cep}/json`;
    const dados = await fetch(url);
    const endereco = await dados.json();

    console.log(endereco);

    if (endereco.erro) {
        console.log('false');
        return false;

    }else if(endereco.logradouro != undefined){
        console.log('true');
        return true;
    }

}

const pesquisarCep = async (cliente) => {

    const url = `https://viacep.com.br/ws/${cliente.cep}/json/`;
    
    if (cepValido(cliente.cep)) {
        
        const dados = await fetch(url);
        const endereco = await dados.json();
        console.log(endereco);
        cliente.endereco = endereco;
        adicionarClienteSistema(cliente);
        preencherFormulario(cliente);
    }
}


