<script>
    import Text from 'ui/text.vue';
    import extend from 'lib/extend.js';
    
    export default extend(true, Text, {
        props: {
            placeholder: {
                default: '请输入身份证号码'
            },
            maxlength: {
                default: '18'
            },
            validPattern: {
                default: '^(\\d{15}|\\d{17}(\\d|[xX]))$'
            },
            pattern: {
                default: '^(\\d{1,18}|\\d{17}[xX])$'
            }
        }
    });
</script>