OUT := build

package := ./package.json
deps := ./node_modules
deps_installed := $(deps)/installed
browserify := $(deps)/browserify/bin/cmd.js
watchify := $(deps)/watchify/bin/cmd.js
simple_server := $(deps)/simple-server/bin/simple-server.js
js_files := $(shell find lib/ -type f -name '*.js')

$(OUT):
	mkdir $(OUT)

$(deps_installed): $(package)
	npm list > /dev/null 2> /dev/null; echo $$? && rm -rf deps
	npm install --silent
	touch $@

$(OUT)/lodash.js: $(deps_installed) $(OUT)
	$(browserify) -r lodash -e $(deps)/lodash/lodash.js -o $@

$(OUT)/react.js: $(deps_installed) $(OUT)
	$(browserify) -r react -e $(deps)/react/addons.js -o $@

$(OUT)/hexdrawer.js: hexdrawer.js $(js_files) $(deps_installed) $(OUT)
	$(browserify) -r ./hexdrawer -x lodash -x react -t reactify -e hexdrawer.js -o $@

demofiles := $(wildcard demo/*)

$(OUT)/demo/demo: $(OUT)/lodash.js $(OUT)/react.js $(OUT)/hexdrawer.js $(demofiles)
	cp -r demo $(OUT)
	touch $(OUT)/demo/demo

.PHONY: demo
demo: $(OUT)/demo/demo
	cd $(OUT); ../$(simple_server) 8000

dist: $(OUT)/hexdrawer.js

.PHONY: dev
dev:
	$(watchify) -r ./hexdrawer -x lodash -x react -t reactify -e hexdrawer.js -o $(OUT)/hexdrawer.js

.PHONY: clean-npm
clean-npm:
	rm -rf $(deps)

.PHONY: clean
clean:
	rm -rf $(OUT)	

.PHONY: pages
pages: $(OUT)/demo
	cd $(OUT) && \
	git init . && \
	git add . && \
	git commit -m "Update pages"; \
	git push "git@github.com:freiksenet/hexdrawer.git" master:gh-pages --force && \
	rm -rf .git
