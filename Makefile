OUT := build

package := ./package.json
deps := ./node_modules
browserify := $(deps)/browserify/bin/cmd.js
watchify := $(deps)/watchify/bin/cmd.js
simple_server := $(deps)/simple-server/bin/simple-server.js
js_files :=  $(shell find lib/ -type f -name '*.js')

$(OUT):
	mkdir $(OUT)

$(deps)/installed: $(package)
	npm install --silent
	touch $@

$(deps): $(deps)/installed

$(OUT)/lodash.js: $(deps)/lodash $(deps) $(OUT)
	$(browserify) -r lodash -e $(deps)/lodash/lodash.js -o $@

$(OUT)/react.js: $(deps)/react $(deps) $(OUT)
	$(browserify) -r react -e $(deps)/react/addons.js -o $@

$(OUT)/hexdrawer.js: hexdrawer.js $(js_files) $(deps) $(OUT)
	$(browserify) -r ./hexdrawer -x lodash -x react -t reactify -e hexdrawer.js -o $@

$(OUT)/demo: $(OUT)/lodash.js $(OUT)/react.js $(OUT)/hexdrawer.js
	cp -r demo $(OUT)

.PHONY: demo
demo: $(OUT)/demo
	cd $(OUT); ../$(simple_server) 8000

dist: $(OUT)/hexdrawer.js

.PHONY: dev
dev:
	$(watchify) -r hexdrawer -x lodash -x react -t reactify -e lib/hexdrawer.js -o $@

.PHONY: clean-npm
clean-npm:
	rm -rf $(deps)

.PHONY: clean
clean:
	rm -rf $(OUT)	
