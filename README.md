# NOTICE
~~I'm moving all of my extensions and porting some other famous ones over to my fork of spicetify-cli available at https://github.com/Delusoire/bespoke. As such, this repo is in maintenance mode, no new extenions/features will be added to this repo and the support will be very limited.~~

This repository is now outdated as spicetify-v3 (codenamed bespoke) is in beta stage. These extensions [have been updated here](https://github.com/Delusoire/bespoke-modules) to work for the newer spicetify release where they'll still be getting new features and bug fixes. However, this repo will be archived.
#

### Practical Spicetify Extensions

Install using [marketplace](https://github.com/spicetify/spicetify-marketplace) OR by downloading either:
 - dist/extension-name/prism.js (online only) 
 - dist/extension-name/app.js (no auto-updates, offline)

and putting them in your Spicetify extensions folder.

## Project Structure
`extensions/` contains the code for each extension, you can find each extension's README under `extension/<name>/assets/`

`snippets/` contains stylesheets for snippets, these are written in scss, if you want to use them then you have to grab the transpiled files from `dist/snippets/`

`dist/` contains all the ready to use bundles for extensions & snippets

## Building
it is as simple as installing the latest [deno](https://github.com/denoland/deno_install) and running `deno task bundle`
the manifest for [marketplace](https://github.com/spicetify/spicetify-marketplace) is automatically generated as part of the build step

## Notes
Most of these extensions are functionally similar to older work from:
 - https://github.com/Tetrax-10/Spicetify-Extensions
 - https://github.com/duffey/spicetify-star-ratings
