const normName = require('./normalize-name');

class Bor {
    constructor(newBor, doubles) {
        this.root = newBor || {}
        this.doubles = doubles || { "о": ["у", "а"], "у": ["о"] }
    }
    getRoot() {
        return this.root;
    }
    addNode(record) {
        // record = {word, data}
        const _name = [...record.word]
        _name[_name.length - 1] = { letter: _name[_name.length - 1], last: true }
        let node = this.root;
        _name.forEach(l => {
            const currentLetter = l.last ? l.letter : l;
            if (!node[currentLetter]) { node[currentLetter] = {} };
            node = node[currentLetter];
            if (l.last) {
                if (node.pl) {
                    node.pl.push(record.data)
                } else {
                    node.pl = [record.data]
                }
            }
            ;
        })
    }
    search(node, wordArr) {
        if (!wordArr.length) return null; //empty
        const letter = wordArr.pop();
        if (wordArr.length == 0) {// have been empty now
            return node[letter].pl ? node[letter].pl : null
        }
        if (node[letter]) return this.search(node[letter], wordArr)
    }
    searchNode(_prefix, node = this.root) {
        // const _prefix= normName(prefix)
        let cur = node;
        for (let index = 0; index < _prefix.length; index++) {
            const l = _prefix[index];
            if (!cur[l]) return null;
            cur = cur[l]
        }
        return cur;
    }
    findDouble(name, pairs, node = this.root) {
        // if(!this.searchOne(name)) return null;
        if (!name) return node.pl ? [...node.pl] : null

        let result = [];
        const nameLength = name.length;
        const slicedName = name.slice(1);
        const doublesDepth = nameLength > 2 ? 3 : nameLength; // 
        // console.log(" ### find double ", name, nameLength, slicedName, doublesDepth);
        // console.log(" ### find double pairs ", pairs);
        for (let d = 1; d <= doublesDepth; d++) {
            const checkSubString = name.slice(0, d);
            const _subpairs = pairs[checkSubString]
            // console.log("checkSubString  - ", checkSubString, " d = ", d, _subpairs);

            if (!_subpairs) continue;
            for (let pairedSymbols = 0; pairedSymbols < _subpairs.length; pairedSymbols++) {
                const pairedSymbol = _subpairs[pairedSymbols];
                const alternativeBranch = this.searchNode(pairedSymbol, node);
                if (alternativeBranch) {

                    const doubleOfSubstring = this.findDouble(name.slice(d), pairs, alternativeBranch);
                    doubleOfSubstring ? result = [...result, ...doubleOfSubstring] : undefined
                }
            }
        }
        const mainBranch = node[name[0]] ? this.findDouble(slicedName, pairs, node[name[0]]) : null;
        result = mainBranch ? [...result, ...mainBranch] : result;

        return result.length > 0 ? result : null
    }

    searchOne(name) {
        const word = [...normName(name)].reverse();
        // console.log(" searchOne   - ", name, "    ", word);
        const resp = [];
        const pl = this.search(this.root, word);
        if (pl) resp.push(pl);

        return resp[0] ? resp : null;
    }
}


// const tree = new Bor;
// // tree.addNode({ word: "Крис Ри", data:[1, 2, "dfd", 146]});
// // tree.addNode({ word: "Крис Риан", data:[1, 2, "dfd", 146]});
// tree.addNode({ word: "Брауни", data: [1, 4, "dfd і", 14] });
// tree.addNode({ word: "Бруну", data: [33, 34, "dfd і", 88] });
// tree.addNode({ word: "Бруно", data: [45, 45, "dfd і", 17] });
// tree.addNode({ word: "Бруно", data: [11, 14, "rdfafefqefі", 205] });
// tree.addNode({ word: "Браунс Дж", data: [45, 45, "dfd і", 17] });

// console.log(tree.getRoot());
// require('fs').writeFile("./bor.json", JSON.stringify(tree.getRoot()), { encoding: "utf-8" }, err => { if (err) console.error });


// console.log("Olololo", { "к": 111, "Т": "dgadg" });

module.exports = Bor;
