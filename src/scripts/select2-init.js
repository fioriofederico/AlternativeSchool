import store from '@/store'
export default class Select2Init {
    constructor(module) {
        this.module = module
    }

    ajaxSet(options) {
        const that = this;

        return {
            multiple: options?.multiple ? true : false,
            allowClear: options?.allowClear ? true : false,
            ajax: {
                url: function(){
                    return options?.urlSet
                        ? options.urlSet
                        : process.env.VUE_APP_API_GLOBAL_URL + '/' + that.module;
                },
                headers: {
                    "Authorization": `Bearer ${store.state.auth.accessToken}`
                },
                dataType: 'json',
                data: function (params) {
                    const query = {};
                    const termKey = options?.termKey ? options?.termKey : 'name:like';
                    query[termKey] = params.term;
                    return query;
                },
                processResults: function(data)  {
                    let res = options?.customRendering
                        ? options.customRendering(data)
                        : data.rows.map(({ id, name: text }) => ({ id, text }));

                    return {results: res}
                }
            }
        }
    }
}