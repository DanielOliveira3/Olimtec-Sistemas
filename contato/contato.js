
const campoCep = document.getElementById("cep");
        const statusCep = document.getElementById("cep-status");

        campoCep.addEventListener("input", function () {

            let cep = this.value.replace(/\D/g, "");

            if (cep.length > 8) {
                cep = cep.substring(0, 8);
            }

            this.value = cep.replace(
                /^(\d{5})(\d{3})$/,
                "$1-$2"
            );

            if (cep.length === 8) {
                buscarCEP(cep);
            } else {
                statusCep.textContent = "";
            }

        });


        async function buscarCEP(cep) {

            statusCep.textContent = "Buscando endereço...";

            try {

                const resposta = await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );

                if (!resposta.ok) {
                    throw new Error("Erro na consulta");
                }

                const dados = await resposta.json();

                if (dados.erro) {

                    statusCep.textContent = "CEP não encontrado.";

                    document.getElementById("endereco").value = "";
                    document.getElementById("bairro").value = "";
                    document.getElementById("cidade").value = "";
                    document.getElementById("estado").value = "";

                    return;
                }

                // PREENCHIMENTO AUTOMÁTICO
                document.getElementById("endereco").value =
                    dados.logradouro || "";

                document.getElementById("bairro").value =
                    dados.bairro || "";

                document.getElementById("cidade").value =
                    dados.localidade || "";

                document.getElementById("estado").value =
                    dados.uf || "";

                statusCep.textContent = "Endereço encontrado com sucesso!";

            } catch (erro) {

                statusCep.textContent =
                    "Não foi possível consultar o CEP. Tente novamente.";

                console.error(erro);

            }

        }
