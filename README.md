# doggos-static

## Purpose
Hosts all the compressed and resized images for the [doggos website](https://doggos.derzan.dev/).

Also has a script that will compress, resize, and automatically rename image names. It will also change all file types to [webp](https://developers.google.com/speed/webp).

## Script Usage

step #1: Dump all images into folders, file names can be whatever but they **CANNOT OVERLAP**. It can also be any img type. (I think?)
step #2: cd into UTILITY and run `npm install`
step #3: open script.js and add any new folder paths if there are new dogs
step #3: run `node script.js` to compress, resize, and rename the images. It will also compile data and write to the /UTILITY/compiledData folder to be used in [doggos](https://github.com/MiTo0o/doggos) website code.

## Original images

original uncompressed images are in [doggos-raw-files-dump](https://github.com/MiTo0o/doggos-raw-files-dump) (private repo). They are way toooooo big for a website.
