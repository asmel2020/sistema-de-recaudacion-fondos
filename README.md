# sistema de recaudacion fondos (BCN)

smart contract creado en AssemblyScript para el bootcamp del protocolo Near ofrecido por [blockdemy](https://www.blockdemy.com/) e impartido por el
instructor [Jhon Alexander Zuluaga Salazar](https://www.blockdemy.com/)

**Tabla de Contenido**

- **[Descripción](#descripción)**  
- **[Instalacion](#instalacion) :astronaut:**  
- **[Desplegar el contrato en la red de pruebas de Near](#desplegar-el-contrato-en-la-red-de-pruebas-de-near)**  
- **[Funciones principales](#funciones-principales)**  
  - **[init](#init)**
  - **[invest](#invest)**
  - **[vote](#vote)**
- **[Autores](#autores)**
- **[Agradecimientos](#agradecimientos)**

# Descripción 

Smart contract creado con la finalidad de realizar una recaudacion de fondos colectivos para posteriormente ser realizado una votacion para decidir donde seran gastados o invertidos los fondos recaudados

# Instalacion

instalar near-cli 

`npm install -g near-cli`

descargar el repositorio


   ` git clone https://github.com/asmel2020/sistema-de-recaudacion-fondos.git `

Instalar repositorio

`npm install`

instalar yarn (necesario)

`npm install --global yarn`

# Desplegar el contrato en la red de pruebas de Near


Compilar el contrato

`yarn asb`

Realizar pruebas unitarias

`yarn asp`

Desplegar el contrato en la red de pruebas del protocolo de near

`near dev-deploy ./build/release/proyect-1.wasm` 


# Funciones principales

### init
Instancia las variables principales que se utilizara en el smart contract



    //@dev constructor del contrato
    export function init(): bool {
      assert(storage.get<string>("init") == null, "contract already initialized");
    
      const initialOwner = context.sender;
      storage.set("owner", initialOwner);
    
      proposals.set(1,"buy an NFT");
      proposals.set(2,"buy bitcoin");
      proposals.set(3,"buy near");
      proposals.set(4,"donate to an ONG");
	  
      onPause();
	  
      logging.log("initialOwner: " + initialOwner);
      storage.set("init", "done");
      return true;
    }

### invest()

Permite a los usuarios depostiar Near en el smart contract que le permitira tener derechos a votar por los proyecto propuestos 1Near=1 Voto



    //@dev funciona para compra de votos
    export function invest(): bool {
    
      assert(storage.getSome<bool>("pause") == true, "investment time is over");
    
      const user = registeredUser.contains(context.sender)
        ? registeredUser.getSome(context.sender)
        : false;
    
      assert(user == false, "user already invested");
    
      const Deposit: u128 = context.attachedDeposit;
    
      assert(Deposit <= MaxDeposit, "exceed the maximum deposit amount");
      assert(Deposit >= MinDeposit, "wrong amount sent");
    
      votesAllowed.set(context.sender, Deposit);
      registeredUser.set(context.sender, true);
      return true;
      
    }

### vote()

Permite a los usuarios votar por las opciones donde los fondos seran donados o invertidos



    //@dev funciona para votar por una propuestas
    //@param _vato:u8 este parametro es para indicar a que propuesta el usuario dara su voto
    export function vote(_voto:u8): bool{
    
      const getVote=getVotesAllowed();
    
      assert(getVote > u128.from("0"), "does not have enough votes");
      assert(_voto >= 1, "wrong choice");
      assert(_voto <= 4, "wrong choice");
    
      const NumberOfVotes=getvoteProposal(_voto);
    
      voteProposal.set(_voto, u128.add(getVote, NumberOfVotes));
      votesAllowed.set(context.sender,u128.from("0"));
    
      return true;
    
    }


# Autores

Danny jesus gonzalez galicia  
Correo: jesusgalicia2019@gmail.com  
Linkedin :https://www.linkedin.com/in/danny-gonzalez-974763219  
GitHub: https://github.com/asmel2020  

Eduardo Antonio Vargas Mauricio  
Correo: eduant.varmau@gmail.com  
Linkedin :https://www.linkedin.com/in/eduantvarmau  
GitHub: https://github.com/eduantvarmau  

Alexis Antonio Castillo Pimienta  
Correo: alexis.castillo.pimienta@gmail.com  
Linkedin: https://www.linkedin.com/in/alexiscastillo25  

Alejandro Juárez Perea  
Correo: alejandro.info33@gmail.com  

# Agradecimientos

Gracias a  [blockdemy](https://www.blockdemy.com/) por permitirnos particpar en este increible bootcamp del protocolo de Near.

A nuestro instructor [Jhon Alexander Zuluaga Salazar](https://www.blockdemy.com/) por sus enseñanzas y apoyo en todo el trayecto bootcamp, espero poder seguir compartiendo contigo en futuros eventos y proyectos que el protocolo de Near lleve a las comunidades
