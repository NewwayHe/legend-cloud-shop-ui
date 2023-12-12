export default {
    props: {
        node: {
            type: Object,
            required: true
        },
        data: {
            required: true
        },
        hide: {
            type: Boolean,
            default: false
        }
    },
    render(h) {
        return h(
            'td',
            {
                attrs: {
                    rowspan: 1,
                    colspan: 1
                },
                style: {
                    opacity: this.hide === true ? 0 : 1
                }
            },
            this.node.children && this.node.children.length ? this.node.children : this.data[this.node.propsData.prop]
        )
    }
}
