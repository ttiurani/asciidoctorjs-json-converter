'use strict';

function JsonConverter(Asciidoctor) {
    class JsonConverter {
        constructor(_backend, _opts) {
            this.outfilesuffix = '.json';
            this.filetype = 'json';
        }

        $convert(node, _transform = null, _opts = {}) {
            if (node.getNodeName() === 'document') {
                return JSON.stringify(node.getAttributes());
            }
            return '';
        }
    }

    Asciidoctor.ConverterFactory.register(new JsonConverter('json'), ['json']);
}

module.exports = JsonConverter;
module.exports.register = function JsonConverterFactory() {
    const asciidoctor = require('@asciidoctor/core')();
    return JsonConverter(asciidoctor);
};
