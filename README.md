# Deployment Workshop

## Prerequities

You should have a basic understanding of

- PowerShell terminal
- Express or ASP.NET and React
- container (e.g Docker) images and containers, published ports, volumes
- environment variables

## Database

Each backend samples uses a database (e.g. PostgreSQL).
Backends expect data as seen in [`init.sql`](init.sql).

Use the [official `postgres` Docker image](https://hub.docker.com/_/postgres) to start a database instance on your development machine's terminal based on the following examples. **Make sure to execute `docker run` in the project's root directory where the `init.sql` file is.**

Notes on the below command and the flags used:

- `--network workshop` needed in order for other containers to connect to the database instance running in the container (**the network needs to be created before using**, you can delete it later if you don't use it)
- `--publish 5432:5432` needed to access the database on your development machine, otherwise it's not required, **but if you a database already running locally on port 5432 you should stop it**
- `--volume ...` is used to mount the current working directory (where you run `docker run` at) _into_ the container at path `/docker-entrypoint-initdb.d`, if the working directory contains an `*.sql` file it'll executed upon database startup (search for _Initialization scripts_ [here](https://hub.docker.com/_/postgres))

```pwsh
docker network create workshop
```

```pwsh
docker run `
    --name postgres `
    --network workshop `
    --publish 5432:5432 `
    --volume ${PWD}:/docker-entrypoint-initdb.d `
    --env POSTGRES_USER=app `
    --env POSTGRES_DB=workshop `
    --env POSTGRES_PASSWORD=secret `
    postgres
```

## Backend

There are two backend samples one for ASP.NET and one for Express.
They provide the same `/api/cars` endpoint which in turn queries the aforementioned database.

### ASP

#### Rider

During local development you most probably will run the backend in your IDE, or maybe in the terminal with `dotnet run`.

1. Load up the project in your IDE and simply start the `http` run configuration
2. See [`launchSettings.json`](backend/asp/Properties/launchSettings.json) and [`appsettings.Development.json`](backend/asp/appsettings.Development.json)
3. Notice that the `CONNECTIONSTRINGS_DEPLOYMENTWORKSHOP` connection string is already configured to be able to connect to the PostgreSQL database service running inside the container started earlier
    3.1 **Note that values set in `appsettings.json` and similar config files can be overriden by environment variables when they're named like that in ASP.NET**
4. In you browser http://localhost:5165/api/cars open up automatically, if not simply visit it
5. You should see a JSON array with same car related data in it

Note: **to overwrite the default development connection string in use `dotnet user-secret` and set the same key to a different value.**

#### Docker

1. Build the image (**make sure to change your current directory to `backend/asp` before running the command**)

    ```pwsh
    docker build -t deployment-workshop-backend:asp .
    ```

2. Run a new container based on the image

    ```pwsh
    docker run `
        --name deployment-workshop-backend-asp `
        --network workshop `
        --publish 8080:8080 `
        --env CONNECTIONSTRINGS__DEPLOYMENTWORKSHOP="Server=postgres;Port=5432;Database=workshop;User Id=app;Password=secret;" `
        deployment-workshop-backend:asp
    ```

    Note: the server's address is `postgres` not `localhost` (since compared to when running in Rider the connection to the database is made from a different place, a container).

3. Visit http://localhost:8080/api/cars in your browser, you should see the previously seen JSON with car data

### Express

#### Terminal

During local development you start the backend in your terminal your IDE.

1. Run 'npm install` in `backend/express`
2. Then simply run `node index.js`

Note: **to overwrite the default `PG_URL` used by the app create an `.env.local` configuration file and override the same key with a different value.**

#### Docker

1. Build the image (**make sure to change your current directory to `backend/express` before running the command**)

    ```pwsh
    docker build -t deployment-workshop-backend:express .
    ```

    Note: the _tag_ changed to `express` at the end of the tag name.

2. Run a new container based on the image

    ```pwsh
    docker run `
        --name deployment-workshop-backend-express `
        --network workshop `
        --publish 3456:3456 `
        --env NODE_ENV=production `
        --env PORT=3456 `
        --env PG_URL="postgres://app:secret@postgres:5432/workshop" `
        --init `
        --interactive `
        --tty `
        deployment-workshop-backend:express
    ```

    Note: again, note that the hostname is `postgres` not `localhost`. Also `--init`, `--interactive` and `--tty` is used because [it's a best practice with `node` based Docker images](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals) to correctly handle <kbd>Ctrl</kbd>+<kbd>C</kbd>. You might also see `--init -it` being used, `-it` being a shorthand for `--interactive` and `--tty`.

3. Visit http://localhost:3456/api/cars in your browser, you should see the previously seen JSON with car data

## Frontend

### Terminal

1. Configure the proxy's hostname and port in `vite.config.js`
2. Then run `npm run dev`
3. Visit http://localhost:5173, you should see the car related data on the website
4. Open your browser's developemt tools and go to the _Network_ tab then refresh the page, **notice that there's a request sent to http://localhost:5173/api/cars which is important (the hostname and port is the same)**

Note: **to override the app's default name set in `.env` create a new  `.env.local` file and set the same key to a different value.**

### Docker

1. Build the image (**make sure to change your current directory to `frontend/react` before running the command**)

    ```pwsh
    docker build -t deployment-workshop-frontend:react .
    ```

2. Run a new container based on the image

    ```pwsh
    docker run `
        --name deployment-workshop-frontend-react `
        --network workshop `
        --publish 4173:4173 `
        --env NODE_ENV=production `
        --env VITE_APP_TITLE="Deployment Workshop (docker)" `
        --env VITE_APP_PROXY="http://deployment-workshop-backend-asp:8080" `
        deployment-workshop-frontend:react
    ```

3. Visit http://localhost:4173, you should see the car related data displayed on the webpage


Note: **`VITE_APP_PROXY` is set to use `deployment-workshop-backend-asp:8080`, but it could have been the `express` version with a different port if that service is running.**