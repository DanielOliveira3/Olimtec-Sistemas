function mascaraTelefone(campo){
        let valor = campo.value.replace(/\D/g, ""); 
        
        if (valor.length > 0) {
          valor = "(" + valor;
        }
        if (valor.length > 3) {
          valor = valor.slice(0, 3) + ") " + valor.slice(3);
        }
        if (valor.length > 10) {
          valor = valor.slice(0, 10) + "-" + valor.slice(10, 14);
        } else if (valor.length > 6) {
          valor = valor.slice(0, 9) + "-" + valor.slice(9);
        }
        
        campo.value = valor;
      }
      
        function atualizarEstiloPDF(input) {
            const uploadStatus = document.getElementById('upload-status');
            const uploadFilename = document.getElementById('upload-filename');
            const previewContainer = document.getElementById('preview-container');
            const pdfPreview = document.getElementById('pdf-preview');
            
            
            if (input.files && input.files[0]) {
                const arquivo = input.files[0];
                
               
                uploadStatus.innerText = "Arquivo selecionado!";
                uploadFilename.innerText = arquivo.name;
                uploadFilename.style.color = "#28a745"; 

                
                if (arquivo.type === "application/pdf") {
                    const url = URL.createObjectURL(arquivo);
                    pdfPreview.src = url;
                    previewContainer.style.display = "block"; 
                }
            } else {
                
                uploadStatus.innerText = "Clique para enviar seu PDF";
                uploadFilename.innerText = "Apenas arquivos .pdf são aceitos";
                uploadFilename.style.color = "#6c757d";
                previewContainer.style.display = "none"; 
            }
        }

// Animação de entrada dos elementos da página Trabalhe Conosco.
document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.querySelector(".container-formulario");
    if (!pagina) return;

    pagina.querySelectorAll("h1, .campo-grupo, #preview-container").forEach((elemento, indice) => {
        elemento.classList.add("trabalhe-reveal");
        elemento.style.transitionDelay = `${Math.min(indice * 45, 300)}ms`;
    });

    const elementos = pagina.querySelectorAll(".trabalhe-reveal");

    if (!("IntersectionObserver" in window)) {
        elementos.forEach((elemento) => elemento.classList.add("visible"));
        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    elementos.forEach((elemento) => observador.observe(elemento));
});

// Mantém o telefone enviado pelo formulário no mesmo campo usado anteriormente,
// enquanto o DDD e o número ficam visualmente separados como no formulário de Contato.
function sincronizarTelefone() {
    const ddd = document.getElementById('txt_DDD');
    const telefone = document.getElementById('txt_Telefone_Visual');
    const oculto = document.getElementById('txt_Telefone');
    if (!ddd || !telefone || !oculto) return;

    const d = ddd.value.replace(/\D/g, '').slice(0, 2);
    const n = telefone.value.replace(/\D/g, '').slice(0, 10);
    oculto.value = d && n ? `(${d}) ${n.slice(0,5)}${n.length > 5 ? '-' + n.slice(5) : ''}` : (d ? `(${d})` : n);
}

document.addEventListener('DOMContentLoaded', () => {
    const ddd = document.getElementById('txt_DDD');
    const telefone = document.getElementById('txt_Telefone_Visual');
    if (!ddd || !telefone) return;
    ddd.addEventListener('input', sincronizarTelefone);
    telefone.addEventListener('input', sincronizarTelefone);
});
