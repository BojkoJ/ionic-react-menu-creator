# Nákupní seznam - BOJ0043 projekt od předmětu TAMZ

Jednoduchá webová/mobilní aplikace v Ionicu (React) pro správu jídelních menu na týden. Uživatel si pro každý den uloží tři jídla a také může pro každý den vytvořit nákupní seznam. Může také využít import/export do/z XML a JSON formátu.

## Instalace

Chcete-li projekt spustit, je třeba mít nainstalovaný <b>[Node.js](https://nodejs.org/en).

1. Nainstalujte Ionic CLI pomocí příkazu `npm install -g @ionic/cli`
2. Nainstalujte závislosti pomocí příkazu `npm install`.
3. Spusťte projekt pomocí příkazu `ionic serve`.
4. V druhém terminálu se přepněte do složky src pomocí `cd ./src`
5. V druhém terminálu pak spusťte express server pomocí příkazu `node server.js`

## Použití

1. Po spuštění přejděte na webovou stránku aplikace - běží na `localhost:8100`.
2. Nyní můžete používat aplikaci

-   Ve složce filesToImport najdete example soubory, s vhodnou strukturou, na kterých si můžete vyzkoušet import xml a json souborů.
-   Při exportu se soubory exportují do složky export
