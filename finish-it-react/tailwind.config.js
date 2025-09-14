export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,css}',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#070a14',
                ink: '#E9F1FF',
                muted: '#A6B5D4',
                accent: '#7FD1FF',
                accent2: '#55C1F9',
                good: '#7CFFA3',
                bad: '#FF7878',
            },
            boxShadow: {
                glass: '0 12px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)',
            },
            borderRadius: {
                xl2: '22px',
            }
        },
    },
    plugins: [],
}
