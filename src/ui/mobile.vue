<script>
    import Text from 'ui/text.vue';
    import extend from 'lib/extend.js';
    
    export default extend(true, Text, {
        props: {
            placeholder: {
                default: '请输入手机号码'
            },
            maxlength: {
                default: '11'
            },
            validPattern: {
                default: '^1\\d{10}$'
            },
            pattern: {
                default: '^1\\d{0,10}$'
            }
        }
    });
</script>