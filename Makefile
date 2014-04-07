all: build

build:
	@component build --no-require -s JSONfn --out . --name jsonfn

clean:
	rm -rf build jsonfn.js

.PHONY: all clean