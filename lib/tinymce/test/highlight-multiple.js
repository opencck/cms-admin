export default function (editor) {
    let items = [
        {
            type: 'togglemenuitem',
            text: 'Highlight 2',
            onAction: function () {
                editor.insertContent('test2');
            },
        },
    ];

    editor.ui.registry.addMenuButton('highlight', {
        text: 'Highlight',
        icon: 'non-breaking',
        fetch: (callback) => {
            callback([
                {
                    text: 'Add highlight',
                    type: 'menuitem',
                    icon: 'plus',
                    onSetup: function (/*api*/) {
                        //editor.formatter.formatChanged('strikethrough', (state) => api.setActive(state));
                        editor.formatter.formatChanged('highlight', () => {});
                        //api.setActive(true);
                    },
                    onAction: (/*value*/) => {
                        editor.execCommand('mceToggleFormat', false, 'highlight');
                        items.push({
                            type: 'togglemenuitem',
                            text: 'Highlight 3',
                            onAction: function () {
                                editor.insertContent('test2');
                            },
                        });
                    },
                },
                {
                    text: 'Highlights',
                    type: 'nestedmenuitem',
                    icon: 'non-breaking',
                    getSubmenuItems: function () {
                        return [
                            {
                                type: 'togglemenuitem',
                                text: 'Highlight 1',
                                id: 1,
                                onAction: function () {
                                    let node = editor.selection.getNode();
                                    //node.setAttribute('data-id', 1);
                                    editor.execCommand('mceToggleFormat', false, 'highlight');
                                    editor.dom.setAttrib(node, 'data-id', '1');
                                    //editor.execCommand('mceCleanup');
                                    editor.save();
                                },
                                onSetup(api) {
                                    //api.setDisabled(true);
                                    console.log('ttt', api, this);
                                },
                            },
                        ].concat(items);
                    },
                },
            ]);
        },
    });
}
