(function () {
    function inicializarContato() {
        const form = document.getElementById("form-contato");
        if (!form || form.dataset.contatoInicializado === "1") return;
        form.dataset.contatoInicializado = "1";

        const campoCep = document.getElementById("cep");
        const statusCep = document.getElementById("cep-status");

        if (campoCep) {
            campoCep.addEventListener("input", function () {
                let cep = this.value.replace(/\D/g, "").substring(0, 8);
                this.value = cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");

                if (cep.length === 8) {
                    buscarCEP(cep);
                } else if (statusCep) {
                    statusCep.textContent = "";
                }
            });
        }

        async function buscarCEP(cep) {
            if (statusCep) statusCep.textContent = "Buscando endereço...";

            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!resposta.ok) throw new Error("Erro na consulta");

                const dados = await resposta.json();

                if (dados.erro) {
                    if (statusCep) statusCep.textContent = "CEP não encontrado.";
                    preencherEndereco({});
                    return;
                }

                preencherEndereco(dados);
                if (statusCep) statusCep.textContent = "Endereço encontrado com sucesso!";
            } catch (erro) {
                if (statusCep) statusCep.textContent =
                    "Não foi possível consultar o CEP. Tente novamente.";
                console.error(erro);
            }
        }

        function preencherEndereco(dados) {
            const campos = {
                endereco: dados.logradouro || "",
                bairro: dados.bairro || "",
                cidade: dados.localidade || "",
                estado: dados.uf || ""
            };

            Object.entries(campos).forEach(([id, valor]) => {
                const campo = document.getElementById(id);
                if (campo) campo.value = valor;
            });
        }

        const modal = document.getElementById("modal-sucesso");
        const fecharBotoes = modal
            ? modal.querySelectorAll(".modal-sucesso-fechar, .modal-sucesso-ok, .modal-sucesso-overlay")
            : [];

        function abrirModalSucesso() {
            if (!modal) return;
            modal.classList.add("ativo");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-aberto");
            const botao = modal.querySelector(".modal-sucesso-ok");
            if (botao) setTimeout(() => botao.focus(), 50);
        }

        function fecharModalSucesso() {
            if (!modal) return;
            modal.classList.remove("ativo");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-aberto");
        }

        fecharBotoes.forEach(botao => botao.addEventListener("click", fecharModalSucesso));

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape" && modal && modal.classList.contains("ativo")) {
                fecharModalSucesso();
            }
        });

        form.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const botao = form.querySelector(".btn-submit");
            const textoOriginal = botao ? botao.innerHTML : "";
            if (botao) {
                botao.disabled = true;
                botao.innerHTML = "ENVIANDO...";
            }

            const email = form.querySelector('input[name="email"]');
            const replyto = document.getElementById("form-replyto");
            if (replyto && email) replyto.value = email.value;

            try {
                const resposta = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (!resposta.ok) {
                    throw new Error("Não foi possível enviar a mensagem.");
                }

                form.reset();
                if (statusCep) statusCep.textContent = "";
                abrirModalSucesso();
            } catch (erro) {
                console.error(erro);
                alert("Não foi possível enviar a mensagem agora. Verifique sua conexão e tente novamente.");
            } finally {
                if (botao) {
                    botao.disabled = false;
                    botao.innerHTML = textoOriginal;
                }
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarContato, { once: true });
    } else {
        inicializarContato();
    }

    window.addEventListener("olimtec:navigation", inicializarContato);
})();
