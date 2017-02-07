angular2 demo，with webpack2, aot, lazy load 

start this project, please open two consoles
one run :
gulp serve
the other run:
./node_modules/.bin/webpack --config webpack.config.js --watch

if you look up aot, pelase run :
./node_modules/.bin/ngc --p tsconfig.aot.json
./node_modules/.bin/webpack --config webpack.config.aot.js --watch


webpack dll is not used by default, if you want to use, pelase run:
./node_modules/.bin/webpack --config webpack.dll.config.js