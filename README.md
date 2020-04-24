# runner-carga-ehr

## Script para criar envs

Altere os parâmetros internamente para apontar para `prd`, `hmg` ou `local`, ajustando qual o host para cada caso.

```bash
node createEnvs.js
```

## Script para preparar o json para execucao

Altere os parâmetros internamente para apontar para a pasta correta. A saída será gravada em pasta `prep` com nome análogo à entrada.

```bash
node formatJsonDocs.js
```

## Script para executar os testes

Altere os parâmetros internamente para apontar para a pasta de docs correta, para qual ambiente os testes serão enviados, qual o limite de documentos por UF.

```bash
node index.js
```

## Script sumarizar os resultados

Altere os parâmetros internamente para apontar para a pasta de resultados correta. A saída será salva na mesma pasta da entrada, em um json de nome `summary.json`.

```bash
node summaryResult.js
```
