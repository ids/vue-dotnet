# .NET Core Angular w/Dev Container

Taking advantage of the remote container development environment integration for VSCode, this is a quick template for a starting point.

> Theoretically, all this needs is to be copied/forked, renamed, re-opened in a VSCode container (generated from the .Dockerfile in the .devcontainer folder largely), and will immediately function as a .NET Core 6.0 LTS WebApi and Angular development environment.  None of the related SDK artifacts need be installed on the development machine, yet they will all be there in development through the integrated terminal session into the running development container.  Nifty.

> Well, some of them do have to be installed on the host machine if you want to use HTTPS the easy way.

## HTTPS

To support HTTPS with the dotnet self signed... unfortunately this has to be done on the host machine, which means installing dotnet and then entering your sudo password a lot on macOS - the cert can then be used in the container services, and will be trusted by your host machine browser.

```
dotnet dev-certs https -ep ${HOME}/Workspace/certs/dotnetcert.pfx -p { password here }
dotnet dev-certs https --trust
```

> Make sure the settings in devcontainer.json align with the mount and location of your cert.
