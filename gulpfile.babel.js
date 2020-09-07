import gulp from "gulp";
import gPug from "gulp-pug";
import del from "del";
import gImg from "gulp-image";
import gulpSass from "gulp-sass";
import bro from "gulp-bro";
import babelify from "babelify";
import csso from "gulp-csso";
import ws from "gulp-webserver";
import ghPages from "gulp-gh-pages";
gulpSass.compiler = require("node-sass");

const route = {
  pug: {
    src: "src/index.pug",
    dest: "build/",
    watch: "src/**/*.pug",
    del: "build/index.pug",
  },
  scss: {
    src: "src/scss/style.scss",
    dest: "build/css",
    watch: "src/scss/**/*.scss",
    del: "build/css/style.css",
  },
  image: {
    src: "src/img/**/*",
    dest: "build/img",
  },
  js: {
    src: "src/js/**/*.js",
    dest: "build/js",
    wacth: "src/js/**/*.js",
    del: "build/js",
  },
};

const pug = () =>
  gulp.src(route.pug.src).pipe(gPug()).pipe(gulp.dest(route.pug.dest));

const scss = () =>
  gulp
    .src(route.scss.src)
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(csso())
    .pipe(gulp.dest(route.scss.dest));

const image = () =>
  gulp.src(route.image.src).pipe(gImg()).pipe(gulp.dest(route.image.dest));

const js = () =>
  gulp
    .src(route.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(route.js.dest));

const gulpServer = () =>
  gulp.src("build").pipe(
    ws({
      livereload: true,
      open: true,
    })
  );

const clean = () => del("build");

const watch = () => {
  gulp.watch(route.pug.watch, pug);
  gulp.watch(route.scss.watch, { ignored: "_reset.scss" }, scss);
  gulp.watch(route.js.wacth, js);
  gulp.watch(route.image.src, image);
};

const upload = () => gulp.src("build/**/*").pipe(ghPages());

export const setup = gulp.series([clean, pug, scss, js, image]);

export const dev = gulp.series([watch, gulpServer]);

//export const deploy = gulp.series([setup, upload]);
