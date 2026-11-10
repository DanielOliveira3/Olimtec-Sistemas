<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Defina aqui o e-mail da OlimTec que vai receber os currículos
    $email_destino = " jose_eduardo@olimtec.com.br"; 

    // 2. Coleta os dados do formulário com segurança
    $nome        = strip_tags(trim($_POST['nome']));
    $email_remet = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telefone    = strip_tags(trim($_POST['telefone']));
    $mensagem    = strip_tags(trim($_POST['comentario']));

    // 3. Configurações básicas do e-mail
    $assunto = "Novo Currículo Recebido: " . $nome;
    $boundary = md5(time()); // Identificador para separar o texto do arquivo PDF

    // Cabeçalhos (Headers) obrigatórios para envio com anexo
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "From: OlimTec Sistemas <noreply@olimtec.com.br>\r\n";
    $headers .= "Reply-To: $email_remet\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // 4. Montagem do corpo da mensagem de texto
    $corpo = "--$boundary\r\n";
    $corpo .= "Content-Type: text/html; charset=UTF-8\r\n";
    $corpo .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $corpo .= "<h2>Novo Cadastro de Currículo - OlimTec</h2>";
    $corpo .= "<p><strong>Nome:</strong> $nome</p>";
    $corpo .= "<p><strong>E-mail:</strong> $email_remet</p>";
    $corpo .= "<p><strong>Telefone:</strong> $telefone</p>";
    $corpo .= "<p><strong>Mensagem/Comentário:</strong><br>" . (!empty($mensagem) ? nl2br($mensagem) : "Nenhuma mensagem enviada.") . "</p>";
    $corpo .= "\r\n";

    // 5. Processamento e inclusão do arquivo PDF anexado
    if (isset($_FILES['curriculo']) && $_FILES['curriculo']['error'] == UPLOAD_ERR_OK) {
        $file_tmp  = $_FILES['curriculo']['tmp_name'];
        $file_name = $_FILES['curriculo']['name'];
        $file_size = $_FILES['curriculo']['size'];
        
        // Abre e lê o arquivo PDF binário
        $handle = fopen($file_tmp, "r");
        $content = fread($handle, $file_size);
        fclose($handle);
        
        // Codifica o arquivo em base64 para poder trafegar por e-mail com segurança
        $encoded_content = chunk_split(base64_encode($content));

        // Anexa o PDF à estrutura da mensagem
        $corpo .= "--$boundary\r\n";
        $corpo .= "Content-Type: application/pdf; name=\"$file_name\"\r\n";
        $corpo .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
        $corpo .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $corpo .= $encoded_content . "\r\n";
    }

    $corpo .= "--$boundary--";

    // 6. Tenta disparar o e-mail usando o servidor
    if (mail($email_destino, $assunto, $corpo, $headers)) {
        // Redireciona o usuário para uma tela simples de sucesso ou mostra aviso
        echo "<script>alert('Currículo enviado com sucesso! Obrigado pelo interesse.'); window.location.href='trabalhe-conosco.html';</script>";
    } else {
        echo "<script>alert('Erro ao enviar o e-mail. Por favor, tente novamente mais tarde.'); window.history.back();</script>";
    }
} else {
    header("Location: trabalhe-conosco.html");
    exit;
}
?>