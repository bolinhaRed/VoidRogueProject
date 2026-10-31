# Void Rogue: Space Survival

Jogo de browser 100% offline (HTML5 + CSS3 + JavaScript puro): gestão de recursos estilo OGame + sobrevivência rogue-like estilo FTL.

## Estrutura
```
index.html            página principal (ordem dos scripts documentada)
css/style.css         tema sci-fi, responsivo (PC + mobile)
js/config.js          dados: edifícios, naves, nodos, legado, habilidades
js/state.js           estado global, custos, gravação (localStorage), tempo offline
js/economy.js         produção, gestão de energia (ligar/desligar), ameaça, tick de 1s
js/audio.js           música sintetizada por fase (calma / tensa / batalha) + efeitos
js/combat.js          combate em tempo real, habilidades ativas e passivas
js/map.js             nodos (mercador, ruínas, anomalias...) e ações do jogador
js/scene.js           ecrã superior em canvas: planeta, frota, batalha (sprites)
js/ui.js              painéis, toasts, histórico, terminal de legado, HUD de combate
js/assets.js          manifesto dos sprites (gerado por prep_assets.py)
js/main.js            arranque e ciclo de jogo
assets/               sprites PNG selecionados dos packs
prep_assets.py        (opcional) volta a gerar assets/ e js/assets.js a partir dos ZIPs
build.py              (opcional) gera void-rogue-standalone.html com tudo embutido
```

## GitHub Pages
1. Cria o repositório e faz commit de **tudo** (mantém as pastas `css/`, `js/` e `assets/`).
2. Settings → Pages → Branch `main`, pasta `/ (root)`. O jogo fica em `https://<user>.github.io/<repo>/`.
3. Para testar localmente, abre `index.html` (funciona também por `file://`).

## Planetas, nome e classificação
No menu **Jogar** escolhes o planeta (bónus/penalizações em `VR.PL`, `js/config.js`) e dás-lhe nome (também podes renomear durante o jogo clicando no nome por baixo do título). Quando a campanha acaba, o resultado entra no **Quadro de Classificação** (pontos, dias, saltos), guardado em `localStorage`.

## Combate e sistemas
Clica num inimigo para focar o fogo; 1-3 habilidades; **4** = Impulso (gasta Deutério). A Ameaça só começa após a 1.ª construção/exploração. Cada sistema tem um modificador (`VR.MODS` em `js/config.js`).

## Controlos
Teclas **1**, **2**, **3** no combate: Escudo de Emergência (5s), Pulso de Plasma (dano em área), Sobrecarga (+60% dano 6s).

## Créditos e licenças dos assets
- Cozy Space Ships (Bramble & Byte), Pixel Planets Pack, Space Pack, Spaceship Pack.
- **Atenção:** as licenças permitem usar os sprites em jogos (também comerciais), mas **não** revender nem redistribuir os assets em si como pacote. Um repositório público com os PNG em bruto pode contar como redistribuição: confirma os termos de cada pack (Space Pack e Spaceship Pack não incluem ficheiro de licença nos ZIPs) ou usa um repositório privado.
