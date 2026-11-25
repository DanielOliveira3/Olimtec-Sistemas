(function () {
    function inicializarTrabalheConosco() {
        const form = document.getElementById("form-trabalhe");
        if (!form || form.dataset.inicializado === "1") return;
        form.dataset.inicializado = "1";

        // Mesmo modal de sucesso utilizado na página Contato.
        const modal = document.getElementById("modal-sucesso");
        const fecharBotoes = modal
            ? modal.querySelectorAll(".modal-sucesso-fechar, .modal-sucesso-ok, .modal-sucesso-overlay")
            : [];

        function abrirModalSucesso() {
            if (!modal) return;
            modal.classList.add("ativo");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-aberto");
            const botaoOk = modal.querySelector(".modal-sucesso-ok");
            if (botaoOk) setTimeout(() => botaoOk.focus(), 50);
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

        const campoArquivo = document.getElementById("txt_Curriculo");
        const uploadStatus = document.getElementById("upload-status");
        const uploadFilename = document.getElementById("upload-filename");
        const previewContainer = document.getElementById("preview-container");
        const pdfPreview = document.getElementById("pdf-preview");
        const ddd = document.getElementById("txt_DDD");
        const telefone = document.getElementById("txt_Telefone_Visual");
        const telefoneOculto = document.getElementById("txt_Telefone");
        const replyto = document.getElementById("form-replyto");

        // Mantém o telefone completo no campo enviado por e-mail.
        function sincronizarTelefone() {
            if (!ddd || !telefone || !telefoneOculto) return;

            const d = ddd.value.replace(/\D/g, "").slice(0, 2);
            const n = telefone.value.replace(/\D/g, "").slice(0, 9);
            let numero = n;

            if (n.length > 5) {
                numero = n.slice(0, 5) + "-" + n.slice(5);
            }

            telefoneOculto.value = d && n
                ? `(${d}) ${numero}`
                : (d ? `(${d})` : numero);
        }

        if (ddd && telefone) {
            ddd.addEventListener("input", sincronizarTelefone);
            telefone.addEventListener("input", sincronizarTelefone);
        }

        // Atualiza o nome do arquivo e a prévia do currículo em PDF.
        window.atualizarEstiloPDF = function (input) {
            if (!uploadStatus || !uploadFilename || !previewContainer || !pdfPreview) return;

            if (pdfPreview.dataset.objectUrl) {
                URL.revokeObjectURL(pdfPreview.dataset.objectUrl);
                delete pdfPreview.dataset.objectUrl;
            }

            if (input.files && input.files[0]) {
                const arquivo = input.files[0];

                uploadStatus.innerText = "Arquivo selecionado!";
                uploadFilename.innerText = arquivo.name;
                uploadFilename.style.color = "#28a745";

                if (arquivo.type === "application/pdf" || arquivo.name.toLowerCase().endsWith(".pdf")) {
                    const url = URL.createObjectURL(arquivo);
                    pdfPreview.src = url;
                    pdfPreview.dataset.objectUrl = url;
                    previewContainer.style.display = "block";
                } else {
                    previewContainer.style.display = "none";
                }
            } else {
                uploadStatus.innerText = "Clique para enviar seu PDF";
                uploadFilename.innerText = "Apenas arquivos .pdf são aceitos";
                uploadFilename.style.color = "#6c757d";
                previewContainer.style.display = "none";
                pdfPreview.removeAttribute("src");
            }
        };

        if (campoArquivo) {
            campoArquivo.addEventListener("change", function () {
                window.atualizarEstiloPDF(this);
            });
        }

        // Animação de entrada dos elementos da página.
        const pagina = document.querySelector(".container-formulario");
        if (pagina) {
            pagina.querySelectorAll("h1, .campo-grupo, #preview-container").forEach((elemento, indice) => {
                elemento.classList.add("trabalhe-reveal");
                elemento.style.transitionDelay = `${Math.min(indice * 45, 300)}ms`;
            });

            const elementos = pagina.querySelectorAll(".trabalhe-reveal");

            if (!("IntersectionObserver" in window)) {
                elementos.forEach(elemento => elemento.classList.add("visible"));
            } else {
                const observador = new IntersectionObserver((entradas, observer) => {
                    entradas.forEach(entrada => {
                        if (entrada.isIntersecting) {
                            entrada.target.classList.add("visible");
                            observer.unobserve(entrada.target);
                        }
                    });
                }, {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                });

                elementos.forEach(elemento => observador.observe(elemento));
            }
        }

        // Envio pelo mesmo serviço utilizado na página Contato (FormSubmit).
        form.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            sincronizarTelefone();

            if (campoArquivo && campoArquivo.files.length) {
                const arquivo = campoArquivo.files[0];
                const ehPdf = arquivo.type === "application/pdf" ||
                    arquivo.name.toLowerCase().endsWith(".pdf");

                if (!ehPdf) {
                    alert("Por favor, selecione seu currículo em formato PDF.");
                    return;
                }

                // O FormSubmit aceita anexos de até 10 MB.
                if (arquivo.size > 10 * 1024 * 1024) {
                    alert("O arquivo PDF deve ter no máximo 10 MB.");
                    return;
                }
            }

            const botao = form.querySelector(".btn-enviar");
            const textoOriginal = botao ? botao.innerHTML : "";

            if (botao) {
                botao.disabled = true;
                botao.innerHTML = "ENVIANDO...";
            }

            const email = form.querySelector('input[name="email"]');
            if (replyto && email) replyto.value = email.value;

            try {
                const resposta = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { "Accept": "application/json" }
                });

                if (!resposta.ok) {
                    throw new Error("Não foi possível enviar o currículo.");
                }

                form.reset();
                sincronizarTelefone();

                if (uploadStatus) uploadStatus.innerText = "Clique para enviar seu PDF";
                if (uploadFilename) {
                    uploadFilename.innerText = "Apenas arquivos .pdf são aceitos";
                    uploadFilename.style.color = "#6c757d";
                }
                if (previewContainer) previewContainer.style.display = "none";
                if (pdfPreview) {
                    if (pdfPreview.dataset.objectUrl) {
                        URL.revokeObjectURL(pdfPreview.dataset.objectUrl);
                        delete pdfPreview.dataset.objectUrl;
                    }
                    pdfPreview.removeAttribute("src");
                }

                abrirModalSucesso();
            } catch (erro) {
                console.error(erro);
                alert("Não foi possível enviar seu currículo agora. Verifique sua conexão e tente novamente.");
            } finally {
                if (botao) {
                    botao.disabled = false;
                    botao.innerHTML = textoOriginal;
                }
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarTrabalheConosco, { once: true });
    } else {
        inicializarTrabalheConosco();
    }

    window.addEventListener("olimtec:navigation", inicializarTrabalheConosco);
})();
