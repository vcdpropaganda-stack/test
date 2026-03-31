# Templates de e-mail do Supabase

Estes arquivos foram preparados para substituir os templates padrão do Supabase Auth por versões com identidade da VLservice.

## Arquivos

- `confirm-signup.html`
  Template para confirmação de cadastro.
- `reset-password.html`
  Template para recuperação e redefinição de senha.

## Onde colar no Supabase

1. Abra o painel do projeto.
2. Vá em `Authentication`.
3. Abra `Email Templates`.
4. Escolha o template correspondente.
5. Cole o HTML do arquivo desejado.

## Variáveis usadas

Os templates usam placeholders do próprio Supabase, como:

- `{{ .ConfirmationURL }}`
- `{{ .Data.full_name }}`

## Recomendação

Se o projeto for para operação real, também vale configurar SMTP próprio para:

- melhorar entregabilidade
- definir remetente da marca
- ter mais controle sobre identidade visual e volume de envio
