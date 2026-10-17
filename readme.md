# Amanda Lenns — Website Premium de Marca Pessoal

Site one-page (HTML + CSS + JS puros, sem dependências) para **Amanda Lenns**,
acompanhante de luxo. Identidade: paleta Preto / Vinho / Sangue / Pimenta / Cereja,
tipografia editorial (Cormorant Garamond + Jost), vídeo de fundo no hero e
movimento com propósito.

## Estrutura (6 seções fixas, nesta ordem)

1. **Hero** — vídeo `video2.mp4` de fundo (alternativa estática: `imagem1.jpg`), nome, posicionamento e CTA WhatsApp.
2. **Essência** — apresentação curta com foto lateral e leve parallax.
3. **Galeria** — 4 fotos (`imagem1–4.jpg`) em grade editorial assimétrica + vídeo `video1.mp4` (dança) + lightbox acessível.
4. **Experiência** — serviços autorizados: acompanhamento de luxo, massagem, packs de conteúdo, ligações ao vivo.
5. **Plataformas** — Instagram, Privacy, OnlyFans e Fatal Model (links centralizados em `config.js`).
6. **Contato** — CTA final de WhatsApp. Footer discreto após a seção.

Extras dentro da estrutura: nav com âncoras, botão flutuante animado de WhatsApp, indicador de scroll.

## Como rodar localmente

```bash
# basta abrir o index.html, ou servir com:
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

## ⚠️ Prévia comercial — campos provisórios

Antes de publicar, edite **`config.js`**:

| Campo | O que colocar | Estado atual |
|---|---|---|
| `whatsappNumber` | número completo com DDI, só dígitos (ex.: "5511999999999") | vago — informado "em outro momento" |
| `links.instagram` | URL real do perfil | vago |
| `links.privacy` | URL real do perfil | vago |
| `links.onlyfans` | URL real do perfil | vago |
| `links.fatalmodel` | URL real do perfil | vago |

Enquanto um campo estiver vazio (""), o botão correspondente:
- não leva a nenhum destino inventado;
- mostra aviso claro de "campo provisório" ao clique;
- recebe borda tracejada + rótulo "link provisório";
- o rodapé exibe uma nota de prévia comercial.

## Mídias — coloque os arquivos reais em `assets/`

```
assets/imagem1.jpg   → poster/fallback do hero + galeria
assets/imagem2.jpg   → essência + galeria
assets/imagem3.jpg   → galeria + poster do vídeo1
assets/imagem4.jpg   → galeria
assets/video1.mp4    → vídeo da modelo dançando (galeria, com controles, sem autoplay)
assets/video2.mp4    → vídeo de fundo do hero (mudo, em loop)
```

Os arquivos de mídia NÃO estão neste repositório (não foram enviados no briefing).
Adicione as versões autorizadas e otimizadas (hero: ideal ≤ ~4 MB, 720p, H.264, sem áudio).
Se o vídeo do hero falhar ao carregar, o site usa automaticamente `imagem1.jpg`.

## Notas técnicas

- Sem build, sem framework: `index.html`, `css/style.css`, `js/main.js`, `config.js`.
- Acessibilidade: HTML semântico, skip-link, foco visível, menu mobile com `aria-expanded`,
  lightbox com Escape/setas/armadilha de foco, `alt` nas imagens, `prefers-reduced-motion` respeitado.
- Responsivo mobile-first (breakpoints ~320/390/768/1200+; valide também em aparelhos reais).
- SEO: `title` e `meta description` somente com dados confirmados (sem localização/preços inventados).
- Links e textos 100% baseados no briefing — nada foi inventado.
