# Evidence projektů a členů týmů – frontend

Webové rozhraní aplikace pro evidenci projektů, osob a týmů. Postavené v Next.js, data čte a zapisuje přes REST API backendu.

Backend je v samostatném repozitáři: [work_task_be](https://github.com/misahoskova/work_task_be).

## Popis aplikace

Aplikace eviduje projekty, osoby a týmy a vazby mezi nimi.

- **Projekty:** název, popis, stav (naplánováno, probíhá, dokončeno), datum zahájení a volitelně datum ukončení.
- **Osoby:** jméno, příjmení, e-mail, pozice a tým. Každá osoba patří právě do jednoho týmu.
- **Týmy:** název a seznam členů.

Funkce:

- seznam a detail projektů, osob a týmů,
- přidání, úprava a smazání projektu, osoby a týmu,
- přiřazení osoby nebo celého týmu k projektu a jejich odebrání,
- přehled všech účastníků na detailu projektu, tedy osob přiřazených přímo i členů přiřazených týmů. U každého účastníka je vidět, jakou cestou se k projektu dostal.

Rozhraní je česky a je responzivní, takže se dá používat na počítači i na telefonu. Výsledek každé akce potvrzuje krátká hláška, mazání se potvrzuje v dialogu.

**Součástí projektu není přihlašovací logika, protože ji zadání výslovně nevyžadovalo.**

## Architektura

- **Stránky** jsou v `src/app` a používají App Router. Každá entita má čtyři stránky: seznam, detail, formulář pro založení a formulář pro úpravu.
- **Data se načítají v prohlížeči.** Stránky jsou klientské komponenty a volají backend přímo přes `fetch` na adresu z proměnné `NEXT_PUBLIC_API_URL`. Backend proto musí povolit požadavky z adresy frontendu (CORS). Výchozí nastavení backendu to pro `http://localhost:3000` dělá.
- **Volání API** jsou na jednom místě v `src/lib/api.ts`. Soubor obsahuje funkci pro každou operaci backendu a třídu `ApiError`, která nese stavový kód, kód chyby a podrobnosti z odpovědi. Stránky a formuláře z ní skládají chybové hlášky.
- **Typy** dat z backendu jsou v `src/lib/types.ts`, české popisky pozic a stavů v `src/lib/labels.ts`.
- **Formuláře** (`team-form.tsx`, `person-form.tsx`, `project-form.tsx`) jsou společné pro založení i úpravu. Stránka jim předá výchozí hodnoty, text tlačítka a funkci, která data odešle.
- **Vzhled** je postavený na Tailwind CSS a komponentách shadcn/ui ve složce `src/components/ui`.

| Adresa                | Stránka                       |
| --------------------- | ----------------------------- |
| `/`                   | úvodní stránka s rozcestníkem |
| `/projects`           | seznam projektů               |
| `/projects/new`       | nový projekt                  |
| `/projects/[id]`      | detail projektu a účastníci   |
| `/projects/[id]/edit` | úprava projektu               |
| `/persons`            | seznam osob                   |
| `/persons/new`        | nová osoba                    |
| `/persons/[id]`       | detail osoby                  |
| `/persons/[id]/edit`  | úprava osoby                  |
| `/teams`              | seznam týmů                   |
| `/teams/new`          | nový tým                      |
| `/teams/[id]`         | detail týmu a členové         |
| `/teams/[id]/edit`    | úprava týmu                   |

## Spuštění

Celá aplikace se spouští v Dockeru jedním příkazem z tohoto repozitáře.
Frontend a backend běží v samostatných kontejnerech.

Potřeba je [Docker](https://docs.docker.com/get-docker/) s Docker Compose.

Oba repozitáře musí být ve stejné složce vedle sebe, protože `docker-compose.yml` frontendu načítá konfiguraci backendu z `../work_task_be`:

```bash
git clone https://github.com/misahoskova/work_task_be.git
git clone https://github.com/misahoskova/work_task_fe.git
```

V repozitáři backendu je potřeba vytvořit soubor `.env` podle návodu v jeho README:

```bash
cd work_task_be
cp .env.example .env
cd ..
```

Potom stačí spustit:

```bash
cd work_task_fe
docker compose up -d --build
```

Spustí se čtyři služby: databáze, backend, pgAdmin a frontend. Frontend čeká, až je backend připravený.

| Služba            | Adresa                     |
| ----------------- | -------------------------- |
| Frontend          | http://localhost:3000      |
| Backend (API)     | http://localhost:3001      |
| Dokumentace k API | http://localhost:3001/docs |

Zastavení:

```bash
docker compose down
```

S přepínačem `-v` se smaže i databáze.

Spuštění z tohoto repozitáře a spuštění samotného backendu z `work_task_be` jsou pro Docker dva různé projekty a každý má vlastní databázi.
Data vytvořená v jednom se ve druhém neobjeví.

## Lokální vývoj

Pro vývoj frontendu bez Dockeru je potřeba Node.js 24 a běžící backend na adrese z `NEXT_PUBLIC_API_URL`.
Backend jde spustit příkazem `docker compose up -d` v repozitáři `work_task_be`.

```bash
cp .env.example .env
npm install
npm run dev
```

Aplikace běží na http://localhost:3000.
Ve stejnou chvíli nesmí běžet kontejner frontendu z předchozí sekce, protože používá stejný port.

Soubor `.env` obsahuje jedinou proměnnou:

| Proměnná              | Výchozí hodnota         | Význam          |
| --------------------- | ----------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | adresa backendu |

Hodnota se do aplikace vkládá při sestavení.
V Dockeru se proto předává jako argument sestavení v `docker-compose.yml`.

| Příkaz                 | Co dělá                     |
| ---------------------- | --------------------------- |
| `npm run dev`          | vývojový server             |
| `npm run build`        | produkční sestavení         |
| `npm start`            | spuštění sestavené aplikace |
| `npm run format`       | formátování přes Prettier   |
| `npm run format:check` | kontrola formátování        |
| `npm run lint`         | kontrola kódu přes Oxlint   |
| `npm run typecheck`    | kontrola typů               |
| `npm test`             | testy funkcí a komponent    |
| `npm run test:e2e`     | testy v prohlížeči          |

## Struktura projektu

```
work_task_fe/
├── e2e/                    testy v prohlížeči (Playwright) a pomocné funkce
├── src/
│   ├── app/                stránky (App Router)
│   │   ├── layout.tsx      společné rozvržení: hlavička, patička, hlášky
│   │   ├── page.tsx        úvodní stránka
│   │   ├── not-found.tsx   stránka pro neexistující adresu
│   │   ├── projects/       seznam, detail, nový projekt, úprava
│   │   ├── persons/        seznam, detail, nová osoba, úprava
│   │   └── teams/          seznam, detail, nový tým, úprava
│   ├── components/         formuláře a sdílené komponenty
│   │   └── ui/             komponenty shadcn/ui
│   └── lib/
│       ├── api.ts          volání REST API a zpracování chyb
│       ├── types.ts        typy dat z backendu
│       ├── labels.ts       české popisky pozic a stavů
│       ├── format.ts       formátování data
│       └── utils.ts        pomocná funkce pro skládání tříd
├── tests/                  testy funkcí a komponent (Vitest)
├── Dockerfile              obraz frontendu
├── docker-compose.yml      spuštění celé aplikace včetně backendu
├── next.config.ts          konfigurace Next.js a bezpečnostní hlavičky
├── playwright.config.ts    konfigurace testů v prohlížeči
└── vitest.config.mts       konfigurace testů funkcí a komponent
```

### Komponenty

| Soubor ve `src/components`                             | Účel                                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `site-header.tsx`                                      | hlavička aplikace s odkazem na úvodní stránku                               |
| `site-footer.tsx`                                      | patička                                                                     |
| `team-form.tsx`, `person-form.tsx`, `project-form.tsx` | formuláře společné pro založení i úpravu                                    |
| `back-link.tsx`                                        | odkaz zpět na nadřazenou stránku                                            |
| `error-message.tsx`                                    | chybová hláška                                                              |
| `loading.tsx`                                          | stav načítání dat                                                           |
| `native-select.tsx`                                    | výběr z možností ve vzhledu ostatních polí                                  |
| `ui/`                                                  | komponenty shadcn/ui: tlačítko, pole, popisek, textové pole, dialog, hlášky |

## Technologie

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) a [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5
- [Tailwind CSS](https://tailwindcss.com/) 4 a [shadcn/ui](https://ui.shadcn.com/)
- [Sonner](https://sonner.emilkowal.ski/) pro hlášky
- [Vitest](https://vitest.dev/) a [React Testing Library](https://testing-library.com/) pro testy funkcí a komponent
- [Playwright](https://playwright.dev/) pro testy v prohlížeči
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) a [Prettier](https://prettier.io/)
- Docker a Docker Compose
- GitHub Actions

## Testy

### Testy funkcí a komponent

```bash
npm test
```

Běží ve Vitestu v prostředí jsdom, bez backendu.
Ve složce `tests/lib` jsou testy formátování data a zpracování chyb, ve složce `tests/components` testy všech tří formulářů.

### Testy v prohlížeči

Procházejí celou aplikaci včetně backendu a databáze, ve třech prohlížečích: Chromium, Firefox a WebKit.
Před spuštěním musí běžet aplikace v Dockeru podle sekce [Spuštění](#spuštění).

```bash
npx playwright install
npm run test:e2e
```

První příkaz stáhne prohlížeče a stačí ho spustit jednou.

Přehled testů

- založení, úprava a smazání týmu,
- zobrazení nové osoby na detailu jejího týmu a odmítnutí smazat tým se členy,
- přiřazení týmu a osoby k projektu, rozlišení účastníků přiřazených přímo a přes tým a jejich odebrání,
- zobrazení názvu s HTML značkami jako textu.

Testy zapisují do databáze běžící aplikace.
Každý si zakládá vlastní data s jedinečnou příponou v názvu, takže se navzájem neovlivňují a jdou spouštět opakovaně.
Část těchto dat po doběhnutí v databázi zůstane.

## Zabezpečení

- **Bezpečnostní hlavičky.** `next.config.ts` přidává ke každé odpovědi hlavičky `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` a `Permissions-Policy` a vypíná hlavičku `X-Powered-By`.
- **Zobrazení dat.** Hodnoty z backendu se do stránky vkládají jako text, ne jako HTML. Ověřuje to test v prohlížeči s názvem obsahujícím HTML značky.
- **Validace vstupů.** Formuláře kontrolují povinná pole, délku a tvar e-mailu už v prohlížeči. Rozhodující validace je na backendu, jeho chybové odpovědi se zobrazují u formuláře.
- **Přihlašování.** Aplikace nemá přihlašování ani uživatelské role. Kdokoli s přístupem k adrese může data číst i měnit.

## CI

Při každém pull requestu spustí GitHub Actions kontrolu formátování, lint, testy funkcí a komponent, sestavení a kontrolu typů.
Testy v prohlížeči v CI neběží, protože potřebují spuštěný backend s databází.
