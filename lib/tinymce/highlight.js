/* eslint-disable unicorn/prefer-includes */
export default function (editor, vm) {
    let getId = function () {
        let ids = [];
        editor.iframeElement.contentDocument.querySelectorAll('.highlight').forEach((el) => {
            if (ids.indexOf(el.getAttribute('data-id')) === -1) {
                ids.push(el.getAttribute('data-id'));
            }
        });
        for (let i = 1; i < 100; i++)
            if (ids.indexOf(String(i)) === -1) {
                return i;
            }
    };

    editor.ui.registry.addButton('highlight', {
        text: 'Highlight',
        icon: 'non-breaking',
        onSetup: function (api) {
            let editorEventCallback = () => api.setDisabled(editor.selection.getContent() === '');
            editor.on('NodeChange', editorEventCallback);
            /* onSetup should always return the unbind handlers */
            return function () {
                editor.off('NodeChange', editorEventCallback);
            };
        },
        onAction: () => {
            editor.execCommand('mceToggleFormat', false, 'highlight');

            let node = editor.selection.getNode();
            //select node if span created
            node.querySelectorAll('.highlight').forEach((el) => {
                if (!el.getAttribute('data-id')) node = el;
            });

            node.setAttribute('data-id', getId());
            //editor.dom.setAttrib(node, 'data-id', '1');

            editor.save();
        },
    });

    editor.ui.registry.addButton('removeHighlight', {
        text: 'Remove highlight',
        icon: 'remove',
        onSetup: function (api) {
            let editorEventCallback = () => {
                let node = editor.selection.getNode();
                api.setDisabled(!(node.getAttribute('data-id') || node.getAttribute('class') === 'highlight'));
            };
            editor.on('NodeChange', editorEventCallback);
            /* onSetup should always return the unbind handlers */
            return function () {
                editor.off('NodeChange', editorEventCallback);
            };
        },
        onAction: () => {
            vm.$swal({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.value) {
                    let node = editor.selection.getNode();

                    node.removeAttribute('class');
                    node.removeAttribute('data-id');
                    editor.formatter.remove('highlight');

                    editor.save();
                }
            });
        },
    });
    editor.on('NodeChange', function () {
        let ids = [];
        editor.iframeElement.contentDocument.querySelectorAll('.highlight').forEach((el) => {
            if (ids.indexOf(el.getAttribute('data-id')) !== -1) {
                el.removeAttribute('class');
                el.removeAttribute('data-id');
            } else {
                ids.push(el.getAttribute('data-id'));
            }
        });
    });
}
