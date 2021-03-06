export default function (editor) {
	let onAction = function (e) {
		console.log(e, editor.ui.registry);
	};
	// Register the blockquote context toolbar
	editor.ui.registry.addContextToolbar('highlight', {
		predicate: function (node) {
			return node.nodeName.toLowerCase() === 'p';
		},
		items: 'bold',
		position: 'node',
		scope: 'node',
	});
	// Add a button that opens a window
	editor.ui.registry.addSplitButton('highlight', {
		text: 'Highlight',
		icon: 'non-breaking',
		onSetup: function (api) {
			//editor.formatter.formatChanged('strikethrough', (state) => api.setActive(state));
			api.setActive(true);
		},
		onAction: function () {
			editor.execCommand('mceToggleFormat', false, 'strikethrough');
		},
		// eslint-disable-next-line no-unused-vars
		onItemAction: function (api, value) {
			let node = editor.selection.getNode();
			//node.setAttribute('data-id', 1);
			editor.dom.setAttrib(node, 'data-id', '1');
			//editor.execCommand('mceCleanup');
			editor.save();
		},
		fetch: function (callback) {
			callback([
				{
					type: 'choiceitem',
					text: 'Menu item 1',
					value: '&nbsp;<em>You clicked menu item 1!</em>',
					icon: 'non-breaking',
				},
				{
					type: 'choiceitem',
					text: 'Menu item 2',
					value: '&nbsp;<em>You clicked menu item 2!</em>',
				},
			]);
		},
	});

	// Adds a menu item, which can then be included in any menu via the menu/menubar configuration
	editor.ui.registry.addMenuItem('highlight', {
		text: 'Example plugin',
		onAction,
	});

	// return {
	// 	getMetadata: function () {
	// 		return {
	// 			name: 'Example plugin',
	// 			url: 'http://exampleplugindocsurl.com',
	// 		};
	// 	},
	// };
}
