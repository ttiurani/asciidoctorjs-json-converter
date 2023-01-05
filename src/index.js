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
                const extractId = node.getDocument().getAttributes()['extract-id'];
                if (extractId) {
                    node.setAttribute(extractId, []);
                }
                node.getContent();
                let attributes = node.getAttributes();
                const titleSeparator = (attributes['title-separator'] || ':') + ' ';
                const doctitle = attributes['doctitle'];
                const subtitleIndex = doctitle.lastIndexOf(titleSeparator);
                if (subtitleIndex > 0) {
                    attributes['doctitle'] = doctitle.substring(0, subtitleIndex);
                    attributes['docsubtitle'] = doctitle.substring(subtitleIndex + titleSeparator.length);
                }
                return JSON.stringify(attributes);
            } else if (node.getNodeName() === 'section') {
                node.getContent();
            } else if (node.getNodeName() === 'preamble') {
                node.getContent();
            } else if (node.getNodeName() === 'image') {
                const title = node.getTitle();
                const alt = node.getAttributes()['alt'];
                const target = node.getAttributes()['target'];
                node.getDocument().getAttributes()['images'].push({title, alt, target});
            } else if (node.getNodeName() === 'paragraph') {
                node.getContent();
            } else if (node.getNodeName() === 'inline_quoted') {
                const extractId = node.getDocument().getAttributes()['extract-id'];
                if (extractId) {
                    const id = node.getId();
                    if (id && id.toString && id.toString() === extractId) {
                        node.getDocument().getAttributes()[extractId].push(node.getText());
                    }
                }
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
