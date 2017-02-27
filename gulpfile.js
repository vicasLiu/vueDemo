var gulp = require('gulp'),
  	colors = require('colors'),
    pkg = require('./package.json'),
    HttpServer = require('./httpserver.js'),
    webpack = require('webpack'),
    argv = require('yargs').argv,
    fs = require('fs'),
	md5 = require('md5-js'),
    server,
    st = new Date().getTime();

var clean,
    clientDir = __dirname + '/debug',
	SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

var log = console.log,
	warn = function (s) {
		log(s.yellow);
	},
	error = function (s) {
		log(s.red);
	},
	success = function (s) {
		log(s.green);
	};

var srcs = {
    release: 'release',
    debug: 'debug'
};

gulp.task('dev', ['clean_copy_watch'], function () {

    var configName = argv.config ? ('.' + argv.config) : '';
    
    var ddlConfig = require('./webpack/dll.config.js');

    var count = 0;
    
    // 打包ddl
    webpack(ddlConfig).run(function(err, stats) {
        if(err) throw (err);
        console.log('[webpack.ddl]', stats.toString({chunks: false, colors: true}));

        // 读取指定配置文件进行打包
        var webpackConfig = require('./webpack/config' + configName + '.js');
        webpack(webpackConfig).watch({}, function(err, stats) {
            if(err) throw (err);
            console.log('[webpack' + configName + ']', stats.toString({ chunks: false, colors: true}));
            
            // 启动web服务器
            server = server || HttpServer({
                root: './debug',
                port: 3003,
            });
            
            if(!count){
                success('构建完毕，耗时' + (new Date().getTime() - st)/1000 + '秒'); 
                count++;
            }
        });
    });
    
});

gulp.task('build', ['clean_copy'], function () {

    var configName = argv.config ? ('.' + argv.config) : '';
    
    var ddlConfig = require('./webpack/dll.config.js');
    
    // 打包ddl
    webpack(ddlConfig).run(function(err, stats) {
        if(err) throw (err);
        console.log('[webpack.ddl]', stats.toString({chunks: false, colors: true}));

        // 读取指定配置文件进行打包
        var webpackConfig = require('./webpack/config' + configName + '.js');
        webpack(webpackConfig).run(function(err, stats) {
            if(err) throw (err);
            console.log('[webpack' + configName + ']', stats.toString({ chunks: false, colors: true}));

            gulp.start('zip');
        });
    });
    
});

// 清空
gulp.task('clean', function() {
    clean = clean || require('gulp-clean')
    return gulp.src([
            clientDir + '/**/*.*', 
            '!**/*-manifest.json',
            '!**/*.dll.js'
        ], {
            read: false
        })
        .pipe(clean());
});

// 拷贝
gulp.task('copy', function() {
    return gulp.src([
                './src/static/**/*.*'
            ], {
                base: './src/'
            })
        .pipe(gulp.dest(clientDir));
});

// 拷贝
gulp.task('copy2build', function() {
    return gulp.src([
                './src/static/**/*.*'
            ], {
                base: './src/'
            })
        .pipe(gulp.dest('./build/'));
});
gulp.task('copy_dll2build', function() {
    return gulp.src([
                clientDir + '/vendor.dll.js'
            ], {
                base: clientDir
            })
        .pipe(gulp.dest('./build/'));
});

// 监听
gulp.task('watch', function(){
    gulp.watch([
        './src/static/**/*.*'
    ], function(e){
        var path = e.path.replace(__dirname, '.');
        log('copy file', path)
        //
        return gulp.src([path], {
                    base: './src/'
                })
            .pipe(gulp.dest(clientDir));
    });
});

// 
gulp.task('clean_copy_watch', ['clean'], function(){
    return gulp.start('watch', ['copy']);
});

gulp.task('clean_copy', ['clean'], function(){
    return gulp.start('copy');
});

gulp.task('zip', function(){

    var zip = require('gulp-zip'),
        md5 = require('md5-js'),
        fs = require('fs');

    var env = (argv.config || '').toLowerCase();
    var todayDate = function(){
        var now = new Date();
        return now.getFullYear() + zeroize(now.getMonth() + 1) + now.getDate();
    };
    var zeroize = function(s){
        s = s + '';
        if(s.length === 1) s = '0' + s;
        return s;
    };
    // 判断对象是否undefined
    var undef = function(o) {
        return typeof o === 'undefined';
    };
    // 微型模板，例如： hello {name}!
    var sub = function(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return undef(o[key]) ? match : o[key];
        }) : s;
    };

	// zip file name
	var zipfilename = sub(pkg.releaseName || '{name}-{date}{env}.zip', {
		name: pkg.name || 'web',
		env: env ? ('-' + env) : '',
		date: todayDate()
	});

	return gulp.src([
            srcs.debug + '/**/*',
            '!**/vendor-manifest.json'
        ], {base:srcs.debug})
		.pipe(zip(zipfilename))
		.pipe(gulp.dest(srcs.release))
		.on('end', function(){
			fs.readFile(srcs.release + '/' + zipfilename, function(err, buf) {
                success((argv.config || '生产') + '环境代码打包完毕');
				success(zipfilename + ' --md5--> ' + md5(buf));
                success('耗时' + (new Date().getTime() - st)/1000 + '秒');
			});
		});
});


// 显示build/release目录下所有文件的md5值
gulp.task('md5', function(){

	fs.readdirSync(srcs.release).forEach(function(name) {
		var filepath = srcs.release + '/' + name;

		if(fs.statSync(filepath).isDirectory()) {
			return;
		};

		fs.readFile(filepath, function(err, buf) {
			success(name + ' --md5--> ' + md5(buf));
		});
	});
});