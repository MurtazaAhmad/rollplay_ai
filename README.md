## Getting Started

> Keep in mind you have to install [Node.js - LTS](https://nodejs.org) to run this project.

First, you have to install all the necessary packages and dependecies required by the application.

```bash
npm install
# or
yarn
# or
pnpm
```
### Env vars
Before running the dev server, you have to create the necessary env vars for this project to run.
- Create a **.env.local** file at the root dir with the same structure as _.env.example_.
- The you have to to fill each key with it's according value.

### Running dev server

After that, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.



## Building

You can build production files with the following command.

```bash
npm run build
# or
yarn build
# or
pnpm build
```


## Deploy

I suggest to use [Vercel](https://vercel.com) as hosting for this Next.js app.

__[Quick tutorial here](https://vercel.com/docs/concepts/get-started/deploy)__