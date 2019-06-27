@echo off

rem -mtriple=wasm32-unknown-win32-wasm -link-internally -L-allow-undefined

set DOPTS=-O3 -release -mtriple=wasm32-unknown-unknown-wasm -betterC -nogc -boundscheck=off
set LINKOPTS=-L-allow-undefined -L-zstack-size=131072

ldc2 %DOPTS% %LINKOPTS% -I src -of=test.wasm src/test.d

set FILES=src/app.d src/sudoku.d src/cell.d src/board.d src/wasm_util.d src/wasm_mem.d src/wasm_json.d

ldc2 %DOPTS% %LINKOPTS% -I src -of=sudoku.wasm %FILES%

del *.o
