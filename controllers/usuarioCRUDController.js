const { response } = require('express');
const {StatusCodes} = require('http-status-codes')

/*Lista de usuários. Esse array faz o papel do banco de dados. Se a aplicação estivesse conectada com o banco de dados, ao invés 
chamar isto, seria chamado o objeto de dados*/
const usuarios = [];


//Cadastra um novo usuário
exports.create = function(request, response){
    console.log('Entrou no método create usuário');

    //Guarda o conteúdo que veio do payload da requisição em uma constante
    const usuario = request.body;

    //Valida se os dados do usuário estão preenchidos
    if (!usuarioValidoCadastro(usuario)){
        return response.status(StatusCodes.BAD_REQUEST).json(`Verifique os dados informados para cadastro do usuário`);
    }

    //Valida se o login já existe e não permite cadasrar duplicado
    if (loginJaCadastrado(usuario)){
        return response.status(StatusCodes.BAD_REQUEST).json(`Usuário ${usuario.login} já foi cadastrado`);
    }
    
    //Adiciona na lista
    const usuarioIndex = usuarios.push(usuario);   
    return response.status(StatusCodes.OK).json(usuario);
}   

//Altera um usuário
exports.update = function(request, response){
    console.log('Entrou no método update usuário');
    const usuario = request.body;
    const usuarioIndex = obterUsuario(usuario.login);
    
    if(usuarioExiste(usuarioIndex)){ //Verifica se o usuário existe
        if (!usuarioValidoCadastro(usuario)){ //Se não existe, retorna uma mensagem
            return response.status(StatusCodes.BAD_REQUEST).json(`Verifique os dados informados para cadastro do usuário`);
        }

        //Valida se o login já existe e não permite cadasrar duplicado
        if (loginJaCadastrado(usuario)){
            return response.status(StatusCodes.BAD_REQUEST).json(`Usuário ${usuario.login} já foi cadastrado`);
        }

        usuarios[usuarioIndex] = usuario; //Se existe, altera
        return response.status(StatusCodes.OK).json(usuarios[usuarioIndex]);
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O usuário ${usuario.login} não existe`);

    }
}

//Exclui um usuário
exports.delete = function(request, response){
    console.log('Entrou no método delete usuário: ' + request.query.login);
    const login = request.query.login;
 
    const usuarioIndex = obterUsuario(login);
    if(usuarioExiste(usuarioIndex)){ //Verifica se o usuário existe
        usuarios.pop(usuarioIndex); //Apaga o usuário, se existe
        return response.status(StatusCodes.NO_CONTENT).json("");
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O usuário ${login} não existe`);

    }
}

//Retorna uma lista com todos os usuários
exports.list = function(request, response){
    console.log('Entrou no método list usuário');
    response.json(usuarios);
}

//Retorna um usuário a partir do login
exports.get = function(request, response){
    console.log('Entrou no método get usuário ' + request.query.login);

    const usuarioIndex = obterUsuario(request.query.login);
    
    if(usuarioExiste(usuarioIndex)){
        return response.json(usuarios[usuarioIndex]);
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O usuário ${request.query.login} não existe`);
    }
}

//Login da aplicação. Chame para verificar se pode logar. Retorna true quando pode logar e false quando não pode logar
exports.signIn = function(request, response){
    console.log('Entrou no método Sign In');

    const usuarioIndex = obterUsuario(request.body.login);
    let logado = false;

    if(usuarioExiste(usuarioIndex)){
        const usuario = usuarios[usuarioIndex];
        logado = usuario.senha===request.body.senha;
    }
    if (logado){
        return response.status(StatusCodes.OK).json(true);
    }
    else {
        return response.status(StatusCodes.BAD_REQUEST).json(false);
    }
}

//Procura um usuário dentro do array. Método criado para deixar o código mais claro e evitar ser repetitivo.
function obterUsuario(login){
    return usuarios.findIndex(usuario=>usuario.login===login);
}

//Retorna se o usuário existe. Método criado para deixar o código mais claro e evitar ser repetitivo.
function usuarioExiste(index){
    return index>=0;
}

//Método para validar se os dados informados estão corretos.
function usuarioValidoCadastro(usuario){
    return (usuario!=null) 
        && (usuario.nome!=null)
        && (usuario.login!=null)
        && (usuario.senha!=null);
}

//Métood para verificar se o usuário já foi cadastrado. Usado para evitar duplicidade.
function loginJaCadastrado(usuario){
    return usuarioExiste(obterUsuario(usuario.login));
}