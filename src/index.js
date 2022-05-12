'use strict';

function JsonConverter(Asciidoctor) {
    class JsonConverter {
        constructor(_backend, _opts) {
            this.outfilesuffix = '.json';
            this.filetype = 'json';
        }

        $convert(node, _transform = null, _opts = {}) {
            if (node.getNodeName() === 'document') {
                node.setAttribute('images', []);
                node.getContent();
                return JSON.stringify(node.getAttributes());
            } else if (node.getNodeName() === 'section') {
                node.getContent();
            } else if (node.getNodeName() === 'image') {
                const title = node.getTitle();
                const alt = node.getAttributes()['alt'];
                const target = node.getAttributes()['target'];
                node.getDocument().getAttributes()['images'].push({title, alt, target});
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
