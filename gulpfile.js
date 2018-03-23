var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open')

var app = {
  srcPath: 'src/',
  devPath: 'build/',
  prdPath: 'dist/'
}

gulp.task('html', function() { // 将src目录下的html写到 bulid和dist下
  gulp.src(app.srcPath + 'pages/*.html')
    .pipe(gulp.dest(app.devPath + 'pages'))
    .pipe(gulp.dest(app.prdPath + 'pages'))
    .pipe($.connect.reload());
})

gulp.task('less', function() { // 转换less
  gulp.src(app.srcPath + 'css/*.less')
    .pipe($.plumber()) // 这个插件可以阻止 gulp 插件发生错误导致进程退出并输出错误日志
    .pipe($.less())
    .pipe(gulp.dest(app.devPath + 'css'))
    .pipe($.cssmin()) // 压缩css
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload()); // 合并
});

gulp.task('js', function() { // js
  gulp.src(app.srcPath + 'js/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('index.js')) // 将js文件合并为一个index.js
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe($.uglify())
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

gulp.task('image', function() { // 处理图片
  gulp.src(app.srcPath + 'images/**/*')
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest(app.devPath + 'images'))
    .pipe(gulp.dest(app.prdPath + 'images'))
    .pipe($.connect.reload());
});
// 在bulid任务执行完之后再进行后续任务
gulp.task('build', ['image', 'js', 'less', 'html']);

gulp.task('clean', function() { // 删除
  gulp.src([app.devPath, app.prdPath])
    .pipe($.clean());
});

gulp.task('serve', ['build'], function() {
  $.connect.server({
    root: [app.devPath],
    livereload: true,
    port: 3000
  });

  open('http://localhost:3000');
  gulp.watch(app.srcPath + 'pages/*.html', ['html']);
  gulp.watch(app.srcPath + 'css/**/*.less', ['less']);
  gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
  gulp.watch(app.srcPath + 'images/**/*', ['image']);
});

gulp.task('default', ['serve']);
