const dados = require("prompt-sync")();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, orderBy, query } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDFutmHYhkz0Tb9yb--dCSLHnJXOECPW_Q",
  authDomain: "projeto-35d67.firebaseapp.com",
  projectId: "projeto-35d67",
  storageBucket: "projeto-35d67.appspot.com",
  messagingSenderId: "440367551980",
  appId: "1:440367551980:web:f39b406ccbdd4333711cc9",
  measurementId: "G-39ZD323S0M",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const scoresRef = collection(db, "scores");

const palavras =['amigo','amiga']

let ps = palavras[Math.floor(Math.random() * palavras.length)];

const nomeUsuario = dados("Digite seu nome: ");
console.log("A palavra tem", ps.length, "letras.");

let opcao = parseInt(dados("Escolha uma opção:\n1. Jogo com chances\n2. Jogo até acertar\nDigite: "));

async function game(ps, opcao) {
  let c = 1;
  let pontos = 0;

  if (opcao === 1) {
    let tt = parseInt(dados("Informe quantas tentativas você quer: "));
    while (c <= tt) {
      let p = dados("Informe a palavra: ").toLowerCase().trim();
      if (p === ps) {
        console.log("✅ VOCÊ ACERTOU na tentativa", c, "!");
        pontos = tt - c + 1;
        break;
      } else {
        mostrarDicas(p, ps);
      }
      c++;
    }
  } else if (opcao === 2) {
    while (true) {
      let p = dados("Informe a palavra: ").toLowerCase().trim();
      if (p === ps) {
        console.log("✅ VOCÊ ACERTOU na tentativa", c, "!");
        pontos = 10 - c;
        break;
      } else {
        mostrarDicas(p, ps);
      }
      c++;
    }
  } else {
    console.log("Opção inválida.");
  }

  try {
    await addDoc(scoresRef, {
      nome: nomeUsuario,
      pontos: pontos,
      data: new Date(),
    });
    console.log("Pontuação registrada!");
    await exibirTabelaPontos();
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error);
  }
}

function mostrarDicas(palpite, palavraSecreta) {
  let dicas = "";

  for (let i = 0; i < palavraSecreta.length; i++) {
    if (palpite[i] === palavraSecreta[i]) {
      dicas += "🟩 " + palpite[i] + " ";
    } else if (palavraSecreta.includes(palpite[i])) {
      dicas += "🟨 " + palpite[i] + " ";
    } else {
      dicas += "⬛ _ ";
    }
  }

  console.log("Dica:", dicas.trim());
}

async function exibirTabelaPontos() {
  try {
    const q = query(scoresRef, orderBy("pontos", "desc"));
    const snapshot = await getDocs(q);

    console.log("\n🏆 TABELA DE PONTOS 🏆");
    let posicao = 1;
    snapshot.forEach((doc) => {
      console.log(posicao + "º -", doc.data().nome, "-", doc.data().pontos, "pontos");
      posicao++;
    });
  } catch (error) {
    console.error("Erro ao carregar pontuação:", error);
  }
}

game(ps, opcao);
