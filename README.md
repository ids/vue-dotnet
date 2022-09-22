# .NET Core Vue3 w/Dev Container

## HTTPS
To support HTTPS with the dotnet self signed... unfortunately this has to be done on the host machine, which means installing dotnet and then entering your sudo password a lot on macOS - the cert can then be used in the container services, and will be trusted by your host machine browser.

```
dotnet dev-certs https -ep ${HOME}/Workspace/certs/dotnetcert.pfx -p { password here }
dotnet dev-certs https --trust
```

> Make sure the settings in devcontainer.json align with the mount and location of your cert.
