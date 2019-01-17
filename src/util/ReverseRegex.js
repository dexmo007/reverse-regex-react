import {unescape} from "./RegexUtils";

export default class ReverseRegex {

    constructor(regex) {
        if (regex instanceof RegExp) {
            this.regex = regex;
            regex = regex.source;
        } else if (typeof regex === 'string') {
            this.regex = new RegExp(regex);
        } else {
            throw new Error('Argument must be RegExp or a string representing a regex');
        }
        regex = regex.replace(/^\^/, '')
            .replace(/\$$/, '');
        this.source = regex;
        this.parts = [];
        this.captureGroupsAt = [];
        let last = 0;
        for (let i = 0; i < regex.length; i++) {
            const char = regex[i];
            if (char === '\\') {
                i++;
                continue;
            }
            if (char === '(') {
                if (i !== last) {
                    this.parts.push(unescape(regex.substring(last, i)));
                }
                let j = i + 1;
                while (j < regex.length && (regex[j] !== ')' || regex[j - 1] === '\\')) {
                    if (regex[j] === '(' && regex[j - 1] !== '\\') {
                        throw new Error('Nested capture groups are not supported');
                    }
                    j++;
                }
                if (j >= regex.length) {
                    throw new Error('Unclosed parenthesis');
                }
                this.parts.push(regex.substring(i, j + 1));
                this.captureGroupsAt.push(this.parts.length - 1);
                i = j;
                last = i + 1;
            }
        }
        if (last < regex.length) {
            this.parts.push(unescape(regex.substring(last)));
        }
    }

    reinsert(args) {
        if (args.length !== this.captureGroupsAt.length) {
            throw new Error('Insert count does not match capture group count');
        }
        const parts = this.parts.slice(0);
        for (let i = 0; i < args.length; i++) {
            parts[this.captureGroupsAt[i]] = args[i];
        }
        return parts.join('');
    }

    exec(s) {
        return this.regex.exec(s);
    }

};
