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
        let cur = node;
        for (let index = 0; index < _prefix.length; index++) {
            const l = _prefix[index];
            if (!cur[l]) return null;
            cur = cur[l]
        }
        return cur;
    }
    findDouble(_name, _pairs, isOneNation=false, node = this.root) {
        if (!_name) return node.pl ? [...node.pl] : null
        const pairs = _pairs || this.doubles;
        const name = normName(_name);

        let result = [];
        const nameLength = name.length;
        const slicedName = name.slice(1);
        const doublesDepth = nameLength > 2 ? 3 : nameLength; // 
        for (let d = 1; d <= doublesDepth; d++) {
            const checkSubString = name.slice(0, d);
            const _subpairs = pairs[checkSubString]
            if (!_subpairs) continue;
            for (let pairedSymbols = 0; pairedSymbols < _subpairs.length; pairedSymbols++) {
                const pairedSymbol = _subpairs[pairedSymbols];
                const alternativeBranch = this.searchNode(pairedSymbol, node);
                if (alternativeBranch) {
                    const doubleOfSubstring = this.findDouble(name.slice(d), pairs,isOneNation, alternativeBranch);
                    doubleOfSubstring ? result = [...result, ...doubleOfSubstring] : undefined
                }
            }
        }
        const mainBranch = node[name[0]] ? this.findDouble(slicedName, pairs, isOneNation ,node[name[0]]) : null;
        result = mainBranch ? [...result, ...mainBranch] : result;

        return result.length > 0 ? result : null
    }

    searchOne(name) {
        const word = [...normName(name)].reverse();
        const resp = [];
        const pl = this.search(this.root, word);
        if (pl) resp.push(pl);

        return resp[0] ? resp : null;
    }
}

module.exports = Bor;
