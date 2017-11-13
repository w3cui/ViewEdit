var pkg = require('./package.json');
// var config = require('./config.json');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var gulpOpen = require('gulp-open');
var os = require('os');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
    default: {
      ver: 'all'
    }
  })
  // host配置
  ,
  host = {
    path: '',
    port: 3000,
    html: 'index.html'
  }
  // 配置open
  ,
  browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
      os.platform() === 'win32' ? 'chrome' : 'firefox'))

//注释
, note = [
  '/**\n* <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License By \n* github: <%= pkg.homepage %>\n**/\n<%= js %>', {
    pkg: pkg,
    // js: "var modsConfig = " + JSON.stringify(config) + ";"
    js: ""
  }
]

//模块
// , mods = config.moduleType

//任务
, task = {

  //压缩js模块
  minjs: (ver) => {
    ver = ver === 'open';
    //可指定模块压缩，eg：gulp minjs --mod 
    var mod = argv.mod ? function() {
        return '(' + argv.mod.replace(/,/g, '|') + ')';
      }() : '',
      src =[    
        './node_modules/jquery/dist/jquery.js',
        './node_modules/html2canvas/dist/html2canvas.js',
        './node_modules/webuploader/dist/webuploader.html5only.js',
        './src/**/viewEdit.js',
        './src/**/mobile/*.js'
      ],
      dir = ver ? 'dist' : 'build';
    
    gulp.src(src)
      //合并输出为app.js
      .pipe(concat('ViewEdit.js', {
        newLine: ''
      }))      
      .pipe(uglify())
      .pipe(header.apply(null, note))
      .pipe(gulp.dest('./' + dir));

  }

  //打包PC合并版JS，即包含lwj.js和所有模块的合并
  ,
  alljs: function(ver) {
    ver = ver === 'open';
    var src = [    
        './node_modules/jquery/dist/jquery.js',
        './node_modules/html2canvas/dist/html2canvas.js',        
        './node_modules/webuploader/dist/webuploader.html5only.js',
        './src/**/viewEdit.js',
        './src/**/mobile/*.js'
      ],
      dir = ver ? 'dist' : 'build';

    return gulp.src(src)
      //合并输出为app.js
      .pipe(concat('ViewEdit.js', {
        newLine: ''
      }))
      .pipe(header.apply(null, note))
      .pipe(gulp.dest('./' + dir + ''));
  }

  //压缩css文件
  ,
  mincss: function(ver) {
    ver = ver === 'open';

    var src = ['./src/**/*.css'],
      dir = ver ? 'dist/style' : 'build/style',

      noteNew = JSON.parse(JSON.stringify(note));
    noteNew[1].js = '';
    return gulp.src(src)
    .pipe(concat('ViewEdit.css', {
        newLine: ''
      }))
    .pipe(minify({
        compatibility: 'ie7'
      })).pipe(header.apply(null, noteNew))
      .pipe(gulp.dest('./' + dir + '/'));
  }

  //复制iconfont文件
  ,
  font: function(ver) {
    ver = ver === 'open';

    var dir = ver ? 'dist' : 'build';

    return gulp.src('./src/font/*')
      .pipe(rename({}))
      .pipe(gulp.dest('./' + dir + '/font'));
  }

  //复制组件可能所需的非css和js资源
  ,
  mv: function(ver) {
    ver = ver === 'open';

    var src = ['./src/**/*.{png,jpg,gif,html,mp3,json,svg}'],
      dir = ver ? 'dist' : 'build';

    gulp.src(src).pipe(rename({}))
      .pipe(gulp.dest('./' + dir));
  }

  // 监听变化
  ,
  watch: function(ver) {
    return gulp.watch(['./src/**/*.{js,css}'], function() {
      for (var key in task) {
        if (key != "watch" && key != "open" && key != "minjs" ) {
          task[key]();
        }
      }
    });
  }

  // 预览
  ,
  open: function(ver) {
    connect.server({
      root: host.path,
      port: host.port,
      livereload: true
    });
    gulp.src('')
      .pipe(gulpOpen({
        app: browser,
        uri: 'http://localhost:3000/demo'
      }))
    this.watch();
  }

};



//清理
gulp.task('clear', function(cb) {
  return del(['./build/*'], cb);
});
gulp.task('clearRelease', function(cb) {
  return del(['./dist/*'], cb);
});


//压缩版本
gulp.task('default', ['clearRelease'], function() { //命令：gulp
  for (var key in task) {
    if (key != "watch" && key != "open" && key != "alljs") {
      task[key]('open');
    }
  }
});

gulp.task('local', function() { //命令：监听
  for (var key in task) {
    if ( key == "open" ) {
      task[key]();
    }
  }
});

//完整任务
gulp.task('all', ['clear'], function() { //命令：gulp all，过滤lwj：gulp all --open
  for (var key in task) {
    if (key != "watch" && key != "open" && key != "minjs") {
      task[key]();
    }
  }
});