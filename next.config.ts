import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_HASH_KEY:"0803e682d450a4f41f2aaad84fd854ac68ba95e59e96460e1d44532d3e2dc899d453780afc7d72b4b7df10f7f935b53acc6db2f78c70e38cbac938ed4b494305",
    },

};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);