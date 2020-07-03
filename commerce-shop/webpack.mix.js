// eslint-disable-next-line @typescript-eslint/no-var-requires
const mix = require('laravel-mix');

mix
    .js('./frontend/js/main.js', './public/js')
    .react('./frontend/js/checkout.js', './public/js')
    .sass('./frontend/scss/main.scss', './public/css')
    .options({
        processCssUrls: false,
    })
    .copy('./frontend/img', './public/img');


if (mix.inProduction()) {
    mix.version();
} else {
    mix.sourceMaps();
}
