### Pré-requisitos
- Java JDK 21
- Node.js (com npm)

É possível executar o programa rapidamente executando o arquivo <b>start.cmd</b> no Windows.
Caso não seja possível executar o start.cmd para executar o código é preciso seguir os passos a baixo:

### Execução do back-end
abrir um terminal em:

    cd ...\ProjedataSystem\back-end\demo

Executar:

    mvn spring-boot:run

---

### Execução do Front-end

Esse projeto utiliza Node.js com Vite que é um Hot Module Replacement que ajuda na hora de codar em tempo real sendo necessário utilizar o mesmo para inicializar.

Indo para:

    cd ...\ProjedataSystem\front-end

E em seguida executando

    npm i

Seguido de:

    npm run dev

Assim a página abrirá no local <b>http://localhost:5173/</b>