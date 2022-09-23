# .NET 6.0 LTS and Vue.js 3.x in Dev Container

A base template for __.NET 6 WebApi__ backend __Vue.js 3__ SPA frontend.

## HTTPS
One tricky bit involved in initial setup is sharing and trusing the development TLS cert so that it is trusted on both the host machine (by the browser), and also by the underlying proxy that runs in the docker environment and integrates with the SPA frameworks (The SPAProxy will throw an `UntrustedRoot` error if the cert isn't trusted in the container).

__dotnet dev certs__ is handy for getting all this setup.

1. __Create the dev certificate.__ dotnet 6.0 SDK is required on the host machine in order to run the following command:

```
dotnet dev-certs https -ep ${HOME}/Workspace/certs/dotnetcert.pfx -p { password here }
```

> By including the password both the public and private keys will be embedded in the pfx.

__Note:__ the certificate is exported to `${HOME}/Workspace/certs/` as `dotnetcert.pfx`.  Subsequent configurations expect this location and naming, and would need to be updated accordingly if changed.

2. __Trust the certificate on the host machine__.

```
dotnet dev-certs https --trust
```

The command works it magic installing and trusting the certificate, and many sudo passwords will be entered.

3. __Export the root crt__. Openssl is required, either on the host machine or in a docker container, to extract from the `dotnetcert.pfx` the root `.crt` file, which will then be imported and trusted within the container.

```
cd ~/Workspace/certs/
openssl pkcs12 -in dotnetcert.pfx -nokeys -out dotnetcert-root.crt -nodes
```

Which should leave you with a new file called `dotnetcert-root.crt` in the same location.  

`cp dotnetcert-root.crt` to the `.devcontainer` folder of this project, along side the `Dockerfile`. The `Dockerfile` will register it during the build process.

It should now be trusted on both the host and within the container so that the .NET SPA Proxy can forward to the SPA server process using TLS.  In this case it is __Vite__ for __Vue__.

4. __Configure Vite to use the PFX for HTTPS__.  The Vite configuration is found in [vite.config.ts](ClientApp/src/vite.config.ts), and looks as follows:

```
const developmentCertificateName = "/home/vscode/.aspnet/https/dotnetcert.pfx";
const httpsSettings: ServerOptions = fs.existsSync(developmentCertificateName)
  ? {
      pfx: fs.readFileSync(developmentCertificateName),
      passphrase: "",
    }
  : {};

console.log(httpsSettings);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: httpsSettings,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

```

> There is nothing to update if the default location has not changed.  TODO: replace the hardcoded cert path with an ENV variable.cd 

> Ensure the passphrase matches the password chosen during the initial export in step 1.

5. __Open in Remote Container__. Open this project in the development container.

6. __Start Vite__. Open a seperate shell in the container terminal in VSCode after the project has opened in the container and change to the`ClientApp` directory.  Start the `Vite` server:

```
cd ClientApp
npm run dev
```

It should launch in HTTPS mode using the certificate from above.

7. __Start Kestrel__. In the other shell, launch the .NET WebApi and Proxy server:

```
dotnet run
```

If you open a browser to the proxy HTTPS address, it should load __Vite__ and __Vue__ in HTTPS also, all trusted by the host browser.  And you can verify the __WebApi__ is working by entering `/WeatherForecast`, and it should produce a `JSON` response.