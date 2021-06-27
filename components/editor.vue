<template>
    <div>
        <tinymce
            ref="editor"
            v-model="data"
            apiKey="e9g3v7qryytmm5drywldc51y487kxtsnp9h6b6ektj1sjjkz"
            initialValue=""
            :init="initParams"
        ></tinymce>
    </div>
</template>
<script>
/* eslint-disable vue/prop-name-casing */

/**
 * https://www.tiny.cloud/docs/integrations/vue/#configuringtheeditor
 */

import highlight from '../lib/tinymce/highlight.js';

export default {
    props: {
        value: {
            default: '',
        },
        plugins: {
            default: () => [
                'advlist autolink lists link image charmap',
                'searchreplace visualblocks code fullscreen',
                'print preview anchor insertdatetime media',
                'paste code help wordcount table',
                'autoresize',
            ],
        },
        toolbar: {
            default: () => [
                [
                    'undo redo |',
                    'formatselect fontsizeselect |',
                    'bold italic underline strikethrough |',
                    'alignleft aligncenter alignright |',
                    'bullist numlist outdent indent |',
                    'help | highlight removeHighlight',
                ].join(' '),
            ],
        },
        /*menu: {
			default: () => ({
				file: { title: 'File', items: 'newdocument restoredraft | preview | print ' },
				edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
				view: {
					title: 'View',
					items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
				},
				insert: {
					title: 'Insert',
					items:
						'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
				},
				format: {
					title: 'Format',
					items:
						'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat',
				},
				tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
				table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
				help: { title: 'Help', items: 'help' },
			}),
		},*/
        style_formats: {
            default: () => [
                {
                    title: 'Headings',
                    items: [
                        { title: 'Heading 1', format: 'h1' },
                        { title: 'Heading 2', format: 'h2' },
                        { title: 'Heading 3', format: 'h3' },
                        //{ title: 'Heading 4', format: 'h4' },
                        //{ title: 'Heading 5', format: 'h5' },
                        //{ title: 'Heading 6', format: 'h6' },
                    ],
                },
                {
                    title: 'Inline',
                    items: [
                        { title: 'Bold', format: 'bold' },
                        { title: 'Italic', format: 'italic' },
                        { title: 'Underline', format: 'underline' },
                        { title: 'Strikethrough', format: 'strikethrough' },
                        //{ title: 'Superscript', format: 'superscript' },
                        //{ title: 'Subscript', format: 'subscript' },
                        //{ title: 'Code', format: 'code' },
                    ],
                },
                {
                    title: 'Blocks',
                    items: [
                        { title: 'Paragraph', format: 'p' },
                        { title: 'Lead', selector: 'p', classes: 'lead' },
                        { title: 'Blockquote', format: 'blockquote' },
                        { title: 'Div', format: 'div' },
                        { title: 'Pre', format: 'pre' },
                    ],
                },
                {
                    title: 'Align',
                    items: [
                        { title: 'Left', format: 'alignleft' },
                        { title: 'Center', format: 'aligncenter' },
                        { title: 'Right', format: 'alignright' },
                        { title: 'Justify', format: 'alignjustify' },
                    ],
                },
            ],
        },
    },
    computed: {
        initParams() {
            // https://www.tiny.cloud/docs/configure/editor-appearance/
            return {
                height: 500,
                plugins: this.plugins,
                toolbar: this.toolbar,
                menubar: 'file edit insert view format table tools help',
                //menu: this.menu,
                //menubar: true,
                style_formats: this.style_formats,
                fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
                //skin: 'oxide-dark',
                skin_url: '/admin/tinymce',
                resize: 'horizontal',
                formats: {
                    highlight: {
                        selector: 'span,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,tr,td,img',
                        inline: 'span',
                        classes: 'highlight',
                        attributes: { 'data-id': '' },
                    },
                },
                //content_css: 'dark',
                setup: (editor) => {
                    highlight(editor, this);
                },
            };
        },
        data: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
};
</script>
<style>
.tox-statusbar__branding {
    display: none !important;
}
</style>
